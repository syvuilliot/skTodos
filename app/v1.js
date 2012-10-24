define([
	'dojo/_base/declare',	'dojo/dom-construct',
	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',	"dijit/_WidgetsInTemplateMixin",	"dijit/_Container",
	'dojo/store/Memory',	'dojo/store/Observable',
    'SkFramework/component/Component',	'SkFramework/component/Presenter',	'SkFramework/component/_Dom',
    'SkFramework/utils/binding',
    '../todo/TodoEditor',	'../list/List',	'../removableList/List',
    '../fixtures/todos',
	"../model/domain/Todo",
	"dijit/form/Form",	"dijit/form/Button",	"dijit/form/TextBox",
	'dojo/text!./v1.html'
], function(
	declare,				domConstruct,
	Widget,					Templated,					WidgetsInTemplate,					Container,
	Memory,					Observable,
	Component,							PresenterBase,		_Dom,		
	binding,
	TodoEditor,				List,			RemovableList,
    todosFixtures,
    Todo,
    Form,				Button,					TextBox,
    template
) {
	var Presenter = declare([PresenterBase], {
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

	return declare([Component, _Dom], {
		constructor: function(params) {
			//create internal machinery
			this._presenter = new Presenter();

			//register components
			this._addComponents({
				addTodoForm: new Form({ 'class':'new-todo' }),
				addTodoLabel: new TextBox({
					name: 'label',
					placeHolder: "Add new task ..."
				}),
				addButton: new Button({
					label: "+",
					type: 'submit'
				}),
				completedTodos: new List({componentClass: TodoEditor}),
				activeTodos: new RemovableList({componentClass: TodoEditor}),
				removeCompletedTodosButton: new Button({
					'label': "Supprimer les tâches terminées"
				}),
				activeTodosTitle: domConstruct.create('h2', {innerHTML: "Taches en cours : "}), //make a plurialized component that take a numeric value and display a string according to its value (0, 1 or more)
				activeTodoCounter: domConstruct.create('div'),
				completedTodoCounter: domConstruct.create("div"),
			});
			
			this._components.addTodoForm.on('submit', function(ev) {
				ev.preventDefault();
			});

			//load data
			this.set("todos", todosFixtures);

		},

		_render: function() {
			this.inherited(arguments);
			this._components.addTodoLabel.placeAt(this._components.addTodoForm);
			this._components.addButton.placeAt(this._components.addTodoForm);
			this._append(this._components.addTodoForm);
			this._append(this._components.activeTodos);
			this._append(this._components.removeCompletedTodosButton);
			this._append(this._components.completedTodos);
			this._append(this._components.activeTodosTitle);
			this._components.activeTodosTitle.appendChild(this._components.activeTodoCounter);
			this._append(this._components.completedTodoCounter);
		},

		_bind: function() {
			this.own(
				new binding.ValueSync(this._presenter, this._components.addTodoLabel, {
					sourceProp: "newTodoLabel",
					targetProp: "value",
				}),
				new binding.Event(this._components.addTodoForm, this._presenter, {
					event: "submit",
					method: "createTodo",
				}),
				new binding.Click(this._components.removeCompletedTodosButton, this._presenter, {
					method: "removeCompletedTodos",
				}),
				new binding.Value(this._presenter, this._components.activeTodos, {
					sourceProp: "activeTodos",
					targetProp: "value"
				}),
				new binding.Value(this._presenter, this._components.completedTodos, {
					sourceProp: "completedTodos",
					targetProp: "value"
				}),
/*				new binding.Event(this._components.activeTodos, this._presenter, {
					event: "remove",
					method: "removeTodoHandler",
				}),
*/				new binding.ObservableQueryResult(this._presenter, this, {
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
			this._components.activeTodoCounter.innerHTML = this._presenter.get("activeTodos").length;
		},
		updateCompletedTodosCounter: function(){
			this._components.completedTodoCounter.innerHTML = this._presenter.get("completedTodos").length;
		},
	});
});