define([
	'dojo/_base/declare',
	'dojo/Stateful',	'dojo/Evented'
],
function(
	declare,
	Stateful,			Evented
) {
	return declare([Stateful, Evented], {
		constructor: function(params) {
			declare.safeMixin(this, params);
		}
	});
});