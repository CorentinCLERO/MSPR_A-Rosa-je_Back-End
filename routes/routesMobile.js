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
  /**
   * @swagger
   * /api/mobile/test:
   *   get:
   *     summary: Retrieve all tests
   *     tags: [Mobile/Test]
   *     responses:
   *       200:
   *         description: A list of tests.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       500:
   *         description: Some error occurred while retrieving tests.
   */
  router.get("/test", testSrv.find);

  //PLANTS ROUTES
  const controllerPlant = require("../controllers/controllerPlant.js");
  /**
   * @swagger
   * /api/mobile/plants/{userId}:
   *   get:
   *     summary: Get plants for a specific user
   *     tags: [Mobile/Plant]
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of plants.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Utilisateur non trouvé
   *       500:
   *         description: Une erreur s'est produite lors de la récupération des plantes.
   */
  router.get("/plants/:userId", authRole("owner"), controllerPlant.getUserPlants);
  const parser = multer({ storage: storage });
  /**
   * @swagger
   * /api/mobile/plant:
   *   post:
   *     summary: Add a new plant
   *     tags: [Mobile/Plant]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *               adress_id:
   *                 type: string
   *               request_id:
   *                 type: string
   *               variety:
   *                 type: string
   *               movable:
   *                 type: boolean
   *               message:
   *                 type: string
   *               photo:
   *                 type: string
   *                 format: binary
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Plante et image ajoutées avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *       500:
   *         description: Erreur lors de la création de la plante ou de l'image
   */
  router.post("/plant", authRole("owner"), parser.single("photo"), controllerPlant.addPlant);
  /**
   * @swagger
   * /api/mobile/plant/{plantId}:
   *   delete:
   *     summary: Delete a plant
   *     tags: [Mobile/Plant]
   *     parameters:
   *       - in: path
   *         name: plantId
   *         schema:
   *           type: string
   *         required: true
   *         description: Plant ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Plante et image associée supprimées
   *       500:
   *         description: Erreur lors de la suppression de la plante et/ou de l'image
   */
  router.delete("/plant/:plantId", authRole("owner"), controllerPlant.deletePlant);

  //REQUESTS ROUTES
  const controllerRequest = require("../controllers/controllerRequest.js");
  /**
   * @swagger
   * /api/mobile/requests/{userId}:
   *   get:
   *     summary: Get requests for a specific user
   *     tags: [Mobile/Request]
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *       - in: query
   *         name: request_status
   *         schema:
   *           type: string
   *         required: false
   *         description: Status of the request
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of requests.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Aucun utilisateur trouvé pour cet identifiant
   *       500:
   *         description: Une erreur s'est produite lors de la récupération des requêtes
   */
  router.get("/requests/:userId", authRole("owner"), controllerRequest.getRequests);
  /**
   * @swagger
   * /api/mobile/requests/{userId}:
   *   get:
   *     summary: Get all requests
   *     tags: [Mobile/Request]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A compilation of all requests that are not the user's.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Une erreur s'est produite lors de la récupération des requêtes
   */
  router.get("/allUsersRequests/:userId", authRole("keeper"), controllerRequest.getAllRequests);
  /**
 * @swagger
 * /api/mobile/requests/{requestId}:
 *   put:
 *     summary: Update a request
 *     tags: [Mobile/Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the request to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the request
 *               guard_id:
 *                 type: integer
 *                 description: The ID of the guard assigned to the request (optional)
 *     responses:
 *       200:
 *         description: The request was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     begin_date:
 *                       type: string
 *                       format: date-time
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                     reason:
 *                       type: string
 *                     description:
 *                       type: string
 *                     user_id:
 *                       type: integer
 *                     adress_id:
 *                       type: integer
 *                     guard_id:
 *                       type: integer
 *                       nullable: true
 *       404:
 *         description: Aucune requête trouvée pour cet identifiant.
 *       500:
 *         description: Une erreur s'est produite lors de la mise à jour de la requête.
 */
  router.put("/request/:requestId", authRole("keeper"), controllerRequest.updateRequest);
  /**
   * @swagger
   * /api/mobile/request:
   *   post:
   *     summary: Create a new request
   *     tags: [Mobile/Request]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *               begin_date:
   *                 type: string
   *                 format: date
   *               end_date:
   *                 type: string
   *                 format: date
   *               plants:
   *                 type: array
   *                 items:
   *                   type: string
   *               reason:
   *                 type: string
   *               description:
   *                 type: string
   *               adress:
   *                 type: object
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Requête créée avec succès.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 requestId:
   *                   type: string
   *       500:
   *         description: Une erreur s'est produite lors de la création de la requête
   */
  router.post("/request", authRole("owner"), controllerRequest.postRequest);
  /**
   * @swagger
   * /api/mobile/request/{requestId}:
   *   delete:
   *     summary: Delete a request
   *     tags: [Mobile/Request]
   *     parameters:
   *       - in: path
   *         name: requestId
   *         schema:
   *           type: string
   *         required: true
   *         description: Request ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Requête supprimée avec succès
   *       404:
   *         description: Aucune requête trouvée pour cet identifiant
   *       500:
   *         description: Une erreur s'est produite lors de la suppression de la requête
   */
  router.delete("/request/:requestId", authRole("owner"), controllerRequest.deleteRequest);

  //HELP REQUESTS ROUTES
  const controllerHelpRequest = require("../controllers/controllerHelpRequest.js");
  /**
   * @swagger
   * /api/mobile/plantsos/{userId}:
   *   get:
   *     summary: Get help requests for a specific user
   *     tags: [Mobile/HelpRequest]
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of help requests.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Utilisateur non trouvé
   *       500:
   *         description: Une erreur s'est produite lors de la récupération des demandes d'aide
   */
  router.get("/plantsos/:userId", authRole("keeper"), controllerHelpRequest.getHelpRequests);
  /**
   * @swagger
   * /api/mobile/plantsos:
   *   get:
   *     summary: Get all help requests
   *     tags: [Mobile/HelpRequest]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of all help requests.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Une erreur s'est produite lors de la récupération des demandes d'aide
   */
  router.get("/plantsos", authRole("botanist"), controllerHelpRequest.getAllHelpRequests);

  //USER ROUTES
  const controllerUser = require("../controllers/controllerUser.js");
  /**
   * @swagger
   * /api/mobile/user/{id}:
   *   patch:
   *     summary: Modify user details
   *     tags: [Mobile/User]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               botaniste_id:
   *                 type: string
   *               password:
   *                 type: string
   *               pseudo:
   *                 type: string
   *               role:
   *                 type: string
   *               firstname:
   *                 type: string
   *               lastname:
   *                 type: string
   *               firstLogin:
   *                 type: boolean
   *               wantToBeKeeper:
   *                 type: boolean
   *               picture_profile:
   *                 type: string
   *               validatePrivacyPolicy:
   *                 type: boolean
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *       404:
   *         description: User not found.
   *       500:
   *         description: An error occurred while updating the user.
   */
  router.patch("/user/:id", authRole("owner"), controllerUser.modifyUser);
  /**
   * @swagger
   * /api/mobile/user/{id}:
   *   delete:
   *     summary: Delete a user
   *     tags: [Mobile/User]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User deleted successfully.
   *       404:
   *         description: User not found.
   *       500:
   *         description: An error occurred while deleting the user.
   */
  router.delete("/user/:id", authRole("owner"), controllerUser.deleteUser);
  /**
   * @swagger
   * /api/mobile/pseudos:
   *   get:
   *     summary: Get all pseudos
   *     tags: [Mobile/User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of pseudos.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   pseudo:
   *                     type: string
   *       500:
   *         description: An error occurred while retrieving the pseudos.
   */
  router.get("/pseudos", authRole("owner"), controllerUser.getAllPseudos);

  //ADRESS ROUTES
  const controllerAdress = require("../controllers/controllerAdress.js");
  /**
   * @swagger
   * /api/mobile/adresses/{userId}:
   *   get:
   *     summary: Get addresses for a specific user
   *     tags: [Mobile/Address]
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of addresses.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Utilisateur non trouvé
   *       500:
   *         description: Une erreur s'est produite lors de la récupération des adresses
   */
  router.get("/adresses/:userId", authRole("owner"), controllerAdress.getAdresses);
  /**
   * @swagger
   * /api/mobile/adresse/{userId}:
   *   post:
   *     summary: Add a new address
   *     tags: [Mobile/Address]
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               number:
   *                 type: string
   *               street:
   *                 type: string
   *               city:
   *                 type: string
   *               country:
   *                 type: string
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Adresse ajoutée avec succès.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Utilisateur non trouvé
   *       409:
   *         description: Cette adresse existe déjà
   *       500:
   *         description: Une erreur s'est produite lors de l'ajout de l'adresse
   */
  router.post("/adresse/:userId", authRole("owner"), controllerAdress.addAddress);
  /**
   * @swagger
   * /api/mobile/adresse/{addressId}:
   *   delete:
   *     summary: Delete an address
   *     tags: [Mobile/Address]
   *     parameters:
   *       - in: path
   *         name: addressId
   *         schema:
   *           type: string
   *         required: true
   *         description: Address ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Adresse supprimée avec succès.
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Adresse non trouvée
   *       500:
   *         description: Une erreur s'est produite lors de la suppression de l'adresse
   */
  router.delete("/adresse/:addressId", authRole("owner"), controllerAdress.deleteAddress);

  //DENYJWT ROUTES
  const controllerDenyJWT = require("../controllers/controllerDenyJWT.js");
  /**
   * @swagger
   * /api/mobile/denyjwt:
   *   post:
   *     summary: Add a JWT to the deny list
   *     tags: [Mobile/DenyJWT]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *                 description: JWT token to be added to the deny list
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Token ajouté à la liste Deny
   *       500:
   *         description: Erreur lors de la création de l'utilisateur
   */
  router.post("/denyjwt", authRole("owner"), controllerDenyJWT.addDenyjwt);
  
  //MESSAGE ROUTES
  const controllerMessage = require("../controllers/controllerMessage.js");
  /**
   * @swagger
   * /api/mobile/messages/{senderId}/{receiverId}:
   *   get:
   *     summary: Get messages between two users
   *     tags: [Mobile/Message]
   *     parameters:
   *       - in: path
   *         name: senderId
   *         schema:
   *           type: string
   *         required: true
   *         description: Sender ID
   *       - in: path
   *         name: receiverId
   *         schema:
   *           type: string
   *         required: true
   *         description: Receiver ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of messages between the two users.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   content:
   *                     type: string
   *                   pseudo:
   *                     type: string
   *                   timestamp:
   *                     type: string
   *                     format: date-time
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Erreur lors de la récupération des messages
   */
  router.get("/messages/:senderId/:receiverId", authRole("owner"), controllerMessage.getMessages);
  /**
   * @swagger
   * /api/mobile/all_messages/{userId}:
   *   get:
   *     summary: Get all users who have exchanged messages with the specified user
   *     tags: [Mobile/Message]
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of users who have exchanged messages with the specified user.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   pseudo:
   *                     type: string
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Erreur lors de la récupération des utilisateurs avec lesquels des messages ont été échangés
   */
  router.get("/all_messages/:userId", authRole("owner"), controllerMessage.getAllMessages);
  /**
   * @swagger
   * /api/mobile/message:
   *   post:
   *     summary: Create a new message
   *     tags: [Mobile/Message]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *               senderId:
   *                 type: string
   *               receiverId:
   *                 type: string
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Message créé avec succès.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 content:
   *                   type: string
   *                 senderId:
   *                   type: string
   *                 receiverId:
   *                   type: string
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Erreur lors de la création du message
   */
  router.post("/message", authRole("owner"), controllerMessage.createMessage);

  app.use("/api/mobile", router);
};
