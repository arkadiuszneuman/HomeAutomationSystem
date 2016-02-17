homeAutomationApp.controller('logsCtrl', function($scope, $http, $state) {
    $http.get('api/log')
    .success(function(data) {
        $scope.logs = data;
    }).error(function(err) {
        console.log(err);
        $state.go('home.login');
    });
});