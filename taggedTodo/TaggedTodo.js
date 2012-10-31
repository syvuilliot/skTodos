define([
		'dojo/_base/declare',
		'dojo/dom-construct',
		'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode', "SkFramework/component/_WithDijit",
		'SkFramework/component/Presenter',
		'SkFramework/utils/binding',
		"../todo/TodoEditor",
		"../list/List",
		"../removableList/List",
		"dijit/form/ComboBox",
		"dojo/store/Memory",
		"dojo/store/Observable",
], function(
		declare,
		domConstruct,
		DomComponent, _WithDom, _WithDijit,
		PresenterBase,
		binding,
		TodoEditor,
		List,
		RemovableList,
		ComboBox,
		Memory,
		Observable
	){

	var Presenter = declare([PresenterBase], {
		tagLabel: "",

		_valueSetter: function(value){
			//TODO: convert value to an instance of Todo if necesary
			var todo = this.value = value;
			this.set("todo", todo);
			this.set("todoTags", todo.get("tags"));

		},
		_tagsSetter: function(value){
			this.tags = value;
			this.set("remainingTagsStore", value);
		},
		tagLabelSubmited: function(){
			var label = this.get("tagLabel");
			if (label){
				//get existing tag by label
				var tag = Tag.query({label: label})[0];
				//or create a new one
				if (!tag) {
					tag = new Tag({label: label}).save();
				}
				//add it to the todo
				this.get("value").add("tag", tag);
				//reset tagLabel
				this.set("tagLabel", "");
			}
		},
		removeTagHandler: function(ev){
			var tag = ev.item;
			this.get("value").remove("tag", tag);
		}


	});
	
	return declare([DomComponent, _WithDom, _WithDijit], {

		constructor: function(params){
			this.disabled = false;
			this._presenter = new Presenter();
			this._addComponents({
				todoEditor: new TodoEditor(),
				tagList: new RemovableList({
					itemConfig: {
						constructor: declare([DomComponent],{
							value: null,
							tagLabel: "",
							_bind: function(){
								this.own(new binding.Stateful2InnerHtml(this, this.domNode, {
									sourceProp: "tagLabel",
								}))
							},
							_valueSetter: function(tag){
								this.value = tag;
								this.set("tagLabel", tag.get("label"));
							}
						}),
					},
				}),
				tagPicker: new ComboBox({
					searchAttr: "label",
					store: new Memory(), //since a store is mandatory at creation
				}),
			});
		},
		_render: function(){
			this.inherited(arguments);
			//place components
			this._placeComponent(this._components.todoEditor);
			this._placeComponent(this._components.tagList);
			this._placeComponent(this._components.tagPicker);
		},
		_bind: function() {
			this.own(
				new binding.Value(this._presenter, this._components.todoEditor, {
					sourceProp: "value", targetProp: "value",
				}),
				new binding.Value(this._presenter, this._components.tagList, {
					sourceProp: "todoTags",
					targetProp: "value",
				}),
				new binding.ValueSync(this._presenter, this._components.tagPicker, {
					sourceProp: "tagLabel",
					targetProp: "value",
				}),
				new binding.Value(this._presenter, this._components.tagPicker, {
					sourceProp: "remainingTagsStore",
					targetProp: "store",
				}),
				new binding.Event(this._components.tagPicker, this._presenter, {
					event: "blur",
					method: "tagLabelSubmited",
				}),
				new binding.Event(this._components.tagList, this._presenter, {
					event: "remove",
					method: "removeTagHandler",
				})

			);
		},
	});



});