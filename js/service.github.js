var Website = angular.module('GitHubWebsite');

Website.factory('GitHub', function($q) {
  var GitHub = function(accountName) {
    this.accountName = accountName;
    this.userRequest = null;
  };

  GitHub.prototype.getUser = function() {
    var deferred = $q.defer();

    if(!this.user) {
      this.userRequest = new Gh3.User(this.accountName);
      this.userRequest.fetch(angular.bind(this, function(err, user) {
          if(err) {
            deferred.reject(err);
          }
          else {
            this.user = user;
            deferred.resolve(this.user);
          }
        }));
    }
    else {
      deferred.resolve(this.user);
    }

    return deferred.promise;
  };


  GitHub.prototype.getRepositories = function() {
    var deferred = $q.defer();

    if(!this.userRequest) {
      this.getUser();
    }

    if(!this.repositories) {
      var repositoriesRequest = new Gh3.Repositories(this.userRequest);
      repositoriesRequest.fetch(
        {
          type: 'public',
          sort: 'full_name',
          direction: 'asc',
          page: 1,
          per_page: 500
        },
        "first",
        angular.bind(this, function (err, response) {
          if(err) {
            deferred.reject(err);
          }
          else {
            this.repository = {}

            var requestPromises = {};
            response.eachRepository(angular.bind(this, function(repository) {
              var request,
                  requestPromise;

              repositoryName = repository.name;

              requestPromise = $q.defer();
              request = new Gh3.Repository(repository.name, this.userRequest);
              request.fetch(function(err, repository) {
                if(err) {
                  requestPromise.reject(err);
                }
                else {
                  requestPromise.resolve(repository);
                }
              });
              requestPromises[repository.name] = requestPromise.promise;
            }));


            $q
              .all(requestPromises)
              .then(angular.bind(this, function(repositories) {
                deferred.resolve(repositories);
              }))
              .catch(function(err) {
                deferred.reject(err);
              });
          }
        }));
    }
    else {
      deferred.resolve(this.repositories);
    }

    return deferred.promise;
  };

  var flyweight = {};

  return {
    on: function(accountName) {
      if(!flyweight[accountName]) {
        flyweight[accountName] = new GitHub(accountName);
      }

      return flyweight[accountName];
    }
  };
});
