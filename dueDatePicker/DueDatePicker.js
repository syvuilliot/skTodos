define([
	"dojo/_base/declare",
	"SkFramework/utils/statefulSync",
	"./Presenter",
	"./View",
], function(declare, statefulSync, Presenter, View){
	
	return declare([View, Presenter], {
		startup: function(){
			this.inherited(arguments);
			this.bind();
		},

		bind: function(){
			var self = this;
			function setLabel (date){
				self.label.innerText = date || "No date selected";
			}
			setLabel(this.get("date"));
			this.watch("date", function(prop, old, current){
				setLabel(current);
			});
			statefulSync(this, this.datePicker, {
				"date": "value",
				"rangeStart": "rangeStart",
				"rangeEnd": "rangeEnd"
			});
			this.clearButton.on("click", this.clearDate.bind(this));
			this.todayButton.on("click", this.setDateToday.bind(this));
			statefulSync(this, this.todayButton, {
				"todayButtonDisabled": "disabled",
			});
			statefulSync(this, this.clearButton, {
				"clearButtonDisabled": "disabled",
			});
		}
	});
});