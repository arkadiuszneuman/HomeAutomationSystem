homeAutomationApp.controller('scheduleCtrl', function ($scope, $http, $state, $stateParams) {
	$scope.schedules = [];

	var device = null;
	$http.get('api/device/' + $stateParams.id)
        .success(function (data) {
			device = data;
			if (device.schedule != null) {
				for (var i = 0; i < device.schedule.length; ++i) {
					if (device.schedule[i].status === true) {
						device.schedule[i].status = "true";
					} else {
						device.schedule[i].status = "false"
					}
				}
				$scope.schedules = device.schedule;
			}
        }).error(function (err) {
			console.log(err);
        }).finally(function () {

        });

	$scope.add = function () {
		var newSchedule = { active: true };
		$scope.schedules.push(newSchedule);
	}

	$scope.save = function (schedule) {
		schedule.saving = true;
		if (schedule._id == null) {
			$http.put('api/device/' + device._id + '/schedule', schedule)
				.success(function (data) {
					schedule.saving = false;
					schedule._id = data._id;
				}).error(function (err) {
					console.log(err);
				});
		} else {
			$http.post('api/device/' + device._id + '/schedule', schedule)
				.success(function (data) {
					schedule.saving = false;
					schedule._id = data._id;
				}).error(function (err) {
					console.log(err);
				});
		}
	}

	$scope.delete = function (schedule) {
		schedule.deleting = true;
		if (schedule._id != null) {
			$http.delete('api/device/' + device._id + '/schedule/' + schedule._id)
				.success(function () {
					schedule.deleting = false;
					schedule.active = false;
				}).error(function (err) {
					console.log(err);
				});
		} else {
			schedule.active = false;
		}
	}

	$scope.close = function () {
		$state.go('home.receivers');
	}
});