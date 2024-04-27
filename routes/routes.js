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

  //PLANTS ROUTES
  const controllerPlant = require("../controllers/controllerPlant");
  router.get("/plants/:userId", controllerPlant.getUserPlants);
  const parser = multer({ storage: storage });
  router.post("/plant", parser.single("photo"), controllerPlant.addPlant);
  router.delete("/plant/:plantId", controllerPlant.deletePlant);

  //REQUESTS ROUTES
  const controllerRequest = require("../controllers/controllerRequest");
  router.get("/requests/:userId", controllerRequest.getRequests);
  router.get("/requests", controllerRequest.getAllRequests);
  router.get("/request", controllerRequest.getRequest);
  router.post("/request", controllerRequest.postRequest);
  router.post("/request/:requestId", controllerRequest.RequestAccept);
  router.delete("/request/:requestId", controllerRequest.deleteRequest);
  router.post("/post/:requestId", controllerRequest.post);

  //HELP REQUESTS ROUTES
  const controllerHelpRequest = require("../controllers/controllerHelpRequest");
  router.get("/plantsos/:userId", controllerHelpRequest.getHelpRequests);
  router.get("/plantsos/:plantSosId", controllerHelpRequest.getHelpRequestInfo);
  router.post("/plantsos", controllerHelpRequest.postHelpRequest);
  router.post(
    "/plantsos/:plantSosId",
    controllerHelpRequest.postHelpRequestAnswer
  );

  //USER ROUTES
  const controllerUser = require("../controllers/controllerUser");
  router.post("/user", controllerUser.createUser);

  app.use("/api", router);
};
