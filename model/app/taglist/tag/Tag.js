define([
	'dojo/_base/declare',
	'sktodos/model/base/_AppModel'
],
function(
	declare,
	AppModel
) {
	return declare([AppModel], {
		selected: false,
		select: function(selected) {
			selected = (selected === undefined ? true : selected);
			this.set('selected', selected);
		}
	});
});
