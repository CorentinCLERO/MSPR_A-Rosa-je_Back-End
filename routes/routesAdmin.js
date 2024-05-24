const router = require("express").Router();
const { authRole } = require("../middleware/authentifactionRole.js");

module.exports = (app) => {
  //USER ROUTES
  const controllerUser = require("../controllers/controllerUser.js");
  router.get("/users", authRole("admin"), controllerUser.getAllUser);
  router.post("/user", authRole("admin"), controllerUser.createUser);
  router.post("/login_admin", controllerUser.loginAdmin);
  router.post("/verify_admin_token", controllerUser.verifyAdminToken);
  router.patch("/user/:id", authRole("admin"), controllerUser.modifyUser);
  router.delete("/user/:id", authRole("admin"), controllerUser.deleteUser);
  router.get("/adminBearerToken", controllerUser.getAdminBearerToken);

  //DENYJWT ROUTES
  const controllerDenyJWT = require("../controllers/controllerDenyJWT.js");
  router.post("/denyjwt", controllerDenyJWT.addDenyjwt);

  app.use("/api/admin", router);
};