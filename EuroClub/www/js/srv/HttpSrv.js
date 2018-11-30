app.factory('HttpSrv', ["$rootScope", '$http', '$httpParamSerializerJQLike', "SettingSrv",
  function ($rootScope, $http, $httpParamSerializerJQLike, SettingSrv) {


    function sendTwilioSms(message) {

     var obj=angular.copy(SettingSrv.getTwilioOptions());
      obj.Body=message;

     return $http({
        url: 'https://api.twilio.com/2010-04-01/Accounts/'+SettingSrv.getTwilioSID()+'/Messages.json',
        method: 'POST',
        data: $httpParamSerializerJQLike(obj),
        timeout:15000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization':SettingSrv.getTwilioAuth()
        }
      })
    }

    function applyNumbers(obj){
      for(var prop in obj){

        var splits=prop.split('_');
        var key=splits[0];

        if(splits.length>1)
          key=splits[1];

        if(key.indexOf('annualFees')>-1 && !obj['overridefees'])
            continue;

        localStorage.setItem(key,obj[prop])
      }
    }
    function fetchphoneNumbers(){

      $http.get('http://applications.euro-assist.com/assets/js/phonenumbers.json')
        .then(function(resp){
          if(resp.data)
            applyNumbers(resp.data);
        })

    }
    return {

      sendTwilioSms:sendTwilioSms,
      fetchphoneNumbers:fetchphoneNumbers

    }
  }
]);
