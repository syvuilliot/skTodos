define([
	"dojo/Deferred",
	"dojo/when",
	"SkFramework/model/Model",
	"dojo/store/Memory",
	"SkFramework/store/ChainableQuery",
	"SkFramework/store/PersistableMemory",
	"dojo/store/Observable",
	"SkFramework/store/SimpleQueryEngineGet",
	"SkFramework/store/Sync",
	"skTodos/store/GoogleJsonRest",
], function(Deferred, when, Model, Memory, Chainable, Persistable, Observable, SimpleQueryEngineGet, Syncable, GoogleStore){
	
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
			when(this.authenticate(), function(){
				this.store.sync(query)
			}.bind(this));
		},
		authenticate: function(){
			if (! gapi.auth.getToken()){
				var deferred = new Deferred();
	            gapi.client.setApiKey('AIzaSyCj1J8O-T61hBkTfMwYnvL9WZsbidbMLF8');
	            gapi.auth.authorize({
	                client_id: '9770186770',
	                scope: 'https://www.googleapis.com/auth/tasks',
	                immediate: false,
	            }, function() {
	                googleTasks.accessToken = gapi.auth.getToken().access_token;
	                console.log("authenticated");
	                deferred.resolve();
	            });
	            return deferred.promise;
	        } else {
	        	return true;
	        }
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

	//Todo.store = Syncable(Todo.initNewStore(), googleTasks); //can not do that since Chainable wrapper need to be at the end
	Todo.store = Chainable(Syncable(Observable(Persistable(new Memory({
		queryEngine: SimpleQueryEngineGet,
	}), {
		storageKey: "TodoStore",
		autoSave: true,
		getConstructor: function(){
			return Todo;
		},
	})), googleTasks));



	return Todo;
});