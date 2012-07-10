define([
	"dojo/_base/declare",	"dojo/_base/lang",
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./tag.html",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/RadioButton",
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
			this.removeButton.on("click", this.delete.bind(this));
			//update label
			this.labelWidget.on("change", this.changeLabel.bind(this));
			this.checkWidget.on("change", this.select.bind(this));
		},
		
		bind: function(manager) {
			this.manager = manager;
			this.labelWidget.set("value", this.manager.get("label"), false);
			this.checkWidget.set("checked", this.manager.get("selected"), false);
			this.manager.watch('selected', function() {
				this.checkWidget.set("checked", this.manager.get("selected"), false);
			}.bind(this));
			return this;
		},
		
		changeLabel: function() {
			this.manager.set('label', this.labelWidget.get('value'));
		},
		
		select: function(checked) {
			this.manager.select(checked);
		},
		
		delete: function() {
			this.manager.delete();
		}
	});
});