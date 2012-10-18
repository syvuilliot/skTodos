define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_Container",
	"dojo/text!./template.html",
	'SkFramework/component/Component',	'SkFramework/component/Presenter',
	'SkFramework/utils/binding'
], function(
	declare,
	Widget,					Templated,					Container,
	template,
	Component,							Presenter,
	binding
) {
	var ListPresenter = declare([Presenter], {
	});

	var View = declare([Widget, Templated, Container], {
		templateString: template
	});

	return declare([Component], {
		componentClass: null,
		
		constructor: function() {
			this.view = new View();
			this._presenter = new ListPresenter();
			this._components = {};
		},

		bind: function(){
			this.own(new binding.ObservableQueryResult(this._presenter, this, {
				sourceProp: "value",
				addMethod: "_addCmp",
				removeMethod: "_removeCmp",
			}));
		},

		_addCmp: function(item, id) {
			var cmp = new this.componentClass();
			cmp.set('value', item);
			this._components[id] = cmp;
			this.view.addChild(cmp.view);
			return cmp;
		},
		_removeCmp: function(todo, id){
			this._components[id].destroy();
			delete this._components[id];
		},
		_getCmp: function(id){
			return this._components[id];
		}
	});
});