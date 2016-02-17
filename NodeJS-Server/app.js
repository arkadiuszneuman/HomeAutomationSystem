var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var restResponse = require('express-rest-response');
var logger = require('winston');
// var scheduler = require('./modules/scheduler');

//Auth part
var jwt = require('jsonwebtoken');
var config = require('./modules/authConfig');

//configure logger for mongo
require('winston-mongodb').MongoDB;
logger.add(logger.transports.MongoDB, {
  db: 'mongodb://localhost/homeautomationsystem'
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/homeautomationsystem', function(err) {
  if (err) 
    logger.error(err);
});

app.use(restResponse({
  showStatusCode: false,
  showDefaultMessage: false
}));


app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/bower_components'));

//serve main file
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/html/index.html');
});


//api
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  logger.info('Home Automation Server listening at http://%s:%s', host, port);
});

var io = require('socket.io')(server);
// var deviceRoutes = require('./routes/device')(io);
// // var scheduleRoutes = require('./routes/schedule');
var logRoutes = require('./routes/log');
var userRoutes = require('./routes/users')
var loginRoutes = require('./routes/login')




// app.use('/api', deviceRoutes);
// // app.use('/api', scheduleRoutes);
app.use('/api', logRoutes);
app.use('/api', userRoutes);
app.use('/api', loginRoutes);
// app.use('/', loginRoutes);

io.on('connection', function (socket) {
  logger.info('a user connected');
  socket.on('disconnect', function () {
    logger.info('user disconnected');
  });
});


process.on('uncaughtException', function (err) {
  logger.error(err);
  logger.info("Node NOT Exiting...");
});

// scheduler.start();
