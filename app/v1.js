define([
	'dojo/_base/declare',
	'dojo/Stateful',
	'dijit/Destroyable', 'dijit/_WidgetBase',	'dijit/_TemplatedMixin',
	'dojo/text!./v1.html',
    'dojo/store/Memory',
    'dojo/store/Observable',
    "SkFramework/utils/binding",
    '../todoList/TodoList',
    '../fixtures/todos',
	"skTodos/model/domain/Todo",

], function(
	declare,
	Stateful,
	Destroyable, Widget,					Templated,
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
			var store = Observable(new Memory());
			if (value && value.forEach){
				value.forEach(function(value){
					var todo = new Todo(value);
					store.put(todo);
					todo.watch(function(){
						store.put(todo);
					});
				});
			}
			this.todos = store.query();
		}
	});

	var View = declare([Widget, Templated], {
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
			this.todoList = new TodoList();
			this.todoList.view.placeAt(this.view.todoListNode);
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
			this.own(new binding.Value(this.presenter, this.todoList, {
				sourceProp: "todos",
				targetProp: "todos",
			}));
		},
	});
});