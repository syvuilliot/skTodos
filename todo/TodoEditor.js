define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/Stateful',
	'dijit/Destroyable',	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./template.html",
	"SkFramework/component/Component",	'SkFramework/component/_Dom', 'SkFramework/component/Presenter',
	"SkFramework/utils/binding",	"SkFramework/utils/statefulSync",
	"skTodos/model/domain/Todo",

	
	"dijit/form/TextBox",	"dijit/form/CheckBox", "dijit/form/Button",
	"skTodos/dueDatePicker/DueDatePicker",
], function(
	declare,				lang,				Stateful,
	Destroyable,			Widget,					Templated,					WidgetsInTemplate,
	template,
	Component,	_Dom,						Presenter,
	binding,						statefulSync,
	Todo,
	TextBox, CheckBox, Button,
	DueDatePicker

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

	return declare([Component, _Dom], {
		tag: "div",
		domNodeAttrs: {
			class: "todo"
		},

		constructor: function(params){
			this.disabled = false;
			this._presenter = new TodoPresenter();
			//register components (but don't place them)
			this._addComponents({
				checkWidget: new CheckBox({
					//hack to prevent widget to call set when it is destroyed
					set: function(){
						if (!this._destroyed) {
							CheckBox.prototype.set.apply(this, arguments);
						}
					}
				}),
				labelWidget: new TextBox({
					//hack to prevent widget to call set when it is destroyed
					set: function(){
						if (!this._destroyed) {
							TextBox.prototype.set.apply(this, arguments);
						}
					}

				}),
				dueDateButton: new Button({label: "add a due date"}),
				dueDateWidget: new DueDatePicker(),
			});
		},

		render: function(){
			this.inherited(arguments);
			//place components
			this._append(this._components.checkWidget);
			this._append(this._components.labelWidget);
			this._append(this._components.dueDateButton);
			this._append(this._components.dueDateWidget);

		},
		
		bind: function() {
			this.own(
				new binding.Multi(this._presenter, this._components.labelWidget, [
					{type: "Value", sourceProp: "checked", targetProp: "disabled"},
					{type: "ValueSync", sourceProp: "label", targetProp: "value"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Multi(this._presenter, this._components.checkWidget, [
					{type: "ValueSync", sourceProp: "checked", targetProp: "checked"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Multi(this._presenter, this._components.dueDateWidget, [
					{type: "ValueSync", sourceProp: "dueDate", targetProp: "date"},
					{type: "Value", sourceProp: "disabled", targetProp: "disabled"}
				]),
				new binding.Click(this._components.dueDateButton, this._presenter, {
					method: "setDueDateToToday"
				}),
				new binding.Display(this._presenter, this._components.dueDateWidget, {
					sourceProp: "dueDate"
				}),
				new binding.Display(this._presenter, this._components.dueDateButton, {
					sourceProp: "dueDate", not: true
				})
			);
		},

		set: function() {
			if (!this._destroyed) {
				this.inherited(arguments);
			}
		}

	});
});