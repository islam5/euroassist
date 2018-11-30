app.controller('ServicesListCtrl', function($scope,$rootScope,$http,langSrv,MiscSrv,$state) {
  $scope.showRegistButton=!(localStorage.getItem('isUserProfileSet')=='true');
  var medical = $state.current.name.indexOf('medical') > -1;
  if(medical)
    $scope.showRegistButton = false;
  $scope.loadServicesListData = function(){
    $http.get('data/servicesList_'+langSrv.getLanguage()+'.json').success(function(data){
      $rootScope.EuroInfo = data;
      $rootScope.$emit('ServiceReloaded')
    });
  }

  $scope.loadServicesMedicalListData = function(){
    $http.get('data/servicesMedicalList_'+langSrv.getLanguage()+'.json').success(function(data){
      $rootScope.EuroInfo = data;
      $rootScope.$emit('ServiceReloaded')
    });
  }

	function init(){
    if($state.current.name.indexOf('medical')==-1)
      $scope.loadServicesListData();
    else  $scope.loadServicesMedicalListData();
    if(localStorage.getItem('showShare')){
      localStorage.removeItem("showShare")
      MiscSrv.showSharePopUp(MiscSrv.shareWithFriends,function(){

      })
    }
  }
  $scope.$on('$ionicView.enter',function(){
    MiscSrv.fixHeader();
    init();
  })

  $scope.goRegForm=function(){
    // if(!medical)
      $state.go('app.userregistform')
      // else $state.go(app.)
  }

  $rootScope.$on('languageChange',function(){
    init();
  })
});

app.controller('ServiceCtrl', function($scope,$rootScope, $stateParams,MiscSrv) {
    var serviceID = ($stateParams.serviceID) ? parseInt($stateParams.serviceID) : 0;
	console.log(serviceID);

  function init(){
    $scope.serviceName = $rootScope.EuroInfo.services[serviceID].name;
    $scope.serviceList = $rootScope.EuroInfo.services[serviceID].serviceList;
    $scope.serviceHeader = $rootScope.EuroInfo.services[serviceID].header;
    $scope.serviceNote = $rootScope.EuroInfo.services[serviceID].notes;

    if(localStorage.getItem("language")=='ar'){
      $scope.iconLang='ion-chevron-left';
    }else{
      $scope.iconLang='ion-chevron-right';
    }
  }

  $scope.$on('$ionicView.enter',function(){
    init()
    MiscSrv.fixHeader();

  })

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

  $rootScope.$on('languageChange',function(){
    init();
  })

  $rootScope.$on('ServiceReloaded',function(){
    init();
  })

  })
