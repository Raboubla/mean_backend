const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Sales = require('../models/Sales');
const Communication = require('../models/Communication');
const Review = require('../models/Review');

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get global statistics for all modules filtered by month (ADMIN only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12). Defaults to current month.
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year (e.g. 2026). Defaults to current year.
 *     responses:
 *       200:
 *         description: Statistics for each module
 *       403:
 *         description: Access denied
 */
router.get('/stats', verifyToken, checkRole(['ADMIN']), async (req, res) => {
    try {
        const now = new Date();
        const month = parseInt(req.query.month) || 0; // 0 = All Year
        const year = parseInt(req.query.year) || now.getFullYear();

        // If month=0, filter the whole year
        let dateFilter;
        if (month === 0) {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year + 1, 0, 1);
            dateFilter = { createdAt: { $gte: startOfYear, $lt: endOfYear } };
        } else {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);
            dateFilter = { createdAt: { $gte: startDate, $lt: endDate } };
        }

        const [users, shops, products, sales, communications, reviews] = await Promise.all([
            User.countDocuments(dateFilter),
            Shop.countDocuments(dateFilter),
            Product.countDocuments(dateFilter),
            Sales.countDocuments(dateFilter),
            Communication.countDocuments(dateFilter),
            Review.countDocuments(dateFilter),
        ]);

        res.json({
            month,
            year,
            stats: { users, shops, products, sales, communications, reviews }
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
