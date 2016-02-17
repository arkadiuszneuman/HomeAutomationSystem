var logger = require('winston');
var express = require('express');
var models = require('../models');
var scheduler = require('../modules/scheduler');
var mongoose = require('mongoose');

var router = express.Router();

 
//   router.post('/device/:id/:status', function (req, res) {
//     logger.info('Setting device id: ' + req.params.id + ' status: ' + req.params.status);
//     var statusToSend = req.params.status == 'true' ? '1' : '0';
// 
//     models.Device.findById(req.params.id, function (err, device) {
//       if (err)
//         logger.info(err);
// 
//       try {
//         var nrfSwitch = new NRFSwitch(device.rxPipe, device.txPipe);
// 
//         nrfSwitch.error(function (err) {
//           logger.error(err);
//           if (!res.headersSent)
//             res.rest.badRequest(err);
//         });
// 
//         nrfSwitch.send('2' + statusToSend, true, function (response) {
//           if (!res.headersSent) {
//             io.emit('changed status', { _id: req.params.id, status: response })
//             res.rest.success({ _id: req.params.id, status: response });
//           }
//         });
//       } catch (err) {
//         logger.error(err);
//         if (!res.headersSent)
//           res.rest.badRequest(err);
//       }
// 
//     });
//   });

router.put('/device/:id/schedule', function (req, res) {
  logger.info('Saving schedule ' + req.body);

  var scheduleToAdd = req.body;
  scheduleToAdd.active = true;
  scheduleToAdd._id = mongoose.Types.ObjectId();
  logger.info(scheduleToAdd);

  models.Device.findById(req.params.id, function (err, device) {
    if (err)
      logger.info(err);

    device.schedule.push(scheduleToAdd);
    device.save(function (err) {
      if (err)
        logger.info(err);
      else
        logger.info('Saved: ' + device);

      scheduler.restart();

      logger.info('Returning: ' + device.schedule[device.schedule.length - 1]._id);
      res.rest.success({ _id: device.schedule[device.schedule.length - 1]._id });
    });
  });
});

router.post('/device/:id/schedule', function (req, res) {
  logger.info('Saving schedule ' + req.body);

  var scheduleToAdd = req.body;
   models.Device.update({ _id: req.params.id, 'schedule._id': req.body._id }, 
   { '$set': 
      { 'schedule.$.name': req.body.name,
       'schedule.$.desc': req.body.desc,
       'schedule.$.cron': req.body.cron,
       'schedule.$.status': req.body.status
       } 
   }, function (err) {
    if (err)
      logger.info(err);
    else {
      res.rest.success();
      scheduler.restart();
    }
  });
});

router.delete('/device/:id/schedule/:scheduleId', function (req, res) {
  logger.info("Delete device: " + req.params.id + ", scheduleID: " + req.params.scheduleId);
  var txt = 'schedule.' + req.params.scheduleId + '.active';
  models.Device.update({ _id: req.params.id, 'schedule._id': req.params.scheduleId }, { '$set': { 'schedule.$.active': false } }, function (err) {
    if (err)
      logger.info(err);
    else
      res.rest.success();
  });
});

module.exports = router;
