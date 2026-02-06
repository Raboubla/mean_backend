const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

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

module.exports = router;