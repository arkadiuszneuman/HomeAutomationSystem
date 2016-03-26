var homeAutomationApp = angular.module('homeautomation', ['angular-ladda', 'ui.router', 'angular-cron-jobs']);

homeAutomationApp.config(function (laddaProvider) {
    laddaProvider.setOption({
        style: 'expand-right'
    });
});

homeAutomationApp.factory('notify', [function() {
    return {
        show: function(options) {
            new PNotify({
                title: options.title,
                text: options.text,
                type: options.type,
                icon: false,
                buttons: {
                    closer: false,
                    sticker: false
                }
            });
        }
    }
}]);


homeAutomationApp.factory('storageService', ['$window', function ($window) {

    var authData = { IsLoggedIn: false };

    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);

homeAutomationApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}]);

homeAutomationApp.directive('userModal', function() {
   return {
     restrict: 'A',
     link: function(scope, element, attr) {
       scope.dismissModal = function() {
           element.modal('hide');
       };
     }
   } 
});