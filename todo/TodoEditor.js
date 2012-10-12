define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/Stateful',
	'dijit/Destroyable',	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./template.html",
	"SkFramework/utils/binding",	"SkFramework/utils/statefulSync",
	"skTodos/model/domain/Todo",

	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
	"skTodos/dueDatePicker/DueDatePicker",
], function(
	declare,				lang,				Stateful,
	Destroyable,			Widget,					Templated,					WidgetsInTemplate,
	template,
	binding,						statefulSync,
	Todo
){
	var Presenter = declare([Stateful, Destroyable], {
		constructor: function(params){
			this.todo = null;
			this.disabled = null;
			this.todoStatefulSyncHandler = {
				remove: function(){},
			};
		},
		_disabledGetter: function() {
			return this.disabled || false;
		},

		_todoSetter: function(value){
			var todo;
			this.todoStatefulSyncHandler.remove();
			if(value instanceof Todo){
				todo = value;
			} else {
				todo = new Todo(value);
			}
			//store the value
			this.todo = todo;
			//explose it
			this.todoStatefulSyncHandler = statefulSync(this.todo, this, {
				label: "label",
				checked: "checked",
				dueDate: "dueDate",
			});
			this.own(this.todoStatefulSyncHandler);
		},
		setDueDateToToday: function(){
			this.set("dueDate", new Date());
		},
	});

	var View = declare([Widget, Templated, WidgetsInTemplate], {
		templateString: template,

		set: function() {
			if (!this._destroyed) {
				this.inherited(arguments);
			}
		}
	});

	return declare([Stateful, Destroyable], {
		constructor: function(params){
			this.disabled = false;
			this.presenter = new Presenter();
			this.view = new View();
			this.view.startup();
			this.bind();
		},
		destroy: function(){
			this.inherited(arguments);
			this.view.destroy();
		},

		get: function() {
			return this.presenter.get.apply(this.presenter, arguments);
		},

		set: function() {
			return this.presenter.set.apply(this.presenter, arguments);
		},

		bind: function() {
			this.own(
				new binding.Multi(this.presenter, this.view.labelWidget, [
					{type: "Value", sourceProp: "checked", targetProp: "disabled"},
					{type: "ValueSync", sourceProp: "label", targetProp: "value"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Multi(this.presenter, this.view.checkWidget, [
					{type: "ValueSync", sourceProp: "checked", targetProp: "checked"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Multi(this.presenter, this.view.dueDateWidget, [
					{type: "ValueSync", sourceProp: "dueDate", targetProp: "date"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Click(this.view.dueDateButton, this.presenter, {
					method: "setDueDateToToday"
				}),
				new binding.Display(this.presenter, this.view.dueDateWidget, {
					sourceProp: "dueDate"
				}),
				new binding.Display(this.presenter, this.view.dueDateButton, {
					sourceProp: "dueDate", not: true
				})
			);
		}
	});
});