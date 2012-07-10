define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',
	'dojo/text!./main.html',
	'dijit/form/TextBox',
	'./TagList',	'./TodoList'
],
function(
	declare,
	WidgetBase,				TemplatedMixin,
	template,
	TextBox,
	TagListView,	TodoListView
) {
	return declare([WidgetBase, TemplatedMixin], {
		templateString: template,
		
		constructor: function(params) {
		},
		
		bind: function(manager) {
			this.manager = manager;
			document.title = this.manager.get('title');
			
			this.tagList.bind(this.manager.get('tagList'));
			this.todoList.bind(this.manager.get('todoList'));
		},
		
		postCreate: function() {
			this.inherited(arguments);
			
			this.tagList = new TagListView({}, this.tagListNode);
			this.todoList = new TodoListView({}, this.todoListNode);
			
			this.newTodo = new TextBox({}, this.newTodoNode);
			this.newTodo.on("change", function(e){
				this.manager.createTodo({label: this.newTodo.get("value")});
				this.newTodo.set("value", "", false);
			}.bind(this));
		}
	});
});
