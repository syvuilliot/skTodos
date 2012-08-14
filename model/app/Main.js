define([
	'dojo/_base/declare',
	'sktodos/model/base/_Base',		'./taglist/TagList',	'./todolist/TodoList',
	'../domain/Tag',	'../domain/Todo',
	
	'../domain/TodoTagRelation'
],
function(
	declare,
	BaseCmp,		TagListManager,			TodoListManager,
	Tag,			Todo
) {
	return declare([BaseCmp], {
		title: "SK Todos sample app",
		
		constructor: function() {
			this.tagList = new TagListManager({
				tagModel: Tag
			});
			
			this.todoList = new TodoListManager({
				tagModel: Tag
			});
			
			this.tagList.on('selectionchanged', function(ev) {
				this.todoList.set('items', ev.selection.get("todosRelations"));
			}.bind(this));
		},
		
		createTodo: function(data) {
			var newTodo = new Todo(data).save();

			var tag = this.tagList.get('selection');
			if (tag) {
				newTodo.addTag(tag).save();
			}
		}
	});
});
