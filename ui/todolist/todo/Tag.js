define([
	"dojo/_base/declare",	'dojo/on',
	"dijit/_WidgetBase", "dojo/Evented",	"dijit/_TemplatedMixin",
	"dijit/form/Button",
], function(
	declare,				on, 
	Widget, Evented, Templated){
	return declare([Widget, Evented, Templated], {
		templateString: '<span><span data-dojo-attach-point="label"></span><button data-dojo-attach-point="removeBtn">X</button></span>',

		postCreate: function() {
			on(this.removeBtn, 'click', function() {
				this.component.remove();
			}.bind(this));
		},

		_setTagAttr: function(tag) {
			this.label.innerHTML = tag.label;
		},
		
		plug: function(cmp) {
			this.component = cmp;
			this.set('tag', this.component.get('tag'));
			return this;
		}
	});
});