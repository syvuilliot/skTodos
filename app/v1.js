define([
	'dojo/_base/declare',
	'dojo/Stateful',
	'dijit/Destroyable', 'dijit/_WidgetBase',	'dijit/_TemplatedMixin', "dijit/_WidgetsInTemplateMixin", "dijit/_Container",
	'dojo/text!./v1.html',
    'dojo/store/Memory',
    'dojo/store/Observable',
    "SkFramework/utils/binding",
    "dojo/on",
    '../todo/TodoEditor',
    '../remover/Remover',
    '../fixtures/todos',
	"skTodos/model/domain/Todo",

	"dijit/form/TextBox",

], function(
	declare,
	Stateful,
	Destroyable, Widget,					Templated, WidgetsInTemplate, Container,
	template,
	Memory, Observable,
	binding,
	on,
	TodoEditor,
	Remover,
    todosFixtures,
    Todo
) {

	var Presenter = declare([Stateful, Destroyable], {
		_todosSetter: function(value){
			//create an observable collection of Todo instances
			//TODO: only do it when it is necessary otherwise use the value directly
			var todosStore = this.todosStore = Observable(new Memory());
			if (value && value.forEach){
				value.forEach(function(value){
					this.addTodo(value);
				}.bind(this));
			}
			this.set("activeTodos", todosStore.query({checked: false}));
			this.set("completedTodos", todosStore.query({checked: true}));
		},
		addTodo: function(value){
			var todo = new Todo(value);
			this.todosStore.put(todo);
			todo.watch(function(){
				this.todosStore.put(todo);
			}.bind(this));
			//TODO: remove watch handler when todo is removed from store and when a new store is created
		},
		createTodo: function(){
			var label = this.get("newTodoLabel");
			if (label) { //only create a todo if label is not empty
				this.addTodo({label: label, checked: false});
				this.set("newTodoLabel", "");
			}
		},
		removeTodo: function(todo){
			this.todosStore.remove(todo.id);
		},
		removeCompletedTodos: function(){
			this.todosStore.query({checked: true}).forEach(function(todo){
				this.removeTodo(todo);
			}.bind(this));
		}
	});

	var ListContainer = declare([Widget, Container], {
	});

	var View = declare([Widget, Templated, WidgetsInTemplate], {
		templateString: template,
		buildRendering: function(){
			this.inherited(arguments);
			this.activeTodosContainer = new ListContainer({}, this.activeTodosNode);
			this.completedTodosContainer = new ListContainer({}, this.completedTodosNode);
		},
		addActiveTodo: function(){
			return 
		},
		startup: function(){
			this.inherited(arguments);
			this.activeTodosContainer.startup();
			this.completedTodosContainer.startup();
		},
	});



	return declare([Stateful, Destroyable], {
		constructor: function(params){
			//init variables
			this.activeTodoComponents = {};
			this.completedTodoComponents = {};

			//create internal machinery
			this.presenter = new Presenter();
			this.view = new View();
			this.view.startup();
			this.bind();
			//load data
			this.set("todos", todosFixtures);
		},
		destroy: function(){
			this.inherited(arguments);
			this.view.destroy();
		},

		get: function() {
			return this.presenter.get.apply(this.presenter, arguments);
		},

		set: function() {
			return this.presenter.set.apply(this.presenter, arguments);
		},

		bind: function() {
			this.own(
				new binding.ObservableQueryResult(this.presenter, this, {
					sourceProp: "activeTodos",
					addMethod: "addActiveTodo",
					removeMethod: "removeActiveTodo",
				}),
				new binding.ObservableQueryResult(this.presenter, this, {
					sourceProp: "completedTodos",
					addMethod: "addCompletedTodo",
					removeMethod: "removeCompletedTodo",
				}),
				new binding.ValueSync(this.presenter, this.view.addTodoWidget, {
					sourceProp: "newTodoLabel",
					targetProp: "value",
				}),
				new binding.Event(this.view.addTodoWidget, this.presenter, {
					event: "change",
					method: "createTodo",
				}),
				new binding.Click(this.view.removeCompletedTodosButton, this.presenter, {
					method: "removeCompletedTodos",
				})
			);
		},

		addActiveTodo: function(todo, id){
			//we don't have to observe the value (Todo instance) corresponding to id, since we will remove the component (and never change it's todo value) 
			var todoComp = new TodoEditor({todo: todo});
			var removerComp = new Remover();
			this.activeTodoComponents[id] = {todoComp: todoComp, removerComp: removerComp};
			removerComp.view.addChild(todoComp.view);
			this.view.activeTodosContainer.addChild(removerComp.view);
			removerComp.own(on(removerComp, "remove", function(ev){
				this.presenter.removeTodo(todo);
			}.bind(this)));
		},
		removeActiveTodo: function(todo, id){
			this.activeTodoComponents[id].todoComp.destroy();
			this.activeTodoComponents[id].removerComp.destroy();
			delete this.activeTodoComponents[id];
		},
		addCompletedTodo: function(todo, id){
			var todoComp = new TodoEditor({todo: todo});
			this.completedTodoComponents[id] = todoComp;
			this.view.completedTodosContainer.addChild(todoComp.view);
		},
		removeCompletedTodo: function(todo, id){
			this.completedTodoComponents[id].destroy();
			delete this.completedTodoComponents[id];
		},
	});
});