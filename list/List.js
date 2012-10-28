define([
	"dojo/_base/declare",	"dojo/dom-class",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_Container",
	'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode','SkFramework/component/Presenter',
	'SkFramework/utils/binding'
], function(
	declare,				domClass,
	Widget,					Templated,					Container,
	DomComponent,			_Dom,				Presenter,
	binding
) {
	var ListPresenter = declare([Presenter], {
	});

	return declare([DomComponent, _Dom], {
		itemConfig: null,
		
		constructor: function() {
			this._presenter = new ListPresenter();
		},

		_bind: function(){
			this.own(new binding.ObservableQueryResult(this._presenter, this, {
				sourceProp: "value",
				addMethod: "_addItem",
				removeMethod: "_removeItem",
			}));
		},
		
		_addItem: function(item, id) {
			//create
			var cmp = this._buildComponent(this.itemConfig, {
				value: item
			});
			//register component
			this._addComponent(cmp, id);
			//place it
			this._placeComponent(cmp);
			domClass.add(cmp.domNode, 'item');
		},
				
		_removeItem: function(item, id){
			var cmp = this._getComponent(id);
			//unplace it (remove its view)
			this._unplaceComponent(cmp);
			//unregister it
			this._removeComponent(id);
			//uncreate it
			cmp.destroy();
		},
		
	});
});