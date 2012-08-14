define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo.html",
	'../../base/_Base',
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
		
		_setModelAttr: function(component) {
			this.inherited(arguments);
			
			this.labelWidget.set("value", this.get('model').get('todo').get("label"), false);
			this.set("checked", this.get('model').get('todo').get("checked"));
			this.tagList.set('model', this.get('model').get("tagList"));
			this.tagSelector.set('model', this.get('model').get('tagSelector'));
			return this;
		},
		
		changeLabel: function() {
			this.get('model').get('todo').set('label', this.labelWidget.get('value'));
		},
		
		_setCheckedAttr: function(checked) {
			domClass.toggle(this.domNode, 'checked', checked);
			this.checkWidget.set('checked', checked, false);
		},
		
		checkChanged: function(checked) {
			this.set('checked', checked);
			this.get('model').get('todo').set('checked', this.checkWidget.get('checked'));
		},
		
		remove: function() {
			this.get('model').delete();
		}
	});
});