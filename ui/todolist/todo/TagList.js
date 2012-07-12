define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/controller/_ListRenderer",
	"./Tag",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	TagView
) {
	return declare([Widget, Container, _ListRenderer], {
		addItem: function(item, index){
			var child = new TagView().plug(this.component.getChild(item));
			this.addChild(child);
			return child;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		
		plug: function(component) {
			this.component = component;
			this.set('items', component.get('items'));
		}
	});
});