app.controller('WelcomeCtrl', ['$scope', '$stateParams', 'ionicMaterialInk', '$rootScope', '$state',
  'MiscSrv', 'ResourcesSrv', '$http',
  function ($scope, $stateParams, ionicMaterialInk, $rootScope, $state, MiscSrv, ResourcesSrv, $http) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    $scope.loadServicesData = function () {
      //$scope.servicesData = ResourcesSrv.getData("1");
      $http.get('data/services.json').success(function (data) {
        $scope.servicesData = data;
      });

    }

    $scope.openLink = function () {
      window.open("http://euroclub.com.eg/index.php/health-care-services/", '_system');
    }
    $scope.loadServicesData();

    $scope.goToEuroClub = function () {
      MiscSrv.showToImage('img/euroclub.jpeg')
      setTimeout(function () {
        MiscSrv.hideLoading();
        $state.go('app.welcomeeuroclub')
      }, 2000)
    }

    $scope.goToEuroClubMedical = function () {
      MiscSrv.showToImage('img/flyerMedical.jpeg')
      setTimeout(function () {
        MiscSrv.hideLoading();
        $state.go('app.welcomeeuroclubmedical')
      }, 2000)
    }

    $scope.nextView = function () {
      var isUserProfileSet = localStorage.getItem('isUserProfileSet');
      if (isUserProfileSet)
        profileSetSuccess();
      else {
        MiscSrv.showUserTypePopUp(memberCallback, visitorCallback)
          .then(function () {
          }, function () {

          })
      }

    }

    function memberCallback() {
      $state.go('app.userform', { nextView: 'app.helprequest' })
    }

    function visitorCallback() {
      $state.go('app.helprequest', {})
    }

    function profileSetSuccess() {
      $state.go('app.helprequest', {})
    }

    function memberCallbackMedical() {
      $state.go('app.userformMedical', { nextView: 'app.helprequestmedical' })
    }

    function visitorCallbackMedical() {
      $state.go('app.helprequestmedical', {})
    }

    function gotoContractCallback(){
      $state.go('app.companyformMedical', { nextView: 'app.helprequestmedical' })
    }
    function profileSetSuccessMedical() {
      $state.go('app.helprequestmedical', {})
    }

    $scope.$on('$ionicView.enter', function () {
      MiscSrv.fixHeader();
    })
    ///

    $scope.goAsMember = function () {
      memberCallback()
    }
    $scope.goAsVisitor = function () {
      visitorCallback();
    }
    
    $scope.gotoContract = function () {
      gotoContractCallback();
    }
    $scope.goIsMember = function () {
      var isUserProfileSet = localStorage.getItem('isUserProfileSet');
      if (isUserProfileSet) {
        profileSetSuccess();
      }
      else {
        $state.go('app.ismember')
      }
    }
    $scope.goAsMemberMedical = function () {
      memberCallbackMedical()
    }
    $scope.goAsVisitorMedical = function () {
      visitorCallbackMedical();
    }
    $scope.goIsMemberMedical = function () {
      var isUserProfileSet = localStorage.getItem('isUserProfileSetMedical');
      if (isUserProfileSet) {
        profileSetSuccessMedical();
      }
      else {
        $state.go('app.ismembermedical')
      }
    }
    $scope.goServices = function () {
      $state.go('app.services')
    }
    $scope.goServicesMedical = function(){
      $state.go('app.servicesmedical')

    }
    $scope.$on('$ionicView.enter', function () {
      $rootScope.fab2.icon = 'ion-help-circled';
      $rootScope.fab2.action = 'help';
      $rootScope.fab1 = {
        icon: 'ion-model-s',
        action: 'GO',
        hide: '',
        eventid: "FabButton1.Click"
      }
    })
  }]);

app.controller('ServiceAgreementCtrl', ["$scope", "$state", "MiscSrv", "$rootScope", "$ionicHistory", "$ionicSideMenuDelegate",
  function ($scope, $state, MiscSrv, $rootScope, $ionicHistory, $ionicSideMenuDelegate) {

    $scope.exit = function () {

      navigator.app.exitApp()
    }

    $scope.goApp = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });
      $rootScope.hideMeneuButton = false;
      localStorage.setItem("agreement", "true");
      $state.go('app.welcome');
    }

    $scope.$on('$ionicView.enter', function () {
      $rootScope.hideMeneuButton = true;
      $ionicSideMenuDelegate.canDragContent(false);
      MiscSrv.fixHeader("75%");
    })

    $scope.$on('$ionicView.leave', function () {
      $rootScope.hideMeneuButton = false;
      $ionicSideMenuDelegate.canDragContent(true);
    })

    if (localStorage.getItem("agreement"))
      $scope.goApp();
  }
])
