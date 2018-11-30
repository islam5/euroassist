app.factory('SettingSrv', ["$rootScope",
  function ($rootScope) {

    var SID = 'AC039229e602ca2c4f0f9c8d3358045801';
    var token = '760e6a90c14da8a544c9a6e5a2f5e2d3';
    var From = '+14153478869';
    var To = '+201019514557';

    //TODO
    var phone = localStorage.getItem("phone");

    if (!phone)
      localStorage.setItem('phone', To);

    phone = localStorage.getItem("twiliophone");

    if (!phone)
      localStorage.setItem('twiliophone', To);
    //=============

    function getTwilioTo() {
      var to = localStorage.getItem('twiliophone');
      if (!to)
        return To;

      return to;
    }

    function getTwilioFrom() {
      var to = localStorage.getItem('twiliofrom');
      if (!to)
        return To;

      return to;
    }
    function getTwilioSID() {
      var twiliosid = localStorage.getItem('twiliosid');

      return twiliosid;
    }

    function getTwilioToken() {
      var token = localStorage.getItem('twiliotoken');

      return token;
    }


    return {


      getTwilioAuth: function () {
        return "Basic " + btoa(getTwilioSID() + ':' + getTwilioToken())
      },


      getTwilioSID:getTwilioSID,

      getTwilioToken: getTwilioToken,


      getTwilioOptions: function () {
        var req = {
          Format: 'json',
          AccountSid: getTwilioSID(),
          To: getTwilioTo(),
          From: getTwilioFrom(),
          Body: '',
          Method: 'post'
        }

        return req;
      },


      getMainPhone:function(){
        return To;
      }

    }
  }

])
;
