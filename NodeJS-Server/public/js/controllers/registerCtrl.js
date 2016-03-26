homeAutomationApp.controller('registerCtrl', function ($scope, $http, $state, notify, userService) {

    function createNewUser(){
        return {firstName:"",lastName:"",admin:false,email:"",password:""};
    }

    $scope.user = createNewUser();

    $scope.createUser = function (isValid,user) {
        if (isValid) {
            userService.Create(user, function (result) {

                if (result.success) {
                    notify.show({
                        title: 'Registration success',
                        text: 'Registration success',
                        type: 'success'
                    });

                    $state.go('home.login');

                } else {
                    notify.show({
                        title: 'Registration failed',
                        text: result.message,
                        type: 'error'
                    });
                }
            });
        }
    };
});


