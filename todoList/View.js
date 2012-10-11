define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin", "dijit/_Container",
	"dojo/text!./template.html",
	"skTodos/todo/TodoEditor",
	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/Button",

], function(
	declare,
	Widget,					Templated,					WidgetsInTemplate, Container,
	template,
	TodoComponent
	){
	
	return declare([Widget, Templated, WidgetsInTemplate, Container], {
		constructor: function(){
			this.todoComponents = {}; 
		},
		templateString: template,

		addTodo: function(todo, id){
			var todoComp = new TodoComponent({todo: todo});
			this.todoComponents[id] = todoComp;
			this.addChild(todoComp);
		},
		removeTodo: function(todo, id){
			this.todoComponents[id].destroy();
			delete this.todoComponents[id];
		},
		getTodoComp: function(id){
			return this.todoComponents[id];
		}
	});
});