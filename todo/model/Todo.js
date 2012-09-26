define([
	"dojo/_base/declare",
	"dojo/Stateful",
], function(declare, Stateful){
	
	return declare(Stateful, {
		_checkedGetter: function() {
			return this.checked || false;
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
*/	});


});