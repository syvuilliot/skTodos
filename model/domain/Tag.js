define([
	"SkFramework/utils/create",
	"SkFramework/model/Model",
	"dojo/store/Memory",
	"SkFramework/store/SimpleQueryEngineGet",
	"dojo/store/Observable"
], function(create, Model, Store, SimpleQueryEngineGet, Observable){
	
	window.Tag = create(Model, function Tag(){
		this.superConstructor.apply(this, arguments);
	});

	Tag.store = window.tagStore = Observable(
		new Store({
			queryEngine: SimpleQueryEngineGet,
		})
	);


	return Tag;
});