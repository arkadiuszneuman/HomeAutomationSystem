var logger = require('winston');
var express = require('express');
var models = require('../models');
var loginProvider = require('./login.js');
var router = express.Router();
    
    
var jwt = require('jsonwebtoken');
var config = require('../modules/authConfig');

function isAuth(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // 
    if (token) {

        console.log(config.secret);
        console.log(token);
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: 'Failed to auth token' });
            } else {
                next();
            }
        });
    } else {
        return res.status(403).send({ success: false, message: 'No token provided' });
    }
};


router.get('/log', isAuth ,function(req, res) {
    logger.info('Getting logs list');
    models.Log.find(null, null, { sort: '-_id', skip: 0, limit: 50 }, function(err, logs) {
        if (err) logger.info(err);

        var returningLogs = [];
        for (var i = 0; i < logs.length; i++) {
        	returningLogs.push({
        		timestamp: new Date(logs[i].timestamp),
        		message: logs[i].message,
        		level: logs[i].level
        	});
        	
        };

        res.rest.success(returningLogs);
    });
});

module.exports = router;