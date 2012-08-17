define([
	'dojo/_base/declare',
	'sktodos/model/base/_Base',		'./todo/Todo'
],
function(
	declare,
	BaseCmp,		Todo
) {
	return declare([BaseCmp], {
		items: [],
		
		_itemsGetter: function() {
			return this.items.map(function(todo){
				var child = new Todo({
					domainModel: todo.get('todo'),
					tagModel: this.tagModel
				});
				return child;
			}.bind(this));
		},
	});
});
