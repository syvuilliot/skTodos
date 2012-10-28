define([
	'dojo/_base/declare',	'dojo/dom-construct',
    'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode',	'SkFramework/component/_WithDijit', 'SkFramework/component/_Container',
    'SkFramework/component/Presenter',
    'SkFramework/utils/binding',
    '../todo/TodoEditor',
    '../taggedTodo/TaggedTodo',
    '../list/List',	'../removableList/List',
    '../fixtures/todos',
	"../model/Todo",
	"../model/Tag",
	"../model/TodoTagRelation",
	"dijit/form/Form",	"dijit/form/Button",	"dijit/form/TextBox",
], function(
	declare,				domConstruct,
	DomComponent,							_WithDom,								_WithDijit, _Container,
	PresenterBase,
	binding,
	TodoEditor,
	TaggedTodo,
	List,			RemovableList,
    todosFixtures,
    Todo,
    Tag,
    TodoTagRelation,
    Form,				Button,					TextBox
) {

	var urgentTag = new Tag({label: "urgent"}).save();

	var Presenter = declare([PresenterBase], {
		_todosSetter: function(value){
			//create an observable collection of Todo instances
			//TODO: only do it when it is necessary otherwise use the value directly
			var todosStore = this.todosStore = Todo;
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

			//just for test
			todo.add("tag", urgentTag).save();

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

	var ContainerComponent = declare([DomComponent, _WithDom, _WithDijit, _Container]);

	return declare([DomComponent, _WithDom, _WithDijit], {
		domAttrs: {
			'class': "todo-app"
		},
		constructor: function(params) {
			//create internal machinery
			this._presenter = new Presenter();

			//register components
			this._addComponents({
				todoListsContainer: new ContainerComponent({domAttrs:{class: "todo-lists"}}),
				//old: activeTodosSection: domConstruct.create("section", {class: "todo-list"}),
				activeTodosSection: new ContainerComponent({domTag:"section", domAttrs:{class: "todo-list"}}),
				completedTodosSection: new ContainerComponent({domTag:"section", domAttrs:{class: "todo-list completed"}}),
				addTodoForm: new Form({ 'class':'new-todo' }),
				addTodoLabel: new TextBox({
					name: 'label',
					placeHolder: "Add new task ..."
				}),
				addButton: new Button({
					label: "+",
					type: 'submit'
				}),
				completedTodos: new List({itemConfig: TodoEditor}),
				activeTodos: new RemovableList({itemConfig: TaggedTodo}),
				removeCompletedTodosButton: new Button({
					'label': "Supprimer les tâches terminées"
				}),
				activeTodoTitle: domConstruct.create('h2'),
				completedTodoTitle: domConstruct.create("h2"),
			});
			
			this._components.addTodoForm.on('submit', function(ev) {
				ev.preventDefault();
			});

			//load data
			this.set("todos", todosFixtures);

		},

		_render: function() {
			this.inherited(arguments);
			var $ = this._components;

			//addTodo form
			$.addTodoLabel.placeAt($.addTodoForm);
			$.addButton.placeAt($.addTodoForm);
			this._placeComponent($.addTodoForm);
			//todos lists
			this._placeComponent($.todoListsContainer.addChildren([
				//active todos
				$.activeTodosSection.addChildren([
					$.activeTodoTitle,
					$.activeTodos
				]),
				//completed todos
				$.completedTodosSection.addChildren([
					$.completedTodoTitle,
					$.removeCompletedTodosButton,
					$.completedTodos,
				]),
			]));
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
				new binding.Event(this._components.activeTodos, this._presenter, {
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
		//TODO: create plurialized component
		updateActiveTodosCounter: function(){
			this._components.activeTodoTitle.innerHTML = "Tâches en cours (" + this._presenter.get("activeTodos").length + ")";
		},
		updateCompletedTodosCounter: function(){
			this._components.completedTodoTitle.innerHTML = "Tâches terminées (" + this._presenter.get("completedTodos").length + ")";
		},
	});
});