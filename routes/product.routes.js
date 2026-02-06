const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// ==================== CRUD DE BASE ====================

// Créer un produit (ADMIN et ADMINSHOP uniquement)
router.post('/', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.createProduct);

// Obtenir tous les produits avec pagination (tous les utilisateurs authentifiés)
router.get('/', verifyToken, productCtrl.getAllProducts);

// Obtenir un produit par ID (tous les utilisateurs authentifiés)
router.get('/:id', verifyToken, productCtrl.getProductById);

// Mettre à jour un produit (ADMIN et ADMINSHOP uniquement)
router.put('/:id', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.updateProduct);

// Supprimer un produit (ADMIN et ADMINSHOP uniquement)
router.delete('/:id', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.deleteProduct);

// ==================== FONCTIONS UTILES ====================

// Obtenir les produits d'une boutique spécifique
router.get('/shop/:shopId', verifyToken, productCtrl.getProductsByShop);

// Rechercher des produits (par nom, catégorie ou description)
// Exemple: GET /api/products/search?query=laptop
router.get('/search/query', verifyToken, productCtrl.searchProducts);

// Obtenir les produits par statut (active ou inactive)
// Exemple: GET /api/products/status/active
router.get('/status/:status', verifyToken, productCtrl.getProductsByStatus);

// Obtenir tous les produits en promotion
router.get('/filter/promotions', verifyToken, productCtrl.getPromotionalProducts);

// Activer/Désactiver un produit (toggle) (ADMIN et ADMINSHOP uniquement)
router.patch('/:id/toggle-status', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.toggleProductStatus);

// Obtenir les statistiques des produits par boutique
router.get('/stats/shop/:shopId', verifyToken, productCtrl.getProductStatsByShop);

// Obtenir les produits par catégorie
// Exemple: GET /api/products/category/electronics
router.get('/category/:category', verifyToken, productCtrl.getProductsByCategory);

module.exports = router;