define([
	"dojo/_base/declare",	"dojo/_base/lang",	'dojo/dom-class',
	"dojo/Stateful",
	"dijit/_WidgetBase",	"dijit/_TemplatedMixin",	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./todo-list.html",
	"SkFramework/utils/statefulSync",
	"skTodos/todo/Todo",

	
	"dijit/form/TextBox",	"dijit/form/CheckBox",
], function(
	declare,				lang,				domClass,
	Stateful,
	Widget,					Templated,					WidgetsInTemplate,
	template,
	statefulSync,
	TodoComponent
){
	return declare([Widget, Templated, WidgetsInTemplate], {
		templateString: template,

		_setDataAttr: function(data){ //external data
			// var todos = new TodoCollectionModel(data); //we should create an observable collection here with possibly custom methods
			this.set("model", new Stateful({
				items: data,
				selectedItem: null,
			}));
		},
		_setModelAttr: function(model){ //internal model
			this.model = model;
			//for each item we delegate to a specialized subcomponent
			//we should take care of collection observation
			this.model.items.forEach(function(item){
				var todoComponent = new TodoComponent({data: item});
				todoComponent.placeAt(this.todoListNode);
				todoComponent.startup();
				todoComponent.on("click", function(ev){
					this.model.set("selectedItem", item);
				}.bind(this));
			}.bind(this));
			
			statefulSync(model, this.selectedTodoNode, {
				selectedItem: "data",
			});
		},
				
	});
});