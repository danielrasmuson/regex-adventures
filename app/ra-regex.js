angular.module('app')
.directive('raRegex', function(LevelService, ProblemService) {
  return {
    restrict: 'E',
    templateUrl: 'views/regex.tpl.html',
    transclude: true,
    scope: {
      templateName: '@',
      textboxPlaceholder: '@',
      elmId: '@'
    },

    link: function(scope, element, attrs) {
      scope.nextPage = function () {
        ProblemService.nextProblem();
      };

      var validRegex = function(regex) {
        var valid;
        try {
          new RegExp(regex);
          valid = true;
        } catch (e) {
          valid = false;
        }
        return valid;
      };

      scope.regex = "";
      scope.matches = [];
      scope.won = false;

      var getMessage = function(){
        return ProblemService.getMessage(scope.regex);
      };


      scope.nextLevelAlert = function(){
         swal({
           title: "Level Complete!",
            text: getMessage(),
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#5ED251",
            confirmButtonText: "Next Level",
            closeOnConfirm: true
          }, function(){
            console.log('hello');
            scope.nextPage();
         });
      };

      scope.runMatches = function () {
        var elm = $("#" + scope.elmId);
        var sourceText = elm.text();
        elm.highlightRegex();

        if (scope.regex !== "" && validRegex(scope.regex)) {
          var re = new RegExp(scope.regex, "g");
          scope.matches = sourceText.match(re);
          elm.highlightRegex(re);

        } else if (scope.regex == "") {
          scope.matches = [];

          elm.highlightRegex();
        }

        if (LevelService.hasWon(ProblemService.getLevel(), scope.matches)) {
          scope.won = true;
          scope.nextLevelAlert();
        }
      };
    }
  };
});
