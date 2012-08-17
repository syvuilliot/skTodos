define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/widgets/_ListRendererMixin",
	'SkFramework/widgets/_ModelRendererMixin',
	"./todo/Todo",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	ViewBase,
	TodoView
) {
	return declare([Widget, Container, ViewBase, _ListRenderer], {
		renderItem: function(item, index){
			var child = new TodoView().set('model', this.get('model').getChild(item));
			return child;
		},
		
		modelMapping: {
			items: 'items'
		}
	});
});