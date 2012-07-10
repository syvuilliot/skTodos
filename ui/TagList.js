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
		addItem: function(tag, index){
			var tagView = new TagView().bind(this.manager.getChild(tag));
			this.addChild(tagView);
			return tagView;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		
		bind: function(manager) {
			this.manager = manager;
			this.set('items', manager.get('items'));
		}
	});
});