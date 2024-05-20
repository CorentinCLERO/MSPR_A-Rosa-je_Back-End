const multer = require("multer");
const router = require("express").Router();
const cloudinary = require("../config/configCloudinary");
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
  router.get("/test", testSrv.find);

  //PLANTS ROUTES
  const controllerPlant = require("../controllers/controllerPlant");
  router.get("/plants/:userId", authRole("owner"), controllerPlant.getUserPlants);
  const parser = multer({ storage: storage });
  router.post("/plant", parser.single("photo"), controllerPlant.addPlant);
  router.delete("/plant/:plantId", controllerPlant.deletePlant);

  //REQUESTS ROUTES
  const controllerRequest = require("../controllers/controllerRequest");
  router.get("/requests/:userId", authRole("owner"), controllerRequest.getRequests);
  router.get("/requests", authRole("keeper"), controllerRequest.getAllRequests);
  router.get("/request", controllerRequest.getRequest); ////////
  router.post("/request", controllerRequest.postRequest);
  router.post("/request/:requestId", controllerRequest.RequestAccept);
  router.delete("/request/:requestId", controllerRequest.deleteRequest);
  router.post("/post/:requestId", controllerRequest.post);

  //HELP REQUESTS ROUTES
  const controllerHelpRequest = require("../controllers/controllerHelpRequest");
  router.get("/plantsos/:userId", controllerHelpRequest.getHelpRequests);
  router.get("/plantsos", controllerHelpRequest.getAllHelpRequests);
  router.get("/plantsos/:plantSosId", controllerHelpRequest.getHelpRequestInfo);
  router.post("/plantsos", controllerHelpRequest.postHelpRequest);
  router.post(
    "/plantsos/:plantSosId",
    controllerHelpRequest.postHelpRequestAnswer
  );

  //USER ROUTES
  const controllerUser = require("../controllers/controllerUser");
  router.post("/user", controllerUser.createUser); ///////
  router.post("/login_user", controllerUser.loginUser);
  router.post("/verify_token", controllerUser.verifyToken);
  router.patch("/user/:id", authRole("owner"), controllerUser.modifyUser);
  router.get("/adminBearerToken", controllerUser.getAdminBearerToken);

  //ADRESS ROUTES
  const controllerAdress = require("../controllers/controllerAdress");
  router.get("/adresses/:userId", authRole("owner"), controllerAdress.getAdresses);
  router.post("/adresse/:userId", authRole("owner"), controllerAdress.addAddress);
  router.delete("/adresse/:addressId", authRole("owner"), controllerAdress.deleteAddress);

  //DENYJWT ROUTES
  const controllerDenyJWT = require("../controllers/controllerDenyJWT");
  router.post("/denyjwt", controllerDenyJWT.addDenyjwt);

  app.use("/api", router);
};
