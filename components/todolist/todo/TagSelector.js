define([
	'dojo/_base/declare',
	'sktodos/components/base/_Base'
], function(
	declare,
	BaseCmp
) {
	return declare([BaseCmp], {
		selectTag: function(tagLabel) {
			var matchingQuery = this.tagModel.query({
				label: tagLabel
			});
			var tag;
			if (matchingQuery.length > 0) {
				tag = matchingQuery[0];
			}
			else {
				// Create new tag
				tag = new this.tagModel({
					label: tagLabel
				}).save();
			}
			this.emit('tagselected', {tag: tag });
		}
	});
});