'use strict';

angular.module('write', [
  'write.controllers',
  'write.filters',
  'write.services',
  'write.directives',
  'ui.utils',
  'markitupNG',
  'ngResource'
]).
config(function ($routeProvider, $locationProvider) {
   $routeProvider.
   when('/', {
      templateUrl: '/partials/login',
      controller: 'loginCtrl'
    }).
   when('/login', {
      templateUrl: '/partials/login',
      controller: 'loginCtrl'
    }).
   when('/register', {
      templateUrl: '/partials/register',
      controller: 'registerCtrl'
    }).
   when('/bad', {
      templateUrl: '/partials/bad',
      controller: 'registerCtrl'
    }).
   when('/test', {
      templateUrl: '/partials/test',
      controller: 'registerCtrl'
    }).
   otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
});
