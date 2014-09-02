angular.module('reCAPTCHA', []).provider('reCAPTCHA', function() {
    var _publicKey = null,
        _options = {},
        self = this;

    this.setPublicKey = function(publicKey) {
        _publicKey = publicKey;
    };

    this.setOptions = function(options) {
        _options = options;
    };

    this._createScript = function($document, callback) {
        var scriptTag = $document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = '//www.google.com/recaptcha/api/js/recaptcha_ajax.js';
        scriptTag.onreadystatechange = function() {
            if (this.readyState == 'complete') {
                callback();
            }
        };
        scriptTag.onload = callback;
        var s = $document.getElementsByTagName('body')[0];
        s.appendChild(scriptTag);
    };

    this.$get = ['$q', '$rootScope', '$window', '$document', function($q, $rootScope, $window, $document) {
        var deferred = $q.defer();

        if (!$window.Recaptcha) {
            self._createScript($document[0], deferred.resolve);
        } else {
            deferred.resolve();
        }

        return {
            create: function(element, callback) {
                if (!_publicKey) {
                    throw new Error('Please provide your PublicKey via setPublicKey');
                }
                _options.callback = callback;

                deferred.promise.then(function() {
                    $window.Recaptcha.create(
                        _publicKey,
                        element,
                        _options
                    );
                });
            },
            response: function() {
                return $window.Recaptcha.get_response();
            },
            challenge: function() {
                return $window.Recaptcha.get_challenge();
            },
            reload: function() {
                return $window.Recaptcha.reload();
            },
            destroy: function() {
                $window.Recaptcha.destroy();
            }
        };
    }];

}).directive('reCaptcha', ['reCAPTCHA', '$compile', function(reCAPTCHA, $compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function(scope, element, attrs, controller) {
            var name = attrs.name || 'reCaptcha';
            scope.clear = function() {
                scope.ngModel = {
                    response: '',
                    challenge: false
                };
            };

            // Create reCAPTCHA
            reCAPTCHA.create(element[0], function() {

                // Reset on Start
                scope.clear();

                // watch if challenge changes
                scope.$watch(function() {
                    return reCAPTCHA.challenge();
                }, function (newValue) {
                    scope.ngModel.challenge = newValue;
                });

                // Attach model and click handler
                $compile(angular.element(document.querySelector('input#recaptcha_response_field')).attr('required', ''))(scope);
                $compile(angular.element(document.querySelector('input#recaptcha_response_field')).attr('ng-model', 'ngModel.response'))(scope);
                $compile(angular.element(document.querySelector('a#recaptcha_reload_btn')).attr('ng-click', 'clear()'))(scope);

            });

            // Destroy Element
            scope.$on('$destroy', reCAPTCHA.destroy);
        }
    };
}]);
