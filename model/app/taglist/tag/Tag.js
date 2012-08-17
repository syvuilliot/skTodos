define([
	'dojo/_base/declare',
	'sktodos/model/base/_Base'
],
function(
	declare,
	BaseCmp
) {
	return declare([BaseCmp], {
		selected: false,
		select: function(selected) {
			selected = (selected === undefined ? true : selected);
			this.set('selected', selected);
		}
	});
});
