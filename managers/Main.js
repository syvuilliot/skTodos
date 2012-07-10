define([
	'dojo/_base/declare',
	'./_Base',		'./TagList',	'./TodoList',
	'../models'
],
function(
	declare,
	ManagerBase,	TagListManager,	TodoListManager,
	models
) {
	return declare([ManagerBase], {
		title: "SK Todos sample app",
		
		constructor: function() {
			this.tagList = new TagListManager({
				model: models.Tag
			});
		
			this.todoList = new TodoListManager({
				model: models.Todo
			});
			
			this.tagList.on('selectionchanged', function(ev) {
				this.todoList.set('items', ev.selection.get("todos"));
			}.bind(this));
		},
		
		createTag: function(data) {
			return new Tag(data).save();
		},
		
		createTodo: function(data) {
			var newTodo = new Todo(data);
			newTodo.save();

			var tag = this.tagList.get('selection');
			if (tag) {
				newTodo.add("tags", tag).save();
			}
		}
	});
});
