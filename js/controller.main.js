var Website = angular.module('GitHubWebsite', ['ngAnimate']);

Website.constant('accountName', 'A----');

Website.controller(
  'MainController',
  function ($scope, $log, GitHub, accountName) {
    $scope.accountName = accountName;

    var GitHubAccount = GitHub.on(accountName);

    GitHubAccount
      .getUser()
      .then(function(user) {
        $scope.user = user;
      })
      .catch(function(err) {
        $log.log(err);
      });


    GitHubAccount
      .getRepositories()
      .then(function(repositories) {
        var forks = [],
            ownRepositories = [];

        angular.forEach(repositories, function(value) {
          if(value.fork) {
            forks.push(value);
          }
          else {
            ownRepositories.push(value);
          }
        });

        $scope.repositories = ownRepositories;
        $scope.forks = forks;
      })
      .catch(function(err) {
        $log.log(err);
      });
  }
);
