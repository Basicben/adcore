var app = angular.module('adcore', ['ngRoute', 'ngResource', 'adcore.directive', 'adcore.filter', 'ui.bootstrap', 'Chronicle', 'cgNotify', 'angular-intro', 'ivpusic.cookie','popoverToggle']).config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).config(
    ['$locationProvider',
            function ($locationProvider) {
            //commenting out this line (switching to hashbang mode) breaks the app
            //-- unless # is added to the templates
            $locationProvider.html5Mode(true);
        }
    ]).factory('safeApply', [function ($rootScope) {
        return function ($scope, fn) {
            var phase = $scope.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn) {
                    $scope.$eval(fn);
                }
            } else {
                if (fn) {
                    $scope.$apply(fn);
                } else {
                    $scope.$apply();
                }
            }
        }
    }]).config(function ($routeProvider) {
    $routeProvider
    // route for the home page
    .when('/', {
        templateUrl : '../public/templates/home.html',
        controller  : 'mainController'
    })
    .when('/home', {
        templateUrl : '../public/templates/home.html',
        controller  : 'mainController'
    })
    // route for the about page7
    .when('/searchTerms', {
        templateUrl : '../public/templates/searchTerms.html',
        controller  : 'searchTermsController'
    })
    // route for the contact page
    .when('/contact', {
        templateUrl : '../public/templates/contact.html',
        controller  : 'contactController'
    })
    // defualt route
    .otherwise({
        redirectTo: '/'
    });

});


// create the controller and inject Angular's $scope
app.controller('mainController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});


app.controller('contactController', function ($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

var adcoreCtrl = app.controller('adcoreCtrl', ['$scope', '$rootScope', '$compile', '$filter', '$location', '$window', '$timeout', 'safeApply', function ($scope, $rootScope, $compile, $filter, $location, $window, $timeout, safeApply) {
        
        $rootScope.location = $location;
        
        //$rootScope.storage = $.localStorage;
        // $scope.sessionStorage = $.sessionStorage;
        
        $scope.safeApply = function (next) {
            safeApply($scope, next);
        };
        
        
        $scope.USER_TYPE = {
            AGENCY: 1,
            MANAGER: 2,
            CLIENT: 3
        }
        
        $scope.siteComponents = {
            header: {
                _class: 'header',
                logo_img: '',
                menu: {
                    _class: 'menu_blue_active', 
                    items: [
                        {
                            id: 1,
                            lable: 'Search',
                            link: '/searchTerms',
                            order: 1,
                            isActive: true,
                            active: true,
                            isDefualt: true
                        },
                        {
                            id: 2,
                            lable: 'Shopping',
                            link: '/home',
                            order: 2,
                            isActive: true,
                            active: false,
                            isDefualt: false
                        },
                        {
                            id: 3,
                            lable: 'Reports',
                            link: '/contact',
                            order: 3,
                            isActive: true,
                            active: false,
                            isDefualt: false
                        }
                    ]
                }
            },
            user: {
                _class: 'menu_blue_user',
                id: 56,
                type: $scope.USER_TYPE.AGENCY,
                name: 'OrTest Agency',
                statistic: {
                    
                }
            }
        };

        $scope.guid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        };
    
    }]);


