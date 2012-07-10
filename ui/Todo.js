define([
	"dojo/_base/declare",	"dojo/_base/lang",
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo.html",
	"dijit/form/TextBox",
	"dijit/form/Button"
], function(
	declare,				lang,
	Widget,					Evented,		Templated,					WidgetsInTemplate,
	template
){
	return declare([Widget, Evented, Templated, WidgetsInTemplate], {
		templateString: template,
		postCreate: function(){
			this.inherited(arguments);
			//remove
			this.removeButton.on("click", this.remove.bind(this));
			//update label
			this.labelWidget.on("change", this.changeLabel.bind(this));
		},
		
		bind: function(manager) {
			this.manager = manager;
			this.labelWidget.set("value", this.manager.get("label"), false);
			return this;
		},
		
		changeLabel: function() {
			this.manager.set('label', this.labelWidget.get('value'));
		},
		
		remove: function() {
			this.manager.delete();
		}
	});
});