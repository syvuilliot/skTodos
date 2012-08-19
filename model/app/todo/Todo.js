define([
	'dojo/_base/declare',
	'sktodos/model/base/_AppModel',
	'./TagList',	'./TagSelector'
],
function(
	declare,
	AppModel,
	TagList,		TagSelector
) {
	return declare([AppModel], {
		constructor: function(params) {
			this.tagSelector = new TagSelector({
				tagModel: this.tagModel
			});
			this.tagSelector.on('tagselected', function(ev) {
				this.addTag(ev.tag).save();
			}.bind(this));
			this.tagList = new TagList({
				items: this.get('tagsRelations')
			});
		},
		
		_labelSetter: function(newLabel) {
			if (this.get('checked')) {
				throw new Error("Cannot change label of a done task");
			}
		}
	});
});
