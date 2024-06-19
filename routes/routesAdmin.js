const router = require("express").Router();
const { authRole } = require("../middleware/authentifactionRole.js");

module.exports = (app) => {
  //USER ROUTES
  const controllerUser = require("../controllers/controllerUser.js");
  /**
   * @swagger
   * /api/admin/users:
   *   get:
   *     summary: Get all users
   *     tags: [Admin/User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of all users.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   email:
   *                     type: string
   *                   pseudo:
   *                     type: string
   *                   role:
   *                     type: string
   *                   firstname:
   *                     type: string
   *                   lastname:
   *                     type: string
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Une erreur s'est produite lors de la récupération des utilisateurs
   */
  router.get("/users", authRole("admin"), controllerUser.getAllUser);
  /**
   * @swagger
   * /api/admin/user:
   *   post:
   *     summary: Create a new user
   *     tags: [Admin/User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
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
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Utilisateur ajouté avec succès.
   *       400:
   *         description: L'utilisateur existe déjà
   *       500:
   *         description: Erreur lors de la création de l'utilisateur
   */
  router.post("/user", authRole("admin"), controllerUser.createUser);
  /**
   * @swagger
   * /api/admin/login_admin:
   *   post:
   *     summary: Admin login
   *     tags: [Admin/Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: Utilisateur connecté avec succès.
   *       401:
   *         description: Email ou mot de passe incorrect, ou non autorisé
   *       500:
   *         description: Erreur lors de la connexion de l'utilisateur
   */
  router.post("/login_admin", controllerUser.loginAdmin);
  /**
   * @swagger
   * /api/admin/verify_admin_token:
   *   post:
   *     summary: Verify admin token
   *     tags: [Admin/Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *     responses:
   *       200:
   *         description: Token vérifié avec succès.
   *       401:
   *         description: Échec de la vérification du token, ou non autorisé
   *       500:
   *         description: Erreur lors de la vérification du token
   */
  router.post("/verify_admin_token", controllerUser.verifyAdminToken);
  /**
   * @swagger
   * /api/admin/user/{id}:
   *   patch:
   *     summary: Modify user details
   *     tags: [Admin/User]
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
  router.patch("/user/:id", authRole("admin"), controllerUser.modifyUser);
  /**
   * @swagger
   * /api/admin/user/{id}:
   *   delete:
   *     summary: Delete a user
   *     tags: [Admin/User]
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
  router.delete("/user/:id", authRole("admin"), controllerUser.deleteUser);
  /**
   * @swagger
   * /api/admin/adminBearerToken:
   *   get:
   *     summary: Get admin bearer token
   *     tags: [Admin/Authentication]
   *     responses:
   *       201:
   *         description: Utilisateur connecté avec succès.
   *       500:
   *         description: Génération de token échoué
   */
  router.get("/adminBearerToken", controllerUser.getAdminBearerToken);

  //DENYJWT ROUTES
  const controllerDenyJWT = require("../controllers/controllerDenyJWT.js");
  /**
   * @swagger
   * /api/denyjwt:
   *   post:
   *     summary: Add a JWT to the deny list
   *     tags: [Admin/DenyJWT]
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
   *     responses:
   *       201:
   *         description: Token ajouté à la liste Deny
   *       500:
   *         description: Erreur lors de la création de l'utilisateur
   */
  router.post("/denyjwt", controllerDenyJWT.addDenyjwt);

  app.use("/api/admin", router);
};