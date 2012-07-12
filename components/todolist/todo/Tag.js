define([
	'dojo/_base/declare',
	'sktodos/components/base/_Base'
], function(
	declare,
	BaseCmp
) {
	return declare([BaseCmp], {
		remove: function() {
			this.data.delete();
		},
		
		_tagGetter: function() {
			return this.data.get('tag');
		}
	});
});