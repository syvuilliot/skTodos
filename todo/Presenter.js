define([
	"dojo/_base/declare",
	"dojo/Stateful",
	"dijit/Destroyable",
	"SkFramework/utils/statefulSync",
	"skTodos/model/domain/Todo",
], function(declare, Stateful, Destroyable, statefulSync, Todo){

	
	return declare([Stateful, Destroyable], {
		constructor: function(params){
			this.todo = null;
			this.disabled = null;
			this.todoStatefulSyncHandler = null;
		},
		_setTodoAttr: function(value){
			var todo;
			if(this.todoStatefulSyncHandler){this.todoStatefulSyncHandler.remove();}
			//TODO: I don't know why the instanceof Todo test does not work
			// if(value instanceof Todo){
				todo = value;
			// } else {
			// 	todo = new Todo(value);
			// }
			//store the value
			this._set("todo", todo);
			//explose it
			this.todoStatefulSyncHandler = statefulSync(this.todo, this, {
				label: "label",
				checked: "checked",
				dueDate: "dueDate",
			});
		},
		setDueDateToToday: function(){
			this.set("dueDate", new Date());
		},
		_setLabelAttr: function(value){
			this._set("label", value);
			console.log("label setter called with", value);
		}
	});
});