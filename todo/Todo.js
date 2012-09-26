define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo.html",
	'SkFramework/widgets/_ModelRendererMixin', "SkFramework/utils/statefulSync",
	"./model/Todo",
	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
], function(
	declare,				lang,				domClass,
	Widget,					Evented,		Templated,					WidgetsInTemplate,
	template,
	ModelRenderer,	statefulSync,
	TodoModel

){
	return declare([Widget, Evented, Templated, WidgetsInTemplate, ModelRenderer], {
		templateString: template,
		
		postCreate: function(){
			this.inherited(arguments);
			//update label
			this.labelWidget.on("change", this.changeLabel.bind(this));
			this.checkWidget.on("change", this.checkChanged.bind(this));		
		},
		
		modelMapping: {
			label: 'label',
			checked: 'checked'
		},
		
		_setModelAttr: function(item) {
			var todo = new TodoModel();
			statefulSync(item, todo, {
				label: 'label',
				checked: 'checked'
			});
			this._set("model", todo);
			this._bindModel();
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
		
	});
});