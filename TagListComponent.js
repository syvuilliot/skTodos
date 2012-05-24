define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_WidgetBase",
	"dojo/Evented",
	"SkFramework/controller/_ListRenderer",
	"dijit/_Container",
	"./TagComponent",
], function(declare, lang, Widget, Evented, _ListRenderer, _Container, TagComponent){
	return declare([Widget, Evented, _Container, _ListRenderer], {
		addItem: function(tag, index){
			var tagComponent = new TagComponent({
				tag: tag,
			});
			this.addChild(tagComponent);
			tagComponent.on("remove", this.tagRemove.bind(this));
			tagComponent.on("updateLabel", this.tagUpdateLabel.bind(this));
			tagComponent.on("updateSelected", this.tagUpdateSelected.bind(this));
			return tagComponent;
		},
		removeItem: function(item, index, child){
			child.destroyRecursive();
		},
		tagRemove: function (ev) {
			this.emit("tagRemove", {tag: ev.tag});
		},
		tagUpdateLabel: function(ev){
			this.emit("tagUpdateLabel", {tag: ev.tag, label: ev.label});
		},
		tagUpdateSelected: function(ev){
			this.emit("tagUpdateSelected", {tag: ev.tag, selected: ev.selected});
		},
	});
});