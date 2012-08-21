define([
	'dojo/_base/declare',	'dojo/on',
	"dijit/_WidgetBase",	"dojo/Evented",	"dijit/_TemplatedMixin",	'dijit/_WidgetsInTemplateMixin',
	"dijit/form/Button",	'dijit/form/TextBox'
], function(
	declare,				on,
	Widget,					Evented,		Templated,					_WidgetsInTemplateMixin,
	Button,					TextBox
) {
	return declare([Widget, Templated, _WidgetsInTemplateMixin, Evented], {
		templateString: '<span><span data-dojo-type="dijit/form/TextBox" data-dojo-attach-point="selector"></span><button data-dojo-attach-point="validBtn">+</button></span>',

		postCreate: function() {
			this.inherited(arguments);

			on(this.validBtn, 'click', this.selectTag.bind(this));
		},

		selectTag: function() {
			this.emit('tagselected', this.selector.get('value'));
		}
	});
});