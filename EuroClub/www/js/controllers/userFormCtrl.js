app.controller('userFormCtrl', [
  "$scope","ionicMaterialInk","$rootScope","$stateParams","$state","MiscSrv",
  function ($scope,ionicMaterialInk,$rootScope,$stateParams,$state,MiscSrv) {
    ionicMaterialInk.displayEffect();

    $scope.form={};
    var nextView=$stateParams.nextView;

    $scope.$on('$ionicView.enter', function () {
      MiscSrv.fixHeader();
      initView();

    });

    function initView(){
      //$rootScope.fab2.icon = 'ion-location';
      $rootScope.fab2.hide = true;
        $scope.user={};
        try{
          $scope.user=JSON.parse(localStorage.getItem('user')||{});
        }catch(e){

        }

        $rootScope.fab2.icon='ion-help-circled';
        $rootScope.fab2.action='help';
        $rootScope.fab1={
          icon:'ion-model-s',
          action:'GO',
          hide:'',
          eventid:"FabButton1.Click"
        }
     }


    function isvalidForm(form){
      form.$valid=true;
      var arr=Object.getOwnPropertyNames(form);
      for(var i in arr){
        var prob=arr[i];
        if(prob.charAt(0)=='$')
          continue;
        form.$valid=form[prob].$valid&&form.$valid
      }

      return form.$valid;
    }
    ////
    $scope.save=function(){

      $scope.form.name.$submitted=true;
      if(!isvalidForm($scope.form.name)) {
        MiscSrv.showAlert($rootScope.translateWord('Please fill required fields'))
        return;
      }
      localStorage.setItem('user',JSON.stringify($scope.user))

      localStorage.setItem('userName', $scope.user.FullName)
      localStorage.setItem('isUserProfileSet','true');
      if(nextView&&nextView!="NONE")
	    	$state.go(nextView,{})
      else {
        $state.go('app.welcome')
      }
    }

    $scope.saveMedicalUser =function(){

      $scope.form.name.$submitted=true;
      if(!isvalidForm($scope.form.name)) {
        MiscSrv.showAlert($rootScope.translateWord('Please fill required fields'))
        return;
      }
      localStorage.setItem('userMedical',JSON.stringify($scope.user))

      localStorage.setItem('userNameMedical', $scope.user.FullName )
      localStorage.setItem('isUserProfileSetMedical','true');
      if(nextView&&nextView!="NONE")
	    	$state.go(nextView,{})
      else {
        $state.go('app.welcome')
      }
    }
  }
]);
