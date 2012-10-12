define([
	"dojo/_base/declare",
	"dojo/Stateful",
], function(declare, Stateful){
	
	return declare([Stateful], {
		_checkedGetter: function() {
			return this.checked || false;
		},
		_labelGetter: function(){
			return this.label || "";

		},

		_labelSetter: function(value) {
			if(this.get("checked")===true){
				throw ("Cannot change the label of an already completed todo");
			} else {
				this.label = value;
			}
		},
	});


});