define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo.html",
	'./TagList',	'./TagSelector',
	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
	"dijit/form/Button"
], function(
	declare,				lang,				domClass,
	Widget,					Evented,		Templated,					WidgetsInTemplate,
	template,
	TagList,		TagSelector
){
	return declare([Widget, Evented, Templated, WidgetsInTemplate], {
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
		
		plug: function(component) {
			this.component = component;
			this.labelWidget.set("value", this.component.get('todo').get("label"), false);
			this.set("checked", this.component.get('todo').get("checked"));
			this.tagList.plug(this.component.get("tagList"));
			this.tagSelector.plug(this.component.get('tagSelector'));
			return this;
		},
		
		changeLabel: function() {
			this.component.get('todo').set('label', this.labelWidget.get('value'));
		},
		
		_setCheckedAttr: function(checked) {
			domClass.toggle(this.domNode, 'checked', checked);
			this.checkWidget.set('checked', checked, false);
		},
		
		checkChanged: function(checked) {
			this.set('checked', checked);
			this.component.get('todo').set('checked', this.checkWidget.get('checked'));
		},
		
		remove: function() {
			this.component.delete();
		}
	});
});