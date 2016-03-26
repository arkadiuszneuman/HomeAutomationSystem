homeAutomationApp.run(function ($rootScope, $location, $state) {
    $rootScope.$on('$viewContentLoaded', function () {
        initjQuery();
    });
});

homeAutomationApp.config(function ($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.when("", "/receivers");
    $urlRouterProvider.when("/", "/receivers");
    $urlRouterProvider.otherwise("/receivers");
    
    $stateProvider
    .state('home', {
        url: "",
        templateUrl: "html/index.html",
        abstract: true,
        views: {
            'menu': {
                templateUrl: 'html/partials/menu.html',
                controller: 'mainCtrl'
            },
            'content': {
                templateUrl: 'html/partials/content.html',
                controller: 'mainCtrl'
            },
        }
    })

    .state('home.receivers', {
        url: "/receivers",
        views: {
            'main@': {
                templateUrl: 'html/partials/pages/receivers/receivers.html',
                controller: 'mainCtrl'
            },
        }
    })
    .state('home.receivers.add', {
        url: "/add",
        views: {
            'main@': {
                templateUrl: 'html/partials/pages/receivers/addDevice.html',
                controller: 'addDeviceCtrl'
            },
        }
    })
    .state('home.receivers.schedule', {
        url: "/:id/schedule",
        views: {
            'main@': {
                templateUrl: 'html/partials/pages/receivers/schedule.html',
                controller: 'scheduleCtrl'
            },
        }
    })
      .state('home.receivers.schedule.timeofday', {
        url: '',
        templateUrl: 'html/partials/pages/receivers/scheduletypes/timeofday.html'
    })
      .state('home.receivers.schedule.sun', {
        url: '',
        templateUrl: 'html/partials/pages/receivers/scheduletypes/sun.html'
    })
    
    .state('home.logs', {
        url: "/logs",
        views: {
            'main@': {
                templateUrl: 'html/partials/pages/logs/logs.html',
                controller: 'logsCtrl'
            },
        }
    })
    .state('login', {
        url: "/login",
        views: {
            'main@': {
                templateUrl: 'html/Login/login.html',
                controller: 'loginCtrl'
            },
        }
    })
    .state('home.register', {
        url: "/register",
        views: {
            'main@': {
                templateUrl: 'html/Login/register.html',
                controller: 'registerCtrl'
            },
        }
    })
    .state('home.profile', {
        url: "/profile",
        views: {
            'main@': {
                templateUrl: 'html/partials/pages/profile/profile.html',
                controller: 'profileCtrl'
            },
        }
    })
    .state('home.users', {
        url: "/users",
        views: {
            'main@': {
                templateUrl: 'html/partials/pages/user/usersManagerment.html',
                controller: 'usersManagermentCtrl'
            },
        }
    })
    ;
});