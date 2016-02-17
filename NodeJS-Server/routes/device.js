var NRFSwitch = require('../modules/nrf-switch');
var logger = require('winston');
var express = require('express');
var models = require('../models');

var router = express.Router();

module.exports = function (io) {
  router.get('/device', function (req, res) {
    logger.info('Getting devices statuses');

    models.Device.find({ active: true }, function (err, devices) {
      if (err)
        logger.info(err);

      logger.info('Sending: ' + devices);
      res.rest.success(devices);
    });
  });

  router.get('/device/:id', function (req, res) {
    logger.info("Getting device status: " + req.params.id);

    models.Device.findById(req.params.id, function (err, device) {
      if (err)
        logger.info(err);

      logger.info("Found device: " + device);

      res.rest.success(device);
    });
  });

  router.get('/device/:id/status', function (req, res) {
    logger.info("Getting device status: " + req.params.id);

    models.Device.findById(req.params.id, function (err, device) {
      if (err)
        logger.info(err);

      logger.info("Found device: " + device);

      var nrfSwitch = new NRFSwitch(device.rxPipe, device.txPipe);

      nrfSwitch.error(function (err) {
        if (!res.headersSent) {
          res.rest.badRequest(err);
        }
      });

      nrfSwitch.send('10', true, function (response) {
        if (!res.headersSent) {
          res.rest.success({ _id: req.params.id, status: response });
        }
      });
    });
  });

  router.post('/device/:id/status/:status', function (req, res) {
    logger.info('Setting device id: ' + req.params.id + ' status: ' + req.params.status);
    var statusToSend = req.params.status == 'true' ? '1' : '0';

    models.Device.findById(req.params.id, function (err, device) {
      if (err)
        logger.info(err);

      try {
        var nrfSwitch = new NRFSwitch(device.rxPipe, device.txPipe);

        nrfSwitch.error(function (err) {
          logger.error(err);
          if (!res.headersSent)
            res.rest.badRequest(err);
        });

        nrfSwitch.send('2' + statusToSend, true, function (response) {
          if (!res.headersSent) {
            io.emit('changed status', { _id: req.params.id, status: response })
            res.rest.success({ _id: req.params.id, status: response });
          }
        });
      } catch (err) {
        logger.error(err);
        if (!res.headersSent)
          res.rest.badRequest(err);
      }

    });
  });

  router.put('/device', function (req, res) {
    logger.info(req.body);

    var device = new models.Device();
    device.name = req.body.name;
    device.rxPipe = req.body.rxPipe;
    device.txPipe = req.body.txPipe;
    device.active = true;
    device.save(function (err) {
      if (err)
        logger.info(err);
      else
        logger.info('Saved: ' + device);

      res.rest.success();
    });
  });

  return router;
}