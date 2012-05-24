define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"./MainController",
	"./TodoListComponent",
	"./TagListComponent",
	"dojo/text!./mainComponent.html",
	"dijit/form/TextBox",
], function(
	declare,
	lang,
	Widget,				Evented,			Templated,				WidgetsInTemplate,
	MainController,
	TodoListComponent,
	TagListComponent,
	template
){
	return declare([Widget, Evented, Templated, WidgetsInTemplate, MainController], {
		templateString: template,
		startup: function(){
			this.inherited(arguments);
			//new tag
			this.newTag.on("change", function(e){
				this.createTag({label: this.newTag.get("value")});
				this.newTag.set("value", "", false);
			}.bind(this));
			//tag list
			this.tagList = new TagListComponent({
				items: this.getTags(),
			}, this.tagListNode);
			this.tagList.startup();
			//this.tagList.on("tagRemove", this.tagRemove);
			this.tagList.on("tagUpdateLabel", this.tagUpdateLabel.bind(this));
			this.tagList.on("tagUpdateSelected", this.tagUpdateSelected.bind(this));		
			//new todo
			this.newTodo.on("change", function(e){
				this.createTodo({label: this.newTodo.get("value")});
				this.newTodo.set("value", "", false);
			}.bind(this));
			this.todoList = new TodoListComponent({
				// items: this.getTodos(),
			}, this.todoListNode);
			this.todoList.startup();
			this.todoList.on("todoRemove", this.todoRemove.bind(this));
			this.todoList.on("todoUpdateLabel", this.todoUpdateLabel.bind(this));
			this.todoList.on("todoUpdateDone", this.todoUpdateDone.bind(this));
		},
		todoRemove: function(ev){
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
			this.todoList.set("items", this.getTodos());
		}
	});
});