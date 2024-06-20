const router = require("express").Router();

module.exports = (app) => {
  const controllerUser = require("../controllers/controllerUser.js");

  /**
   * @swagger
   * /api/login_user:
   *   post:
   *     summary: Connecter un utilisateur
   *     tags: [Connexion/User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               idToken:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *     responses:
   *       201:
   *         description: Utilisateur connecté avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 token:
   *                   type: string
   *                 role:
   *                   type: string
   *                 id:
   *                   type: string
   *                 user:
   *                   type: object
   *       400:
   *         description: Requête invalide
   *       401:
   *         description: Authentification échouée
   *       500:
   *         description: Erreur interne du serveur
   */
  router.post("/login_user", controllerUser.loginUser);

  /**
   * @swagger
   * /api/verify_token:
   *   post:
   *     summary: Vérifier un token JWT
   *     tags: [Connexion/User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *             required:
   *               - token
   *     responses:
   *       200:
   *         description: Token vérifié avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 user:
   *                   type: object
   *       401:
   *         description: Échec de la vérification du token
   *       500:
   *         description: Erreur interne du serveur
   */
  router.post("/verify_token", controllerUser.verifyToken);

  app.use("/api", router);
};
