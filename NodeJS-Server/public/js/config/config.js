var homeAutomationApp = angular.module('homeautomation', ['angular-ladda', 'ui.router', 'angular-cron-jobs']);

homeAutomationApp.config(function (laddaProvider) {
  laddaProvider.setOption({
    style: 'expand-right'
  });
});

homeAutomationApp.factory('$notify', [function () {
    return {
        show: function (options) {
            new PNotify({
                title: options.title,
                text: options.text,
                type: options.type
            });
        }
    }
}]);

homeAutomationApp.factory('userService', ['$http',function ($http) {

    var userCached = { name: '', lastname: '' };

    return {
        logIn:function(user){
            return  $http.post('api/authenticate/', user);
        },
        logOut:function(){
            
        },
        getUser: function () {
            return userCached;
        },
        user:userCached,
        setUser: function (newUser) {
            userCached.name = newUser.name;
        }
    }
}]);

homeAutomationApp.factory('authService', ['$window', function($window) {
    
   var authData ={IsLoggedIn:false};
    
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    authData
  }
}]);

homeAutomationApp.factory('authInterceptor',['authService',function(authService){
    var myInterceptor = {
        request:function(config){
           config.headers['x-access-token'] = authService.get('HACToken');
           return config;
        }
    };
    
    return myInterceptor;
}]);

homeAutomationApp.config(['$httpProvider',function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
}]);