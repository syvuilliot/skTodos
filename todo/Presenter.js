define([
	"dojo/_base/declare",
	"dijit/Destroyable",
	"SkFramework/utils/statefulSync",
	"skTodos/model/domain/Todo",
], function(declare, Destroyable, statefulSync, Todo){

	var todoStatefulSyncHandler;
	
	return declare(Destroyable, {
		constructor: function(params){
			this.todo = null;
			this.disabled = null;
		},
		_setTodoAttr: function(value){
			var todo;
			if(todoStatefulSyncHandler){todoStatefulSyncHandler.remove();} 
			if(value instanceof Todo){
				todo = value;
			} else {
				todo = new Todo(value);
			}
			//store the value
			this._set("todo", todo);
			//explose it
			todoStatefulSyncHandler = statefulSync(this.todo, this, {
				label: "label",
				checked: "checked",
				dueDate: "dueDate",
			});
		},
		setDueDateToToday: function(){
			this.set("dueDate", new Date());
		}
	});
});