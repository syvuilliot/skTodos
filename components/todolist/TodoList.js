define([
	'dojo/_base/declare',
	'sktodos/components/base/_Base',		'./todo/Todo'
],
function(
	declare,
	BaseCmp,		Todo
) {
	return declare([BaseCmp], {
		items: [],
		
		getChild: function(item) {
			var child = new Todo({
				data: item,
				tagModel: this.tagModel
			});
			return child;
		}
	});
});
