angular.module('write', [
  'write.controllers',
  'write.filters',
  'write.services',
  'write.directives',
  'ui.utils',
  'ngResource',
  'ngRoute',
  'ui.bootstrap'
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
    when('/edit', {
      templateUrl: '/partials/edit',
      controller: 'editCtrl'
    }).
    otherwise({
      redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
});
