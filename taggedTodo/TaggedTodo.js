define([
		'dojo/_base/declare',
		'dojo/dom-construct',
		'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode', "SkFramework/component/_WithDijit",
		'SkFramework/component/Presenter',
		'SkFramework/utils/binding',
		"../todo/TodoEditor",
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
		RemovableList,
		ComboBox,
		Memory,
		Observable
	){

	var Presenter = declare([PresenterBase], {
		tagLabel: "",
		//this solution for maintening a list of tags not already linked to a todo is not robust
/*		constructor: function(){
			this.remainingTagsStore = Observable(new Memory());
			this.own(
				new binding.ObservableQueryResult(this, this, {
					sourceProp: "tags",
					addMethod: "addRemainingTag",
					removeMethod: "removeRemainingTag",
				}),
				new binding.ObservableQueryResult(this, this, {
					sourceProp: "todoTags",
					addMethod: "removeRemainingTag",
					removeMethod: "addRemainingTag",
				})
			);
		},

		addRemainingTag: function(tag){
			this.remainingTagsStore.put(tag);
		},
		removeRemainingTag: function(tag){
			this.remainingTagsStore.remove(tag.id);
		},
*/
		_valueSetter: function(value){
			//TODO: convert value to an instance of Todo if necesary
			var todo = this.value = value;
			this.set("todo", todo);
			this.set("todoTags", todo.get("tags"));

			//**** temporary
			function tags2string(tags){
				return tags.length ? tags.reduce(function(tagsString, tag){
					return tagsString+tag.get("label")+", ";
				}, ""): "";
			}
			var tagsList = todo.get("tags");
			this.set("tagsString", tags2string(tagsList));
			//recompute string for each change
			tagsList.observe(function(){
				this.set("tagsString", tags2string(todo.get("tags")));
			}.bind(this));
			//***** temporary
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
				this.get("value").add("tag", tag).save();
				//reset tagLabel
				this.set("tagLabel", "");
			}
		}


	});
	
	return declare([DomComponent, _WithDom, _WithDijit], {

		constructor: function(params){
			this.disabled = false;
			this._presenter = new Presenter();
			this._addComponents({
				todoEditor: new TodoEditor(),
				tagList: domConstruct.create("div"),
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
				new binding.Stateful2InnerHtml(this._presenter, this._components.tagList, {
					sourceProp: "tagsString",
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
				})
			);
		},
	});



});