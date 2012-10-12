define([
	"dojo/_base/declare",	'dojo/Stateful', 'dojo/Evented',
	'dijit/Destroyable',	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",	"dijit/_Container",
	"dojo/text!./template.html",
	"SkFramework/utils/binding",
	'skTodos/todo/TodoEditor',

	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/Button"
], function(
	declare,				Stateful,	Evented,
	Destroyable,			Widget,					Templated,					WidgetsInTemplate,					Container,
	template,
	binding,
	TodoComponent
) {
	var Presenter = declare([Stateful, Destroyable], {
	});

	var View = declare([Widget, Templated, WidgetsInTemplate, Container], {
		templateString: template
	});

	return declare([Stateful, Destroyable, Evented], {
		constructor: function(params) {
			this.params = params;
			this.view = new View();
			this.view.startup();
			this.presenter = new Presenter();
			this.bind();
		},
		destroy: function(){
			this.view.destroy();
		},

		get: function() {
			return this.presenter.get.apply(this.presenter, arguments);
		},

		set: function() {
			return this.presenter.set.apply(this.presenter, arguments);
		},

		bind: function(){
			this.own(new binding.Click(this.view.removeButton, this, {
				method: "removeHandler",
			}));
		},

		removeHandler: function(ev){
			this.emit("remove");
		},

	});
});