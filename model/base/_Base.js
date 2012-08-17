define([
	'lodash/lodash',
	'dojo/_base/declare',
	'dojo/Stateful',	'dojo/Evented'
],
function(_,
	declare,
	Stateful,			Evented
) {
	return declare([Stateful, Evented], {
		constructor: function(params) {
			declare.safeMixin(this, params);
			//for each function that exists on domainModel (owned and inherited) but not on this, proxy it
			_(this.domainModel).forIn(function(value, prop){
				if (typeof value === "function"){
					if (!this[prop]){
						this[prop] = function(){
							return value.apply(this.domainModel, arguments);
						};
					}
				}
			}, this);
		},
		set: function(attr) {
			//when setting a prop that is not defined on this, set it on this.domainModel instead
			var setter = this[this._getAttrNames(attr).s];
			if (this.hasOwnProperty(attr) || setter) {
				return Stateful.prototype.set.apply(this, arguments);
			}
			else {
				return this.domainModel.set.apply(this.domainModel, arguments);
			}
		},
		get: function(attr) {
			//when getting a prop that is not defined on this, get it on this.domainModel instead
			var getter = this[this._getAttrNames(attr).g];
			if (this.hasOwnProperty(attr) || getter) {
				return Stateful.prototype.get.apply(this, arguments);
			}
			else {
				return this.domainModel.get.apply(this.domainModel, arguments);
			}
		},
		watch: function(attr){
			//when watching a prop that is not defined on this, watch it on this.domainModel instead
			var setter = this[this._getAttrNames(attr).s];
			if (this.hasOwnProperty(attr) || setter) {
				return Stateful.prototype.watch.apply(this, arguments);
			}
			else {
				return this.domainModel.watch.apply(this.domainModel, arguments);
			}
		},

	});
});
