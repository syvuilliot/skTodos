define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',	'dijit/_Container',	'dijit/_TemplatedMixin',
	'dijit/form/Button',
	'SkFramework/component/Component',	'SkFramework/component/_Container',	'SkFramework/component/Presenter',	'SkFramework/utils/binding',
], function(
	declare,
	Widget,					DjContainer,		Templated,
	Button,
	Component,							_Container,							Presenter,							binding
) {
	var RemovablePresenter = declare([Presenter], {
		remove: function() {
			this.emit('remove');
		}
	});
	
	var RemovableView = declare([Widget, Templated, DjContainer], {
		templateString: '<div><div data-dojo-attach-point="containerNode"></div><div data-dojo-attach-point="removeBtnNode"></div></div>',
		
		postCreate: function() {
			this.removeBtn = new Button({
				label: "Remove",
				'class': "remove-btn"
			}, this.removeBtnNode);
		}
	});
	
	return declare([Component, _Container], {
		constructor: function() {
			this._presenter = new RemovablePresenter();
			this.view = new RemovableView();
		},
		
		_contentSetter: function(content) {
			this.inherited(arguments);
			this.view.addChild(content.view);
		},
		
		bind: function() {
			this.own(
				new binding.Event(this.view.removeBtn, this._presenter, {
					event: 'click',
					method: 'remove'
				}),
				new binding.Event(this._presenter, this, {
					event: 'remove',
					method: 'remove'
				})
			);
		},
		
		remove: function() {
			this.emit('remove');
		}
	});
});
