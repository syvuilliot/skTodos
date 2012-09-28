define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dojo/Stateful",
	"dojo/store/Memory", "dojo/store/Observable",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo-list.html",
	"SkFramework/utils/statefulSync",
	"skTodos/todo/Todo",

	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
], function(
	declare,				lang,				domClass,
	Stateful,
	Memory, Observable,
	Widget,					Templated,					WidgetsInTemplate,
	template,
	statefulSync,
	TodoComponent
){
	return declare([Widget, Templated, WidgetsInTemplate], {
		templateString: template,

		postCreate: function(){
			this.inherited(arguments);
			//model instanciation
			var model = this.model = Observable(new Memory());
			//here external items are acceded by reference but we could also create a copy internaly (in this case the external items would have to synchronise to the internal ones)
			this.subComponents = {};
			model.query().observe(function(item, from, to){
				if (from === -1){
					//create new subComponent
					var todoComponent = this.subComponents[item.id] = new TodoComponent();
					todoComponent.placeAt(this.domNode);
					statefulSync(item, todoComponent.model, {
						"label": "label",
						"done": "checked",
					});
					todoComponent.model.on("deleted", function(ev){
						this.model.remove(item.id);
					}.bind(this));
				}
				if (to === -1){
					var todoComponent = this.subComponents[item.id];
					todoComponent.destroy();
				}

			}.bind(this));
		},				
	});
});