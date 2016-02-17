var NRFSwitch = require('../modules/nrf-switch');
var logger = require('winston');
var express = require('express');
var models = require('../models');

var CronJob = require('cron').CronJob;

var jobs = [];

exports.start = function () {
      logger.info('Staring scheduler');
      models.Device.find({ active: true }, function (err, devices) {
            if (err)
                  logger.info(err);
            else {
                  devices.forEach(function (device) {
                        device.schedule.forEach(function (schedule) {
                              if (schedule.active) {
                                    logger.info('Starting job ' + schedule.name);
                                    var job = new CronJob(schedule.cron, function () {
                                          logger.info('Sending status ' + schedule.status + ' by scheduler');
                                          var nrfSwitch = new NRFSwitch(device.rxPipe, device.txPipe);

                                          nrfSwitch.error(function (err) {
                                                logger.error('Scheduler [' + schedule.name + ']  err: ' + err);
                                          });

                                          var statusToSend = schedule.status === true ? '1' : '0';
                                          nrfSwitch.send('2' + statusToSend, true, function (response) {
                                                logger.info('Scheduler [' + schedule.name + '] sent status');
                                          });
                                    }, null, true);

                                    jobs.push(job);
                              }
                        }, this);
                  }, this);

                  var job = new CronJob('*/10 * * * *', function () {
                        logger.info('Keeping nodejs up');
                  }, null, true);

                  jobs.push(job);
            }

      });
}

exports.stop = function () {
      logger.info('Stopping scheduler');
      jobs.forEach(function (job) {
            job.stop();
      }, this);
}

exports.restart = function () {
      exports.stop();
      exports.start();
}