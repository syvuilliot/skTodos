define([
	'dojo/_base/declare',
	'SkFramework/model/_DomainModelProxy'
], function(
	declare,
	AppModel
) {
	return declare([AppModel], {
		remove: function() {
			this.relationModel.delete();
		}
	});
});