const express = require('express');
const router = express.Router();
const shopCtrl = require('../controllers/shop.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const createUpload = require('../middlewares/image.middleware');
const upload = createUpload('shops');

// ==================== BASIC CRUD ====================

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
 *               - floor
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Store"
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [FASHION, FOOD, ELECTRONICS, LEISURE, RESTAURANT, BEAUTY]
 *                 example: ["ELECTRONICS"]
 *               description:
 *                 type: string
 *                 example: "Your one-stop shop for all tech needs"
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED, UNDER_RENOVATION, COMING_SOON]
 *                 default: OPEN
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
 *                       enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
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
router.post('/', upload.single('banner'), verifyToken, checkRole(['ADMIN']), shopCtrl.createShop);

/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Get all shops
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: List of all shops
 */
router.get('/', shopCtrl.getAllShops);

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Get shop by ID (increments view count)
 *     tags: [Shops]
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
router.get('/:id', shopCtrl.getShopById);

/**
 * @swagger
 * /api/shops/{id}:
 *   put:
 *     summary: Update shop (ADMIN only)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED, UNDER_RENOVATION, COMING_SOON]
 *               floor:
 *                 type: number
 *               opening_hours:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Shop updated successfully
 *       404:
 *         description: Shop not found
 *       403:
 *         description: Access denied
 */
router.put('/:id', upload.single('banner'), verifyToken, checkRole(['ADMIN']), shopCtrl.updateShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     summary: Delete shop (ADMIN only)
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
 *         description: Shop deleted successfully
 *       404:
 *         description: Shop not found
 *       403:
 *         description: Access denied
 */
router.delete('/:id', verifyToken, checkRole(['ADMIN']), shopCtrl.deleteShop);

// ==================== UTILITY FUNCTIONS ====================

/**
 * @swagger
 * /api/shops/category/{category}:
 *   get:
 *     summary: Get shops by category
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [FASHION, FOOD, ELECTRONICS, LEISURE, RESTAURANT, BEAUTY]
 *         description: Shop category
 *     responses:
 *       200:
 *         description: List of shops in the category
 *       400:
 *         description: Invalid category
 */
router.get('/category/:category', shopCtrl.getShopsByCategory);

/**
 * @swagger
 * /api/shops/status/{status}:
 *   get:
 *     summary: Get shops by status
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [OPEN, CLOSED, UNDER_RENOVATION, COMING_SOON]
 *         description: Shop status
 *     responses:
 *       200:
 *         description: List of shops with specified status
 *       400:
 *         description: Invalid status
 */
router.get('/status/:status', shopCtrl.getShopsByStatus);

/**
 * @swagger
 * /api/shops/floor/{floor}:
 *   get:
 *     summary: Get shops by floor
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: floor
 *         required: true
 *         schema:
 *           type: integer
 *         description: Floor number
 *         example: 2
 *     responses:
 *       200:
 *         description: List of shops on the floor
 *       400:
 *         description: Invalid floor number
 */
router.get('/floor/:floor', shopCtrl.getShopsByFloor);

/**
 * @swagger
 * /api/shops/{id}/status:
 *   patch:
 *     summary: Update shop status (ADMIN only)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED, UNDER_RENOVATION, COMING_SOON]
 *                 example: "OPEN"
 *     responses:
 *       200:
 *         description: Shop status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Shop not found
 *       403:
 *         description: Access denied
 */
router.patch('/:id/status', verifyToken, checkRole(['ADMIN']), shopCtrl.updateShopStatus);

/**
 * @swagger
 * /api/shops/search/name:
 *   get:
 *     summary: Search shops by name
 *     tags: [Shops]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *         example: "tech"
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing search query
 */
router.get('/search/name', shopCtrl.searchShopsByName);

/**
 * @swagger
 * /api/shops/stats/overview:
 *   get:
 *     summary: Get shop statistics (ADMIN only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop statistics (total, by status, by category, by floor, total views)
 *       403:
 *         description: Access denied
 */
router.get('/stats/overview', verifyToken, checkRole(['ADMIN']), shopCtrl.getShopStatistics);

/**
 * @swagger
 * /api/shops/analytics/most-viewed:
 *   get:
 *     summary: Get most viewed shops
 *     tags: [Shops]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of shops to return
 *     responses:
 *       200:
 *         description: List of most viewed shops
 */
router.get('/analytics/most-viewed', shopCtrl.getMostViewedShops);

/**
 * @swagger
 * /api/shops/filter/open-now:
 *   get:
 *     summary: Get shops currently open (based on current day and time)
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: List of shops open now
 */
router.get('/filter/open-now', shopCtrl.getShopsOpenNow);

module.exports = router;