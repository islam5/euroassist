app.factory('langSrv', ["$rootScope",
  function ($rootScope) {


    function translateWord(word, lang) {
      var langObj = window.language[lang];
      if (!langObj || !langObj[word])
        return word;
      return langObj[word];
    }

    return {
		getLanguage: function () {
        return localStorage.getItem("language");
      },
		translateWord: translateWord
    }
  }
]);
