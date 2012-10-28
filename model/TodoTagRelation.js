define([
	"SkFramework/model/Model",
	'./Tag',
	'./Todo',
], function(Model, Tag, Todo){
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
		var transform = function(item){
			return item.get("todo");
		};
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

	Tag.prototype._todoAdder = function(todo, options){
		options = options || {};
		options.tag = this;
		options.todo = todo;
		return new TodoTagRelation(options).save();
	};
	

	Todo.prototype._tagsGetter = function(){
		return this.get("tagsRelations").map(function(item){return item.get("tag");});
	};
	Todo.prototype._tagAdder = function(tag, options){
		options = options || {};
		options.todo = this;
		options.tag = tag;
		return new TodoTagRelation(options).save();
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