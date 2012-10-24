define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',	'dijit/_Container',	'dijit/_TemplatedMixin',
	'dijit/form/Button',
	'SkFramework/component/Component',	'SkFramework/component/_Dom',	'SkFramework/component/Presenter',	'SkFramework/utils/binding',
], function(
	declare,
	Widget,					DjContainer,		Templated,
	Button,
	Component,							_Dom,							Presenter,							binding
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
	
	return declare([Component, _Dom], {
		constructor: function() {
			this._presenter = new RemovablePresenter();
			this.own(
				new binding.Event(this._presenter, this, {
					event: 'remove',
					method: '_remove'
				})
			);
		},
				
		bind: function() {
			this.own(
				new binding.Event(this.view.removeBtn, this._presenter, {
					event: 'click',
					method: 'remove'
				})
			);
		},
		
		_remove: function() {
			this.emit('remove');
		}
	});
});
