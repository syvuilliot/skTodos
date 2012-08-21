define([
	'dojo/_base/declare',	'dojo/on',
	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',
	'dojo/text!./main.html',
	'dijit/form/Form',	'dijit/form/TextBox',	'dijit/form/Button',
	'SkFramework/widgets/_ModelRendererMixin',
	'./taglist/TagList',	'./todolist/TodoList'
],
function(
	declare,				on,
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
			
			this.tagList.set('model', this.get('model'));
			this.todoList.set('model', this.get('model'));
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
			
			on(this.btnAll, 'click', function() {
				this.get('model').showAll();
			}.bind(this));
		},

		startup: function() {
			this.inherited(arguments);
			this.tagList.startup();
			this.todoList.startup();
		}
	});
});
