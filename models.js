define([
	"SkFramework/utils/create",
	"SkFramework/model/Model",
	"SkFramework/store/LocalStorage",
	"SkFramework/store/Constructor",
	"SkFramework/store/SubQueryable",
	"SkFramework/store/SimpleQueryEngineGet",
	"dojo/store/Observable",
], function(create, Model, LocalStorage, Constructor, SubQueryable, SimpleQueryEngineGet, Observable){
	var Tag = window.Tag = create(Model, function Tag(){
		this.superConstructor.apply(this, arguments);
	});
	
	var Todo = window.Todo = create(Model, function Todo(){
		this.superConstructor.apply(this, arguments);
	});
	
	Todo.addRelationTo(Tag, {
		sourcePropertyName: "tags",
		targetPropertyName: "todos",
	});
	
	Model.store = window.store = //SubQueryable(
		Observable(
			Constructor(
				new LocalStorage({
					queryEngine: SimpleQueryEngineGet,
				}), {
					constructorsMap: {
						Todo: Todo,
						Tag: Tag,
					}
				}
			)
		)
	//)
	;
	
	return {
		Todo: Todo,
		Tag: Tag,
	};
});