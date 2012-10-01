define([
	"dojo/_base/declare",
	"dojo/Stateful",
	"dojo/Evented",
], function(declare, Stateful, Evented){
	
	return declare([Evented], {
		constructor: function(items){
			this.items = items || [];
		},
		addKey: function(key){
			this.items[key]=undefined;
			this.emit("keyAdded", {key: key});
		},
		removeKey: function(key){
			delete this.items[key];
			this.emit("keyRemoved", {key: key});
		},
		setValue: function(key,value){
			this.items[key]=value;
			this.emit("valueSetted", {key: key, value: value});
		},
		getValue: function(key){
			return this.items[key];
		},
		add: function(key, value){
			this.addKey(key);
			this.setValue(key,value);
		},
		remove: function(key){
			this.removeKey(key);
		}

	});


});