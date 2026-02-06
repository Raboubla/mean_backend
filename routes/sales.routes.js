const express = require('express');
const router = express.Router();
const salesCtrl = require('../controllers/sales.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Record a new sale (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - unit_price
 *               - total_price
 *               - shop
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 5
 *               unit_price:
 *                 type: number
 *                 example: 99.99
 *               total_price:
 *                 type: number
 *                 example: 499.95
 *               shop:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *     responses:
 *       201:
 *         description: Sale recorded successfully
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Access denied
 */
router.post('/',
  verifyToken,
  checkRole(['ADMINSHOP', 'ADMIN']),
  salesCtrl.createSale
);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get sales history (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sales
 *       403:
 *         description: Access denied
 */
router.get('/',
  verifyToken,
  checkRole(['ADMINSHOP', 'ADMIN']),
  salesCtrl.getAllSales
);

module.exports = router;