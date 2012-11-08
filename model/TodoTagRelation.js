define([
	"SkFramework/model/Model",
	'./Tag',
	'./Todo',
], function(Model, Tag, Todo){

	return Model.addMany2ManyRelation({
		sourceModel: Todo,
		targetModel: Tag,
		sourceAddRemoveName: "tag",
		sourceGetName: "tags",
		targetAddRemoveName: "todo",
		targetGetName: "todos",
	});


});