define([
	"dojo/_base/declare",	"dojo/_base/lang",
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo.html",
	'./TagList',	'./TagSelector',
	"dijit/form/TextBox",
	"dijit/form/Button"
], function(
	declare,				lang,
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
			
			this.tagList = new TagList({}, this.tagListNode);
			
			this.tagSelector = new TagSelector({
				tagModel: Tag,
			}, this.addTagNode);
		},
		
		plug: function(component) {
			this.component = component;
			this.labelWidget.set("value", this.component.get('todo').get("label"), false);
			this.tagList.plug(this.component.get("tagList"));
			this.tagSelector.plug(this.component.get('tagSelector'));
			return this;
		},
		
		changeLabel: function() {
			this.component.get('todo').set('label', this.labelWidget.get('value'));
		},
		
		remove: function() {
			this.component.delete();
		}
	});
});