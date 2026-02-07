const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// ==================== BASIC CRUD ====================

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePassword123!"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, BUYERS, ADMINSHOP]
 *                 example: "BUYERS"
 *               shop:
 *                 type: string
 *                 description: Shop ID (required for ADMINSHOP role)
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', userCtrl.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Access denied (ADMIN role required)
 */
router.get('/', verifyToken, checkRole(['ADMIN']), userCtrl.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */
router.get('/:id', verifyToken, checkRole(['ADMIN']), userCtrl.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [ADMIN, BUYERS, ADMINSHOP]
 *               status:
 *                 type: string
 *               shop:
 *                 type: string
 *               permission:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */
router.put('/:id', verifyToken, checkRole(['ADMIN']), userCtrl.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */
router.delete('/:id', verifyToken, checkRole(['ADMIN']), userCtrl.deleteUser);

// ==================== UTILITY FUNCTIONS ====================

/**
 * @swagger
 * /api/users/role/{role}:
 *   get:
 *     summary: Get users by role (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ADMIN, BUYERS, ADMINSHOP]
 *         description: User role
 *     responses:
 *       200:
 *         description: List of users with specified role
 *       400:
 *         description: Invalid role
 *       403:
 *         description: Access denied
 */
router.get('/role/:role', verifyToken, checkRole(['ADMIN']), userCtrl.getUsersByRole);

/**
 * @swagger
 * /api/users/shop/{shopId}:
 *   get:
 *     summary: Get users by shop (ADMIN and ADMINSHOP)
 *     tags: [Users]
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
 *         description: List of users associated with the shop
 *       403:
 *         description: Access denied
 */
router.get('/shop/:shopId', verifyToken, checkRole(['ADMIN', 'ADMINSHOP']), userCtrl.getUsersByShop);

/**
 * @swagger
 * /api/users/status/{status}:
 *   get:
 *     summary: Get users by status (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: User status
 *     responses:
 *       200:
 *         description: List of users with specified status
 *       403:
 *         description: Access denied
 */
router.get('/status/:status', verifyToken, checkRole(['ADMIN']), userCtrl.getUsersByStatus);

/**
 * @swagger
 * /api/users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user status (ACTIVE/INACTIVE) (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */
router.patch('/:id/toggle-status', verifyToken, checkRole(['ADMIN']), userCtrl.toggleUserStatus);

/**
 * @swagger
 * /api/users/{id}/password:
 *   patch:
 *     summary: Update user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Current password is incorrect
 *       404:
 *         description: User not found
 */
router.patch('/:id/password', verifyToken, userCtrl.updatePassword);

/**
 * @swagger
 * /api/users/stats/overview:
 *   get:
 *     summary: Get user statistics (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics (total, active, inactive, by role, with shop)
 *       403:
 *         description: Access denied
 */
router.get('/stats/overview', verifyToken, checkRole(['ADMIN']), userCtrl.getUserStatistics);

/**
 * @swagger
 * /api/users/search/email:
 *   get:
 *     summary: Search users by email (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Email search term
 *         example: "john"
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing search query
 *       403:
 *         description: Access denied
 */
router.get('/search/email', verifyToken, checkRole(['ADMIN']), userCtrl.searchUsersByEmail);

module.exports = router;