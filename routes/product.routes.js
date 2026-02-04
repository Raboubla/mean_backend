const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.createProduct);
router.get('/shop/:shopId', verifyToken, productCtrl.getProductsByShop);

module.exports = router;