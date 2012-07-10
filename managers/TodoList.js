define([
	'dojo/_base/declare',
	'./_Base',		'./Todo'
],
function(
	declare,
	ManagerBase,	Todo
) {
	return declare([ManagerBase], {
		items: [],
		
		constructor: function() {
			this.selection = [];
		},
		
		getChild: function(item) {
			var child = new Todo({
				todo: item
			});
			return child;
		}
	});
});
