define([
	'dojo/_base/declare',
	'sktodos/model/base/_AppModel',
	'./Tag'
],
function(
	declare,
	AppModel,
	AppTag
) {
	return declare([AppModel], {
		constructor: function(params) {
			this.set('tags', this.get('tagsRelations').map(function(rel) {
				return new AppTag({
					domainModel: rel.get('tag'),
					relationModel: rel
				});
			}));
		},
		
		addTag: function(tagLabel) {
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
			this.get('domainModel').addTag(tag);
		},
		
		_labelSetter: function(newLabel) {
			if (!this.get('checked')) {
				this.get('domainModel').set('label', newLabel);
			}
			else {
				throw new Error("Cannot change label of a done task");
			}
		}
	});
});
