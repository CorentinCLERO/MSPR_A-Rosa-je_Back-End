module.exports = app => {
  const usersSrv = require("../controller/controllerUsers.js");

  var router = require("express").Router();

  router.get("/users", usersSrv.find);

  app.use('/api/utilisateurs', router);
};