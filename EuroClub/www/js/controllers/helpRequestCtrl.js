app.controller('helpRequestCtrl', [
  "$scope", "ionicMaterialInk", 'NgMap', 'GeoCoder', "$rootScope",
  "$state", 'MiscSrv', 'langSrv', 'HttpSrv', '$q', 'NavigatorGeolocation',
  '$ionicModal',


  function ($scope, ionicMaterialInk, NgMap, GeoCoder, $rootScope,
            $state, MiscSrv, langSrv, HttpSrv, $q, NavigatorGeolocation
    , $ionicModal) {


    var isMedical = $state.current.name.indexOf('medical') > -1;
    $scope.userName=(isMedical?localStorage.getItem("userNameMedical"):localStorage.getItem("userName"))||"VisitorClub#";

    ionicMaterialInk.displayEffect();
    $scope.online = true;
    var leaveViewReason;
    var options = {
      maximumAge: 30000,
      timeout: 50000,
      enableHighAccuracy: true
    };
    var optionsNoAcc = {
      maximumAge: 30000,
      timeout: 50000,
      enableHighAccuracy: false
    };

    function getCurrentLocation() {
      MiscSrv.showLoading($rootScope.translateWord("Searching for Your Location"));
      $scope.location = null;

      getCurrenGoeLocation(options)
        .then(getGoeLocationSuccess, getGoeLocationError)

      getCurrenGoeLocation(optionsNoAcc)
        .then(getGoeLocationNoAccuSuccess, getGoeLocationNoAccuError)
    }

    function getCurrenGoeLocation(options) {
      var deferred = $q.defer();
      NavigatorGeolocation.getCurrentPosition(options).then(function (result) {
        var latLng = wrapLocationCords(result)
        deferred.resolve(latLng);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise
    }

    function wrapLocationCords(location) {
      var loc = {
        lat: location.coords.latitude,
        lng: location.coords.longitude

      }
      if (window.google) {
        loc.Golatlng = new google.maps.LatLng(loc.lat, loc.lng);
      }

      return loc;
    }

    function getGoeLocationError(error) {
      //TODO Error
      MiscSrv.hideLoading();

      if (!$scope.location) {
       // showConfirmMsgManualLocation();
        showLocationErrorMsgToast()
      }
    }

    function getGoeLocationSuccess(latlang) {
      if ($scope.location && $scope.location.lat == latlang.lat && $scope.location.lng == latlang.lng)
        return;
      $scope.location = latlang;
      getLocationSuccess(latlang);
    }

    function getGoeLocationNoAccuError(error) {
      //TODO Error
      MiscSrv.hideLoading();

      if (!$scope.location) {
        //showConfirmMsgManualLocation();
        showLocationErrorMsgToast()
      }
    }

    function showLocationErrorMsgToast(){
      showToasMsg($rootScope.translateWord('LocationError'))
    }
    function showConfirmMsgManualLocation() {
      return;
      if ($scope.ErrorLocation.map) {
        MiscSrv.showAlert($rootScope.translateWord("Failed To get Current Location"),
          $rootScope.translateWord("choosemapmanualloaction"))
        return;
      }
      var promise = MiscSrv.showUserChooseMapManualPopUp(
        function () {

        }, function () {
          openManualLoactionModal();
        }
      )
    }

    function getGoeLocationNoAccuSuccess(latlang) {
      if ($scope.location && $scope.location.lat == latlang.lat && $scope.location.lng == latlang.lng)
        return;
      $scope.location = latlang;

      getLocationSuccess(latlang)
    }

    function getLocationSuccess(latlang) {
      MiscSrv.hideLoading();
      localStorage.setItem("location",JSON.stringify($scope.location||{}));
      if(isMedical){
        localStorage.setItem('isMedical',"true")
      }else{
        localStorage.removeItem('isMedical')
      }
      showLocationCordInfo(latlang)
        setTimeout(function(){
          $state.go('app.mylocation');
        },900);
    }

    function showLocationCordInfo(location) {
       var prom2 = getLocationGPSCoords(location);
      $q.all([prom2])
        .then(function (msgs) {
          //MiscSrv.showAlert($rootScope.translateWord('Your Location'), msgs[0] );
          showToasMsg(msgs[0])
         }, function () {

        })

    }

    function showToasMsg(msg,dur){
      if(window.plugins.toast)
      window.plugins.toast.showWithOptions(
        {
          message: msg,
          duration: dur||7000, // ms
          position: "bottom",
          addPixelsY: -40,  // (optional) added a negative value to move it up a bit (default 0)
          data: {'foo':'bar'} // (optional) pass in a JSON object here (it will be sent back in the success callback below)
        });
    }
    function getLocationGPSCoords(location) {
      var defer = $q.defer();
      var msg = '';
      msg += $rootScope.translateWord('Your Location Coordinates')+' ';
      msg +=  $rootScope.translateWord('Latitude') + ": " + location.lat+" "  ;
      msg += $rootScope.translateWord('Longitude') + ": " + location.lng  +" ";

      defer.resolve(msg);
      return defer.promise;
      //
    }

    //
    function initView() {
      // check if has all permission [location,sms,call]
      $scope.userName=localStorage.getItem("userName")||'VisitorClub#';

      checkHasLocationAvailable(function(){
        checkPermissions();
      });

      MiscSrv.fixHeader();
    }


    function checkPermissions(){

      if(window.ionic.Platform.isAndroid()){
        checkAndroidPermissions();
      }

    }
    function checkAndroidPermissions(){
      requestSMSAndroid();

      function requestSMSAndroid(){
        cordova.plugins.permissions.requestPermission(cordova.plugins.permissions.CALL_PHONE,requestPhoneAndroid,requestPhoneAndroid);
      }
      function requestPhoneAndroid(){
        cordova.plugins.permissions.requestPermission(cordova.plugins.permissions.SEND_SMS,angular.identity,angular.identity);
      }

    }

    function doDeneyLocationAccess() {
      MiscSrv.showLocationAuthorizedDenyMessage()
        .then(function (ok) {
          if (ok)
            requestLocationAuthorized();
        })
    }

    function requestLocationAuthorized(callback) {
      cordova.plugins.diagnostic.requestLocationAuthorization(
        function (status) {

          switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              if(callback&&callback instanceof Function){
                callback();
              }
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
              doDeneyLocationAccess();
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
              //TODO
              break;
          }

        }, function (error) {

        }
      )
    }

    function requestLocationSetting(callback) {
      cordova.plugins.diagnostic.isLocationEnabled(function (access) {
        if (!access) {
          showConfonfirmLocationSetting();
        }
        else checkLocationAuthorized(callback);

      }, function () {

      })

    }

    function showConfonfirmLocationSetting() {
      MiscSrv.showOpenLocationSettingConfirm()
        .then(function (ok) {
          if (ok) {
            leaveViewReason = "LOCATION_ENABLE";
            if(window.ionic.Platform.isIOS()){
              cordova.plugins.settings.open('location')
            }
            else {
              cordova.plugins.diagnostic.switchToLocationSettings();
            }
          }
        }, function () {

        })
    }

    function checkLocationAuthorized(callback) {
      cordova.plugins.diagnostic.isLocationAuthorized(function (access) {
        if (!access) {
          requestLocationAuthorized(callback)
        }else{
          if(callback&&callback instanceof Function){
            callback();
          }
        }
      }, function (error) {

      });
    }

    function AppResume() {
      if (leaveViewReason == "LOCATION_ENABLE") {
        leaveViewReason = "NONE";
        checkHasLocationAvailable(getCurrentLocation);
      }
    }

    function checkHasLocationAvailable(callback) {
      cordova.plugins.diagnostic.isLocationAvailable(function (access) {
        if (!access) {
          requestLocationSetting(callback);
        } else {
            if(callback&&callback instanceof Function){
              callback();
            }
         }

      }, function (error) {

      })
    }

    function isLocationPickedSuccess() {
      if ($scope.location || $scope.address || (Object.getOwnPropertyNames($scope.manualLocation || {}).length && $scope.form.manual.$valid))
        return true;
    }


    function openManualLoactionModal() {
      $ionicModal.fromTemplateUrl('templates/ManualLocationModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        modal.show();
      })
    }

    $scope.$on('$ionicView.enter', function () {
      initView();
    })
    $scope.$on('$ionicView.leave', function () {
      $scope.location = null;
    })
    //===============


    $scope.getCurrentLocation = function () {
      checkHasLocationAvailable(getCurrentLocation);
    }

     //=======================
    document.addEventListener("resume", AppResume, false);

    $scope.$on('$destroy', function () {
      document.removeEventListener("resume", AppResume, false);
    })


    //
  }
]);
