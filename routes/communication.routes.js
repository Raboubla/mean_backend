const express = require('express');
const router = express.Router();
const communicationCtrl = require('../controllers/communication.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// ==================== BASIC CRUD ====================

/**
 * @swagger
 * /api/communications:
 *   post:
 *     summary: Create a new communication (ADMIN and ADMINSHOP only)
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - type
 *               - target
 *               - start_date
 *               - end_date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Summer Sale Event"
 *               content:
 *                 type: string
 *                 example: "Join us for our biggest summer sale with up to 50% off!"
 *               type:
 *                 type: string
 *                 enum: [ANNOUNCEMENT, EVENT]
 *                 example: "EVENT"
 *               target:
 *                 type: string
 *                 enum: [ALL, BUYERS, SHOP_ADMINS]
 *                 example: "ALL"
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-01T00:00:00Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-30T23:59:59Z"
 *               image_url:
 *                 type: string
 *                 example: "https://example.com/images/summer-sale.jpg"
 *               shop:
 *                 type: string
 *                 description: Shop ID (optional, for shop-specific communications)
 *     responses:
 *       201:
 *         description: Communication created successfully
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Access denied
 */
router.post('/', verifyToken, checkRole(['ADMIN', 'ADMINSHOP']), communicationCtrl.createCommunication);

/**
 * @swagger
 * /api/communications:
 *   get:
 *     summary: Get all communications
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all communications
 */
router.get('/', verifyToken, communicationCtrl.getAllCommunications);

/**
 * @swagger
 * /api/communications/{id}:
 *   get:
 *     summary: Get communication by ID
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Communication ID
 *     responses:
 *       200:
 *         description: Communication details
 *       404:
 *         description: Communication not found
 */
router.get('/:id', verifyToken, communicationCtrl.getCommunicationById);

/**
 * @swagger
 * /api/communications/{id}:
 *   put:
 *     summary: Update communication (ADMIN and ADMINSHOP only)
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Communication ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [ANNOUNCEMENT, EVENT]
 *               target:
 *                 type: string
 *                 enum: [ALL, BUYERS, SHOP_ADMINS]
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Communication updated successfully
 *       404:
 *         description: Communication not found
 *       403:
 *         description: Access denied
 */
router.put('/:id', verifyToken, checkRole(['ADMIN', 'ADMINSHOP']), communicationCtrl.updateCommunication);

/**
 * @swagger
 * /api/communications/{id}:
 *   delete:
 *     summary: Delete communication (ADMIN and ADMINSHOP only)
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Communication ID
 *     responses:
 *       200:
 *         description: Communication deleted successfully
 *       404:
 *         description: Communication not found
 *       403:
 *         description: Access denied
 */
router.delete('/:id', verifyToken, checkRole(['ADMIN', 'ADMINSHOP']), communicationCtrl.deleteCommunication);

// ==================== UTILITY FUNCTIONS ====================

/**
 * @swagger
 * /api/communications/filter/active:
 *   get:
 *     summary: Get active communications (current date between start and end date)
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active communications
 */
router.get('/filter/active', verifyToken, communicationCtrl.getActiveCommunications);

/**
 * @swagger
 * /api/communications/type/{type}:
 *   get:
 *     summary: Get communications by type
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ANNOUNCEMENT, EVENT]
 *         description: Communication type
 *     responses:
 *       200:
 *         description: List of communications by type
 *       400:
 *         description: Invalid type
 */
router.get('/type/:type', verifyToken, communicationCtrl.getCommunicationsByType);

/**
 * @swagger
 * /api/communications/target/{target}:
 *   get:
 *     summary: Get communications by target audience
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: target
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ALL, BUYERS, SHOP_ADMINS]
 *         description: Target audience
 *     responses:
 *       200:
 *         description: List of communications by target
 *       400:
 *         description: Invalid target
 */
router.get('/target/:target', verifyToken, communicationCtrl.getCommunicationsByTarget);

/**
 * @swagger
 * /api/communications/shop/{shopId}:
 *   get:
 *     summary: Get communications by shop
 *     tags: [Communications]
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
 *         description: List of shop communications
 */
router.get('/shop/:shopId', verifyToken, communicationCtrl.getCommunicationsByShop);

/**
 * @swagger
 * /api/communications/filter/upcoming:
 *   get:
 *     summary: Get upcoming communications (start date in the future)
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming communications
 */
router.get('/filter/upcoming', verifyToken, communicationCtrl.getUpcomingCommunications);

/**
 * @swagger
 * /api/communications/filter/expired:
 *   get:
 *     summary: Get expired communications (end date in the past)
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expired communications
 */
router.get('/filter/expired', verifyToken, communicationCtrl.getExpiredCommunications);

/**
 * @swagger
 * /api/communications/stats/overview:
 *   get:
 *     summary: Get communication statistics
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Communication statistics (total, active, upcoming, expired, by type, by target)
 */
router.get('/stats/overview', verifyToken, communicationCtrl.getCommunicationStatistics);

/**
 * @swagger
 * /api/communications/search/query:
 *   get:
 *     summary: Search communications by title or content
 *     tags: [Communications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *         example: "sale"
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing search query
 */
router.get('/search/query', verifyToken, communicationCtrl.searchCommunications);

module.exports = router;
