var logger = require('winston');
var express = require('express');
var models = require('../models');
var router = express.Router();
var User = require('../models/user');
//Auth part
var jwt = require('jsonwebtoken');
var config = require('../modules/authConfig');

module.exports = function isAuth(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to auth token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({ success: false, message: 'No token provided' });
    }
};


router.post('/authenticate',function(req,res){
    
    logger.log("auth started");
    
    User.findOne({
        name:req.body.name
    },function(err,user){
        if (err) logger.info(err);
        
        if (!user) {
            res.json({success:false,message:"Auth failed, user not in DB"});
        }else if(user){
            
            if (user.password != req.body.password) {
                res.json({success:false,message:"Password failed"});
            }else{
                
                logger.info(config.secret);
                var token = jwt.sign(user,config.secret,{
                    expiresIn:1440
                });
                
                
                logger.info('User ' + user.name + ' has logged in');
                
                res.json({
                    success:true,
                    message:'Cool login complete',
                    token:token
                });
            }
        }    
    });
    
});

router.get('/login', function (req, res) {
  res.sendFile(__dirname + '/public/html/partials/pages/Login/login.html');
});



// 
// router.use(function(req,res,next){
//    
//    var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     
//     if (token) {
//         
//         jwt.verify(token,config.secret,function(err,decoded){
//            if(err){
//                    return res.json({success:false,message:'Failed to auth token'});       
//            }else{
//                req.decoded = decoded;
//                next();
//            }
//         });
//     }else{
//         return res.status(403).send({success:false,message:'No token provided'});
//     }
// });

router.get('/authtest',function(req,res){
    res.json({succcess:true,message:'testing auth'});
});

module.exports = router;