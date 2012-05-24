define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_WidgetBase", "dojo/Evented",	"dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./tagComponent.html",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/CheckBox",
], function(
	declare,
	lang,
	Widget,				Evented,		Templated,				WidgetsInTemplate,
	template
){
	return declare([Widget, Evented, Templated, WidgetsInTemplate], {
		templateString: template,
		startup: function(){
			this.inherited(arguments);
			//remove
			this.removeButton.on("click", function(){
				this.emit("remove", {tag: this.tag});
			}.bind(this));
			//update label
			this.labelWidget.on("change", function(ev){
				this.emit("updateLabel", {tag: this.tag, label: this.labelWidget.get("value")});
			}.bind(this));
			this.checkWidget.on("change", function(ev){
				this.emit("updateSelected", {tag: this.tag, selected: this.checkWidget.get("checked")});
			}.bind(this));
		},
		_setTagAttr: function(tag){
			this.tag = tag;
			this.labelWidget.set("value", tag.get("label"), false);
			//this.checkWidget.set("checked", tag.get("selected"), false); //we don't need that since "selected" is not a property of tag model but a state of the application
		},
	});
});