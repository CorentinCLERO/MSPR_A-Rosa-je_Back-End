const multer = require("multer");
const router = require("express").Router();
const cloudinary = require("../config/configCloudinary.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { authRole } = require("../middleware/authentifactionRole.js");

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
  router.get("/test", testSrv.find); // for testing app in deploiement

  //PLANTS ROUTES
  const controllerPlant = require("../controllers/controllerPlant.js");
  router.get("/plants/:userId", authRole("owner"), controllerPlant.getUserPlants);
  const parser = multer({ storage: storage });
  router.post("/plant", authRole("owner"), parser.single("photo"), controllerPlant.addPlant);
  router.delete("/plant/:plantId", authRole("owner"), controllerPlant.deletePlant);

  //REQUESTS ROUTES
  const controllerRequest = require("../controllers/controllerRequest.js");
  router.get("/requests/:userId", authRole("owner"), controllerRequest.getRequests);
  router.get("/requests", authRole("keeper"), controllerRequest.getAllRequests);
  // router.get("/request", controllerRequest.getRequest);
  router.post("/request", authRole("owner"), controllerRequest.postRequest);
  // router.post("/request/:requestId", controllerRequest.RequestAccept);
  router.delete("/request/:requestId", authRole("owner"), controllerRequest.deleteRequest);
  // router.post("/post/:requestId", controllerRequest.post);

  //HELP REQUESTS ROUTES
  const controllerHelpRequest = require("../controllers/controllerHelpRequest.js");
  router.get("/plantsos/:userId", authRole("keeper"), controllerHelpRequest.getHelpRequests);
  router.get("/plantsos", controllerHelpRequest.getAllHelpRequests);
  // router.get("/plantsos/:plantSosId", controllerHelpRequest.getHelpRequestInfo);
  router.post("/plantsos", authRole("keeper"), controllerHelpRequest.postHelpRequest); ///
  // router.post("/plantsos/:plantSosId", controllerHelpRequest.postHelpRequestAnswer);

  //USER ROUTES
  const controllerUser = require("../controllers/controllerUser.js");
  // router.post("/user", controllerUser.createUser);
  // router.post("/login_user", controllerUser.loginUser);
  // router.post("/verify_token", controllerUser.verifyToken);
  router.patch("/user/:id", authRole("owner"), controllerUser.modifyUser);
  router.delete("/user/:id", authRole("owner"), controllerUser.deleteUser);
  // router.get("/adminBearerToken", controllerUser.getAdminBearerToken);

  //ADRESS ROUTES
  const controllerAdress = require("../controllers/controllerAdress.js");
  router.get("/adresses/:userId", authRole("owner"), controllerAdress.getAdresses);
  router.post("/adresse/:userId", authRole("owner"), controllerAdress.addAddress);
  router.delete("/adresse/:addressId", authRole("owner"), controllerAdress.deleteAddress);

  //DENYJWT ROUTES
  const controllerDenyJWT = require("../controllers/controllerDenyJWT.js");
  router.post("/denyjwt", authRole("owner"), controllerDenyJWT.addDenyjwt);

  app.use("/api/mobile", router);
};
