const express = require('express');
const router = express.Router();
const salesCtrl = require('../controllers/sales.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// ==================== BASIC CRUD ====================

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
router.post('/', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.createSale);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sales
 *       403:
 *         description: Access denied
 */
router.get('/', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.getAllSales);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get sale by ID (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale details
 *       404:
 *         description: Sale not found
 *       403:
 *         description: Access denied
 */
router.get('/:id', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.getSaleById);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update sale (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *               unit_price:
 *                 type: number
 *               total_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *       404:
 *         description: Sale not found
 *       403:
 *         description: Access denied
 */
router.put('/:id', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.updateSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete sale (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *       404:
 *         description: Sale not found
 *       403:
 *         description: Access denied
 */
router.delete('/:id', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.deleteSale);

// ==================== UTILITY FUNCTIONS ====================

/**
 * @swagger
 * /api/sales/shop/{shopId}:
 *   get:
 *     summary: Get sales by shop (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: List of sales for the shop
 *       403:
 *         description: Access denied
 */
router.get('/shop/:shopId', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.getSalesByShop);

/**
 * @swagger
 * /api/sales/filter/date-range:
 *   get:
 *     summary: Get sales by date range (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *         example: "2026-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *         example: "2026-12-31"
 *     responses:
 *       200:
 *         description: List of sales within date range
 *       400:
 *         description: Missing date parameters
 *       403:
 *         description: Access denied
 */
router.get('/filter/date-range', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.getSalesByDateRange);

/**
 * @swagger
 * /api/sales/filter/today:
 *   get:
 *     summary: Get today's sales (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of today's sales
 *       403:
 *         description: Access denied
 */
router.get('/filter/today', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.getTodaySales);

/**
 * @swagger
 * /api/sales/stats/overview:
 *   get:
 *     summary: Get overall sales statistics (ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales statistics (total, today, month, revenue, average order value)
 *       403:
 *         description: Access denied
 */
router.get('/stats/overview', verifyToken, checkRole(['ADMIN']), salesCtrl.getSalesStatistics);

/**
 * @swagger
 * /api/sales/stats/shop/{shopId}:
 *   get:
 *     summary: Get sales statistics by shop (ADMINSHOP and ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop sales statistics (total, today, revenue, average order value)
 *       403:
 *         description: Access denied
 */
router.get('/stats/shop/:shopId', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), salesCtrl.getSalesStatsByShop);

/**
 * @swagger
 * /api/sales/revenue/date-range:
 *   get:
 *     summary: Get revenue by date range (ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *         example: "2026-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *         example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Revenue data for date range
 *       400:
 *         description: Missing date parameters
 *       403:
 *         description: Access denied
 */
router.get('/revenue/date-range', verifyToken, checkRole(['ADMIN']), salesCtrl.getRevenueByDateRange);

/**
 * @swagger
 * /api/sales/analytics/top-shops:
 *   get:
 *     summary: Get top selling shops (ADMIN only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top shops to return
 *     responses:
 *       200:
 *         description: List of top selling shops with sales and revenue data
 *       403:
 *         description: Access denied
 */
router.get('/analytics/top-shops', verifyToken, checkRole(['ADMIN']), salesCtrl.getTopSellingShops);

module.exports = router;