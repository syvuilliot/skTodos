define([
	'dojo/_base/declare',	'dojo/_base/xhr',
	'dojo/store/JsonRest'
], function(
	declare,				xhr,
	JsonRest
) {
	return declare([JsonRest], {
		accepts: "application/javascript, application/json",
		accessToken: null, 
		
		put: function(object, options){
			// summary:
			//		Stores an object. This will trigger a PUT request to the server
			//		if the object has an id, otherwise it will trigger a POST request.
			// object: Object
			//		The object to store.
			// options: Store.PutDirectives?
			//		Additional metadata for storing the data.  Includes an "id"
			//		property if a specific id is to be used.
			//	returns: Number
			options = options || {};
			var id = ("id" in options) ? options.id : this.getIdentity(object);
			var hasId = typeof id != "undefined";
			return xhr(hasId && !options.incremental ? "PUT" : "POST", {
				url: hasId ? this.target + id : this.target,
				postData: JSON.stringify(object),
				handleAs: "json",
				headers: {
					'Authorization': 'Bearer ' + this.accessToken,
					"Content-Type": "application/json",
					"Accept": this.accepts
				}
			});
		},
		remove: function(id){
			// summary:
			//		Deletes an object by its identity. This will trigger a DELETE request to the server.
			// id: Number
			//		The identity to use to delete the object
			return xhr("DELETE",{
				url:this.target + id,
				headers: {
					'Authorization': 'Bearer ' + this.accessToken
				}
			});
		},
		query: function(query, options) {
			headers = {
				'Authorization': 'Bearer ' + this.accessToken
			}
			
			var results = xhr("GET", {
				url: this.target,
				handleAs: "json",
				//content: query,
				headers: headers
			});
			
			var that = this;
			results.forEach = function(callback) {
				var args = arguments;
				return results.then(function(result){
					return that.transformResult(result).forEach(callback);
				});
			};
			
			return results;
		},
		
		transformResult: function(result) {
			return result;
		}
	});
});
