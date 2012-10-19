define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/Stateful',
	'dijit/Destroyable',	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./template.html",
	"SkFramework/component/Component",	'SkFramework/component/Presenter',
	"SkFramework/utils/binding",	"SkFramework/utils/statefulSync",
	"skTodos/model/domain/Todo",

	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
	"skTodos/dueDatePicker/DueDatePicker",
], function(
	declare,				lang,				Stateful,
	Destroyable,			Widget,					Templated,					WidgetsInTemplate,
	template,
	Component,							Presenter,
	binding,						statefulSync,
	Todo
){
	var TodoPresenter = declare([Presenter], {
		constructor: function(params){
			this.value = null;
			this.disabled = null;
			this.todoStatefulSyncHandler = {
				remove: function(){},
			};
		},
		_disabledGetter: function() {
			return this.disabled || false;
		},

		_valueSetter: function(value){
			this.todoStatefulSyncHandler.remove();
			if (!(value instanceof Todo)){
				value = new Todo(value);
			}
			//store the value
			this.value = value;
			//explode it
			this.todoStatefulSyncHandler = statefulSync(this.value, this, {
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

		postCreate: function(){
			this.inherited(arguments);
			//hack to prevent checkboxWidget to call set when it is destroyed
			var checkWidgetSetMethod = this.checkWidget.set;
			this.checkWidget.set = function(){
				if (!this._destroyed) {
					checkWidgetSetMethod.apply(this, arguments);
				}
			};
			//hack to prevent labelWidget to call set when it is destroyed
			var labelWidgetSetMethod = this.labelWidget.set;
			this.labelWidget.set = function(){
				if (!this._destroyed) {
					labelWidgetSetMethod.apply(this, arguments);
				}
			};
		},

		set: function() {
			if (!this._destroyed) {
				this.inherited(arguments);
			}
		}
	});

	return declare([Component], {
		constructor: function(params){
			this.disabled = false;
			this._presenter = new TodoPresenter();
			this.view = new View();
			this.view.startup();
		},
		
		bind: function() {
			this.own(
				new binding.Multi(this._presenter, this.view.labelWidget, [
					{type: "Value", sourceProp: "checked", targetProp: "disabled"},
					{type: "ValueSync", sourceProp: "label", targetProp: "value"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Multi(this._presenter, this.view.checkWidget, [
					{type: "ValueSync", sourceProp: "checked", targetProp: "checked"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Multi(this._presenter, this.view.dueDateWidget, [
					{type: "ValueSync", sourceProp: "dueDate", targetProp: "date"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Click(this.view.dueDateButton, this._presenter, {
					method: "setDueDateToToday"
				}),
				new binding.Display(this._presenter, this.view.dueDateWidget, {
					sourceProp: "dueDate"
				}),
				new binding.Display(this._presenter, this.view.dueDateButton, {
					sourceProp: "dueDate", not: true
				})
			);
		}
	});
});