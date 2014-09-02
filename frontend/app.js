angular.module('AppointmentApp', ['ngMessages', 'ngAnimate', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: './form.html',
      controller: 'FormCtrl as form'
    });
    $routeProvider.when('/completed', {
      templateUrl: './completed.html',
    });
  }])

  .directive('usernameAvailableValidator', ['$http', function($http) {
    return {
      require : 'ngModel',
      link : function($scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.usernameAvailable = function(username) {
          return $http.get('/api/username-exists?u='+ username);
        };
      }
    }
  }])

  .directive('compareToValidator', function() {
    return {
      require : 'ngModel',
      link : function(scope, element, attrs, ngModel) {
        ngModel.$validators.compareTo = function(value) {
          var other = scope.$eval(attrs.compareToValidator);
          return !value || !other || value == other;
        }
      }
    }
  })
  
  .controller("FormCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
    this.data = {};
    this.data.reminders = [""];

    var self = this;
    this.submit = function(valid) {
      if(!valid) return;

      self.submitting = true;

      $http.post("/api/register", self.data).then(function() {
        self.data = [];
        self.submitting = false;
        $location.path('/completed');
      });
    };
  }])
