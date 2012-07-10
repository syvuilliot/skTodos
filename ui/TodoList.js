define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/controller/_ListRenderer",
	"./Todo",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	TodoView
) {
	return declare([Widget, Container, _ListRenderer], {
		addItem: function(item, index){
			var child = new TodoView().bind(this.manager.getChild(item));
			this.addChild(child);
			return child;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		
		bind: function(manager) {
			this.manager = manager;
			this.set('items', manager.get('items'));
			manager.watch('items', function() {
				this.set('items', manager.get('items'));
			}.bind(this));
		}
	});
});