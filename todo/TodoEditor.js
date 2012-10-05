define([
	"dojo/_base/declare", "dojo/_base/lang",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./template.html",
	"SkFramework/utils/binding",
	"./Presenter",

	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
	"skTodos/dueDatePicker/DueDatePicker",
], function(
	declare, lang,
	Widget,					Templated,					WidgetsInTemplate,
	template,
	binding,
	Presenter
){

	return declare([Widget, Templated, WidgetsInTemplate, Presenter], {
		templateString: template,

		constructor: function(){
			this.disabled = false; 
		},

		startup: function(){
			this.inherited(arguments);
			this.bind();
		},

		bind: function(){
			new binding.Multi(this, this.labelWidget, [
				{type: "Value", sourceProp: "checked", targetProp: "disabled"},
				{type: "ValueSync", sourceProp: "label", targetProp: "value"},
				{type: "Value", sourceProp: "disabled", targetProp: "disabled"},

			]);
			new binding.Multi(this, this.checkWidget, [
				{type: "ValueSync", sourceProp: "checked", targetProp: "checked"},
				{type: "Value", sourceProp: "disabled", targetProp: "disabled"},
			]);
			new binding.Multi(this, this.dueDateWidget, [
				{type: "ValueSync", sourceProp: "dueDate", targetProp: "date"},
				{type: "Value", sourceProp: "disabled", targetProp: "disabled"},
			]);
			new binding.Click(this.dueDateButton, this, {
				method: "setDueDateToToday"
			});
			new binding.Display(this, this.dueDateWidget, {
				sourceProp: "dueDate"
			});
			new binding.Display(this, this.dueDateButton, {
				sourceProp: "dueDate", not: true
			});
		},
						
	});
});