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
  //USER ROUTES
  const controllerUser = require("../controllers/controllerUser.js");
  router.post("/login_user", controllerUser.loginUser);
  router.post("/verify_token", controllerUser.verifyToken);

  app.use("/api", router);
};
