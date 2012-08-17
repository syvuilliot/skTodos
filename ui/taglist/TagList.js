define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/widgets/_ListRendererMixin",
	'SkFramework/widgets/_ModelRendererMixin',
	"./tag/Tag",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	ViewBase,
	TagView
) {
	return declare([Widget, Container, ViewBase, _ListRenderer], {
		renderItem: function(tag, index){
			var tagView = new TagView().set('model', tag);
			return tagView;
		},
		
		modelMapping: {
			items: 'items'
		}
	});
});