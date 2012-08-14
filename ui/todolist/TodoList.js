define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/controller/_ListRenderer",
	'../base/_Base',
	"./todo/Todo",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	ViewBase,
	TodoView
) {
	return declare([Widget, Container, ViewBase, _ListRenderer], {
		addItem: function(item, index){
			var child = new TodoView().set('model', this.get('model').getChild(item));
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