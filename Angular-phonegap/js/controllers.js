angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MenuCtrl', function($scope, $http, $state, globals) {
    
    //steroids.view.setBackgroundColor("#FFF")

    $scope.init = function() {
        if(localStorage.getItem('pages') != '') {
            $scope.pages = JSON.parse( localStorage.getItem('pages') );
            console.log($scope.pages);   
        }
        $scope.getPagesFromServer();
    }

    $scope.menuClick = function(page) {
        if(page.type == 'text') {
            $state.go('app.textpage', {id: page.id});    
        } else if(page.type == 'facebook') {
            console.log(page.facebook_id);
            $state.go('app.fbpage', {id: page.facebook_id});
        } else if(page.type == 'link') {
            if(localStorage.getItem('platform') == 'iOS') {
                window.open(page.link, '_blank', 'location=no');
            } else {
                window.open(page.link, '_system', 'location=no');
            }
        } else if(page.type == 'native') {
            var eventView = new steroids.views.WebView(page.link);
            steroids.layers.push(eventView);
        } else if(page.type == 'category') {
            $state.go('app.news', {cid: page.id, name: page.name});
        }
    }
    
    $scope.getPagesFromServer = function() {
        
        $http({
            method: 'GET', 
            url: globals.base_url+'/api/pages',
            params: {
                user: globals.user
            } 
        })
        .success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(data);
            localStorage.setItem('pages', JSON.stringify(data.data.pages));
            localStorage.setItem('categories', JSON.stringify(data.data.categories));
            localStorage.setItem('fb_app_token', data.app_token);
            $scope.pages = data.data.pages;
            $scope.categories = data.data.categories;
        })
        .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error loading pages.')
        });
        
    }
    
})

.controller('PageCtrl', function($scope, $stateParams, $filter, partner) {
    
    $scope.initSingle = function() {
        if(localStorage.getItem('pages') != '') {
            $scope.pages = JSON.parse( localStorage.getItem('pages') );   
        }
        $scope.getPage();
    }
    
    $scope.getPage = function() {
        $scope.page = $filter('getById')( $scope.pages, $stateParams.id );
    }

    $scope.openLink = function(url) {
        if(localStorage.getItem('platform') == 'iOS') {
            window.open(url, '_blank', 'location=no');
        } else {
            window.open(url, '_system', 'location=no');
        }
    }
    
})

.controller('NewsCtrl', function($scope, $stateParams, $filter, globals, $http) {
    
    $scope.initSingle = function() {
        if(localStorage.getItem('news') != '') {
            $scope.newsItems = JSON.parse( localStorage.getItem('news') );   
        }
        $scope.getNewsItem();
    }
    
    $scope.initOverview = function() {
        $scope.curCat = {};
        $scope.curCat.id = $stateParams.cid;
        $scope.curCat.name = $stateParams.name;
        if(localStorage.getItem('news') != '') {
            $scope.newsItems = JSON.parse( localStorage.getItem('news') );   
        }
        $scope.getNewsFromServer();
    }
    
    $scope.doRefresh = function() {
        angular.element( document.getElementById("errors") )
                .html('');
        $scope.getNewsFromServer();
      };
    
    $scope.getNewsItem = function() {
        $scope.newsItem = $filter('getById')( $scope.newsItems, $stateParams.id );
    }

    $scope.openLink = function(url) {
        if(localStorage.getItem('platform') == 'iOS') {
            window.open(url, '_blank', 'location=no');
        } else {
            window.open(url, '_system', 'location=no');
        }
    }
    
    $scope.getNewsFromServer = function() {
        
        $http({
            method: 'GET', 
            url: globals.base_url+'/api/news',
            params: {
                user: globals.user,
                nb: 10
            } 
        })
        .success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(data);
            localStorage.setItem('news', JSON.stringify(data.data));
            $scope.newsItems = data.data;
        })
        .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error loading news items.')
            angular.element( document.getElementById("errors") )
                .html('<div class="error">Error loading news items</div>');
        }).finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });;
        
    }
    
})

