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
		postCreate: function() {
			this.inherited(arguments);
			//remove
			this.removeButton.on("click", this.delete.bind(this));
			//update label
			this.labelWidget.on("change", this.changeLabel.bind(this));
			this.checkWidget.on("change", this.select.bind(this));
		},
		
		plug: function(component) {
			this.component = component;
			this.labelWidget.set("value", this.component.get("label"), false);
			this.checkWidget.set("checked", this.component.get("selected"), false);
			this.component.watch('selected', function() {
				this.checkWidget.set("checked", this.component.get("selected"), false);
			}.bind(this));
			return this;
		},
		
		changeLabel: function() {
			this.component.set('label', this.labelWidget.get('value'));
		},
		
		select: function(checked) {
			this.component.select(checked);
		},
		
		delete: function() {
			this.component.delete();
		}
	});
});