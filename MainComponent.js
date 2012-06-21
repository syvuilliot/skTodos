define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",
	"./TodoComponent",
	"./TagListComponent",
	"./TagSelector",
	"dojo/text!./mainComponent.html",
	"dijit/form/TextBox",
	"./models",
	"SkFramework/widgets/List",
	'SkFramework/store/Mirror'
], function(
	declare,
	lang,
	Widget,				Evented,			Templated,
	TodoComponent,
	TagListComponent,
	TagSelector,
	template,
	TextBox,
	models,
	List,
	Mirror
){
	var Tag = models.Tag;
	var Todo = models.Todo;
	
	return declare([Widget, Evented, Templated], {
		templateString: template,
		
		postCreate: function(){
			this.inherited(arguments);
			
			new Mirror({
				local: Todo.store,
				remote: googleTasks
			});
			
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
				//for dgrid
				renderRow: function(item) {
					return this.addItem(item).domNode;
				}.bind(this),
				//for SkList
				renderItem: function(item) {
					return this.addItem(item);
				}.bind(this),
			}, this.todoListNode);
			
		},
		
		startup: function(){
			this.tagList.startup();
			this.newTodo.startup();
			this.todoList.startup();
			this.set("items", this.getTodos());
		},
		
		_setItemsAttr: function (items) {
			// this.todoList.refresh();
			// this.todoList.renderArray(items);
			this.todoList.set("items", items);
		},
		
		getTodos: function(){
			return Todo.query({});
			//var firstTagSelected = this.getTagsState()[0];
			//return firstTagSelected && firstTagSelected.get("todos") || [];
		},
		todoCreate: function(params){
			var newTodo = new Todo({
				label: params.label,
			});
			newTodo.save();
			// add tags from tagsState to the new todo
			this.getTagsState().forEach(function(tag){
				newTodo.add("tags", tag).save();
			});
		},
		
		addItem: function(todo) {
			var addTagCmp = new TagSelector({
				tagModel: Tag,
			});
			var todoCmp = new TodoComponent({
				todo: todo,
				tagSelector: addTagCmp,
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
			ev.todo.delete();
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