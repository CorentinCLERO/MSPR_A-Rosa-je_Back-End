module.exports = app => {
  const usersSrv = require("../controller/controllerUsers.js");

  var router = require("express").Router();

  router.get("/", (req, res) => {
    res.send("Server running");
  });

  router.get("/users", usersSrv.find);

  app.use('/api', router);
};