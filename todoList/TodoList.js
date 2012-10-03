define([
	"dojo/_base/declare",
	"SkFramework/utils/statefulSync",
	"./View",
	"./Presenter",
], function(
	declare,
	statefulSync,
	View,
	Presenter

){
	return declare([View, Presenter], {
		startup: function(){
			this.inherited(arguments);
			this.bindView();
		},


		bindView: function(){
			var handlers = [];
			this.todos.on("keyAdded", function(e){
				this.addTodoComp(e.key);
				var todoComp = this.getTodoComp(e.key);
				var mapping = {};
				mapping[e.key] = "todo";
				handlers.push(statefulSync(this.todos, todoComp, mapping));
				handlers.push(statefulSync(this, todoComp, {
					"disabled": "disabled",
				}));
			}.bind(this));

			this.todos.on("keyRemoved", function(e){
				handlers.forEach(function(handler){
					handler.remove();
				});
				this.removeTodoComp(e.key);
			}.bind(this));
		}

	});
});