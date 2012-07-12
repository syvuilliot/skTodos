define([
	'dojo/_base/declare',
	'sktodos/components/base/_Base',		'./Tag'
],
function(
	declare,
	BaseCmp,		Tag
) {
	return declare([BaseCmp], {
		constructor: function() {
			this.set('items', this.todo.get('tagsRelations'));
		},
		
		getChild: function(item) {
			var child = new Tag({
				data: item
			});
			return child;
		}
	});
});
