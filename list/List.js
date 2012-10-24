define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_Container",
	"dojo/text!./template.html",
	'SkFramework/component/Component',	'SkFramework/component/_Dom','SkFramework/component/Presenter',
	'SkFramework/utils/binding'
], function(
	declare,
	Widget,					Templated,					Container,
	template,
	Component,			_Dom,				Presenter,
	binding
) {
	var ListPresenter = declare([Presenter], {
	});

	return declare([Component, _Dom], {
		componentClass: null,
		
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
			var cmp = new this.componentClass({
				value: item
			});
			//register component
			this._addComponent(cmp, id);
			//place it
			this._append(cmp);
		},
				
		_removeItem: function(item, id){
			var cmp = this._getComponent(id);
			cmp.destroy();
			this._removeComponent(id);
		},
		
	});
});