'use strict';

angular.module('write', [
  'write.controllers',
  'write.filters',
  'write.services',
  'write.directives',
  'ui.utils',
  'markitupNG'
]).
config(function ($routeProvider, $locationProvider) {
   $routeProvider.
   when('/', {
      templateUrl: '/partials/main',
      controller: 'loginCtrl'
    }).
   otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
});
