define([
	'dojo/_base/declare',	'dojo/_base/lang',
	'dojo/Stateful',
	'dojo/Evented',
	'sktodos/model/base/_Base',		'./tag/Tag'
],
function(
	declare,				lang,
	Stateful,
	Evented,
	BaseCmp,							Tag
) {


	return declare([BaseCmp], {
		// Provisoire
		_children: [],
		_itemsGetter: function() {
			return this.tagModel.query({}).map(function(tag){
				var child = new Tag({
					domainModel: tag,
				});
				child.watch('selected', function() {
					this.select(child, child.selected);
				}.bind(this));
				// Provisoire
				this._children.push(child);
				return child;
			}.bind(this));
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
