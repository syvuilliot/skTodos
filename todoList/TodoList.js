define([
	"dojo/_base/declare",
	"SkFramework/utils/binding",
	"./View",
	"./Presenter",
], function(
	declare,
	binding,
	View,
	Presenter

){
	return declare([View, Presenter], {
		startup: function(){
			this.inherited(arguments);
			this.bind();
		},


		bind: function(){
			this.own(new binding.ObservableQueryResult(this, this, {
				sourceProp: "todos",
				addMethod: "addTodo",
				removeMethod: "removeTodo",
			}));
			//TODO: update binding when todos is changed
		}

	});
});