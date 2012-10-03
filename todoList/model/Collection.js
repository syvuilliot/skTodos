define([
	"dojo/_base/declare",
	"dojo/Stateful",
	"dojo/Evented",
], function(declare, Stateful, Evented){
	
	return declare([Evented], {
		constructor: function(items){
			this.items = {};
			if(items){
				items.forEach(function(value, key){
					this.add(key, value);
				}.bind(this));
			}
		},

		//base methods
		addKey: function(key){
			this.items[key]=null;
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

		//helpers
		get: function(key){
			return this.getValue(key);
		},
		set: function(key, value){
			return this.setValue(key, value);
		},
		add: function(key, value){
			this.addKey(key);
			this.setValue(key,value);
		},
		remove: function(key){
			this.removeKey(key);
		},

		//observing
		watch: function(prop, cb){
			var handler = this.on("valueSetted", function(ev){
				if(ev.key === prop){
					cb(ev.key, "unknow", ev.value);
				}
			});
			return {
				remove: function(){
					handler.remove();
				}
			};
		}

	});


});