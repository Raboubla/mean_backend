const express = require('express');
const router = express.Router();
const salesCtrl = require('../controllers/sales.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Enregistrer une vente : réservé aux gérants de boutique et admins
router.post('/', 
  verifyToken, 
  checkRole(['ADMINSHOP', 'ADMIN']), 
  salesCtrl.createSale
);

// Consulter l'historique des ventes (peut être filtré par boutique dans le controller)
router.get('/', 
  verifyToken, 
  checkRole(['ADMINSHOP', 'ADMIN']), 
  salesCtrl.getAllSales
);

module.exports = router;