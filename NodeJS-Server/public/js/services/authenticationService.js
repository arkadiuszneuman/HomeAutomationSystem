
homeAutomationApp.factory('authService', ['$http', 'storageService', 'userService', function ($http, storageService, userService) {

    return {
        Login: function (user, callback) {
            return $http.post('api/authenticate', user)
                .success(function (result) {

                    if (result.success) {
                        storageService.set('id', result.user._id);
                        storageService.set('email', result.user.email);
                        storageService.set('firstName', result.user.firstName);
                        storageService.set('lastName', result.user.lastName);
                        storageService.set('HACToken', result.token);

                        userService.setUser(result.user);
                        callback({ success: result.success, message: result.message });
                    }
                })
                .error(function (err) {

                    callback({ success: err.success, message: err.message });
                });
        },
        Logout: function (callback) {
            storageService.set('id', '');
            storageService.set('email', '');
            storageService.set('firstName', '');
            storageService.set('lastName', '');
            storageService.set('HACToken', '');

            userService.setUser({});

            callback({ success: true });
        }
    }
}]);

homeAutomationApp.factory('authInterceptor', ['$q','$injector', 'storageService', function ($q,$injector, storageService) {
    var myInterceptor = {
        request: function (config) {
            config.headers['x-access-token'] = storageService.get('HACToken');
            return config;
        },
        responseError: function (response) {
            
            if (response.status == 401) {
                console.log(response.status);
                $injector.get('$state').transitionTo('home.login');
            }
            
            return $q.reject(response);
        }
    };

    return myInterceptor;
}]);
