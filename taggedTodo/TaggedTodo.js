define([
		'dojo/_base/declare',
		'dojo/dom-construct',
		'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode', "SkFramework/component/_WithDijit",
		'SkFramework/component/Presenter',
		'SkFramework/utils/binding',
		'skTodos/model/Tag',
		"../todo/TodoEditor",
		"../list/List",
		"../removableList/List",
		"dijit/form/ComboBox",
		'dojo/store/Memory',
		'dojo/store/Observable',
		"SkFramework/store/ChainableQuery",
], function(
		declare,
		domConstruct,
		DomComponent, _WithDom, _WithDijit,
		PresenterBase,
		binding,
		Tag,
		TodoEditor,
		List,
		RemovableList,
		ComboBox,
		Memory,
		Observable,
		Chainable
	){

	var Presenter = declare([PresenterBase], {
		tagLabel: "",
		remainingTagsStore: new Memory(), // to prevent error on the combobox which needs a store

		_valueSetter: function(value){
			//TODO: convert value to an instance of Todo if necesary
			var todo = this.value = value;
			this.set("todoTags", todo.get("tags"));
			this.createRemainingTagsStore();
		},
		_tagsSetter: function(value){
			this.tags = value; //collection
			this.createRemainingTagsStore();
		},
		createRemainingTagsStore: function(){
			//process for maintaining the list of all tags except those already linked to the todo
			var allTags = this.get("tags");
			var todoTags = this.get("todoTags");
			if (allTags && todoTags){
				//create an empty collection
				var remainingTagsStore = Chainable(Observable(new Memory()));
				//add existing tags
				allTags.forEach(function(tag){
					remainingTagsStore.put(tag);
				});
				//update the new collection based on tags observation
				allTags.observe(function(tag, from, to){
					if (from < 0){
						remainingTagsStore.put(tag);
					}
					if (to < 0){
						remainingTagsStore.remove(tag.getIdentity());
					}
				});
				//remove already linked tags
				todoTags.forEach(function(tag){
					remainingTagsStore.remove(tag.getIdentity());
				});
				//update the new collection based on tags observation
				todoTags.observe(function(tag, from, to){
					if (from < 0){
						//when a tag is linked to the todo, remove it from remaining tags
						remainingTagsStore.remove(tag.getIdentity());
					}
					if (to < 0){
						//when a tag is unlinked to the todo, add it to remaining tags
						remainingTagsStore.put(tag);
					}
				});
				//finally expose it
				this.set("remainingTagsStore", remainingTagsStore);

			}
		},
		tagLabelSubmited: function(){
			var label = this.get("tagLabel");
			if (label){
				//get existing tag by label
				var tag = this.get("tags").query({label: label})[0];
				//or create a new one
				if (!tag) {
					tag = new Tag({label: label});
					this.get("tags").put(tag);
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
					store: this._presenter.remainingTagsStore, //since a store is mandatory at creation
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