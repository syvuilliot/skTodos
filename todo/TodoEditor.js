define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/dom-style",
	"dojo/text!./template.html",
	"SkFramework/utils/statefulSync",
	"./Presenter",

	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
	"skTodos/dueDatePicker/DueDatePicker",
], function(
	declare,
	Widget,					Templated,					WidgetsInTemplate,
	domStyle,
	template,
	statefulSync,
	Presenter
){
	return declare([Widget, Templated, WidgetsInTemplate, Presenter], {
		templateString: template,

		startup: function(){
			this.inherited(arguments);
			this.bind();
		},

		bind: function(){

			statefulSync(this, this.labelWidget, {
				label: "value",
				checked: "disabled",
			});
			statefulSync(this, this.checkWidget, {
				checked: "checked",
			});
			statefulSync(this, this.dueDateWidget, {
				dueDate: "date",
			});
			this.dueDateButton.on("click", function(){
				this.set("dueDate", new Date());
			}.bind(this));
			function dueDateWidgetToogle(dueDate){
				domStyle.set(this.dueDateButton.domNode, "display", dueDate ? "none" : "block");
				domStyle.set(this.dueDateWidget.domNode, "display", dueDate ? "block" : "none");			
			}
			dueDateWidgetToogle.bind(this)(this.get("dueDate"));
			this.watch("dueDate", function(prop, old, current){
				dueDateWidgetToogle.bind(this)(current);
			}.bind(this));

		},
						
	});
});