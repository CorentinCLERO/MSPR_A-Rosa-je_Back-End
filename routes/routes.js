module.exports = app => {
  const router = require("express").Router();
  
  const testSrv = require("../controllers/controllerTest.js");
  router.get("/test", testSrv.find);
  
  const controllerPlant = require("../controllers/controllerPlant");
  router.get("/plants/:userId", controllerPlant.getPlants);
  router.post("/plant", controllerPlant.addPlant);

  
  const controllerRequest = require("../controllers/controllerRequest");
  router.get("/requests", controllerRequest.getRequests);

    
  const controllerHelpRequest = require("../controllers/controllerHelpRequest");
  router.get("/helpRequests/:userId", controllerHelpRequest.getHelpRequests);
  
  const controllerUser = require("../controllers/controllerUser");
  router.post("/user", controllerUser.createUser);
  
  app.use("/api", router);
};