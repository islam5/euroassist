// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-material', 'ionMdInput', 'ngMap', 'ion-floating-menu', 'fabDirective', 'ngMessages']);

app.run(["$ionicPlatform", "$rootScope", "$http", "langSrv", 'ionicMaterialInk', "$state",
  function ($ionicPlatform, $rootScope, $http, langSrv, ionicMaterialInk, $state) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      ionicMaterialInk.displayEffect();
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    $rootScope.googleMapUrl = "https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBDck1kcOflzZdQER46oGBevaXD3ehqLkU";


    if (localStorage.getItem("agreement"))
      $state.go("app.welcome");
    else $state.go("app.agreement");
    // fab
    $rootScope.fab1 = {
      icon: 'ion-model-s',
      action: 'GO',
      hide: '',
      eventid: "FabButton1.Click"
    }

    $rootScope.fab2 = {
      icon: '',
      action: '',
      hide: '',
      eventid: "FabButton2.Click"
    }

    $rootScope.loadMenuTitles = function () {
      $http.get('data/menuTitle.json').success(function (data) {
        $rootScope.menuTitles = data;
        console.log($rootScope.menuTitle);
      });

    }
    $rootScope.loadMenuTitles();

    $rootScope.fabClick = function (fab) {
      $rootScope.$emit(fab.eventid, fab.action);
    }
  }
])

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.userform', {
      url: '/userform/{nextView}',
      views: {
        'menuContent': {
          templateUrl: 'templates/UserForm.html',
          controller: 'userFormCtrl'
        }
      }
    })


    .state('app.userregistform', {
      url: '/userregistform',
      views: {
        'menuContent': {
          templateUrl: 'templates/UserRegistForm.html',
          controller: 'userRegistFormCtrl'
        }
      }
    })

    .state('app.welcome', {
      url: '/welcome',
      views: {
        'menuContent': {
          templateUrl: 'templates/WelcomeEuroAssist.html',
          controller: 'WelcomeCtrl'
        }
      }
    })

    .state('app.welcomeeuroclub', {
      url: '/welcomeeuroclub',
      views: {
        'menuContent': {
          templateUrl: 'templates/WelcomeEuroClub.html',
          controller: 'WelcomeCtrl'
        }
      }
    })


    .state('app.welcomeeuroclubmedical', {
      url: '/welcomeeuroclubmedical',
      views: {
        'menuContent': {
          templateUrl: 'templates/WelcomeEuroClubMedical.html',
          controller: 'WelcomeCtrl'
        }
      }
    })

    .state('app.userformMedical', {
      url: '/userformmedical/{nextView}',
      views: {
        'menuContent': {
          templateUrl: 'templates/UserRegistFormMedical.html',
          controller: 'userFormCtrl'
        }
      }
    })

    .state('app.companyformMedical', {
      url: '/companyformmedical/{nextView}',
      views: {
        'menuContent': {
          templateUrl: 'templates/UserRegistFormMedical.1.html',
          controller: 'userRegistFormCtrl'
        }
      }
    }) 
    .state('app.ismembermedical', {
      url: '/ismembermedical',
      views: {
        'menuContent': {
          templateUrl: 'templates/IsMemberMedical.html',
          controller: 'WelcomeCtrl'
        }
      }
    })

    .state('app.helprequestmedical', {
      url: '/helprequestmedical',
      views: {
        'menuContent': {
          templateUrl: 'templates/helpRequestMedical.html',
          controller: 'helpRequestCtrl'
        }
      }
    })

    .state('app.mylocationmedical', {
      url: '/mylocationmedical',
      views: {
        'menuContent': {
          templateUrl: 'templates/showLocationMap.html',
          controller: 'showLocationMapCtrl'
        }
      }
    })

    .state('app.aboutmedical', {
      url: '/aboutmedical',
      views: {
        'menuContent': {
          templateUrl: 'templates/AboutUsMedical.html',
          controller: "AboutCtrl"
        }
      }
    })



    .state('app.ismember', {
      url: '/ismember',
      views: {
        'menuContent': {
          templateUrl: 'templates/IsMember.html',
          controller: 'WelcomeCtrl'
        }
      }
    })

    .state('app.agreement', {
      url: '/agreement',
      views: {
        'menuContent': {
          templateUrl: 'templates/agreement.html',
          controller: 'ServiceAgreementCtrl'
        }
      }
    })

    .state('app.pickloc', {
      url: '/pickloc',
      views: {
        'menuContent': {
          templateUrl: 'templates/pickLocation.html',
          controller: 'pickLocationCtrl'
        },
        resolve: {
          perLoad: function ($rootScope) {
            if (!window.google || !window.google.maps) {
              var arr = document.querySelectorAll('[src^="' + $rootScope.googleMapUrl + '"]');
              if (arr.length > 0)
                arr[0].remove();
            }
          }
        }
      }
    })

    .state('app.setting', {
      url: '/setting',
      views: {
        'menuContent': {
          templateUrl: 'templates/Setting.html',
          controller: 'SettingCtrl'
        }
      }
    })

    .state('app.helprequest', {
      url: '/helprequest',
      views: {
        'menuContent': {
          templateUrl: 'templates/helpRequest.html',
          controller: 'helpRequestCtrl'
        }
      }
    })

    .state('app.mylocation', {
      url: '/mylocation',
      views: {
        'menuContent': {
          templateUrl: 'templates/showLocationMap.html',
          controller: 'showLocationMapCtrl'
        }
      }
    })

    .state('app.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'templates/Help.html'
        }
      }
    })

    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/AboutUs.html',
          controller: "AboutCtrl"
        }
      }
    })

    .state('app.services', {
      url: '/services/{action}',
      views: {
        'menuContent': {
          templateUrl: 'templates/ServicesList.html',
          controller: 'ServicesListCtrl'
        }
      }
    })
    .state('app.servicesmedical', {
      url: '/servicesmedical/{action}',
      views: {
        'menuContent': {
          templateUrl: 'templates/ServicesList.html',
          controller: 'ServicesListCtrl'
        }
      }
    })

    .state('app.single', {
      url: '/service/:serviceID',
      views: {
        'menuContent': {
          templateUrl: 'templates/Service.html',
          controller: 'ServiceCtrl'
        }
      }
    })
    .state('app.customers', {
      url: '/customers',
      views: {
        'menuContent': {
          templateUrl: 'templates/Customers.html',
          controller: 'CustomersCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/welcome');
});
