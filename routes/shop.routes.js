const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shop.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/shops:
 *   post:
 *     summary: Create a new shop (ADMIN only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - status
 *               - floor
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Store"
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Electronics", "Computers"]
 *               description:
 *                 type: string
 *                 example: "Your one-stop shop for all tech needs"
 *               status:
 *                 type: string
 *                 example: "OPEN"
 *               floor:
 *                 type: number
 *                 example: 2
 *               opening_hours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       example: "Monday"
 *                     open:
 *                       type: string
 *                       example: "09:00"
 *                     close:
 *                       type: string
 *                       example: "18:00"
 *     responses:
 *       201:
 *         description: Shop created successfully
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Access denied (ADMIN role required)
 */
router.post('/', verifyToken, checkRole(['ADMIN']), shopCtrl.createShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Get shop by ID
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop details
 *       404:
 *         description: Shop not found
 */
router.get('/:id', verifyToken, shopCtrl.getShopById);

module.exports = router;