define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/controller/_ListRenderer",
	'../base/_Base',
	"./tag/Tag",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	ViewBase,
	TagView
) {
	return declare([Widget, Container, ViewBase, _ListRenderer], {
		addItem: function(tag, index){
			var tagView = new TagView().set('model', this.get('model').getChild(tag));
			this.addChild(tagView);
			return tagView;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		
		modelMapping: {
			items: 'items'
		}
	});
});