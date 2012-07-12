define([
	'dojo/_base/declare',
	'sktodos/components/base/_Base',		'./taglist/TagList',	'./todolist/TodoList',
	'./models'
],
function(
	declare,
	BaseCmp,		TagListManager,			TodoListManager,
	models
) {
	var Tag = models.Tag;
	var Todo = models.Todo;
	
	return declare([BaseCmp], {
		title: "SK Todos sample app",
		
		constructor: function() {
			this.tagList = new TagListManager({
				tagModel: models.Tag
			});
			
			this.todoList = new TodoListManager({
				tagModel: models.Tag
			});
			
			this.tagList.on('selectionchanged', function(ev) {
				this.todoList.set('items', ev.selection.get("todosRelations"));
			}.bind(this));
		},
		
		createTodo: function(data) {
			var newTodo = new Todo(data).save();

			var tag = this.tagList.get('selection');
			if (tag) {
				newTodo.add("tags", tag).save();
			}
		}
	});
});
