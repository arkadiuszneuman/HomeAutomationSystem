homeAutomationApp.controller('loginCtrl', function ($scope, $http, $state, notify, authService) {

    $scope.loginCredentials = { email: '', password: '' };

    $scope.loginUser = function (isValid) {

        if (isValid) {
            authService.Login($scope.loginCredentials, function (loginResult) {

                if (loginResult.success) {
                    notify.show({
                        title: 'Welcome in Home Automation System',
                        text: 'login success',
                        type: 'success'
                    });

                    $state.go('home.logs');

                } else {
                    notify.show({
                        title: 'Login failed',
                        text: loginResult.message,
                        type: 'error'
                    });
                }
            });
        }
    };
});