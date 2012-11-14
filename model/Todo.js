define([
	"SkFramework/model/Model",
	"SkFramework/store/Sync",
], function(Model, Syncable){
	
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
		}
	});

	//store: Syncable(Model.initNewStore(), new GoogleStore()),
	Todo.initNewStore();


	return Todo;
});