const User = require('../models/User');
const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const { email, password, role, shop } = req.body;
    
    // 1. Hacher le mot de passe
    const hashedPassword = await authService.hashPassword(password);
    
    // 2. Créer l'utilisateur (le modèle forcera le rôle en MAJUSCULE) 
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      shop
    });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await authService.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = authService.generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};