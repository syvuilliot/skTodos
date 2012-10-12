define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',	'dijit/_TemplatedMixin',
	'dojo/text!./v1.html',
    'dojo/store/Memory',
    'dojo/store/Observable',
    '../todoList/TodoList',
    '../fixtures/todos'
], function(
	declare,
	Widget,					Templated,
	template,
	Memory, Observable, TodoList,
    todosFixtures
) {
	return declare([Widget, Templated], {
		templateString: template,

		postCreate: function() {
			var todoCollection = Observable(new Memory({
				data: todosFixtures
			}));

			var todoList = new TodoList({
				todos: todoCollection.query()
			});
			todoList.view.placeAt(this.todoList);

			for(var k in todoList.todoComponents) {
				var todo = todoList.todoComponents[k].get('todo');
				todo.watch("*", function(){
					todoCollection.put(todo);
				});
			}
		}
	});
});