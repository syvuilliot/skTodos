define([
	"./models",
	"dojo/_base/declare",
 ], function(models, declare){
	var Tag = models.Tag;
	var Todo = models.Todo;
	
	return declare(null, {
		constructor: function(){
			this.tagsState = [];
		},
		models: models,
		//get all tags from the app store
		getTags: function(){
			return Tag.query({});
		},
		//get tags selected by user
		getTagsState: function(){
			return this.tagsState;
		},
		getTodos: function(){
			//return Todo.query({});
			var firstTagSelected = this.getTagsState()[0];
			return firstTagSelected && firstTagSelected.get("todos") || [];
		},
		createTodo: function(params){
			var newTodo = new Todo({
				label: params.label,
			});
			//TODO: add tags from tagsState to the new todo
			this.getTagsState().forEach(function(tag){
				newTodo.add("tags", tag);
			});
			
			newTodo.save();
		},
		createTag: function(params){
			var newTag = new Tag({
				label: params.label,
			});
			newTag.save();
		}
	});
});