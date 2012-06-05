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
		templateString: '<span><span data-dojo-type="dijit/form/TextBox" data-dojo-attach-point="selector"></span><button data-dojo-attach-point="validBtn">X</button></span>',

		postCreate: function() {
			this.inherited(arguments);

			on(this.validBtn, 'click', function() {
				this.emit('tagselected', {
					tag: this.getSelectedTag()
				});
			}.bind(this));
		},

		getSelectedTag: function() {
			var tagLabel = this.selector.get('value');
			var matchingQuery = this.tagModel.query({
				label: tagLabel
			});
			var tag;
			if (matchingQuery.length > 0) {
				tag = matchingQuery[0];
			}
			else {
				// Create new tag
				tag = new this.tagModel({
					label: tagLabel
				});
				tag.save();
			}
			return tag;
		}
	});
});