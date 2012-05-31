define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"./models",
	"SkFramework/widgets/Widget",
	"SkFramework/widgets/NewList",
	"./GetLabelComponent",
	"./TodoComponent",
	"./TagComponent",
], function(
	declare,
	lang,
	models,
	Widget,
	List,
	GetLabelComponent,
	TodoComponent,
	TagComponent
){
	var Tag = models.Tag;
	var Todo = models.Todo;

	var SkTodoApp = declare(Widget, {
		children: {
			newTag: {
				type: GetLabelComponent,
				params: {defaultValue: "new tag"},
				events: {"new-label": "createTag"},
			},
			tagsList: {
				type: List,
				params: {
					itemPropName: "tag",
					itemViewType: TagComponent,
					itemViewParams: {},
				},
				events: {
					"remove": "tagRemove",
					"update-label": "tagUpdateLabel",
					"update-selected": "tagUpdateSelected",
				},
			},
			newTodo: {
				type: GetLabelComponent,
				params: {defaultValue: "new todo"},
				events: {"new-label": "createTodo"},
			},
			todoList: {
				type: List,
				params: {
					itemPropName: "todo",
					itemViewType: TodoComponent,
					itemViewParams: {
/*						tagsAvailable: function(){
							return SkTodoApp.getTags();
						},
*/					},
				},
				events: {
					"remove-todo": "todoRemove",
					"remove-tag": "todoTagRemove",
					"update-label": "todoUpdateLabel",
					"update-done": "todoUpdateDone",
				},
			},
		},
		models: models,
		constructor: function(){
			this.tagsState = [];
		},
		startup: function(){
			this.inherited(arguments);
			this.getChild("tagsList").set("items", this.getTags());
		},
		//get all tags from the app store
		getTags: function(){
			return Tag.query({});
		},
		//get tags selected by user
		getTagsState: function(){
			return this.tagsState;
		},
		getTodos: function(){
			//return Todo.query({});
			var firstTagSelected = this.getTagsState()[0];
			return firstTagSelected && firstTagSelected.get("todos") || [];
		},
		createTodo: function(params){
			var newTodo = new Todo({
				label: params.label,
			});
			//TODO: add tags from tagsState to the new todo
			this.getTagsState().forEach(function(tag){
				newTodo.add("tags", tag);
			});
			
			newTodo.save();
		},
		createTag: function(params){
			var newTag = new Tag({
				label: params.label,
			});
			newTag.save();
		},
		todoRemove: function(ev){
			ev.todo.remove();
		},
		todoUpdateLabel: function(ev){
			ev.todo.set("label", ev.label);
			ev.todo.save();
		},
		todoUpdateDone: function(ev){
			ev.todo.set("done", ev.done);
			ev.todo.save();
		},
		todoTagRemove: function(ev){
			//TODO: ev.todo.remove("tags", ev.tag);
		},
		tagRemove: function(ev){
			ev.tag.remove();
		},
		tagUpdateLabel: function(ev){
			ev.tag.set("label", ev.label);
			ev.tag.save();
		},
		tagUpdateSelected: function(ev){
			if (ev.selected === true && this.tagsState.indexOf(ev.tag) == -1){
				this.tagsState.push(ev.tag);
			}
			if (ev.selected === false && this.tagsState.indexOf(ev.tag) != -1){
				this.tagsState.splice(this.tagsState.indexOf(ev.tag), 1);
			}
			this.getChild("todoList").set("items", this.getTodos());
		},
	});

	return SkTodoApp;
});