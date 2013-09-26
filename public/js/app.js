'use strict';

angular.module('write', [
  'write.controllers',
  'write.filters',
  'write.services',
  'write.directives',
  'ui.tinymce',
  'ngResource'
]).
config(function ($routeProvider, $locationProvider) {
   $routeProvider.
   when('/', {
      templateUrl: 'eventlist',
      controller: 'eventListCtrl'
    }).
   when('/login', {
    templateUrl: 'login',
    controller: 'loginCtrl'
  }).
   when('/logout', {
    templateUrl: 'login',
    controller: 'logoutCtrl'
  }).
   otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
});
