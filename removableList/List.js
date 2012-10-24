define([
	'dojo/_base/declare',
	'dojo/dom-construct',
	'SkFramework/component/Presenter',	'SkFramework/utils/binding',
	'../list/List',
	'./Removable'
], function(
	declare,
	domConstruct,
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
			this.own(
				new binding.Event(this._presenter, this, {
					event: 'remove',
					method: 'onRemove',
				})
			);
		},
		
		onRemove: function(ev) {
			this.emit('remove', ev);
		},
		
		_addItem: function(item, id) {
			//create components
			var containerCmp = domConstruct.create("div");
			var cmp = new this.componentClass({
				value: item
			});
			var removableCmp = new Removable();
			//register components
			this._addComponent(containerCmp, id+"container");
			this._addComponent(cmp, id);
			this._addComponent(removableCmp, id+"remover");
			//place components
			this._append(containerCmp);
			domConstruct.place(cmp.domNode, containerCmp);
			domConstruct.place(removableCmp.domNode, containerCmp);
			//create binding
			removableCmp.own(removableCmp.on("remove", function(ev){
				this._presenter.remove(item);
			}.bind(this)));
		},
				
		_removeItem: function(item, id){
			var containerCmp = this._getComponent(id+"container");
			var cmp = this._getComponent(id);
			var removableCmp = this._getComponent(id+"remover");
			cmp.destroy();
			removableCmp.destroy();
			domConstruct.destroy(containerCmp);
			this._removeComponent(id+"container");
			this._removeComponent(id);
			this._removeComponent(id+"remover");
		},
	});
});
