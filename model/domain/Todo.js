define([
	"SkFramework/utils/create",
	"SkFramework/model/Model",
	"dojo/store/Memory",
	"SkFramework/store/SimpleQueryEngineGet",
	"dojo/store/Observable"
], function(create, Model, Store, SimpleQueryEngineGet, Observable){
	
	window.Todo = create(Model, function Todo(){
		this.superConstructor.apply(this, arguments);
	});
	Todo.initNewStore();
	Todo.prototype._checkedGetter = function() {
		return this.checked || false;
	};


	return Todo;
});