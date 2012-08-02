define([
	'dojo/_base/declare',
	'sktodos/components/base/_Base'
],
function(
	declare,
	BaseCmp
) {
	return declare([BaseCmp], {
		constructor: function(params) {
		},
		
		'delete': function() {
			this.tag.delete();
		},
		
		selected: false,
		select: function(selected) {
			selected = (selected === undefined ? true : selected);
			this.set('selected', selected);
		}
	});
});
