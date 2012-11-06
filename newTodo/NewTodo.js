define([
	'dojo/_base/declare',	'dojo/_base/lang',	'dojo/_base/event',	'dojo/Stateful',
	'dijit/Destroyable',	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',	'dijit/_WidgetsInTemplateMixin',
	'SkFramework/utils/binding',	'SkFramework/utils/statefulSync',
	'dijit/form/Form',	'dijit/form/Button',	'dijit/form/TextBox',
], function(
	declare,				lang,				event,				Stateful,
	Destroyable,			Widget,					Templated,					WidgetsInTemplate,
	binding,						statefulSync,
    Form,				Button,					TextBox
) {
	return declare([Form], {
		'class': 'new-todo',
		
		buildRendering: function() {
			this.inherited(arguments);
			this.labelBox = new TextBox({
				name: 'label',
				placeHolder: "Add new task ..."
			});
			
			this.submitBtn = new Button({
				label: "+",
				type: 'submit'
			});
			
			this.labelBox.placeAt(this);
			this.submitBtn.placeAt(this);

			this.own(this.on('submit', function(ev) {
				this._set('value', this.get('value'));
				event.stop(ev);
			}));
		}
	});
});