app.controller('pickLocationCtrl', [
  "$scope", "ionicMaterialInk", 'NgMap', 'GeoCoder', "$rootScope", "$state", 'MiscSrv', 'langSrv', 'HttpSrv', '$q',
  'NavigatorGeolocation', '$ionicModal',
  function ($scope, ionicMaterialInk, NgMap, GeoCoder, $rootScope, $state, MiscSrv, langSrv, HttpSrv, $q, NavigatorGeolocation, $ionicModal) {
    ionicMaterialInk.displayEffect();
    $scope.map;
    $scope.form = {};
    $scope.switchToManualLocation = false;
    $scope.markerPosition;
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


    $scope.ErrorLocation = {}
    function getMap() {
      NgMap.getMap()
        .then(getMapSuccess, getMapError);
    }

    function getMapSuccess(map) {
      $scope.map = map;
      $scope.marker = $scope.map.markers[0];
      if ($scope.location)
        setMapLocation($scope.location)
    }

    function getMapError() {
      if (!window.google || !window.google.maps) {
        // $scope.ErrorLocation.map=true;
        MiscSrv.showAlert($rootScope.translateWord('Map Error'), $rootScope.translateWord('Failed to load map,check Your Internet Connection'))
        //TODO
      } else {
        getMap();
      }
    }

    function getCurrentLocation() {
      MiscSrv.showLoading($rootScope.translateWord("Searching for Your Location"));
      $scope.location = null;
      $scope.ErrorLocation.net = false;
      $scope.ErrorLocation.gps = false;
      //NgMap.getGeoLocation('current', options)
      //  .then(getGoeLocationSuccess, getGoeLocationError)

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

    function wrapGoogleLatLng(latlng) {
      var loc = {
        lat: latlng.lat(),
        lng: latlng.lng()

      }
      if (google) {
        loc.Golatlng = latlng;
      }

      return loc;
    }

    function getBestViewPort(location) {
      GeoCoder.geocode({ location: location })
        .then(getBestViewPortSuccess, getBestViewPortError)
    }

    function setLocationAddressName(location) {
      GeoCoder.geocode({ location: location })
        .then(function (results) {
          if (results instanceof Array && results.length > 1) {
            $scope.address = results[0].formatted_address;
          }
        })
    }

    function getGoeLocationError(error) {
      //TODO Error
      $scope.ErrorLocation.gps = true;
      MiscSrv.hideLoading();

      if (!$scope.location && !$scope.ErrorLocation.net) {
        showConfirmMsgManualLocation();
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
      $scope.ErrorLocation.net = true;
      MiscSrv.hideLoading();

      if (!$scope.location && !$scope.ErrorLocation.gps) {
        showConfirmMsgManualLocation();
      }
    }

    function showConfirmMsgManualLocation() {
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

      showLocationCordInfo(latlang)
      if ($scope.map)
        setMapLocation(latlang);
    }

    function showLocationCordInfo(location) {
      var prom1 = getLocationAddress(location);
      var prom2 = getLocationGPSCoords(location);
      $q.all([prom1, prom2])
        .then(function (msgs) {
          MiscSrv.showAlert($rootScope.translateWord('Your Location'), msgs[0] + msgs[1]);
          sendAutoSmsMsg();
        }, function () {

        })

    }
    function getLocationAddress(location) {
      var defer = $q.defer();

      if (!!window.google && !!window.google.maps) {
        GeoCoder.geocode({ location: location })
          .then(function (results) {
            var address = JSON.stringify(location || {});
            if (results instanceof Array && results.length > 1) {
              address = results[0].formatted_address;
              var msg = $rootScope.translateWord('Your Location Address : ') + address + "</br>";
              defer.resolve(msg);
            }
          }, function () {
            defer.resolve('');
          });
      }
      else {
        defer.resolve('');
      }


      return defer.promise;
    }
    function getLocationGPSCoords(location) {
      var defer = $q.defer();
      var msg = '';
      msg += $rootScope.translateWord('Your Location Coordinates');
      msg += "\n </br>: " + $rootScope.translateWord('Lat') + ": " + location.lat + "\n</br>";
      msg += $rootScope.translateWord('Lng') + ": " + location.lng + "\n</br>";

      defer.resolve(msg);
      return defer.promise;
      //
    }
    function getBestViewPortSuccess(results) {
      if (results instanceof Array && results.length > 1) {
        $scope.map.fitBounds(results[0].geometry.viewport)
        $scope.address = results[0].formatted_address;
      }

    }

    function sendAutoSmsMsg() {
      if ($scope.ErrorLocation.map)
        return true;
      setTimeout(function () {
        $scope.sendSimSms();
      }, 4000);
    }
    function setMapLocation(location) {
      $scope.marker = $scope.map.markers[0];
      $scope.marker.setPosition(new google.maps.LatLng(location.lat, location.lng));
      getBestViewPort(new google.maps.LatLng(location.lat, location.lng) || {});
    }

    function getBestViewPortError() {

    }

    //
    function initView() {

      getMap();
      $scope.ErrorLocation = {};
      $scope.manualLocation = {};
      if ($scope.form.manual)
        $scope.form.manual.$submitted = false;
      $scope.location = null;
      checkHasLocationAvailable();
      if (!checkInternetWorks()) {
        MiscSrv.showAlert($rootScope.translateWord("No Internet Connection"),
          $rootScope.translateWord("nonetconnection"))
        $scope.ErrorLocation.map = true;
      }
    }

    function doDeneyLocationAccess() {
      MiscSrv.showLocationAuthorizedDenyMessage()
        .then(function (ok) {
          if (ok)
            requestLocationAuthorized();
        })
    }

    function requestLocationAuthorized() {
      cordova.plugins.diagnostic.requestLocationAuthorization(
        function (status) {

          switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:

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

    function requestLocationSetting() {
      cordova.plugins.diagnostic.isLocationEnabled(function (access) {
        if (!access) {
          showConfonfirmLocationSetting();
        }
        else checkLocationAuthorized();

      }, function () {

      })

    }

    function showConfonfirmLocationSetting() {
      MiscSrv.showOpenLocationSettingConfirm()
        .then(function (ok) {
          if (ok) {
            leaveViewReason = "LOCATION_ENABLE";
            cordova.plugins.diagnostic.switchToLocationSettings();
          }
        }, function () {

        })
    }

    function checkLocationAuthorized() {
      cordova.plugins.diagnostic.isLocationAuthorized(function (access) {
        if (!access) {
          requestLocationAuthorized()
        }
      }, function (error) {

      });
    }

    function AppResume() {
      if (leaveViewReason == "LOCATION_ENABLE") {
        leaveViewReason = "NONE";
        checkHasLocationAvailable();
      }
    }

    function online() {
      $scope.online = false;
      if (!window.google || !window.google.maps) {
        var arr = document.querySelectorAll('[src^="' + $rootScope.googleMapUrl + '"]');
        if (arr.length > 0)
          arr[0].remove();
      }
      setTimeout(function () {
        $scope.online = true;
        $scope.$apply();
        initView();
      }, 500)
    }

    function offline() {
      $scope.online = true;
      setTimeout(function () {
        $scope.online = false;
        $scope.$apply();
        initView();
      }, 500)
    }

    function getSmsMessage() {

      try {
        var user = JSON.parse(localStorage.getItem('user'));
      } catch (e) {
        user = {};
      }
      var msg = " SMS Message :";
      if (user && user.FullName)
        msg += " Name : " + user.FullName;
      else
        msg += " Name : " + " A Visitor ";

      if ($scope.address)
        msg += " Address :" + $scope.address;
      else {
        msg += " User Manual Location :\n";
        msg += " City :" + $scope.manualLocation.city + "\n";
        msg += " Street :" + $scope.manualLocation.street + "\n";
        msg += " Remarkable Place :" + $scope.manualLocation.mark + "\n";
        msg += " Other :" + $scope.manualLocation.other + "\n";
      }

      if ((!$scope.ErrorLocation.gps || !$scope.ErrorLocation.gps) && $scope.location) {
        msg += "GPS : " + " [ Latitude :" + $scope.location.lat
          + ", longitude :" + $scope.location.lng + "]";
      }

      return msg;

    }
    function checkHasLocationAvailable() {
      cordova.plugins.diagnostic.isLocationAvailable(function (access) {
        if (!access) {
          requestLocationSetting();
        } else {
          getCurrentLocation();
        }

      }, function (error) {

      })
    }

    function sendSmsMessage() {
      var options = {};
      var phone = localStorage.getItem('phone');
      if (!phone)
        alert(' no sms phone ')

      var message = getSmsMessage();

      MiscSrv.showLoading($rootScope.translateWord('Sending SMS Message'));
      sms.send(phone, message, options, function (status) {
        MiscSrv.hideLoading();
        MiscSrv.showSendSmsMessageSuccess();
      }, sendSIMSMSError)
    }

    function showSendSMSConfirm() {
      MiscSrv.showSendSMSConfirm()
        .then(function (ok) {
          if (ok) {
            checkSmsPermission();
          }
        }, function () {

        })
    }
    function isLocationPickedSuccess() {
      if ($scope.location || $scope.address || (Object.getOwnPropertyNames($scope.manualLocation || {}).length && $scope.form.manual.$valid))
        return true;
    }
    function sendSIMSMSError(error) {
      if (error != "User has denied permission") {
        MiscSrv.showSendSIMSmsMessageError()
          .then(function (ok) {
            if (ok)
              letUseCall()
          });
      }
      MiscSrv.hideLoading();
    }
    function letUseCall() {

      plugins.sim.getSimInfo(function (info) {
        if (true)
          window.plugins.CallNumber.callNumber(angular.identity, angular.identity, localStorage.getItem(info.carrierName), true);
        else $rootScope.translateWord("We are sorry , not supported this " + info.carrierName + " , please notify us  about that , we need to ensure to have best service with Euro Assist ")
      }, function (erorr) {
        alert(erorr)
      });
    }
    function letUseCall1() {
      if (localStorage.getItem("phonecall1"))
        window.plugins.CallNumber.callNumber(letUseCall2, letUseCall2, localStorage.getItem("phonecall1"), false);
      else letUseCall2();
    }

    function letUseCall2() {
      setTimeout(function () {
        if (localStorage.getItem("phonecall2"))
          window.plugins.CallNumber.callNumber(letUseCall3, letUseCall3, localStorage.getItem("phonecall2"), false);
        else letUseCall3();
      }, 800)
    }
    function letUseCall3() {
      setTimeout(function () {
        if (localStorage.getItem("phonecall3"))
          window.plugins.CallNumber.callNumber(angular.identity, angular.identity, localStorage.getItem("phonecall3"), false);
      }, 900)

    }
    function getphoneCallMeCode() {
      var defer = $q.defer();
      window.plugins.sim.getSimInfo(function (info) {
        var phone = localStorage.getItem('phone');
        if (!phone)
          alert(' no sms phone ')
        if (info.carrierName == "vodafone")
          defer.resolve("*505*" + phone + "#")
      })
      return defer.promise;
    }
    function requestSmsMessage() {
      cordova.plugins.permissions.requestPermission(cordova.plugins.permissions.SEND_SMS, function (status) {
        if (status.hasPermission) {
          sendSmsMessage();
        }
        else {
          alert(' Please give me sms Permission ')
        }
      }, function () {

      })
    }

    function checkSmsPermission() {
      // cordova.plugins.permissions.hasPermission(cordova.plugins.permissions.SEND_SMS, function (status) {
      //   if (status.hasPermission) {
      //     sendSmsMessage();
      //   } else {
      //     requestSmsMessage();
      //   }
      // }, function () {

      // })
      sendSmsMessage();
    }

    function checkInternetWorks() {
      return navigator.connection.type != Connection.NONE;
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
    $rootScope.$on('FabButton1.Click', function (event, action) {
      if (action == 'SMS') {
        checkSmsPermission();
      }
    });

    $scope.$on('$ionicView.enter', function () {
      //$rootScope.fab2.icon = 'ion-location';
      $rootScope.fab2.hide = true;
      $rootScope.fab1.hide = true;
      $rootScope.fab1.action = "SMS";
      $rootScope.fab1.icon = "ion-android-textsms";

      //

      initView();
    })
    $scope.$on('$ionicView.leave', function () {
      $scope.location = null;
    })
    //===============

    $scope.clickMap = function (event) {
      $scope.marker.setPosition(event.latLng);
      $scope.location = wrapGoogleLatLng(event.latLng);
      setLocationAddressName(event.latLng);
    }

    $scope.markerClick = function (event) {

    }

    $scope.placeChanged = function (event) {
      var place = this.getPlace();
      $scope.location = wrapGoogleLatLng(place.geometry.location);
      setMapLocation(wrapGoogleLatLng(place.geometry.location));
    }

    $scope.getCurrentLocation = function () {
      checkHasLocationAvailable();
    }

    // work around for can't select on mobile
    $scope.addressFocus = function (event) {

      var input = event.target;

      // Get the predictions element
      var container = document.getElementsByClassName('pac-container');
      container = angular.element(container);

      // Apply css to ensure the container overlays the other elements, and
      // events occur on the element not behind it
      container.css('z-index', '5000');
      container.css('pointer-events', 'auto');

      // Disable ionic data tap
      container.attr('data-tap-disabled', 'true');

      // Leave the input field if a prediction is chosen
      container.on('click', function () {
        input.blur();
      });
    };

    $scope.sendSimSms = function () {
      //checkSmsPermission();
      // sendSmsMessage();
      if (isLocationPickedSuccess()) {
        showSendSMSConfirm();
      } else {
        MiscSrv.showAlert($rootScope.translateWord('Your Location'),
          $rootScope.translateWord('Your Location Un-known please identify Your Location to Continue'))
      }
    }
    $scope.sendSMSInternet = function () {
      //MiscSrv.showLoading($rootScope.translateWord('Sending SMS Message'));
      //  HttpSrv.sendTwilioSms(getSmsMessage())
      //    .then(function () {
      //      MiscSrv.hideLoading();
      //      MiscSrv.showSendSmsMessageSuccess();
      //    }, function () {
      //      //TODO
      //      MiscSrv.hideLoading();
      //    })
      letUseCall();
    }
    function isvalidForm(form) {
      form.$valid = true;
      var arr = Object.getOwnPropertyNames(form);
      for (var i in arr) {
        var prob = arr[i];
        if (prob.charAt(0) == '$')
          continue;
        form.$valid = form[prob].$valid && form.$valid
      }

      return form.$valid;
    }
    $scope.SendManualLocation = function () {
      $scope.form.manual.$submitted = true;
      if (isvalidForm($scope.form.manual))
        $scope.sendSimSms();
      else {
        MiscSrv.showAlert($rootScope.translateWord('Please Fill Required Fields'))
      }
    }
    //=======================
    document.addEventListener("resume", AppResume, false);
    document.addEventListener("online", online, false);
    document.addEventListener("offline", offline, false);

    $scope.$on('$destroy', function () {
      document.removeEventListener("resume", AppResume, false);
      document.removeEventListener("resume", online, false);
      document.removeEventListener("resume", online, false);

    })


    $scope.clickMap = function (event) {
      event.target
    }
    //
  }
]);
