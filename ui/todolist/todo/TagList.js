define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/widgets/_ListRendererMixin",
	'SkFramework/widgets/_ModelRendererMixin',
	"./Tag",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	ViewBase,
	TagView
) {
	return declare([Widget, Container, _ListRenderer, ViewBase], {
		renderItem: function(item, index){
			var child = new TagView().set('model', this.get('model').getChild(item));
			return child;
		},
		
		modelMapping: {
			items: 'items'
		}
	});
});