.controller('EventsCtrl', function($scope, $stateParams, $filter, $http, globals) {
    
    $scope.initSingle = function() {
        if(localStorage.getItem('events') != '') {
            $scope.events = JSON.parse( localStorage.getItem('events') );   
        }
        $scope.getEvent();
    }
    
    $scope.initOverview = function() {
        if(localStorage.getItem('events') != '') {
            $scope.events = JSON.parse( localStorage.getItem('events') );   
        }
        $scope.getEventsFromServer();
    }
    
    $scope.doRefresh = function() {
        angular.element( document.getElementById("errors") )
                .html('');
        $scope.getEventsFromServer();
      };
    
    $scope.getEvent = function() {
        $scope.event = $filter('getById')( $scope.events, $stateParams.id );
        console.log($scope.event);
        $scope.drawMap();
        if($scope.event.facebook_event_id) {
            getEventFb();
        }
    }

    $scope.openLink = function(url) {
        if(localStorage.getItem('platform') == 'iOS') {
            window.open(url, '_blank', 'location=no');
        } else {
            window.open(url, '_system', 'location=no');
        }
    }

    $scope.drawMap = function() {
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(-33, 151),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        //var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        angular.element(document.getElementById("map_canvas")).html('<iframe src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;q='+$scope.event.location+'&amp;ie=UTF8&amp;hq=&amp;t=m&amp;z=15&amp;iwloc=A&amp;output=embed"></iframe>');
    }
    
    $scope.getEventsFromServer = function() {
        
        $http({
            method: 'GET', 
            url: globals.base_url+'/api/events',
            params: {
                user: globals.user,
                nb: 15
            } 
        })
        .success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(data);
            localStorage.setItem('events', JSON.stringify(data.data));
            localStorage.setItem('fb_app_token', data.app_token);
            $scope.events = data.data;
        })
        .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error loading events.')
            angular.element( document.getElementById("errors") )
                .html('<div class="error">Error loading events</div>');
        }).finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });;
        
    }

    function getEventFb() {
        $http({
            method: 'GET', 
            url: 'https://graph.facebook.com/'+$scope.event.facebook_event_id,
            params: {
                access_token: localStorage.getItem('fb_app_token'), 
                fields: 'attending_count,cover,invited_count,maybe_count'
            } 
        })
        .success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(data);
            $scope.event.facebook = data;
        })
        .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error loading events.')
        });
    }
    
})

.controller('FacebookCtrl', function($scope, $stateParams, $filter, $http, globals) {
    
    $scope.initSingle = function() {
        if(localStorage.getItem('facebook') != '') {
            $scope.facebook = JSON.parse( localStorage.getItem('facebook') );   
        }
        $scope.getFacebookItem();
    }
    
    $scope.initOverview = function() {
        if(localStorage.getItem('facebook') != '') {
            $scope.facebook = JSON.parse( localStorage.getItem('facebook') );   
        }
        $scope.fib = $stateParams.id;
        $scope.getFacebookItems();
    }
    
    $scope.doRefresh = function() {
        angular.element( document.getElementById("errors") )
                .html('');
        $scope.getFacebookItems();
      };
    
    $scope.getFacebookItem = function() {
        $scope.post = $filter('getById')( $scope.facebook, $stateParams.pid );
        console.log($scope.post);
    }

    $scope.openLink = function(url) {
        if(localStorage.getItem('platform') == 'iOS') {
            window.open(url, '_blank', 'location=no');
        } else {
            window.open(url, '_system', 'location=no');
        }
    }
    
    $scope.getFacebookItems = function() {
        var id = $stateParams.id;

        $http({
            method: 'GET', 
            url: 'https://graph.facebook.com/v2.1/'+id+'/feed',
            params: {
                access_token: localStorage.getItem('fb_app_token')
            } 
        })
        .success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("Result:");
            console.log(data.data);
            localStorage.setItem('facebook', JSON.stringify(data.data));
            $scope.facebook = data.data;
        })
        .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error loading news items.')
            angular.element( document.getElementById("errors") )
                .html('<div class="error">Error loading news items</div>');
        }).finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });;
        
    }
    
});