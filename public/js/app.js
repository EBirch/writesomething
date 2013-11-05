'use strict';

angular.module('write', [
  'write.controllers',
  'write.filters',
  'write.services',
  'write.directives',
  'ui.utils',
  'markitupNG',
  'ngResource',
  'ngRoute'
]).
config(function ($routeProvider, $locationProvider){
   $routeProvider.
   when('/', {
      templateUrl: '/partials/main',
      controller: 'mainCtrl'
    }).
   when('/login', {
      templateUrl: '/partials/login',
      controller: 'loginCtrl'
    }).
   when('/register', {
      templateUrl: '/partials/register',
      controller: 'registerCtrl'
    }).
   when('/main', {
      templateUrl: '/partials/main',
      controller: 'mainCtrl'
    }).
   when('/new', {
      templateUrl: '/partials/new',
      controller: 'newCtrl'
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
