homeAutomationApp.factory('userService', ['$http', 'storageService', function ($http, storageService) {

    function handleError(msg, err) {
        return function () { return { success: false, message: msg, error: err } };
    };

    var currentUser = { firstName: '',lastName: '',isLoaded:false };

    return {
        user: function () {

            if (!currentUser.isLoaded) {
                currentUser.firstName = storageService.get('firstName');
                currentUser.lastName = storageService.get('lastName');
                currentUser.isLoaded = true;
            }

            return currentUser;
        },

        setUser: function (_user) {
            currentUser.firstName = _user.firstName;
            currentUser.lastName = _user.lastName;
            currentUser.isLoaded = true;
        },
        GetAll: function (callback) {
            return $http.get('api/users/').success(function (users) {
                callback(users);
            })
                .error(handleError('Get all users'));
        },
        GetById: function (id) {
            return $http.get('api/users/' + id).success(function (user) {
                return user;
            })
                .error(handleError('Get user by id'));
        },
        Remove: function (id,callback) {
            return $http.delete('api/users/' + id).success(function (result) {
                callback(result);
            })
                .error(handleError('delete user'));
        },
        Update: function (user,callback) {
            return $http.post('api/users', user).success(function (result) {
                callback(result);
            })
                .error(handleError('Updating user'));
        },
        Create: function (user,callback) {
            return $http.put('api/users', user).success(function (result) {
                callback(result);
            })
                .error(handleError('Createing user'));
        }
    };
}]);
