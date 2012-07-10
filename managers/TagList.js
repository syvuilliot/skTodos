define([
	'dojo/_base/declare',
	'./_Base',		'./Tag'
],
function(
	declare,
	ManagerBase,	Tag
) {
	return declare([ManagerBase], {
		_itemsGetter: function() {
			return this.model.query({});
		},
		
		_children: {},
		getChild: function(tag) {
			var tagId = tag.getIdentity();
			if (!(tagId in this._children)) {
				var child = this._children[tagId] = new Tag({
					tag: tag
				});
				child.watch('selected', function() {
					this.select(child.tag, child.selected);
				}.bind(this));
			}
			return this._children[tagId];
		},
		
		select: function(tag, selected) {
			if (selected) {
				this.selection = tag;
				this.emit('selectionchanged', {
					selection: this.selection
				});
			}
		},
		
		createTag: function(data) {
			
		}
	});
});
