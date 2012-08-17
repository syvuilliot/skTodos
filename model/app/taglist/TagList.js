define([
	'dojo/_base/declare',	'dojo/_base/lang',
	'dojo/Stateful',
	'dojo/Evented',
	'sktodos/model/base/_Base',		'./tag/Tag'
],
function(
	declare,				lang,
	Stateful,
	Evented,
	BaseCmp,							Tag
) {


	return declare([BaseCmp], {
		// Provisoire
		_children: [],
		
		_itemsGetter: function() {
			return this._items = this._items || this.tagModel.query({}).map(function(tag){
				var child = new Tag({
					domainModel: tag,
				});
				child.watch('selected', function() {
					if (child.get('selected')) {
						this.set('selectedTag', child);
					}
				}.bind(this));
				return child;
			}.bind(this));
		},
		
		createTag: function(data) {
			return new this.tagModel(data).save();
		},
	});
});
