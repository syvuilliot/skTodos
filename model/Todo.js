define([
	"SkFramework/model/Model",
	"SkFramework/store/Sync",
	"skTodos/store/GoogleJsonRest",
], function(Model, Syncable, GoogleStore){
	
	window.Todo = Model.extend("Todo", {
		_checkedGetter: function() {
		    return this.checked || false;
		},
		_labelGetter: function() {
		    return this.label || "";

		},

		_labelSetter: function(value) {
		    if (this.get("checked") === true) {
		        throw ("Cannot change the label of an already completed todo");
		    } else {
		        this.label = value;
		    }
		},
	}, {
		sync: function(query){
			return this.store.sync(query);
		},
		authenticate: function(){
            gapi.client.setApiKey('AIzaSyCj1J8O-T61hBkTfMwYnvL9WZsbidbMLF8');
            gapi.auth.authorize({
                client_id: '9770186770',
                scope: 'https://www.googleapis.com/auth/tasks',
                immediate: true,
            }, function() {
			    var token = gapi.auth.getToken();
                Todo.store.remoteStore.accessToken = token.access_token;
                console.log("authenticated");
            }.bind(this));

		}
	});

	window.googleTasks = new GoogleStore({
	    target: "https://www.googleapis.com/tasks/v1/lists/MDc2NzE2NzUyNTMzMDAzNzE0MDM6MDow/tasks/",
	    transformQueryResult: function(result) {
	        return result.items.map(this.toInstance)
	    },
	    toInstance: function(object) {
	        var params = {};
	        Object.keys(object).forEach(function(key){
	            switch(key){
	                case "title": params.label = object[key]; break;
	                default: params[key] = object[key];
	            }                           
	        })
	        return new Todo(params);
	    },
	    fromInstance: function(item){
	        var object = {};
	        Object.keys(item).forEach(function(key){
	            switch(key){
	                case "label": object.title = item[key]; break;
	                default: object[key] = item[key];
	            }                           
	        })
	        return object;
	    },

	});

	Todo.store = Syncable(Todo.initNewStore(), googleTasks);


	return Todo;
});