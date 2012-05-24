define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_WidgetBase",
	"dojo/Evented",
	"SkFramework/Controller/_ListRenderer",
	"dijit/_Container",
	"./TodoComponent",
], function(declare, lang, Widget, Evented, _ListRenderer, _Container, TodoComponent){
	return declare([Widget, Evented, _Container, _ListRenderer], {
		addItem: function(todo, index){
			var todoComponent = new TodoComponent({
				todo: todo,
			});
			this.addChild(todoComponent);
			todoComponent.on("remove", this.todoRemove.bind(this));
			todoComponent.on("updateLabel", this.todoUpdateLabel.bind(this));
			todoComponent.on("updateDone", this.todoUpdateDone.bind(this));
			return todoComponent;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		todoRemove: function (ev) {
			this.emit("todoRemove", {todo: ev.todo});
		},
		todoUpdateLabel: function(ev){
			this.emit("todoUpdateLabel", {todo: ev.todo, label: ev.label});
		},
		todoUpdateDone: function(ev){
			this.emit("todoUpdateDone", {todo: ev.todo, done: ev.done});
		},
	});
});