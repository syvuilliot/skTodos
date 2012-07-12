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
