define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_Container",
	"SkFramework/controller/_ListRenderer",
	"./todo/Todo",
], function(
	declare,
	Widget,					Container,
	_ListRenderer,
	TodoView
) {
	return declare([Widget, Container, _ListRenderer], {
		addItem: function(item, index){
			var child = new TodoView().plug(this.component.getChild(item));
			this.addChild(child);
			return child;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		
		plug: function(component) {
			this.component = component;
			this.set('items', component.get('items'));
			component.watch('items', function() {
				this.set('items', component.get('items'));
			}.bind(this));
		}
	});
});