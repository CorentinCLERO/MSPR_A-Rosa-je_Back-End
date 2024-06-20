const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API projet MSPR",
    version: "1.0.0",
    description: "Documentation de l'API de votre application",
  },
  servers: [
    {
      url: process.env.SERVER_URL || "http://localhost:8080",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
