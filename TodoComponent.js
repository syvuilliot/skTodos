define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"./models",
	"SkFramework/widgets/Widget",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/CheckBox",
	"SkFramework/widgets/NewList",
	"dijit/form/ComboBox",
	"dojo/store/Memory",
], function(
	declare,
	lang,
	models,
	Widget,
	TextBox,
	Button,
	CheckBox,
	List,
	ComboBox,
	Memory
){
	var Tag = models.Tag;

	return declare(Widget, {
		children: {
			done: {
				type: CheckBox,
				events: {change: "updateDone"},
			},
			label: {
				type: TextBox,
				events: {change: "updateLabel"},
			},
			button: {
				type: Button,
				params: {label: "Remove"},
				events: {click: "removeTodo"},
			},
			tagsList: {
				type: List,
				params: {
					itemPropName: "tag",
					itemViewType: Widget,
					itemViewParams: {
						children: {
							label: {
								type: TextBox,
							},
							button: {
								type: Button,
								params: {label: "Remove"},
								events: {click: "remove"},
							},
						},
						_setTagAttr: function(tag){
							this.tag = tag;
							this.getChild("label").set("value", tag.label);
						},
						remove: function(ev){
							this.emit("remove", {tag: this.tag});
						}
					},
				},
				events: {remove: "removeTag"},
			},
			addTag: {
				type: ComboBox,
				params: {
					store: new Memory({data: Tag.query()}), //mandatory param at construction time
					searchAttr: "label",
				},
				events: {"change": "addTag"},
			},
		},
		removeTodo: function(ev){
			//what to do here ? call todo.remove() or send an event "remove" with the todo instance ?
			// this.todo.remove();
			this.emit("remove-todo", {todo: this.todo});
		},
		updateLabel: function(ev){
			this.emit("update-label", {todo: this.todo, label: this.getChild("label").get("value")});
		},
		updateDone: function(ev){
			//not sure if we should instead fire a "toogle-done" with the todo only (and not the state of the check widget)
			this.emit("update-done", {todo: this.todo, done: this.getChild("done").get("checked")});
		},
		removeTag: function(ev){
			this.emit("remove-tag", {todo: this.todo, tag: ev.tag});
		},
		addTag: function(ev){
			this.emit("add-tag", {todo: this.todo, tag: this.getChild("addTag").get("value")});
		},
		_setTodoAttr: function(todo){
			this.todo = todo;
			//an update of the instance should not fire lableWidget "change" event
			this.getChild("label").set("value", todo.get("label"), false);
			this.getChild("done").set("checked", todo.get("done"), false);
			this.getChild("tagsList").set("items", todo.get("tags"));
		},
	});
});