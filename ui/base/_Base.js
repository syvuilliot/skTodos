define([
	'dojo/_base/declare'
],
function(
	declare
) {
	return declare([], {
		_setModelAttr: function(model) {
			this._set("model", model);
			this._renderModel();
		},
		_setModelMappingAttr: function(modelMapping){
			this._set("modelMapping", modelMapping);
			this._renderModel();
		},
		_renderModel: function(){
			if (this.get('model')) {
				var modelMapping = this.get("modelMapping");
				var model = this.get("model");
				for (var modelProp in modelMapping){
					var thisProp = modelMapping[modelProp];
					this.set(thisProp, model.get(modelProp));
					this.own(model.watch(modelProp, function(modelProp, oldValue, currentValue){
						this.set(thisProp, currentValue);
					}.bind(this)));
				}
			}
		}
	});
});
