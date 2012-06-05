define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",
	"./MainController",
	"./TodoListComponent",
	"./TodoComponent",
	"./TagListComponent",
	"dojo/text!./mainComponent.html",
	"dijit/form/TextBox",
	"./models",
	"SkFramework/controller/_ListRenderer",
	'dgrid/List'
], function(
	declare,
	lang,
	Widget,				Evented,			Templated,
	MainController,
	TodoListComponent,
	TodoComponent,
	TagListComponent,
	template,
	TextBox,
	models,
	_ListRenderer,
	List
){
	var Tag = models.Tag;
	var Todo = models.Todo;
	
	return declare([Widget, Evented, Templated, _ListRenderer], {
		templateString: template,
		
		postCreate: function(){
			this.inherited(arguments);
			this.tagsState = [];
			//tags list
			this.tagList = new TagListComponent({
				items: this.getTags(),
			}, this.tagListNode);
			this.tagList.on("tagUpdateSelected", this.tagUpdateSelected.bind(this));
			
			//new todo
			this.newTodo = new TextBox({}, this.newTodoNode);
			this.newTodo.on("change", function(e){
				this.todoCreate({label: this.newTodo.get("value")});
				this.newTodo.set("value", "", false);
			}.bind(this));
			
			//todo list
			this.todoList = new List({
				renderRow: function(item) {
					return this.addItem(item).domNode;
				}.bind(this)
			}, this.todoListNode);
			
		},
		
		startup: function(){
			this.tagList.startup();
			this.newTodo.startup();
			this.todoList.startup();
			this.set("items", this.getTodos());
		},
		
		_setItemsAttr: function (items) {
			if (items.length) {
				this.todoList.renderArray(items);
			}
			else {
				this.todoList.refresh();
			}
		},
		
		getTodos: function(){
			//return Todo.query({});
			var firstTagSelected = this.getTagsState()[0];
			return firstTagSelected && firstTagSelected.get("todos") || [];
		},
		todoCreate: function(params){
			var newTodo = new Todo({
				label: params.label,
			});
			// add tags from tagsState to the new todo
			this.getTagsState().forEach(function(tag){
				newTodo.add("tags", tag);
			});
			
			newTodo.save();
		},
		
		addItem: function(todo) {
			var todoCmp = new TodoComponent({
				todo: todo
			});
			todoCmp.on('delete', this.todoDelete.bind(this));
			todoCmp.on("udatelabel", this.todoUpdateLabel.bind(this));
			todoCmp.on("updatedone", this.todoUpdateDone.bind(this));
			return todoCmp;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		todoDelete: function(ev){
			ev.todo.remove();
		},
		todoUpdateLabel: function(ev){
			ev.todo.set("label", ev.label);
			ev.todo.save();
		},
		todoUpdateDone: function(ev){
			ev.todo.set("done", ev.done);
			ev.todo.save();
		},
		getTags: function(){
			return Tag.query({});
		},
		//get tags selected by user
		getTagsState: function(){
			return this.tagsState;
		},
		tagUpdateLabel: function(ev){
			ev.tag.set("label", ev.label);
			ev.tag.save();
		},
		tagUpdateSelected: function(ev){
			if (ev.selected === true && this.tagsState.indexOf(ev.tag) == -1){
				this.tagsState.push(ev.tag);
			}
			if (ev.selected === false && this.tagsState.indexOf(ev.tag) != -1){
				this.tagsState.splice(this.tagsState.indexOf(ev.tag), 1);
			}
			this.set("items", this.getTodos());
		}
	});
});