app.controller('showLocationMapCtrl', [
  "$scope", "ionicMaterialInk", 'NgMap', 'GeoCoder', "$rootScope",
  "$state", 'MiscSrv', 'langSrv', 'HttpSrv', '$q', 'NavigatorGeolocation',
  '$ionicModal',"$ionicHistory","$state",


  function ($scope, ionicMaterialInk, NgMap, GeoCoder, $rootScope,
            $state, MiscSrv, langSrv, HttpSrv, $q, NavigatorGeolocation
    , $ionicModal,$ionicHistory,$state) {
    $scope.mapurl="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBDck1kcOflzZdQER46oGBevaXD3ehqLkU&language="+(localStorage.getItem('language')||'en');
    $scope.location = JSON.parse(localStorage.getItem("location"));
    $scope.other={};
    try {
      $scope.user = JSON.parse(localStorage.getItem('user'))||{};
    } catch (e) {
      $scope.user={};
    }
    var isMedical = localStorage.getItem('isMedical') || false;
    $scope.isMedical = localStorage.getItem('isMedical') || false;
     var count=0;
    var lastIdSMS=0;
    function getMap() {
      NgMap.getMap('mapid')
        .then(getMapSuccess, getMapError);
    }

    function getMapSuccess(map) {
      $scope.map = map;
      $scope.shap = $scope.map.shapes.circle;
      try {
        if ($scope.location && $scope.location.lat && $scope.location.lat)
          setMapLocation($scope.location)
      } catch (e) {

      }

    }

    function getMapError() {
      if (!window.google || !window.google.maps) {
        // $scope.ErrorLocation.map=true;
        //MiscSrv.showAlert($rootScope.translateWord('Map Error'), $rootScope.translateWord('Failed to load map,check Your Internet Connection'))
        //TODO
      }else{
        if(count<10)
           setTimeout(getMap,2000)
      }
    }

    function setMapLocation(location) {
      $scope.marker = $scope.map.markers[0];
      $scope.shap.setCenter(new google.maps.LatLng(location.lat, location.lng));
      $scope.marker.setPosition(new google.maps.LatLng(location.lat, location.lng));
      $scope.map.setZoom(16);
      $scope.map.setCenter(new google.maps.LatLng(location.lat, location.lng));
      var top=(mapid.getBoundingClientRect().height/2)-40;
      if(top>0)
        $scope.map.panBy(0,top);
     // getBestViewPort(new google.maps.LatLng(location.lat, location.lng) || {});
    }

    function getBestViewPort(location) {
      GeoCoder.geocode({location: location})
        .then(getBestViewPortSuccess, getBestViewPortError)
    }

    function getSmsMessage(){

      try {
        var user = JSON.parse(localStorage.getItem('user'));
      } catch (e) {
        user={};
      }
      var msg = (isMedical?'for Medical Service' :"")+" SMS Message :\n" ;
      if(user&&user.FullName)
        msg+=" Name : "+user.FullName;
      else
        msg+=" Name : "+" A Visitor " ;

      if((user&&user.PhoneNumber)||($scope.other&&$scope.other.phoneNoTemp))
        msg+=" Phone Number : "+user.PhoneNumber || $scope.other.phoneNoTemp+"\n";

      if($scope.location) {
        msg += "GPS Location : " + " ["+ $scope.location.lat+"," + $scope.location.lng + " ]";
      }

      if($scope.other&&$scope.other.notes){
        msg+=" \n \n User Notes : "+$scope.other.notes ;
      }
      return msg;

    }

    function sendSmsMessage() {

      var options = {};
      var phone = localStorage.getItem('phone');
      if (!phone)
        alert(' no sms phone ')

      var message=getSmsMessage();

      MiscSrv.showLoading($rootScope.translateWord('Sending SMS Message'));
      nativeSMSSend(phone,message,options);
      $scope.popup.close();
    }
    $scope.sendSMSInternet=function(phone,message,options){
      MiscSrv.showLoading($rootScope.translateWord('Sending SMS Message'));
       HttpSrv.sendTwilioSms(message)
         .then(function () {
           MiscSrv.hideLoading();
           var p=MiscSrv.showSendSmsMessageSuccess();
           p.then(function (ok) {
             if(ok)
               sendSMSSuccess();
           })
         }, function () {
           //TODO
           defualtSMSSender(phone,message,options);
         })
    }

    function androidSendSMS(phone,message,options){
      SMS.sendSMS(phone, message, function (status) {
        setTimeout(function () {
          checkAndroidSmsSuccess(phone,message);
        },1500)
      },sendSIMSMSError)
    }

    function androidSMSMessageSuccess(){
      MiscSrv.hideLoading();
      MiscSrv.showSendSmsMessageSuccess()
        .then(function (ok) {
          if(ok)
            sendSMSSuccess();
        });
    }
    function checkAndroidSmsSuccess(phone,message){
      SMS.listSMS({address:phone,body:message},function(arr){
        if(arr.length>0&&arr[0]._id>lastIdSMS){
          androidSMSMessageSuccess();
        }else{
          sendSIMSMSError('')
        }
      },function(error){
        sendSIMSMSError(error)
      })
    }
    function getAndroidLastIdmsg(phone,message,options,callback){
      var phone = localStorage.getItem('phone');
      if (!phone)
        alert(' no sms phone ')

       SMS.listSMS({address:phone},function(arr){
          if(arr.length>0)
              lastIdSMS=arr[0]._id;
        if(callback instanceof Function)
          callback(phone,message,options)
      }, function () {
        if(callback instanceof Function)
          callback(phone,message,options)
      })
    }
    function sendSMSSuccess(){
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });
      $ionicHistory.clearHistory();
      localStorage.setItem("showShare","true");
      if(!$scope.isMedical)
        MiscSrv.showToImage('img/flyer.jpg');
      else
        MiscSrv.showToImage('img/flyerMedical.jpeg');
      setTimeout(function(){
        MiscSrv.hideLoading();
        if(!$scope.isMedical)
        $state.go('app.services' );
        else  $state.go('app.servicesmedical' );
      },2000)
    }
    function defualtSMSSender(phone,message,options){
      sms.send(phone, message, options, function (status) {
        MiscSrv.hideLoading();
       var p= MiscSrv.showSendSmsMessageSuccess();
        p.then(function (ok) {
          if(ok)
            sendSMSSuccess();
        })
      },sendSIMSMSError)
    }

    function  nativeSMSSend(phone,message,options){
      if(window.ionic.Platform.isAndroid()){
        defualtSMSSender(phone,message,options);

      }else if(window.ionic.Platform.isIOS()){
        //$scope.sendSMSInternet(phone,message,options)
        $scope.sendSMSInternet(phone,message,options);
      }
    }

    function letUseCall(){

      plugins.sim.getSimInfo(function(info){
        if(getCodeCallMe(info.carrierName))
          window.plugins.CallNumber.callNumber(function () {
            MiscSrv.showAlert($rootScope.translateWord("Sms Message"),$rootScope.translateWord("Send Help Request Without GPS Location Successfully"))
            sendSMSSuccess();
          }, function () {
            MiscSrv.showAlert($rootScope.translateWord("Sms Message"),$rootScope.translateWord("Send Help Request Without GPS Location Failed"))
            sendSMSSuccess();
          }, getCodeCallMe(info.carrierName), true);
        else $rootScope.translateWord("We are sorry , not supported this "+info.carrierName+" , please notify us  about that , we need to ensure to have best service with Euro Club ")
      }, function (erorr) {
        alert(erorr)
      });
    }
    function getCodeCallMe(str){
      str=str.toLowerCase();
      if(str.indexOf('vodafone')!=-1)
          return localStorage.getItem('vodafone')
      if(str.indexOf('orange')!=-1)
        return localStorage.getItem('orange')
      if(str.indexOf('etisalat')!=-1)
        return localStorage.getItem('etisalat')
      if(str.indexOf('mobinil')!=-1)
        return localStorage.getItem('mobinil')
      return null;
    }
    function sendSIMSMSError(error){
      if(error!="User has denied permission") {
        MiscSrv.showSendSIMSmsMessageError()
          .then(function (ok) {
            if(ok)
              letUseCall()
          });
      }
      MiscSrv.hideLoading();
    }
    function getBestViewPortSuccess() {

    }

    function getBestViewPortError() {

    }

    $scope.$on('maploaded', function () {
      count=0;
      getMap();
    })
    $scope.$on('$ionicView.enter', function () {
      getMap();
        MiscSrv.fixHeader();

    })
    $scope.$on('$ionicView.leave', function () {

    })
    $scope.smallMap=function(){
      if(window.mapoverlab){
        setMapLocation($scope.location);
        window.mapoverlab.style.top='200px';
      }
    }

    $scope.clickMap=function(){
      if(window.mapoverlab){
        setMapLocation($scope.location);
        window.mapoverlab.style.top=document.body.querySelector('.view-container').getBoundingClientRect().height-200+'px';
      }
    }

    function sendSMS(){

    }
    function sendAndroid(){
      $scope.popup=MiscSrv.showPopSMSSend($scope,sendSmsMessage,sendSmsMessage);
    }

    function sendIOS(){
      if(!$scope.user.PhoneNumber){
        MiscSrv.showPopPhoneInput($scope,sendAndroid, function () {

        });
      }else{
        sendAndroid();
      }

    }
    $scope.cancel= function () {
      $state.go('app.helprequest');
    }
     $scope.send=function(){
       if(window.ionic.Platform.isAndroid()){
         sendAndroid();

       }else if(window.ionic.Platform.isIOS()){
        sendIOS();
       }
    }

    $scope.smsCallMe=function(){
      letUseCall()
    }
    //
  }
]);
