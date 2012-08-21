define([
	'dojo/_base/declare',
	'../domain/Tag',	'../domain/Todo',	'../domain/TodoTagRelation',
	'SkFramework/model/_AppModel',	'./tag/Tag',	'./todo/Todo'
],
function(
	declare,
	Tag,				Todo,				TodoTagRel,
	AppModel,					AppTag,			AppTodo
) {
	return declare([AppModel], {
		title: "SK Todos sample app",
		selectedTag: null,
		
		constructor: function() {
			this.set('tags', Tag.query({}).map(function(tag){
				var appTag = new AppTag({
					domainModel: tag,
				});
				appTag.watch('selected', function() {
					if (appTag.get('selected')) {
						this.set('selectedTag', appTag);
					}
				}.bind(this));
				return appTag;
			}.bind(this)));
			this.get('tags').observe(function(item, removed) {
				if (removed >= 0 && this.get('selectedTag') && item.getIdentity() == this.get('selectedTag').getIdentity()) {
					this.showAll();
				}
			}.bind(this));
			
			
			function _getAppTodo(todo) {
				return new AppTodo({
					domainModel: todo,
					tagModel: Tag
				});
			}
			this.watch('selectedTag', function() {
				var tag = this.get('selectedTag');
				if (tag) {
					this.set('todos', tag.get("todosRelations").map(function(todoRel) {
						return _getAppTodo(todoRel.get('todo'));
					}));
				}
				else {
					this.set('todos', Todo.query().map(_getAppTodo));
				}
			}.bind(this));
			
			this.set('selectedTag', null);
		},
		
		createTag: function(data) {
			return new Tag(data).save();
		},
		
		createTodo: function(data) {
			var newTodo = new Todo(data).save();

			var tag = this.get('selectedTag');
			if (tag) {
				newTodo.addTag(tag);
			}
			
			return newTodo;
		},
		
		showAll: function() {
			this.get('selectedTag') && this.get('selectedTag').set('selected', false);
			this.set('selectedTag', null);
		}
	});
});
