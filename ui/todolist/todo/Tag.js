define([
	"dojo/_base/declare",	'dojo/on',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	'SkFramework/widgets/_ModelRendererMixin',
	"dijit/form/Button",
], function(
	declare,				on, 
	Widget,					Evented,		Templated,					_WidgetsInTemplateMixin,
	ViewBase){
	return declare([Widget, Evented, Templated, _WidgetsInTemplateMixin, ViewBase], {
		'class': 'tag',
		templateString: '<span><span data-dojo-attach-point="label"></span><span data-dojo-type="dijit/form/Button" data-dojo-attach-point="removeBtn">X</span></span>',

		postCreate: function() {
			on(this.removeBtn, 'click', function() {
				this.get('model').remove();
			}.bind(this));
		},
		
		modelMapping: {
			label: 'label'
		},

		_setLabelAttr: function(label) {
			this.label.innerHTML = label;
		}
	});
});