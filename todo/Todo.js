define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo.html",
	"SkFramework/utils/statefulSync",
	"./model/Todo",
	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
], function(
	declare,				lang,				domClass,
	Widget,					Templated,					WidgetsInTemplate,
	template,
	statefulSync,
	TodoModel
){
	return declare([Widget, Templated, WidgetsInTemplate], {
		templateString: template,
		
		_setDataAttr: function(data){ //external data
			var todo = new TodoModel(data);
			this.set("model", todo);
		},
		_setModelAttr: function(model){ //internal model
			this.model = model;
			statefulSync(model, this.labelWidget, {
				label: "value",
			});
			statefulSync(model, this.checkWidget, {
				checked: "checked",
			});
		},
				
	});
});