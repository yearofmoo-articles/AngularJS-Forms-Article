angular.module('AppointmentApp', ['ngMessages', 'ngAnimate', 'ngRoute', 'reCAPTCHA'])

  .constant('RECAPTCHA', (function() { return !/localhost:/.test(window.location) })())

  .run(['$rootScope', 'RECAPTCHA', function($rootScope, RECAPTCHA) {
    $rootScope.showRecaptcha = RECAPTCHA;
  }])

  .config(['$routeProvider', 'reCAPTCHAProvider', 'RECAPTCHA',
   function($routeProvider,   reCAPTCHAProvider,   RECAPTCHA) {
    $routeProvider.when('/', {
      templateUrl: './form.html',
      controller: 'FormCtrl as form'
    });
    $routeProvider.when('/completed', {
      templateUrl: './completed.html',
    });
    
    if (RECAPTCHA) {
      reCAPTCHAProvider.setPublicKey('6LcnjvkSAAAAAN5bea5NRK87pI0UuoetbOZDvyEb');
      reCAPTCHAProvider.setOptions({
          theme: 'clean'
      });
    }
  }])

  .directive('passwordCharactersValidator', function() {

    var REQUIRED_PATTERNS = [
      /\d+/,    //numeric values
      /[a-z]+/, //lowercase values
      /[A-Z]+/, //uppercase values
      /\W+/,    //special characters
      /^\S+$/   //no whitespace allowed
    ];

    return {
      require : 'ngModel',
      link : function($scope, element, attrs, ngModel) {
        ngModel.$validators.passwordCharacters = function(value) {
          var status = true;
          angular.forEach(REQUIRED_PATTERNS, function(pattern) {
            status = status && pattern.test(value);
            console.log(status, pattern);
          });
          return status;
        }; 
      }
    }
  })

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
        scope.$watch(attrs.compareToValidator, function() {
          ngModel.$validate();
        });
        ngModel.$validators.compareTo = function(value) {
          var other = scope.$eval(attrs.compareToValidator);
          return !value || !other || value == other;
        }
      }
    }
  })
  
  .controller("FormCtrl", ["$scope", "$http", "$location", "RECAPTCHA", function($scope, $http, $location, RECAPTCHA) {
    this.data = {};
    this.data.emails = [""];

    var self = this;
    this.submit = function(valid) {
      if(!valid) return;

      self.submitting = true;

      //we don't if it's valid yet, but the reject will handle this
      self.captchaError = false;

      $http.post("/api/register", self.data).then(function() {
        self.data = [];
        $location.path('/completed');
      }, function(response) {
        self.submitting = false;
        self.captchaError = response.data && /incorrect captcha/.test(response.data.status);
      });
    };
  }])
