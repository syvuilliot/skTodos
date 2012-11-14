define([
	'dojo/_base/declare',	'dojo/dom-construct',
    'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode',
    'SkFramework/component/Presenter',
    'SkFramework/utils/binding',
    'skTodos/app/v2',
    'skTodos/model/Todo',
    'skTodos/model/Tag',
    'skTodos/model/TodoTagRelation',
    './fixtures/todos.js', // is that a good practice to use relative path ? but it works !
    'skTodos/fixtures/tags',
    'skTodos/fixtures/todo-tag-relations',
], function(
	declare, domConstruct,
	DomComponent,							_WithDom,
	PresenterBase,
	binding,
    TodosManager,
    Todo,
    Tag,
    TodoTagRelation,
    todosFixtures,
    tagsFixtures,
    todoTagRelationsFixtures
) {
	var Presenter = declare([PresenterBase], {
		constructor: function(){
			//populate collections with data from localStorage (if any)
			Todo.load();
			Tag.load();
			TodoTagRelation.load();

		},
		syncTodos: function(ev){
			//TODO: allow for specifiyng the sync query
			var query = {};
			Todo.sync(query);

		},
		saveData: function(ev){
			Todo.save();
			Tag.save();
			TodoTagRelation.save();
		},

		_todosGetter: function(){
			return Todo.query();
		},
		_tagsGetter: function(){
			return Tag.query();
		}
	});

	return declare([DomComponent, _WithDom], {
		constructor: function(params) {
			//create internal machinery
			this._presenter = new Presenter();

			//register components
			this._addComponents({
				saveButton: domConstruct.create("button", {innerHTML: "Save data"}),
				syncButton: domConstruct.create("button", {innerHTML: "Sync todos"}),
				todosManager: new TodosManager({
					todos: this.get("todos"),
					tags: this.get("tags"),
				}),
			});
		},
		_render: function() {
			this.inherited(arguments);
			this._placeComponent(this._components.saveButton);
			this._placeComponent(this._components.syncButton);
			this._placeComponent(this._components.todosManager);
		},
		_bind: function() {
			this.own(
				new binding.Event(this._components.syncButton, this._presenter, {
					event: "click",
					method: "syncTodos",
				}),
				new binding.Event(this._components.saveButton, this._presenter, {
					event: "click",
					method: "saveData",
				})
			);
		},
	});

});

