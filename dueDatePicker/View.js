define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./template.html",
	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/Button",

], function(
	declare,
	Widget,					Templated,					WidgetsInTemplate,
	template
	){
	
	return declare([Widget, Templated, WidgetsInTemplate], {
		templateString: template,
	});
});