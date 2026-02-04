const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {
  // Hashage du mot de passe avant enregistrement
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Comparaison des mots de passe
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Génération du Token JWT
  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role }, // Payload 
      process.env.JWT_SECRET,
    );
  }
}

module.exports = new AuthService();