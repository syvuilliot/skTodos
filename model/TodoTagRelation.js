define([
	"SkFramework/model/Model",
	'./Tag',
	'./Todo',
	'dojo/store/Memory',
	'dojo/store/Observable',
	"SkFramework/store/ChainableQuery",
], function(Model, Tag, Todo, Memory, Observable, Chainable){
	window.TodoTagRelation = Model.extend("TodoTagRelation");
	
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
	
		
	Tag.prototype._todosGetter = function(){
		var todoTagRelations = this.get("tagsRelations");
		var todos = Chainable(Observable(new Memory()));
		todoTagRelations.forEach(function(todoTagRelation){
			todos.put(todoTagRelation.get("todo"));
		});
		todoTagRelations.observe(function(todoTagRelation, from, to){
			if (to < 0) {
				todos.remove(todoTagRelation.get("todo").getIdentity());
			} 
			if (from < 0) {
				todos.put(todoTagRelation.get("todo"));
			}
		});
		return todos.query();
	};

	Tag.prototype._todoAdder = function(todo, options){
		if(this.get("todos").get(todo.getIdentity()) === undefined) {
			options = options || {};
			options.tag = this;
			options.todo = todo;
			return new TodoTagRelation(options).save();
		}
	};
	

	Todo.prototype._tagsGetter = function(){
		var todoTagRelations = this.get("tagsRelations");
		var tags = Chainable(Observable(new Memory()));
		todoTagRelations.forEach(function(todoTagRelation){
			tags.put(todoTagRelation.get("tag"));
		});
		todoTagRelations.observe(function(todoTagRelation, from, to){
			if (to < 0) {
				tags.remove(todoTagRelation.get("tag").getIdentity());
			} 
			if (from < 0) {
				tags.put(todoTagRelation.get("tag"));
			} 
		});
		return tags.query();
	};
	Todo.prototype._tagAdder = function(tag, options){
		//in this case, where the intermediary model is transparent, we don't want to have many relations between one todo and one tag => a tag can only be set once on a todo
		if(this.get("tags").get(tag.getIdentity()) === undefined) {
			options = options || {};
			options.todo = this;
			options.tag = tag;
			return new TodoTagRelation(options).save();
		}
	};

	var oldDelete = Todo.prototype.delete;
	Todo.prototype.delete = function(){
		this.get("tagsRelations").forEach(function(tagRelation){
			tagRelation.delete();
		});
		oldDelete.apply(this, arguments);
	};
	oldDelete = Tag.prototype.delete;
	Tag.prototype.delete = function(){
		this.get("todosRelations").forEach(function(todoRelation){
			todoRelation.delete();
		});
		oldDelete.apply(this, arguments);
	};

	return TodoTagRelation;
});