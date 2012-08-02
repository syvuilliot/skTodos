define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./tag.html",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/RadioButton",
], function(
	declare,				lang,				domClass,
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
			this.labelWidget.set("value", this.component.get('tag').get("label"), false);
			this.set('selected', this.component.get("selected"));
			this.component.watch('selected', function(attr, oldValue, newValue) {
				this.set('selected', newValue);
			}.bind(this));
			return this;
		},
		
		changeLabel: function() {
			this.component.get('tag').set('label', this.labelWidget.get('value'));
		},
		
		_setSelectedAttr: function(selected) {
			selected = selected || false;
			domClass.toggle(this.domNode, 'selected', selected);
			this.checkWidget.set("checked", selected, false);
		},
		
		select: function(selected) {
			this.component.select(selected);
			this.set('selected', selected);
		},
		
		delete: function() {
			this.component.delete();
		}
	});
});