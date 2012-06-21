define([
	"SkFramework/utils/create",
	"SkFramework/model/Model",
	"dojo/store/Memory",
	"SkFramework/store/SimpleQueryEngineGet",
	"dojo/store/Observable",
], function(create, Model, Store, SimpleQueryEngineGet, Observable){
	
	window.Tag = create(Model, function Tag(){
		this.superConstructor.apply(this, arguments);
	});
	
	window.Todo = create(Model, function Todo(){
		this.superConstructor.apply(this, arguments);
	});
	
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
	Todo.prototype.gettags = function(){
		return this.get("tagsRelations").map(function(item){return item.get("tag");});
	};
	Tag.prototype.gettodos = function(){
		var transform = function(item){return item.get("todo");};
		var relQueryResult = this.get("todosRelations");
		var results = relQueryResult.map(transform);
		results.observe = function(callback) {
			var relCallback = function(item, from, to) {
				callback(transform(item), from, to);
			};
			return relQueryResult.observe(relCallback);
		};
		return results;
	};
	Todo.prototype.addtags = function(tag, options){
		options = options || {};
		options.todo = this;
		options.tag = tag;
		return new TodoTagRelation(options);
	};
	Tag.prototype.addtodos = function(todo, options){
		options = options || {};
		options.tag = this;
		options.todo = todo;
		return new TodoTagRelation(options);
	};

	Tag.store = window.tagStore = Observable(
		new Store({
			queryEngine: SimpleQueryEngineGet,
		})
	);
	Todo.store = window.todoStore = Observable(
		new Store({
			queryEngine: SimpleQueryEngineGet,
		})
	);
	TodoTagRelation.store = window.todoTagRelationStore = Observable(
		new Store({
			queryEngine: SimpleQueryEngineGet,
		})
	);


	return {
		Todo: Todo,
		Tag: Tag,
	};
});