define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',
	'dojo/text!./main.html',
	'dijit/form/Form',	'dijit/form/TextBox',	'dijit/form/Button',
	'./taglist/TagList',	'./todolist/TodoList'
],
function(
	declare,
	WidgetBase,				TemplatedMixin,
	template,
	Form,				TextBox,				Button,
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
			
			this.newTodo = new Form({ 'class':'new-todo' }, this.newTodoNode);
			new TextBox({
				name: 'label',
				placeHolder: "Add new task ..."
			}).placeAt(this.newTodo);
			new Button({
				label: "+",
				type: 'submit'
			}).placeAt(this.newTodo);
			
			this.newTodo.on("submit", function(ev){
				this.component.createTodo({label: this.newTodo.get("value").label});
				this.newTodo.reset();
				ev.preventDefault();
			}.bind(this));
		}
	});
});
