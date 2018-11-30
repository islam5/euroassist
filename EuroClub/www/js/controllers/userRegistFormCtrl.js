app.controller('userRegistFormCtrl', [
  "$scope","ionicMaterialInk","$rootScope","$stateParams","$state","MiscSrv","HttpSrv",
  function ($scope,ionicMaterialInk,$rootScope,$stateParams,$state,MiscSrv,HttpSrv) {
    ionicMaterialInk.displayEffect();

    $scope.form={};
    $scope.user={};
    $scope.annualFees=localStorage.getItem("annualFees"+localStorage.getItem("language"));
    var isMedical = $state.current.name.indexOf('medical') > -1;

    var nextView=$stateParams.nextView;

    $scope.$on('$ionicView.enter', function () {
      MiscSrv.fixHeader();
      initView();
    });

    $rootScope.$on('languageChange',function(){
      $scope.annualFees=localStorage.getItem("annualFees"+localStorage.getItem("language"))||500;

    })
    function sendSmsMessage() {

      var options = {};
      var phone = localStorage.getItem('phone');
      if (!phone)
        alert(' no sms phone ')

      var message=getSmsMessage();

      MiscSrv.showLoading($rootScope.translateWord('Sending Registration Request'));
      if(window.ionic.Platform.isAndroid()){
        defualtSMSSender(phone,message,options);

      }else if(window.ionic.Platform.isIOS()){
         $scope.sendSMSInternet(phone,message,options)
        //defualtSMSSender(phone,message,options);

      }
      //$scope.popup.close();
    }

    $scope.sendSMSInternet=function(phone,message,options){
      MiscSrv.showLoading($rootScope.translateWord('Sending SMS Message'));
      HttpSrv.sendTwilioSms(message)
        .then(function () {
          MiscSrv.hideLoading();
          var p=MiscSrv.showSendSmsRegMessageSuccess();
              p.then(function (ok) {
                     if(ok)
                     sendSMSSuccess();
                     })
        }, function () {
          //TODO
          defualtSMSSender(phone,message,options);
        })
    }

    function getSmsMessage(){

      try {
        var user =$scope.user;
      } catch (e) {
        user={};
      }
      var msg = (isMedical?"For Medical":"")+" SMS Registration Message :" ;
      if(user&&user.FullName)
        msg+=" Name : "+user.FullName;

      if(user.address) {
        msg += " address : " + " [ " + $scope.address + " ]";
      }
      if(user.PhoneNumber) {
        msg += " phoneNumber : " + " [ " + user.PhoneNumber+ " ]";
      }

      return msg;

    }

    function defualtSMSSender(phone,message,options){
      sms.send(phone, message, options, function (status) {
        MiscSrv.hideLoading();
        var p= MiscSrv.showSendSmsRegMessageSuccess();
        p.then(function (ok) {
          if(ok)
            sendSMSSuccess();
        })
      },sendSIMSMSError)
    }
    function initView(){

     }

    function sendSMSSuccess(){
        $state.go('app.welcome');
     }

    function sendSIMSMSError(error){
      if(error!="User has denied permission") {
        MiscSrv.showSendSIMSmsMessageError2()
          .then(function (ok) {

          });
      }
      MiscSrv.hideLoading();
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

      sendSmsMessage();
    }
  }
]);
