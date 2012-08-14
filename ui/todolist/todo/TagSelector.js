define([
	'dojo/_base/declare',	'dojo/on',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	'dijit/_WidgetsInTemplateMixin',
	'../../base/_Base',
	"dijit/form/Button",	'dijit/form/TextBox'
], function(
	declare,				on,
	Widget,					Evented,		Templated,					_WidgetsInTemplateMixin,
	ViewBase,
	Button,					TextBox
) {
	return declare([Widget, Templated, _WidgetsInTemplateMixin, Evented, ViewBase], {
		templateString: '<span><span data-dojo-type="dijit/form/TextBox" data-dojo-attach-point="selector"></span><button data-dojo-attach-point="validBtn">+</button></span>',

		postCreate: function() {
			this.inherited(arguments);

			on(this.validBtn, 'click', this.selectTag.bind(this));
		},

		selectTag: function() {
			var tagLabel = this.selector.get('value');
			this.get('model').selectTag(tagLabel);
		}
	});
});