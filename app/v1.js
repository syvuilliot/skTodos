define([
	'dojo/_base/declare',	'dojo/dom-construct',
	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',	"dijit/_WidgetsInTemplateMixin",	"dijit/_Container",
	'dojo/store/Memory',	'dojo/store/Observable',
    'SkFramework/component/Component',	'SkFramework/component/Presenter',	'SkFramework/utils/binding',
    '../todo/TodoEditor',	'../list/List',	'../removableList/List',
    '../fixtures/todos',
	"../model/domain/Todo",
	"dijit/form/Form",	"dijit/form/Button",	"dijit/form/TextBox",
	'dojo/text!./v1.html'
], function(
	declare,				domConstruct,
	Widget,					Templated,					WidgetsInTemplate,					Container,
	Memory,					Observable,
	Component,							Presenter,							binding,
	TodoEditor,				List,			RemovableList,
    todosFixtures,
    Todo,
    Form,				Button,					TextBox,
    template
) {
	var Presenter = declare([Presenter], {
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
		removeTodo: function(todo) {
			this.todosStore.remove(todo.id);
		},
		removeTodoHandler: function(ev){
			this.removeTodo(ev.item);
		},
		removeCompletedTodos: function(){
			this.todosStore.query({checked: true}).forEach(function(todo){
				this.removeTodo(todo);
			}.bind(this));
		}
	});

	var View = declare([Widget, Templated, WidgetsInTemplate], {
		constructor: function(){
			this.activeTodoViews = {};
		},
		templateString: template,
		buildRendering: function() {
			this.inherited(arguments);
			
			this.addTodoForm = new Form({ 'class':'new-todo' }, this.newTodoNode);
			this.addTodoLabel = new TextBox({
				name: 'label',
				placeHolder: "Add new task ..."
			}).placeAt(this.addTodoForm);
			new Button({
				label: "+",
				type: 'submit'
			}).placeAt(this.addTodoForm);
			this.addTodoForm.on('submit', function(ev) {
				ev.preventDefault();
			});
		}
	});


	return declare([Component], {
		constructor: function(params){
			//init variables
			this.activeTodoComponentsHandlers = {};
			this.completedTodoComponents = {};

			//create internal machinery
			this._presenter = new Presenter();
			this.view = new View();
			this.view.startup();
			
			this.completedTodosCmp = new List({
				componentClass: TodoEditor
			});
			this.completedTodosCmp.view.placeAt(this.view.completedTodosNode, 'replace');
			
			this.activeTodosCmp = new RemovableList({
				componentClass: TodoEditor
			});
			this.activeTodosCmp.view.placeAt(this.view.activeTodosNode, 'replace');
			
			//load data
			this.set("todos", todosFixtures);
		},

		bind: function() {
			this.own(
				new binding.ValueSync(this._presenter, this.view.addTodoLabel, {
					sourceProp: "newTodoLabel",
					targetProp: "value",
				}),
				new binding.Event(this.view.addTodoForm, this._presenter, {
					event: "submit",
					method: "createTodo",
				}),
				new binding.Click(this.view.removeCompletedTodosButton, this._presenter, {
					method: "removeCompletedTodos",
				}),
				new binding.Value(this._presenter, this.activeTodosCmp, {
					sourceProp: "activeTodos",
					targetProp: "value"
				}),
				new binding.Value(this._presenter, this.completedTodosCmp, {
					sourceProp: "completedTodos",
					targetProp: "value"
				}),
				new binding.Event(this.activeTodosCmp, this._presenter, {
					event: "remove",
					method: "removeTodoHandler",
				}),
				new binding.ObservableQueryResult(this._presenter, this, {
					sourceProp: "activeTodos",
					addMethod: "updateActiveTodosCounter",
					removeMethod: "updateActiveTodosCounter",
				}),
				new binding.ObservableQueryResult(this._presenter, this, {
					sourceProp: "completedTodos",
					addMethod: "updateCompletedTodosCounter",
					removeMethod: "updateCompletedTodosCounter",
				})
			);
		},
		updateActiveTodosCounter: function(){
			this.view.activeTodoCounter.innerHTML = this._presenter.get("activeTodos").length;
		},
		updateCompletedTodosCounter: function(){
			this.view.completedTodoCounter.innerHTML = this._presenter.get("completedTodos").length;
		},
	});
});