const express = require('express');
const router = express.Router();
const reviewCtrl = require('../controllers/review.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// ==================== BASIC CRUD ====================

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - rating
 *               - shop
 *             properties:
 *               customer_name:
 *                 type: string
 *                 example: "John Doe"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Excellent service and quality products!"
 *               shop:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', reviewCtrl.createReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 *       403:
 *         description: Access denied
 */
router.get('/', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.getAllReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 *       403:
 *         description: Access denied
 */
router.get('/:id', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.getReviewById);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update review (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_name:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED, SPAM]
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *       403:
 *         description: Access denied
 */
router.put('/:id', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       403:
 *         description: Access denied
 */
router.delete('/:id', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.deleteReview);

// ==================== UTILITY FUNCTIONS ====================

/**
 * @swagger
 * /api/reviews/shop/{shopId}:
 *   get:
 *     summary: Get all reviews for a shop (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
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
 *         description: List of reviews for the shop
 *       403:
 *         description: Access denied
 */
router.get('/shop/:shopId', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.getReviewsByShop);

/**
 * @swagger
 * /api/reviews/shop/{shopId}/approved:
 *   get:
 *     summary: Get approved reviews for a shop (public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: List of approved reviews for the shop
 */
router.get('/shop/:shopId/approved', reviewCtrl.getApprovedReviewsByShop);

/**
 * @swagger
 * /api/reviews/status/{status}:
 *   get:
 *     summary: Get reviews by status (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, SPAM]
 *         description: Review status
 *     responses:
 *       200:
 *         description: List of reviews with specified status
 *       400:
 *         description: Invalid status
 *       403:
 *         description: Access denied
 */
router.get('/status/:status', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.getReviewsByStatus);

/**
 * @swagger
 * /api/reviews/rating/{rating}:
 *   get:
 *     summary: Get reviews by rating (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rating
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Rating (1-5)
 *     responses:
 *       200:
 *         description: List of reviews with specified rating
 *       400:
 *         description: Invalid rating
 *       403:
 *         description: Access denied
 */
router.get('/rating/:rating', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.getReviewsByRating);

/**
 * @swagger
 * /api/reviews/{id}/status:
 *   patch:
 *     summary: Update review status (moderation) (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
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
 *                 enum: [PENDING, APPROVED, REJECTED, SPAM]
 *                 example: "APPROVED"
 *     responses:
 *       200:
 *         description: Review status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Review not found
 *       403:
 *         description: Access denied
 */
router.patch('/:id/status', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.updateReviewStatus);

/**
 * @swagger
 * /api/reviews/stats/overview:
 *   get:
 *     summary: Get overall review statistics (ADMIN only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review statistics (total, by status, by rating, average rating)
 *       403:
 *         description: Access denied
 */
router.get('/stats/overview', verifyToken, checkRole(['ADMIN']), reviewCtrl.getReviewStatistics);

/**
 * @swagger
 * /api/reviews/stats/shop/{shopId}:
 *   get:
 *     summary: Get review statistics by shop (ADMIN and SHOP_ADMIN only)
 *     tags: [Reviews]
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
 *         description: Shop review statistics (total, approved, pending, average rating, distribution)
 *       403:
 *         description: Access denied
 */
router.get('/stats/shop/:shopId', verifyToken, checkRole(['ADMIN', 'SHOP_ADMIN']), reviewCtrl.getReviewStatsByShop);

/**
 * @swagger
 * /api/reviews/analytics/top-rated:
 *   get:
 *     summary: Get top rated shops (ADMIN only)
 *     tags: [Reviews]
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
 *         description: List of top rated shops with average rating and review count
 *       403:
 *         description: Access denied
 */
router.get('/analytics/top-rated', verifyToken, checkRole(['ADMIN']), reviewCtrl.getTopRatedShops);

module.exports = router;
