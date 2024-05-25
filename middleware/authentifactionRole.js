const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_JWT;

const rolePermissions = {
  "owner": 1,
  "keeper": 2,
  "botanist": 3,
  "admin": 4
};

exports.authRole = (requiredRole) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Accès refusé. Pas de token fourni." });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;

      const userFromDB = { id: decoded.id, role: decoded.role };

      if (rolePermissions[userFromDB.role] >= rolePermissions[requiredRole]) {
        next();
      } else {
        return res.status(403).json({ message: "Accès refusé. Rôle insuffisant." });
      }
    } catch (error) {
      return res.status(418).json({ 
        message: "Token invalide.",
        error: process.env.NODE_ENV === "development" ? {
          message: error.message,
          stack: error.stack,
          token: token,
          authHeader: authHeader,
          details: error.details || "Aucun détail supplémentaire"
        } : undefined
      });
    }
  };
};
