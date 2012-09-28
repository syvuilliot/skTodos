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

		postCreate: function(){
			this.inherited(arguments);

			var model = this.model = new TodoModel(); //internal model
			statefulSync(model, this.labelWidget, {
				label: "value",
				checked: "disabled",
			});
			statefulSync(model, this.checkWidget, {
				checked: "checked",
			});

		},
						
	});
});