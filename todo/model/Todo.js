define([
	"SkFramework/model/Model",
], function(Model){
	
	return Model.extend("Todo", {
		_checkedGetter: function() {
			return this.checked || false;
		},
	});


});