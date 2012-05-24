define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dijit/_WidgetBase", "dojo/Evented",	"dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	//"./todoController",
	"dojo/text!./todoComponent.html",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/CheckBox",
], function(
	declare,
	lang,
	domConstruct,
	Widget,				Evented,		Templated,				WidgetsInTemplate,
	//todoController,
	template
){
	return declare([Widget, Evented, Templated, WidgetsInTemplate], {
		templateString: template,
		startup: function(){
			this.inherited(arguments);
			//remove
			this.removeButton.on("click", function(){
				//what to do here ? call todo.remove() or send an event "remove" with the todo instance ?
				// this.todo.remove();
				this.emit("remove", {todo: this.todo});
			}.bind(this));
			//update label
			this.labelWidget.on("change", function(ev){
				this.emit("updateLabel", {todo: this.todo, label: this.labelWidget.get("value")});
			}.bind(this));
			this.checkWidget.on("change", function(ev){
				this.emit("updateDone", {todo: this.todo, done: this.checkWidget.get("checked")});
			}.bind(this));
		},
		_setTodoAttr: function(todo){
			this.todo = todo;
			//an update of the instance should not fire lableWidget "change" event
			this.labelWidget.set("value", todo.get("label"), false);
			this.checkWidget.set("checked", todo.get("done"), false);
			todo.get("tags").forEach(function(tag){
				domConstruct.create("li", {innerHTML: tag.get("label")}, this.tagsListNode);
			}.bind(this));
			
		},
	});
});