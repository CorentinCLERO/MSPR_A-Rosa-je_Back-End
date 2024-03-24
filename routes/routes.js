const multer = require("multer");
const router = require("express").Router();
const cloudinary = require("../config/configCloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "msprb3cda",
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "msprb3cda",
  },
});

module.exports = (app) => {
  const testSrv = require("../controllers/controllerTest.js");
  router.get("/test", testSrv.find);

  const controllerPlant = require("../controllers/controllerPlant");
  router.get("/plants/:userId", controllerPlant.getUserPlants);
  const parser = multer({ storage: storage });
  router.post("/plant", parser.single("photo"), controllerPlant.addPlant);
  router.delete("/plant/:plantId", controllerPlant.deletePlant);

  const controllerRequest = require("../controllers/controllerRequest");
  router.get("/requests/:userId", controllerRequest.getRequests);
  router.get("/request", controllerRequest.getRequest);

  const controllerHelpRequest = require("../controllers/controllerHelpRequest");
  router.get("/helpRequests/:userId", controllerHelpRequest.getHelpRequests);

  const controllerUser = require("../controllers/controllerUser");
  router.post("/user", controllerUser.createUser);

  app.use("/api", router);
};
