define([
	"SkFramework/utils/create",
	"SkFramework/model/Model",
	"dojo/store/Memory",
	"SkFramework/store/SimpleQueryEngineGet",
	"dojo/store/Observable",
	'./Tag',	'./Todo'
], function(create, Model, Store, SimpleQueryEngineGet, Observable,
	Tag,		Todo
){
	window.TodoTagRelation = create(Model, function TodoTagRelation(){ //need to give a constructor name for Constructor(new LocalStorage) to work
		Model.apply(this, arguments);
	});
	
	TodoTagRelation.addRelationTo(Tag, {
		sourcePropertyName: "tag",
		targetPropertyName: "todosRelations",
		min: 0,
		max: null,
	});
	TodoTagRelation.addRelationTo(Todo, {
		sourcePropertyName: "todo",
		targetPropertyName: "tagsRelations",
		min: 0,
		max: null,
	});
	TodoTagRelation.store = window.todoTagRelationStore = Observable(
		new Store({
			queryEngine: SimpleQueryEngineGet,
		})
	);
	
		
	Tag.prototype.gettodos = function(){
		var transform = function(item){return item.get("todo");}
		var relQueryResult = this.get("todosRelations");
		var results = relQueryResult.map(transform);
		results.observe = function(callback) {
			var relCallback = function(item, from, to) {
				callback(transform(item), from, to);
			}
			return relQueryResult.observe(relCallback);
		}
		return results;
	};

	Tag.prototype.addtodos = function(todo, options){
		options = options || {};
		options.tag = this;
		options.todo = todo;
		return new TodoTagRelation(options);
	};
	

	Todo.prototype.gettags = function(){
		return this.get("tagsRelations").map(function(item){return item.get("tag");});
	};
	Todo.prototype.addTag = function(tag, options){
		options = options || {};
		options.todo = this;
		options.tag = tag;
		return new TodoTagRelation(options);
	};

	return TodoTagRelation;
});