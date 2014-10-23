// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  steroids.view.setBackgroundColor("#001e49");

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
    }
  });
})

/* Filters */

.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      console.log(input[i].id == id);
      if (input[i].id == id) {
        return input[i];
      }
    }
    return null;
  }
})

/* Factories */

.factory('globals', function() {
  return {
      base_url : 'http://studentapp.appstudions.be/',
      //base_url : 'http://localhost/studentapp-web/public/index.php/',
      user : 1
  };
})

.factory('partner', function($http, globals) {
  return {
      getById: function(pid){
           $http({
              method: 'GET', 
              url: globals.base_url+'/api/partner',
              params: {
                  'pid': pid,
              } 
            })
            .success(function(data, status, headers, config) {
              console.log(data);
              return data;
            })
            .error(function(data, status, headers, config) {
              console.log('Error loading news items.')
            });
      }  
    }
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
  
    .state('app.events', {
      url: "/events",
      views: {
        'menuContent' :{
          templateUrl: "templates/events.html",
          controller: 'EventsCtrl'
        }
      }
    })

    .state('app.eventitem', {
      url: "/event/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/eventitem.html",
          controller: 'EventsCtrl'
        }
      }
    })
  
    .state('app.textpage', {
      url: "/page/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/page.html",
          controller: 'PageCtrl'
        }
      }
    })

    .state('app.fbpage', {
      url: "/facebook/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/facebook.html",
          controller: 'FacebookCtrl'
        }
      }
    })

    .state('app.fbitem', {
      url: "/facebook/:id/post/:pid",
      views: {
        'menuContent' :{
          templateUrl: "templates/facebookitem.html",
          controller: 'FacebookCtrl'
        }
      }
    })
    
    .state('app.news', {
      url: "/news/:name/:cid",
      views: {
        'menuContent' :{
          templateUrl: "templates/news.html",
          controller: 'NewsCtrl'
        }
      }
    })
  
    .state('app.newsitem', {
      url: "/newsitem/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/newsitem.html",
          controller: 'NewsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/news/Nieuws/1');
});

