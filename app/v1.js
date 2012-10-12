define([
	'dojo/_base/declare',
	'dojo/Stateful',
	'dijit/Destroyable', 'dijit/_WidgetBase',	'dijit/_TemplatedMixin', "dijit/_WidgetsInTemplateMixin",
	'dojo/text!./v1.html',
    'dojo/store/Memory',
    'dojo/store/Observable',
    "SkFramework/utils/binding",
    '../todoList/TodoList',
    '../fixtures/todos',
	"skTodos/model/domain/Todo",

	"dijit/form/TextBox",

], function(
	declare,
	Stateful,
	Destroyable, Widget,					Templated, WidgetsInTemplate,
	template,
	Memory, Observable,
	binding,
	TodoList,
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
		removeCompletedTodos: function(){
			this.todosStore.query({checked: true}).forEach(function(todo){
				this.todosStore.remove(todo.id);
			}.bind(this));
		}
	});

	var View = declare([Widget, Templated, WidgetsInTemplate], {
		templateString: template,
	});

	return declare([Stateful, Destroyable], {
		constructor: function(params){
			this.presenter = new Presenter();
			this.render();
			this.bind();
			//load data
			this.set("todos", todosFixtures);
		},
		render: function(){
			this.view = new View();
			this.activeTodos = new TodoList();
			this.activeTodos.view.placeAt(this.view.activeTodosNode);
			this.completedTodos = new TodoList();
			this.completedTodos.view.placeAt(this.view.completedTodosNode);
			this.view.startup();

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

		bind: function() {
			this.own(
				new binding.Value(this.presenter, this.activeTodos, {
					sourceProp: "activeTodos",
					targetProp: "todos",
				}),
				new binding.Value(this.presenter, this.completedTodos, {
					sourceProp: "completedTodos",
					targetProp: "todos",
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
	});
});