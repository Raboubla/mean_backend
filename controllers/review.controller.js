const Review = require('../models/Review');

// ==================== BASIC CRUD ====================

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();

        res.status(201).json({
            message: 'Review created successfully',
            review
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('shop', 'name category')
            .sort({ created_at: -1 });

        res.json({
            count: reviews.length,
            reviews
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('shop', 'name category floor');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update review
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('shop', 'name category');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json({
            message: 'Review updated successfully',
            review
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==================== UTILITY FUNCTIONS ====================

// Get reviews by shop
exports.getReviewsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        const reviews = await Review.find({ shop: shopId })
            .populate('shop', 'name category')
            .sort({ created_at: -1 });

        res.json({
            shopId,
            count: reviews.length,
            reviews
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get reviews by status
exports.getReviewsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const statusUpper = status.toUpperCase();

        // Validate status
        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SPAM'];
        if (!validStatuses.includes(statusUpper)) {
            return res.status(400).json({
                message: 'Invalid status. Valid statuses: PENDING, APPROVED, REJECTED, SPAM'
            });
        }

        const reviews = await Review.find({ status: statusUpper })
            .populate('shop', 'name category')
            .sort({ created_at: -1 });

        res.json({
            status: statusUpper,
            count: reviews.length,
            reviews
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get reviews by rating
exports.getReviewsByRating = async (req, res) => {
    try {
        const { rating } = req.params;
        const ratingNum = parseInt(rating);

        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({
                message: 'Invalid rating. Rating must be between 1 and 5'
            });
        }

        const reviews = await Review.find({ rating: ratingNum })
            .populate('shop', 'name category')
            .sort({ created_at: -1 });

        res.json({
            rating: ratingNum,
            count: reviews.length,
            reviews
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get approved reviews for a shop (public endpoint)
exports.getApprovedReviewsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        const reviews = await Review.find({
            shop: shopId,
            status: 'APPROVED'
        })
            .populate('shop', 'name category')
            .sort({ created_at: -1 });

        res.json({
            shopId,
            count: reviews.length,
            reviews
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update review status (moderation)
exports.updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const statusUpper = status.toUpperCase();
        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SPAM'];

        if (!validStatuses.includes(statusUpper)) {
            return res.status(400).json({
                message: 'Invalid status. Valid statuses: PENDING, APPROVED, REJECTED, SPAM'
            });
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status: statusUpper },
            { new: true, runValidators: true }
        ).populate('shop', 'name category');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json({
            message: `Review status updated to ${statusUpper}`,
            review
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get review statistics
exports.getReviewStatistics = async (req, res) => {
    try {
        // Execute all queries in parallel for better performance
        const [
            total,
            pending,
            approved,
            rejected,
            spam,
            rating1,
            rating2,
            rating3,
            rating4,
            rating5,
            avgRatingData
        ] = await Promise.all([
            Review.countDocuments(),
            Review.countDocuments({ status: 'PENDING' }),
            Review.countDocuments({ status: 'APPROVED' }),
            Review.countDocuments({ status: 'REJECTED' }),
            Review.countDocuments({ status: 'SPAM' }),
            Review.countDocuments({ rating: 1 }),
            Review.countDocuments({ rating: 2 }),
            Review.countDocuments({ rating: 3 }),
            Review.countDocuments({ rating: 4 }),
            Review.countDocuments({ rating: 5 }),
            Review.aggregate([
                { $match: { status: 'APPROVED' } },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' }
                    }
                }
            ])
        ]);

        const averageRating = avgRatingData.length > 0
            ? avgRatingData[0].averageRating.toFixed(2)
            : 0;

        res.json({
            statistics: {
                total,
                pending,
                approved,
                rejected,
                spam
            },
            byRating: {
                rating1,
                rating2,
                rating3,
                rating4,
                rating5
            },
            averageRating: parseFloat(averageRating)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get review statistics by shop
exports.getReviewStatsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Execute all queries in parallel for better performance
        const [
            total,
            approved,
            pending,
            avgRatingData,
            ratingDistribution
        ] = await Promise.all([
            Review.countDocuments({ shop: shopId }),
            Review.countDocuments({ shop: shopId, status: 'APPROVED' }),
            Review.countDocuments({ shop: shopId, status: 'PENDING' }),
            Review.aggregate([
                {
                    $match: {
                        shop: require('mongoose').Types.ObjectId(shopId),
                        status: 'APPROVED'
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' },
                        totalApproved: { $sum: 1 }
                    }
                }
            ]),
            Review.aggregate([
                {
                    $match: {
                        shop: require('mongoose').Types.ObjectId(shopId),
                        status: 'APPROVED'
                    }
                },
                {
                    $group: {
                        _id: '$rating',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        const stats = avgRatingData.length > 0 ? avgRatingData[0] : {
            averageRating: 0,
            totalApproved: 0
        };

        res.json({
            shopId,
            statistics: {
                total,
                approved,
                pending
            },
            averageRating: parseFloat(stats.averageRating.toFixed(2)),
            ratingDistribution
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get top rated shops
exports.getTopRatedShops = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const topShops = await Review.aggregate([
            { $match: { status: 'APPROVED' } },
            {
                $group: {
                    _id: '$shop',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            },
            { $match: { totalReviews: { $gte: 1 } } }, // At least 1 review
            { $sort: { averageRating: -1, totalReviews: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'shops',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'shopDetails'
                }
            },
            { $unwind: '$shopDetails' }
        ]);

        res.json({
            count: topShops.length,
            shops: topShops.map(shop => ({
                shopId: shop._id,
                shopName: shop.shopDetails.name,
                category: shop.shopDetails.category,
                averageRating: parseFloat(shop.averageRating.toFixed(2)),
                totalReviews: shop.totalReviews
            }))
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
