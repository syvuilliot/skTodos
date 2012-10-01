define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin", "dijit/_Container",
	"dojo/text!./todo-list.html",
	"SkFramework/utils/statefulSync",
	"./model/TodosCollection",
	"skTodos/todo/Todo",

	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
], function(
	declare,
	Widget,					Templated,					WidgetsInTemplate,	Container,
	template,
	statefulSync,
	TodosCollection,
	TodoComponent
){
	return declare([Widget, Templated, Container, TodosCollection], {
		templateString: template,
		constructor: function(){
			this.todos = {};
		},
		startup: function(){
			this.inherited(arguments);
			this.bind();
		},

		addTodo: function(key){
			var todoComp = new TodoComponent();
			this.todos[key] = todoComp;
			this.addChild(todoComp);
		},
		removeTodo: function(key){
			this.todos[key].destroy();
			delete this.todos[key];
		},

		bind: function(){
			this.on("keyAdded", function(e){
				this.addTodo(e.key);
			}.bind(this));
			this.on("valueSetted", function(e){
				var todoComp = this.todos[e.key];
				todoComp.set(e.value);
				todoComp.on("change", function(e){
					
				});
			});
			this.on("keyRemoved", function(e){
				this.removeTodo(e.key);
			}.bind(this));
		}

	});
});