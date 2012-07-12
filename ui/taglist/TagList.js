define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/controller/_ListRenderer",
	"./tag/Tag",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	TagView
) {
	return declare([Widget, Container, _ListRenderer], {
		addItem: function(tag, index){
			var tagView = new TagView().plug(this.component.getChild(tag));
			this.addChild(tagView);
			return tagView;
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