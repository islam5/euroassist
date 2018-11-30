app.controller('SettingCtrl', [
  "$scope", "ionicMaterialInk", "$rootScope","$window", "$state",
  function ($scope, ionicMaterialInk, $rootScope, $window, $state) {
    ionicMaterialInk.displayEffect();


    $scope.$on('$ionicView.enter', function () {
      //$rootScope.fab2.icon = 'ion-location';
      $rootScope.fab2.hide = true;
      $scope.setting = {};
      $scope.setting.phone = localStorage.getItem("phone");
      $scope.setting.twiliophone=localStorage.getItem("twiliophone");
	  $scope.setting.language=localStorage.getItem("language");

      $scope.setting.vodafone=localStorage.getItem("vodafone");
      $scope.setting.orange=localStorage.getItem("orange");
      $scope.setting.etisalat=localStorage.getItem("etisalat");


      if (!$scope.setting.phone)
        $scope.setting.phone = "+201019514557";

      if (!$scope.setting.phone)
        $scope.setting.language = "ar";

	if (!$scope.setting.phone)
        $scope.setting.phone = "+201019514557";

      $rootScope.fab2.icon = 'ion-help-circled';
      $rootScope.fab2.action = 'help';
      $rootScope.fab1 = {
        icon: 'ion-model-s',
        action: 'GO',
        hide: '',
        eventid: "FabButton1.Click"
      }


    })

    $scope.save = function () {
      localStorage.setItem('phone', $scope.setting.phone)
      localStorage.setItem('twiliophone', $scope.setting.twiliophone)
	  localStorage.setItem('phone', $scope.setting.phone)
      localStorage.setItem('etisalat', $scope.setting.etisalat)
      localStorage.setItem('orange', $scope.setting.orange)
      localStorage.setItem('vodafone', $scope.setting.vodafone)
	  localStorage.setItem('language', $scope.setting.language)
	 $state.reload();
    }
  }
])
app.controller('AboutCtrl', ["$scope",function($scope){

  $scope.phone=localStorage.getItem('phone')||'+201000039026'
  $scope.contact=function(){
    window.open('mailto:club@euro-assist.com?Subject=[EuroClubRescue]FeedBack', '_system');
  }

  $scope.contactMedical=function(){
    window.open('mailto:Medical@euro-assist.com?Subject=[MedicalService]FeedBack', '_system');
  }

  $scope.link=function(){
    window.open('http://www.euroclub.com.eg', '_system');
  }

}])
;

