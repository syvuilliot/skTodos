define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"SkFramework/widgets/Widget",
	"dijit/form/TextBox",
	"dijit/form/Button",
], function(declare, lang, Widget, TextBox, Button){
	return declare(Widget, {
		children: {
			label: {
				type: TextBox,
			},
			button: {
				type: Button,
				params: {label: "add"},
				events: {click: "sendLabel"},
			}
		},
		sendLabel: function(ev){
			var label = this.getChild("label").get("value");
			this.emit("new-label", {label: label});
		},
		_setDefaultValueAttr: function(value){
			this.getChild("label").set("value", value, false);
		},
	});
});