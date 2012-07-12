define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',
	'dojo/text!./main.html',
	'dijit/form/TextBox',
	'./taglist/TagList',	'./todolist/TodoList'
],
function(
	declare,
	WidgetBase,				TemplatedMixin,
	template,
	TextBox,
	TagListView,			TodoListView
) {
	return declare([WidgetBase, TemplatedMixin], {
		templateString: template,
		
		constructor: function(params) {
		},
		
		plug: function(component) {
			this.component = component;
			document.title = this.component.get('title');
			
			this.tagList.plug(this.component.get('tagList'));
			this.todoList.plug(this.component.get('todoList'));
		},
		
		postCreate: function() {
			this.inherited(arguments);
			
			this.tagList = new TagListView({}, this.tagListNode);
			this.todoList = new TodoListView({}, this.todoListNode);
			
			this.newTodo = new TextBox({}, this.newTodoNode);
			this.newTodo.on("change", function(e){
				this.component.createTodo({label: this.newTodo.get("value")});
				this.newTodo.set("value", "", false);
			}.bind(this));
		}
	});
});
