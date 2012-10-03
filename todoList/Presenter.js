define([
	"dojo/_base/declare",
	"dijit/Destroyable",
	"SkFramework/utils/statefulSync",
	"./model/Collection",
], function(declare, Destroyable, statefulSync, Collection){
	
	return declare(null, {
		constructor: function(params){
			this.todos = new Collection();
			this.disabled = null;
		},
		_setTodosAttr: function(todos){
			todos.forEach(function(todo, key){
				this.todos.add(key+"", todo);
			}.bind(this));
		},
	});
});