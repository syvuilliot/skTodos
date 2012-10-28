define([
		'dojo/_base/declare',
		'dojo/dom-construct',
		'SkFramework/component/DomComponent',	'SkFramework/component/_WithDomNode',
		'SkFramework/component/Presenter',
		'SkFramework/utils/binding',
		"../todo/TodoEditor",
		"../removableList/List",
], function(
		declare,
		domConstruct,
		DomComponent, _WithDom,
		PresenterBase,
		binding,
		TodoEditor,
		RemovableList
	){

	var Presenter = declare([PresenterBase], {
		_valueSetter: function(value){
			//TODO: convert value to an instance of Todo if necesary
			var todo = this.value = value;
			this.set("todo", todo);
			function tags2string(tags){
				return tags.length ? tags.reduce(function(tagsString, tag){
					return tagsString+tag.get("label");
				}, ""): "";
			}
			var tagsList = todo.get("tags");
			this.set("tagsString", tags2string(tagsList));
			//recompute string for each change
			tagsList.observe(function(){
				this.set("tagsString", tags2string(todo.get("tags")));
			}.bind(this));

		}

	});
	
	return declare([DomComponent, _WithDom], {

		constructor: function(params){
			this.disabled = false;
			this._presenter = new Presenter();
			this._addComponents({
				todoEditor: new TodoEditor(),
				tagList: domConstruct.create("div"),
			});
		},
		_render: function(){
			this.inherited(arguments);
			//place components
			this._placeComponent(this._components.todoEditor);
			this._placeComponent(this._components.tagList);
		},
		_bind: function() {
			this.own(
				new binding.Value(this._presenter, this._components.todoEditor, {
					sourceProp: "value", targetProp: "value",
				}),
				new binding.Stateful2InnerHtml(this._presenter, this._components.tagList, {
					sourceProp: "tagsString",
				})
			);
		},
	});



});