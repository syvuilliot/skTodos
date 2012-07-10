define([
	'dojo/_base/declare',
	'./_Base'
],
function(
	declare,
	ManagerBase
) {
	return declare([ManagerBase], {
		constructor: function(params) {
		},
		
		delete: function() {
			this.todo.delete();
		},
		
		get: function() {
			return this.todo.get.apply(this.todo, arguments);
		},
		
		set: function() {
			return this.todo.set.apply(this.todo, arguments);
		}
	});
});
