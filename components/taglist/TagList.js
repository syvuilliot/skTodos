define([
	'dojo/_base/declare',
	'sktodos/components/base/_Base',		'./tag/Tag'
],
function(
	declare,
	BaseCmp,							Tag
) {
	return declare([BaseCmp], {
		_itemsGetter: function() {
			return this.tagModel.query({});
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
			return new this.tagModel(data).save();
		},
	});
});
