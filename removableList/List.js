define([
	'dojo/_base/declare',
	'SkFramework/component/Presenter',	'SkFramework/utils/binding',
	'../list/List',
	'./Removable'
], function(
	declare,
	Presenter,							binding,
	List,
	Removable
) {
	var RemovablePresenter = declare([Presenter], {
		remove: function(item) {
			this.emit('remove', {item: item});
		}
	});
	
	return declare([List], {
		constructor: function() {
			this._presenter = new RemovablePresenter();
		},
		
		onRemove: function(ev) {
			this.emit('remove', ev);
		},
		
		_addCmp: function(cmp, id) {
			var removableCmp = new Removable({
				content: cmp
			});
			// removableCmp.view.addChild(cmp.view);
			removableCmp.on('remove', function() {
				this._presenter.remove(cmp.get('value'));
			}.bind(this));
			this.inherited(arguments, [removableCmp, id]);
		},
		
		bind: function() {
			this.inherited(arguments);
			this.own(
				new binding.Event(this._presenter, this, {
					event: 'remove',
					method: 'onRemove',
				})
			);
		}
	});
});
