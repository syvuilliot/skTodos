define([
	"dojo/_base/declare",
	"dijit/Destroyable",
	"SkFramework/utils/statefulSync",
	"skTodos/model/domain/Todo",
], function(declare, Destroyable, statefulSync, Todo){
	
	return declare(Destroyable, {
		constructor: function(params){
			this.todo = null;
			this.disabled = null;
			this.todoStatefulSyncHandler = null;
		},
		_setTodoAttr: function(value){
			var todo;
			if(this.todoStatefulSyncHandler){this.todoStatefulSyncHandler.remove();} 
			value instanceof Todo ? todo = value : todo = new Todo(value);
			//store the value
			this._set("todo", todo);
			//explose it
			this.todoStatefulSyncHandler = statefulSync(todo, this, {
				label: "label",
				checked: "checked",
				dueDate: "dueDate",
			});
		},
	});
});