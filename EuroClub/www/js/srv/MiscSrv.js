app.factory('MiscSrv', ["$rootScope", "$ionicLoading", '$ionicPopup', 'langSrv', "$q",
  function ($rootScope, $ionicLoading, $ionicPopup, langSrv, $q) {


    function showLoading(msg) {
      $ionicLoading.show({
        template: '<div class="loader" ng-click="hideLoading()">' +
          '<svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>' +
          '<span style="font-size: .6em;color: white;" ng-bind="$root.translateWord(\'' + msg + '\')"></span>' +
          '</div>'
      });
    }
    function showToImage(path) {
      $ionicLoading.show({
        template: '<div style="position: fixed; background: white; top: 0px; bottom: 0px; left: 0px;  right: 0px;">' +
          '<img src="' + path + '"' + 'width="100%"  height="100%" />'
          + '</div>'
      });
    }

    function hideLoading() {
      setTimeout(function () {
        $ionicLoading.hide();
      }, 500)
    }
    function hideToImage() {
      setTimeout(function () {
        $ionicLoading.hide();
      }, 500)
    }

    function showConfirmPopUp(title, template, ok, cancel) {

      var config = {
        template: '<p style="text-align: center">' + (template ? template : "") + '</p>',
        title: '<h3 >' + (title ? title : "") + '</h3>',
        buttons: [

          {
            text: '' + (ok ? ok : $rootScope.translateWord('Ok')) + '',
            type: 'button-raised button-assertive',
            onTap: function (e) {
              return true
            }
          },

          {
            text: '' + (cancel ? cancel : $rootScope.translateWord('Cancel')) + '',
            onTap: function (e) {

            }
          }

        ]
      }

      var confirmPopup = $ionicPopup.show(config);

      return confirmPopup;
    }

    function showUserTypePopUp(membercallback, visitorcallback) {
      var config = {
        template: '<p style="text-align: center;font-size: 1.03em;font-weight: 300;">' + $rootScope.translateWord('userProfileParag') + '</p>',
        title: '<h1 >' + $rootScope.translateWord('User Profile') + '</h1>',
        subTitle: '<h5 >' + $rootScope.translateWord('userProfileSubTitle') + '</h6>',
        cssClass: 'popup-vertical-buttons',
        buttons: [
          {
            text: $rootScope.translateWord('Continue As Member'),
            type: 'button-raised button-assertive',
            onTap: function (e) {
              if (membercallback instanceof Function)
                membercallback();
            }
          },
          {
            text: '' + $rootScope.translateWord('Continue As Visitor') + '',
            type: 'button-raised button-assertive',
            onTap: function (e) {
              if (visitorcallback instanceof Function)
                visitorcallback();
            }
          },

          {
            text: '' + $rootScope.translateWord('Cancel') + '',
            onTap: function (e) {

            }
          }

        ]
      }

      var popup = $ionicPopup.show(config);

      return popup;
    }

    function showSharePopUp(membercallback, visitorcallback) {
      var config = {
        template: '<p style="text-align: center;font-size: 1.03em;font-weight: 300;">' + $rootScope.translateWord('tellfriendspara') + '</p>',
        title: '<h1 >' + $rootScope.translateWord('Tell Your Friends') + '</h1>',
        cssClass: 'popup-vertical-buttons',
        buttons: [
          {
            text: $rootScope.translateWord('Ok'),
            type: 'button-raised button-assertive',
            onTap: function (e) {
              if (membercallback instanceof Function)
                membercallback();
            }
          },

          {
            text: '' + $rootScope.translateWord('Cancel') + '',
            onTap: function (e) {
              if (visitorcallback instanceof Function)
                visitorcallback();
            }
          }

        ]
      }

      var popup = $ionicPopup.show(config);

      return popup;
    }

    function showPopSMSSend($scope, withnotecallback, nonotecallback) {
      var config = {
        template: '<div class="list">' +
          '<label class="item item-input item-stacked-label">' +
          '<textarea style="resize: none;border-bottom: 1px solid #f1574b;padding: 6px;height: 60px" ng-model="other.notes" row="15" type="text" placeholder="{{$root.translateWord(\'Notes\')}}"></textarea>' +
          '</label>' +
          '</div>',
        title: '',
        subTitle: '',
        scope: $scope,
        cssClass: 'popup-vertical-buttons',
        buttons: [
          {
            text: $rootScope.translateWord('Send With Notes'),
            type: 'button-assertive',
            onTap: function (e) {
              if (withnotecallback instanceof Function)
                withnotecallback();
            }
          },
          {
            text: '' + $rootScope.translateWord('Send Without Notes') + '',
            onTap: function (e) {
              if (nonotecallback instanceof Function)
                nonotecallback();
            }
          }

        ]
      }

      var popup = $ionicPopup.show(config);

      return popup;
    }

    function showPopPhoneInput($scope, withnotecallback, nonotecallback) {
      var config = {
        template: '<div class="list">' +
          '<label class="item item-input item-stacked-label">' +
          '<input style=" border-bottom: 1px solid #f1574b;padding: 6px;height: 50px" ng-model="other.phoneNoTemp"  type="tel" placeholder="{{$root.translateWord(\'Phone Number\')}}">' +
          '<p style="color: red;text-align: center" ng-show="other.phoneNoError&&!other.phoneNoTemp" ng-bind="$root.translateWord(\'Enter Phone Number\')"></p>' +
          '</label>' +
          '</div>',
        title: '',
        subTitle: '',
        scope: $scope,
        cssClass: 'popup-vertical-buttons',
        buttons: [
          {
            text: $rootScope.translateWord('Next'),
            type: 'button-assertive',
            onTap: function (e) {
              if (!$scope.other.phoneNoTemp) {
                $scope.other.phoneNoError = true
                e.preventDefault();
                return;
              }
              $scope.other.phoneNoError = false;
              if (withnotecallback instanceof Function)
                withnotecallback();
            }
          },
          {
            text: '' + $rootScope.translateWord('Cancel') + '',
            onTap: function (e) {
              if (nonotecallback instanceof Function)
                nonotecallback();
            }
          }

        ]
      }

      var popup = $ionicPopup.show(config);

      return popup;
    }
    function showUserChooseMapManualPopUp(membercallback, visitorcallback) {
      var config = {
        template: '<p >' + $rootScope.translateWord('choosemapmanualloaction') + '</p>',
        title: '<h3 >' + $rootScope.translateWord('Failed To get Current Location') + '</h3>',
        cssClass: 'popup-vertical-buttons',
        buttons: [
          {
            text: '<b>' + $rootScope.translateWord('I Will use Map') + '</b>',
            type: 'button-raised button-assertive',
            onTap: function (e) {
              if (membercallback instanceof Function)
                membercallback();
            }
          },
          {
            text: '' + $rootScope.translateWord('Set Location Manual') + '',
            onTap: function (e) {
              if (visitorcallback instanceof Function)
                visitorcallback();
            }
          }

        ]
      }

      var popup = $ionicPopup.show(config);

      return popup;
    }

    function showAlert(title, template, ok) {

      var config = {
        template: '<p style="text-align: center">' + (template ? template : "") + '</p>',
        title: '<h3 >' + (title ? title : '') + '</h3>',
        buttons: [

          {
            text: '' + (ok ? ok : $rootScope.translateWord('Ok')) + '',
            type: 'button-raised button-assertive',
            onTap: function (e) {
              return true
            }
          }

        ]
      }

      var confirmPopup = $ionicPopup.show(config);

      return confirmPopup;
    }


    function showSendSmsMessageSuccess() {
      return showAlert($rootScope.translateWord("Sms Message"), $rootScope.translateWord("Sms Message Send Successfully"))
    }

    function showSendSmsRegMessageSuccess() {
      return showAlert($rootScope.translateWord("Registration Request"), $rootScope.translateWord("Sms Message Send Successfully"))
    }

    function showSendSIMSmsMessageError() {
      return showConfirmPopUp($rootScope.translateWord("Sms Message"), $rootScope.translateWord("smserrormsg"))
    }

    function showSendSIMSmsRegMessageError() {
      return showConfirmPopUp($rootScope.translateWord("Sms Message"), $rootScope.translateWord("Failed To Send Your Request"))
    }

    function showSendSIMSmsMessageError2() {
      return showConfirmPopUp($rootScope.translateWord("Registration Request"), $rootScope.translateWord("Failed To Send Your Request"))
    }

    function showOpenLocationSettingConfirm() {
      var confirm = showConfirmPopUp($rootScope.translateWord("Location Setting Is Disabled"),
        $rootScope.translateWord("Open Location Setting To Enable it"))
      return confirm;
    }

    function showSendSMSConfirm() {
      var confirm = showConfirmPopUp($rootScope.translateWord("Send Help SMS Message"),
        $rootScope.translateWord("Do you want Send SMS Help Request"))
      return confirm;
    }

    function showLocationAuthorizedDenyMessage() {
      var confirm = showConfirmPopUp($rootScope.translateWord("Location Authorized Failed"),
        $rootScope.translateWord("Please Allow Euro Assist Access your location"))
      return confirm;
    }
    function shareWithFriends() {
      var defer = $q.defer();

      var options = {
        message: langSrv.translateWord('ShareMsg', 'en_US') + '\n' + langSrv.translateWord('ShareMsg', 'ar_EG') + "\n", // not supported on some apps (Facebook, Instagram)
        subject: 'Euro Assist App', // fi. for email
        url: 'http://www.applications.euro-assist.com'
      }

      var onSuccess = function (result) {
        defer.resolve(result);
      }

      var onError = function (msg) {
        defer.reject(msg);
      }

      window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

      return defer.promise;
    }

    return {

      showLoading: showLoading,
      hideLoading: hideLoading,
      showConfirmPopUp: showConfirmPopUp,
      showAlert: showAlert,
      showOpenLocationSettingConfirm: showOpenLocationSettingConfirm,
      showSendSmsMessageSuccess: showSendSmsMessageSuccess,
      showSendSmsRegMessageSuccess: showSendSmsRegMessageSuccess,
      showUserTypePopUp: showUserTypePopUp,
      showSendSIMSmsMessageError: showSendSIMSmsMessageError,
      showSendSIMSmsRegMessageError: showSendSIMSmsRegMessageError,
      showLocationAuthorizedDenyMessage: showLocationAuthorizedDenyMessage,
      showSendSMSConfirm: showSendSMSConfirm,
      showUserChooseMapManualPopUp: showUserChooseMapManualPopUp,
      showPopSMSSend: showPopSMSSend,
      showPopPhoneInput: showPopPhoneInput,
      showSendSIMSmsMessageError2: showSendSIMSmsMessageError2,
      shareWithFriends: shareWithFriends,
      showToImage: showToImage,
      showSharePopUp: showSharePopUp,
      fixHeader: function (width) {
        setTimeout(function () {
          var doms = document.body.querySelectorAll(' ion-header-bar .title');
          for (var i = 0; i < doms.length; i++) {
            if (doms[i]) {
              doms[i].style.left = "30px";
              if (width)
                doms[i].style.width = width;
              else doms[i].style.width = "";

            }
          }
        }, 20)
      }
    }
  }
]);
