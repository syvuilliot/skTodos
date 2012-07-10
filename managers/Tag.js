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
			this.tag.delete();
		},
		
		get: function() {
			var result = this.inherited(arguments);
			if (result === undefined) {
				result = this.tag.get.apply(this.tag, arguments);
			}
			return result;
		},
		
		set: function(name) {
			if (this[name] !== undefined) {
				var result = this.inherited(arguments);
			}
			else {
				this.tag.set.apply(this.tag, arguments);
			}
		},
		
		selected: false,
		select: function(selected) {
			selected = (selected === undefined ? true : selected);
			this.set('selected', selected);
		}
	});
});
