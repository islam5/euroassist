app.factory('ResourcesSrv', ["$rootScope","$http","$q",
 function ($rootScope,$http,$q) {
    //var resource = $resource('/data/:file', {file: '@file'});
    return {
        getData: function (fileName) {
			/* var deferred = $q.defer(fileName);
			$http.get('data/'+fileName+'.json').success(function(data){ 
				deferred.resolve(data);
			});
            return deferred.promise; */
			$http.get('data/'+fileName+'.json').success(function(data){ 
				console.log(data);
				return data;
			});
        },
        save: function(fileName) {
           /*  
		    var deferred = $q.defer();
            resource.save(fileName,
                function(response) { deferred.resolve(response);},
                function(response) { deferred.reject(response);}
            );
            return deferred.promise; 
			*/
        }
    };
}
]);