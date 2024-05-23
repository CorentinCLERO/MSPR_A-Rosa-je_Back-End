const router = require("express").Router();

module.exports = (app) => {
  //USER ROUTES
  const controllerUser = require("../controllers/controllerUser.js");
  router.post("/login_user", controllerUser.loginUser);
  router.post("/verify_token", controllerUser.verifyToken);

  app.use("/api", router);
};
