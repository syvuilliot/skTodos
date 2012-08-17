define([
	'dojo/_base/declare',
	'sktodos/model/base/_Base',
	'./TagList',	'./TagSelector'
],
function(
	declare,
	BaseCmp,
	TagList,		TagSelector
) {
	return declare([BaseCmp], {
		constructor: function(params) {
			this.tagSelector = new TagSelector({
				tagModel: this.tagModel
			});
			this.tagSelector.on('tagselected', function(ev) {
				this.get('todo').addTag(ev.tag).save();
			}.bind(this));
			this.tagList = new TagList({
				todo: this.get('todo')
			});
		},
		
		_todoGetter: function() {
			return this.data.get('todo');
		},
		
		delete: function() {
			this.get('todo').delete();
		}
	});
});
