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
			return new TodoView().set('model', item);
		},
		
		modelMapping: {
			items: 'items'
		}
	});
});