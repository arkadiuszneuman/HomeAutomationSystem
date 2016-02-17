
homeAutomationApp.controller('mainCtrl', function ($scope, $http, $state,userService) {
  var socket = io();

  $scope.sessionService = userService;
  
  socket.on('changed status', function (changedDevice) {
    for (var i = 0; i < $scope.devices.length; i++) {
      if ($scope.devices[i]._id === changedDevice._id) {
        $scope.devices[i].status = changedDevice.status;
        $scope.$apply();
      }
    }
  });

  var currentDeviceStatus = 0;
  var getNextDeviceStatus = function () {
    if (currentDeviceStatus < $scope.devices.length) {
      var device = $scope.devices[currentDeviceStatus];
      $http.get('api/device/' + device._id + '/status')
        .success(function (data) {
          device.status = data.status;
          device.connectionError = false;
        }).error(function (err) {
          device.connectionError = true;
          console.log(err);
        }).finally(function () {
          device.isRefreshing = false;
          ++currentDeviceStatus;
          getNextDeviceStatus();
        });
    }

  }

  $http.get('api/device')
    .success(function (data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].isRefreshing = true;
      }

      $scope.devices = data;
    })
    .then(function () {
      getNextDeviceStatus();
    });

  $scope.changeStatus = function (device) {
    device.changingStatus = true;
    var stat = !device.status
    $http.post('api/device/' + device._id + '/status/' + stat)
      .success(function (data) {
        device.status = data.status;
      })
      .error(function (err) {
        console.log(err);
      })
      .finally(function () {
        device.changingStatus = false;
      });
  }

  $scope.refresh = function (device) {
    device.reconnecting = true;
    $http.get('api/device/' + device._id + '/status')
      .success(function (data) {
        device.status = data.status;
        device.connectionError = false;
      }).error(function (err) {
        device.connectionError = true;
        console.log(err);
      }).finally(function () {
        device.reconnecting = false;
      });
  }

  $scope.add = function () {
    $state.go('home.receivers.add');
  }

  $scope.schedule = function (device) {
    $state.go('home.receivers.schedule', { id: device._id });
  }
});