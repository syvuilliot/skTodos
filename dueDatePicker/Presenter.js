define([
	"dojo/_base/declare",
], function(declare){
	
	return declare(null, {
		constructor: function(params){
			this.date = null;
			this.rangeStart = null;
			this.rangeEnd = null;
		},
		_setDateAttr: function(value){
			var date = value; //TODO: check that value is a date or try to convert to a date ("today", "tomorrow", ...)
			this.set("clearButtonDisabled", !date);
			this.set("todayButtonDisabled", date && date.toDateString() === new Date().toDateString());
			// this.set("tomorrowButtonDisabled", date === Date.now()+1);
			this._set("date", date);

		},
		clearDate: function(){
			this.set("date", null);
		},
		setDateToday: function(){
			this.set("date", new Date());
		}
	});
});