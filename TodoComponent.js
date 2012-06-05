define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dijit/_WidgetBase", "dojo/Evented",	"dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"SkFramework/widgets/List",
	"./RemovableTag",
	"dojo/text!./todoComponent.html",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/CheckBox",
], function(
	declare,
	lang,
	domConstruct,
	Widget,				Evented,		Templated,				WidgetsInTemplate,
	List,
	RemovableTag,
	template
){
	return declare([Widget, Evented, Templated, WidgetsInTemplate], {
		templateString: template,
		buildRendering: function(){
			this.inherited(arguments);
			this.tagList = new List({
				renderItem: this.addTag.bind(this),
			}, this.tagListNode);
			this.tagSelector.placeAt(this.addTagNode);
		},
		postCreate: function(){
			this.inherited(arguments);
			//remove
			this.removeButton.on("click", function(){
				this.emit("delete", {todo: this.todo});
			}.bind(this));
			//update label
			this.labelWidget.on("change", function(ev){
				this.emit("updateLabel", {todo: this.todo, label: this.labelWidget.get("value")});
			}.bind(this));
			this.checkWidget.on("change", function(ev){
				this.emit("updateDone", {todo: this.todo, done: this.checkWidget.get("checked")});
			}.bind(this));
			this.tagSelector.on('tagselected', function(ev) {
				this.todo.add('tags', ev.tag);
				this.todo.save();
			}.bind(this));

		},
		_setTodoAttr: function(todo){
			this.todo = todo;
			//an update of the instance should not fire lableWidget "change" event
			this.labelWidget.set("value", todo.get("label"), false);
			this.checkWidget.set("checked", todo.get("done"), false);
			this.tagList.set("items", todo.get("tags"));
			
		},
		addTag: function(tag){
			var tagView = new RemovableTag({
				tag: tag
			});
			tagView.on("remove", function(ev){
				this.todo.remove("tags", tag);
				this.todo.save();
			}.bind(this));
			return tagView;
		},
	});
});