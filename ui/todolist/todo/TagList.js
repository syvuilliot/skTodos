define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/controller/_ListRenderer",
	'../../base/_Base',
	"./Tag",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	ViewBase,
	TagView
) {
	return declare([Widget, Container, _ListRenderer, ViewBase], {
		addItem: function(item, index){
			var child = new TagView().set('model', this.get('model').getChild(item));
			this.addChild(child);
			return child;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		
		modelMapping: {
			items: 'items'
		}
	});
});