define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	'SkFramework/widgets/_ModelRendererMixin',
	"dojo/text!./tag.html",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/RadioButton",
], function(
	declare,				lang,				domClass,
	Widget,					Evented,		Templated,					WidgetsInTemplate,
	ViewBase,
	template
){
	return declare([Widget, Evented, Templated, WidgetsInTemplate, ViewBase], {
		templateString: template,
		
		postCreate: function() {
			this.inherited(arguments);
			//remove
			this.removeButton.on("click", this.delete.bind(this));
			//update label
			this.labelWidget.on("change", this.changeLabel.bind(this));
			this.checkWidget.on("change", this.select.bind(this));
		},
		
		modelMapping: {
			selected: 'selected'
		},
		
		_setModelAttr: function(component) {
			this.inherited(arguments);
			
			this.labelWidget.set("value", this.get('model').get("label"), false);
			
			return this;
		},
		
		changeLabel: function() {
			this.get('model').set('label', this.labelWidget.get('value'));
		},
		
		_setSelectedAttr: function(selected) {
			selected = selected || false;
			domClass.toggle(this.domNode, 'selected', selected);
			this.checkWidget.set("checked", selected, false);
		},
		
		select: function(selected) {
			this.get('model').select(selected);
			this.set('selected', selected);
		},
		
		delete: function() {
			this.get('model').delete();
		}
	});
});