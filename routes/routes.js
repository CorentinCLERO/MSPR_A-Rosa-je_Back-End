module.exports = app => {
  const testSrv = require('../controller/controllerTest.js');

  const router = require('express').Router();

  router.get('/test', testSrv.find);

  app.use('/api', router);
};