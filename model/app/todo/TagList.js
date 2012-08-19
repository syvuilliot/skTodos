define([
	'dojo/_base/declare',
	'sktodos/model/base/_Base',		'./Tag'
],
function(
	declare,
	BaseCmp,		Tag
) {
	return declare([BaseCmp], {
		getChild: function(item) {
			var child = new Tag({
				domainModel: item.get('tag'),
				relationModel: item
			});
			return child;
		}
	});
});
