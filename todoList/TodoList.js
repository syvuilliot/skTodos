define([
	"dojo/_base/declare",	'dojo/Stateful',
	'dijit/Destroyable',	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",	"dijit/_Container",
	"dojo/text!./template.html",
	"SkFramework/utils/binding",
	'skTodos/todo/TodoEditor',

	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/Button"
], function(
	declare,				Stateful,
	Destroyable,			Widget,					Templated,					WidgetsInTemplate,					Container,
	template,
	binding,
	TodoComponent
) {
	var Presenter = declare([Stateful, Destroyable], {
	});

	var View = declare([Widget, Templated, WidgetsInTemplate, Container], {
		templateString: template
	});

	return declare([Stateful, Destroyable], {
		constructor: function() {
			this.view = new View();
			this.view.startup();
			this.presenter = new Presenter();
			this.todoComponents = {};
			this.bind();
		},
		destroy: function(){
			this.view.destroy();
		},

		get: function() {
			return this.presenter.get.apply(this.presenter, arguments);
		},

		set: function() {
			return this.presenter.set.apply(this.presenter, arguments);
		},

		bind: function(){
			this.own(new binding.ObservableQueryResult(this.presenter, this, {
				sourceProp: "todos",
				addMethod: "addTodo",
				removeMethod: "removeTodo",
			}));
		},

		addTodo: function(todo, id){
			var todoComp = new TodoComponent({todo: todo});
			this.todoComponents[id] = todoComp;
			this.view.addChild(todoComp.view);
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