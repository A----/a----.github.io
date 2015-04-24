var Website = angular.module('GitHubWebsite');

Website.directive(
  'repository',
  function () {
    return {
      restrict: 'E',
      scope: {
        model: '='
      },
      replace: true,
      transclude: false,
      controller: function ($scope) {},
      templateUrl: 'templates/directive.repository.html'
    }
  }
);
