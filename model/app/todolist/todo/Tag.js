define([
	'dojo/_base/declare',
	'sktodos/model/base/_AppModel'
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