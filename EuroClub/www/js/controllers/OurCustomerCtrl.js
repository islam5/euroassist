app.controller('CustomersCtrl', function($scope,$rootScope,$http,$stateParams,langSrv,MiscSrv) {

	console.log(langSrv.getLanguage());
  $scope.loadServicesListData = function(){
    $http.get('./data/customersList_'+langSrv.getLanguage()+'.json').success(function(data){
      $scope.CustomersInEgypt  = data;
      $rootScope.$emit('CustomerReloaded')
    });
  }
	function init(){
    $scope.loadServicesListData();
    if(localStorage.getItem("language")=='ar'){
      $scope.iconLang='ion-chevron-left';
    }else{
      $scope.iconLang='ion-chevron-right';
    }
  }


  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $rootScope.$on('languageChange',function(){
    init();
  });

  $scope.$on('$ionicView.enter',function(){
    MiscSrv.fixHeader();
    init();
  })
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
})
