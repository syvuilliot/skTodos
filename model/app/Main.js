define([
	'dojo/_base/declare',
	'sktodos/model/base/_Base',		'./taglist/TagList',	'./todo/Todo',
	'../domain/Tag',	'../domain/Todo',
	
	'../domain/TodoTagRelation'
],
function(
	declare,
	AppBase,		TagListManager,			AppTodo,
	Tag,			Todo
) {
	return declare([AppBase], {
		title: "SK Todos sample app",
		
		constructor: function() {
			this.tagList = new TagListManager({
				tagModel: Tag
			});
			
			this.todoList = new AppBase();
			
			this.tagList.watch('selectedTag', function(prop, oldVal, selectedTag) {
				this.todoList.set('items', selectedTag.get("todosRelations").map(function(todoRel){
					return new AppTodo({
						domainModel: todoRel.get('todo'),
						tagModel: Tag
					});
				}.bind(this)));
			}.bind(this));
		},
		
		createTodo: function(data) {
			var newTodo = new Todo(data).save();

			var tag = this.tagList.get('selectedTag');
			if (tag) {
				newTodo.addTag(tag).save();
			}
			
			return newTodo;
		}
	});
});
