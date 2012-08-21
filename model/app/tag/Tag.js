define([
	'dojo/_base/declare',
	'SkFramework/model/_DomainModelProxy'
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
