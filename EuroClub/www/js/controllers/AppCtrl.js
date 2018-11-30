app.controller('AppCtrl', [
  "$scope","ionicMaterialInk","$ionicPopover","langSrv","$rootScope","HttpSrv","MiscSrv",
  function ($scope,ionicMaterialInk,$ionicPopover,langSrv,$rootScope,HttpSrv,MiscSrv) {
    ionicMaterialInk.displayEffect();

    $rootScope.showMeneuButton=true;
    $rootScope.langKey = localStorage.getItem("langKey");
    if (!$rootScope.langKey || !window.language[$rootScope.langKey]) {
      $rootScope.langKey = 'ar_EG';
      localStorage.setItem('langKey', $rootScope.langKey);
    }
    setToggleLang();
    function setToggleLang(){
      $rootScope.toggleLangLabel=window.language[$rootScope.langKey].toggleLangLabel;
      $rootScope.toggleLang=window.language[$rootScope.langKey].toggleLang;
      localStorage.setItem('language',window.language[$rootScope.langKey].id);
      angular.element(document.body).addClass($rootScope.langKey)

      $rootScope.$emit('languageChange');
     }

    $rootScope.langTempateUrl = 'templates/' + $rootScope.langKey + "/";
    $rootScope.translateWord = function (word) {
      return langSrv.translateWord(word, $rootScope.langKey);
    }

    function addLangClass(){

    }
    $rootScope.changeLanguage=function(key){
      angular.element(document.body).removeClass($rootScope.langKey)
      $rootScope.langKey = key;
      localStorage.setItem('langKey', $rootScope.langKey);
      setToggleLang();
    }

    function setAppConstants(){
      if(!localStorage.getItem("phone"))
      localStorage.setItem('phone', "+201000396091");
      if(!localStorage.getItem("vodafone"))
        localStorage.setItem('vodafone', "*505*01019514557#");

      if(!localStorage.getItem("orange"))
        localStorage.setItem('orange', "*121*01208934411#")

      if(!localStorage.getItem("mobinil"))
       localStorage.setItem('mobinil', "*121*01208934411#")

      if(!localStorage.getItem("etisalat"))
        localStorage.setItem('etisalat', "*111*01000048393#")

      if(!localStorage.getItem("annualFeesar"))
        localStorage.setItem('annualFeesar', "500")

      if(!localStorage.getItem("annualFeesen"))
      
           localStorage.setItem('annualFeesen', "500")
     
      if(!localStorage.getItem("twiliotoken"))
        localStorage.setItem('twiliotoken', "78176912a662bf7653008beb707b0249")

      if(!localStorage.getItem("twiliosid"))
        localStorage.setItem('twiliosid', "AC70f10769abc8ae40e3fbb5c60909bbf2")


      if(!localStorage.getItem("twilioto"))
        localStorage.setItem('twilioto', localStorage.getItem("phone"))


      if(!localStorage.getItem("twiliofrom"))
        localStorage.setItem('twiliofrom', "+12564475709")

      if(!localStorage.getItem("twiliophone"))
        localStorage.setItem('twiliophone', localStorage.getItem("phone"))
    }

    function setPhoneNumbers(){
      HttpSrv.fetchphoneNumbers();
    }

    setAppConstants();
    setPhoneNumbers();
    $ionicPopover.fromTemplateUrl('templates/popover-bar-items.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.$root.popover = popover;
    });

    $rootScope.shareWithFriends=function(){
      MiscSrv.shareWithFriends();
    }

    try {
      var round=localStorage.getItem("round")||1;
      if(round%4==0){
          MiscSrv.showSharePopUp( MiscSrv.shareWithFriends,function(){

          })
      }
      localStorage.setItem("round",parseInt(round)+1)
    } catch (e) {

    }
  }
]);
