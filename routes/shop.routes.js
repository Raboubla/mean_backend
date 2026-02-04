const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shop.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, checkRole(['ADMIN']), shopCtrl.createShop);
router.get('/:id', verifyToken, shopCtrl.getShopById);

module.exports = router;