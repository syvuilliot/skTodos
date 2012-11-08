define([
	'dojo/_base/declare',	'dojo/dom-construct',
    'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode',	'SkFramework/component/_WithDijit', 'SkFramework/component/_Container',
    'SkFramework/component/Presenter',
    'SkFramework/utils/binding',
    '../todo/TodoEditor',
    '../taggedTodo/TaggedTodo',
    '../list/List',	'../removableList/List',
	"skTodos/model/Todo",
	"skTodos/model/Tag",
	"dijit/form/Form",	"dijit/form/Button",	"dijit/form/TextBox",
], function(
	declare,				domConstruct,
	DomComponent,							_WithDom,								_WithDijit, _Container,
	PresenterBase,
	binding,
	TodoEditor,
	TaggedTodo,
	List,			RemovableList,
    Todo,
    Tag,
    Form,				Button,					TextBox
) {

	var Presenter = declare([PresenterBase], {
		_todosSetter: function(value){
			//create an observable collection of Todo instances if the provided value is not already one
			if (!value.observe){
				this.todosStore = Todo;
				value.forEach(function(item){
					var todo = item instanceof Todo ? item : new Todo(item);
					this.todosStore.put(todo);
				}.bind(this));
			} else {
				this.todosStore = value;
			}
			this.set("activeTodos", this.todosStore.query({checked: false}));
			this.set("completedTodos", this.todosStore.query({checked: true}));
		},
		_tagsSetter: function(value){
			//create an observable collection of Tag instances if the provided value is not already one
			// when Tag will not be also a collection, we will have to do :
			// this.tagStore = new Collection({itemConstructor: Tag, items: fixtures});
			// each item in items will be converted to a Tag instance if necessary
			if (!value.observe){
				this.tagsStore = Tag;
				value.forEach(function(item){
					var tag = item instanceof Tag ? item : new Tag(item);
					this.tagsStore.put(tag);
				}.bind(this));
			} else {
				this.tagsStore = value;
			}
		},
		addTodo: function(value){
			var todo = new Todo(value);
			this.todosStore.put(todo);
			//observe each todo, so we don't have to call save on them
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

	var ContainerComponent = declare([DomComponent, _WithDom, _WithDijit, _Container]);

	return declare([DomComponent, _WithDom, _WithDijit], {
		domAttrs: {
			'class': "todo-app"
		},
		constructor: function(params) {
			//create internal machinery
			this._presenter = new Presenter({tags: params.tags}); //we need to give manually the params required at presenter creation time

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
				activeTodos: new RemovableList({itemConfig: {
					constructor: TaggedTodo,
					tags: this._presenter.tagsStore.query(), //this only works if tagStore is known at creation time and doesn't change after
				}}),
				removeCompletedTodosButton: new Button({
					'label': "Supprimer les tâches terminées"
				}),
				activeTodoTitle: domConstruct.create('h2'),
				completedTodoTitle: domConstruct.create("h2"),
			});
			
			this._components.addTodoForm.on('submit', function(ev) {
				ev.preventDefault();
			});
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