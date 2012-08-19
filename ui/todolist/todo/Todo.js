define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo.html",
	'SkFramework/widgets/_ModelRendererMixin',
	'./TagList',	'./TagSelector',
	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
	"dijit/form/Button"
], function(
	declare,				lang,				domClass,
	Widget,					Evented,		Templated,					WidgetsInTemplate,
	template,
	ViewBase,
	TagList,		TagSelector
){
	return declare([Widget, Evented, Templated, WidgetsInTemplate, ViewBase], {
		templateString: template,
		
		postCreate: function(){
			this.inherited(arguments);
			//remove
			this.removeButton.on("click", this.remove.bind(this));
			//update label
			this.labelWidget.on("change", this.changeLabel.bind(this));
			this.checkWidget.on("change", this.checkChanged.bind(this));
			
			this.tagList = new TagList({}, this.tagListNode);
			
			this.tagSelector = new TagSelector({
				tagModel: Tag,
			}, this.addTagNode);
		},

		startup: function() {
			this.inherited(arguments);
			this.tagList.startup();
			this.tagSelector.startup();
		},
		
		modelMapping: {
			label: 'label',
			checked: 'checked'
		},
		
		_setModelAttr: function(component) {
			this.inherited(arguments);
			this.tagList.set('model', this.get('model').get("tagList"));
			this.tagSelector.set('model', this.get('model').get('tagSelector'));
			return this;
		},
		
		_setLabelAttr: function(label) {
			this.labelWidget.set("value", label, false);
		},
		
		changeLabel: function() {
			try {
				this.get('model').set('label', this.labelWidget.get('value'));
			}
			catch(ex) {
				this.set('label', this.get('model').get('label'));
			}
		},
		
		_setCheckedAttr: function(checked) {
			domClass.toggle(this.domNode, 'checked', checked);
			this.checkWidget.set('checked', checked, false);
		},
		
		checkChanged: function(checked) {
			this.set('checked', checked);
			this.get('model').set('checked', this.checkWidget.get('checked'));
		},
		
		remove: function() {
			this.get('model').delete();
		}
	});
});