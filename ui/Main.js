define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',
	'dojo/text!./main.html',
	'dijit/form/Form',	'dijit/form/TextBox',	'dijit/form/Button',
	'./base/_Base',
	'./taglist/TagList',	'./todolist/TodoList'
],
function(
	declare,
	WidgetBase,				TemplatedMixin,
	template,
	Form,				TextBox,				Button,
	ViewBase,
	TagListView,			TodoListView
) {
	return declare([WidgetBase, TemplatedMixin, ViewBase], {
		templateString: template,
		
		modelMapping: {
			title: 'title'
		},
		
		_setTitleAttr: function(title) {
			document.title = title;
		},
		
		_setModelAttr: function() {
			this.inherited(arguments);
			
			this.tagList.set('model', this.get('model').get('tagList'));
			this.todoList.set('model', this.get('model').get('todoList'));
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
				this.get('model').createTodo({label: this.newTodo.get("value").label});
				this.newTodo.reset();
				ev.preventDefault();
			}.bind(this));
		}
	});
});