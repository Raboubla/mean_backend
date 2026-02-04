const jwt = require('jsonwebtoken');

// Vérifie si l'utilisateur est connecté (Token valide)
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(403).json({ message: "Token requis" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On stocke les infos du user (id, role) dans la requête
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

// Vérifie si l'utilisateur a le rôle nécessaire
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé : permissions insuffisantes" });
    }
    next();
  };
};