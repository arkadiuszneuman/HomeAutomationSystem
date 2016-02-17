/* global PNotify */
homeAutomationApp.controller('loginCtrl', function ($scope, $http, $state, $notify,userService,authService) {
    $scope.user = { name: '', password: '' };


    $scope.loginUser = function () {
            userService.logIn($scope.user)
            .success(function (data) {
                console.log(data);

                if (data.success == true) {

                    authService.set('HACToken',data.token);
                    authService.IsLoggedIn = true
                    
                    userService.setUser($scope.user);
                    
                    $notify.show({
                        title: 'Welcome in Home Automation System',
                        text: 'piczi',
                        type: 'success'
                    });
                   
                    $state.go('home.logs');
                } else {
                    
                    $notify.show({
                        title: 'Login failed',
                        text: data.message,
                        type: 'error'
                    });
                }

            }).error(function (err) {
                console.log(err);
            });
    };
});


            //    $http.post('api/authenticate/', $scope.user)
