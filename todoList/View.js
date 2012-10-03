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

		addTodoComp: function(key){
			var todoComp = new TodoComponent();
			this.todoComponents[key] = todoComp;
			this.addChild(todoComp);
		},
		removeTodoComp: function(key){
			this.todoComponents[key].destroy();
			delete this.todoComponents[key];
		},
		getTodoComp: function(key){
			return this.todoComponents[key];
		}
	});
});