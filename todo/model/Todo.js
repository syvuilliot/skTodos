define([
	"dojo/_base/declare",
	"dojo/Stateful",
	"dojo/Evented",
], function(declare, Stateful, Evented){
	
	return declare([Stateful, Evented], {
		_checkedGetter: function() {
			return this.checked || false;
		},
		_checkedSetter: function(bool){
			this.checked = bool;
			this.set("removable", !bool);
		},

		_labelSetter: function(value) {
			if(this.get("checked")===true){
				throw ("Cannot change the label of an already completed todo");
			} else {
				this.label = value;
			}
		},
		//is that a good idea to implement that in model ?
/*		_setCheckedAttr: function(checked) {
			domClass.toggle(this.domNode, 'checked', checked);
			this.checkWidget.set('checked', checked, false);
		},
*/
		delete: function(){
			this.set("_deleted", true);
			console.log("The todo '"+this.get("label")+"' was deleted");
			this.emit("deleted");
		}
	});


});