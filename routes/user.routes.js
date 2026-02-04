const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Créer un utilisateur (Peut être public pour l'inscription ou restreint à l'ADMIN)
router.post('/', userCtrl.createUser);

// Seul l'ADMIN peut voir la liste de tous les utilisateurs
router.get('/', verifyToken, checkRole(['ADMIN']), userCtrl.getAllUsers);

module.exports = router;