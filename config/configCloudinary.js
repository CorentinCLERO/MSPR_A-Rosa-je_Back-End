require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: "dl0ehqnva", 
  api_key: "136398354816141", 
  api_secret: "HW0bLrJQgu6FiE5RmocU5PB67NM" 
});

module.exports = cloudinary;
