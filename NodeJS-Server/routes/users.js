var logger = require('winston');
var express = require('express');
var models = require('../models');
var router = express.Router();
var User = require('../models/user');

router.get('/user', function(req, res) {
    logger.info('Getting users list');
    
    User.find({},function(err,users){
        if (err) logger.info(err);
        
        res.json(users);
    });
});

// #debugger
// router.get('/user/create',function(req,res){
//     var newUser = new User({
//         name:'Norek',
//         password:'a',
//         admin:true
//     });
//     
//     newUser.save(function(err){
//          if (err) logger.info(err);
//          
//          logger.info('User saved');
//          
//          res.json({success:true});
//     });
// });

module.exports = router;