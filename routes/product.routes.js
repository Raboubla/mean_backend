const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// ==================== BASIC CRUD ====================

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *               - price
 *               - status
 *               - shop
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop Dell XPS 15"
 *               description:
 *                 type: string
 *                 example: "High performance laptop"
 *               price:
 *                 type: number
 *                 example: 899.99
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               status:
 *                 type: string
 *                 example: "AVAILABLE"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *               shop:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *               promotion:
 *                 type: object
 *                 properties:
 *                   discount_percent:
 *                     type: number
 *                     example: 15
 *                   promo_price:
 *                     type: number
 *                     example: 764.99
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     example: "2026-03-01"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Access denied (insufficient role)
 */
router.post('/', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of products with pagination
 *       401:
 *         description: Not authenticated
 */
router.get('/', verifyToken, productCtrl.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', verifyToken, productCtrl.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Access denied
 */
router.put('/:id', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Access denied
 */
router.delete('/:id', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.deleteProduct);

// ==================== UTILITY FUNCTIONS ====================

/**
 * @swagger
 * /api/products/shop/{shopId}:
 *   get:
 *     summary: Get products from a specific shop
 *     tags: [Products]
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
 *         description: List of shop products
 */
router.get('/shop/:shopId', verifyToken, productCtrl.getProductsByShop);

/**
 * @swagger
 * /api/products/search/query:
 *   get:
 *     summary: Search products by name, category or description
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *         example: "laptop"
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing search parameter
 */
router.get('/search/query', verifyToken, productCtrl.searchProducts);

/**
 * @swagger
 * /api/products/status/{status}:
 *   get:
 *     summary: Filter products by status (active/inactive)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Product status
 *     responses:
 *       200:
 *         description: List of products filtered by status
 */
router.get('/status/:status', verifyToken, productCtrl.getProductsByStatus);

/**
 * @swagger
 * /api/products/filter/promotions:
 *   get:
 *     summary: Get all products on promotion
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products with active promotions
 */
router.get('/filter/promotions', verifyToken, productCtrl.getPromotionalProducts);

/**
 * @swagger
 * /api/products/{id}/toggle-status:
 *   patch:
 *     summary: Toggle product active status
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product status updated successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Access denied
 */
router.patch('/:id/toggle-status', verifyToken, checkRole(['ADMINSHOP', 'ADMIN']), productCtrl.toggleProductStatus);

/**
 * @swagger
 * /api/products/stats/shop/{shopId}:
 *   get:
 *     summary: Get product statistics by shop
 *     tags: [Products]
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
 *         description: Product statistics (total, active, inactive, promotions, by category)
 */
router.get('/stats/shop/:shopId', verifyToken, productCtrl.getProductStatsByShop);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *         example: "Electronics"
 *     responses:
 *       200:
 *         description: List of products in the category
 */
router.get('/category/:category', verifyToken, productCtrl.getProductsByCategory);

module.exports = router;