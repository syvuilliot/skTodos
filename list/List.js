define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_Container",
	'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode','SkFramework/component/Presenter',
	'SkFramework/utils/binding'
], function(
	declare,
	Widget,					Templated,					Container,
	DomComponent,			_Dom,				Presenter,
	binding
) {
	var ListPresenter = declare([Presenter], {
	});

	return declare([DomComponent, _Dom], {
		componentClass: null,
		componentDomAttrs: null,
		
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
			var cmp = new this.componentClass({
				value: item,
				domAttrs: this.componentDomAttrs
			});
			//register component
			this._addComponent(cmp, id);
			//place it
			this._append(cmp);
		},
				
		_removeItem: function(item, id){
			var cmp = this._getComponent(id);
			//unplace it (remove its view)
			this._remove(cmp);
			//unregister it
			this._removeComponent(id);
			//uncreate it
			cmp.destroy();
		},
		
	});
});