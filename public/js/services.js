'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('write.services', []).
//   factory('User', function($resource){
//     return $resource('localhost/api/user', {}, {
//       query: {method:'GET', isArray:true},
//       post: {method:'POST'},
//       update: {method:'PUT'},
//       remove: {method:'DELETE'}
//     });
//   });
// angular.module('write.services', ['ngResource']).
//   factory('User', function($resource){
//     return $resource('/api/user');
//   });
// angular.module('write.services', ['ngResource']).
//   factory('User', function($resource){
//     return $resource('/login');
//   });
angular.module('write.services', [])
    .service('editDoc', function(){
      var id='';
      var path='/';
      return {
        getDocId: function(){
          return id;
        },
        setDocId: function(value){
          id=value;
        },
        getDocPath: function(){
          return path;
        },
        setDocPath: function(value){
          path=value;
        }
      };
    });
