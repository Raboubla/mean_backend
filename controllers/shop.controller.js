const Shop = require('../models/Shop');
const User = require('../models/User');

// ==================== BASIC CRUD ====================

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    const newShop = new Shop(req.body);
    const savedShop = await newShop.save();

    // Assign the shop to the user
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { shop: savedShop._id });

    res.status(201).json({
      message: 'Shop created successfully',
      shop: savedShop
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Get all shops
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ name: 1 });

    res.json({
      count: shops.length,
      shops
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get shop by ID
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Increment view count
    shop.view_count += 1;
    await shop.save();

    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update shop
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({
      message: 'Shop updated successfully',
      shop
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete shop
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ message: 'Shop deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Get shops by category
exports.getShopsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const categoryUpper = category.toUpperCase();

    // Validate category
    const validCategories = ['FASHION', 'FOOD', 'ELECTRONICS', 'LEISURE', 'RESTAURANT', 'BEAUTY'];
    if (!validCategories.includes(categoryUpper)) {
      return res.status(400).json({
        message: 'Invalid category. Valid categories: FASHION, FOOD, ELECTRONICS, LEISURE, RESTAURANT, BEAUTY'
      });
    }

    const shops = await Shop.find({ category: categoryUpper }).sort({ name: 1 });

    res.json({
      category: categoryUpper,
      count: shops.length,
      shops
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get shops by status
exports.getShopsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const statusUpper = status.toUpperCase();

    // Validate status
    const validStatuses = ['OPEN', 'CLOSED', 'UNDER_RENOVATION', 'COMING_SOON'];
    if (!validStatuses.includes(statusUpper)) {
      return res.status(400).json({
        message: 'Invalid status. Valid statuses: OPEN, CLOSED, UNDER_RENOVATION, COMING_SOON'
      });
    }

    const shops = await Shop.find({ status: statusUpper }).sort({ name: 1 });

    res.json({
      status: statusUpper,
      count: shops.length,
      shops
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get shops by floor
exports.getShopsByFloor = async (req, res) => {
  try {
    const { floor } = req.params;
    const floorNum = parseInt(floor);

    if (isNaN(floorNum)) {
      return res.status(400).json({ message: 'Invalid floor number' });
    }

    const shops = await Shop.find({ floor: floorNum }).sort({ name: 1 });

    res.json({
      floor: floorNum,
      count: shops.length,
      shops
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update shop status
exports.updateShopStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const statusUpper = status.toUpperCase();
    const validStatuses = ['OPEN', 'CLOSED', 'UNDER_RENOVATION', 'COMING_SOON'];

    if (!validStatuses.includes(statusUpper)) {
      return res.status(400).json({
        message: 'Invalid status. Valid statuses: OPEN, CLOSED, UNDER_RENOVATION, COMING_SOON'
      });
    }

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { status: statusUpper },
      { new: true, runValidators: true }
    );

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({
      message: `Shop status updated to ${statusUpper}`,
      shop
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search shops by name
exports.searchShopsByName = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const shops = await Shop.find({
      name: { $regex: query, $options: 'i' }
    }).sort({ name: 1 });

    res.json({
      count: shops.length,
      shops
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get shop statistics
exports.getShopStatistics = async (req, res) => {
  try {
    // Execute all queries in parallel for better performance
    const [
      totalShops,
      openShops,
      closedShops,
      underRenovation,
      comingSoon,
      categoryStats,
      floorStats,
      viewsData
    ] = await Promise.all([
      Shop.countDocuments(),
      Shop.countDocuments({ status: 'OPEN' }),
      Shop.countDocuments({ status: 'CLOSED' }),
      Shop.countDocuments({ status: 'UNDER_RENOVATION' }),
      Shop.countDocuments({ status: 'COMING_SOON' }),
      Shop.aggregate([
        { $unwind: '$category' },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Shop.aggregate([
        {
          $group: {
            _id: '$floor',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Shop.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$view_count' }
          }
        }
      ])
    ]);

    const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;

    res.json({
      statistics: {
        total: totalShops,
        open: openShops,
        closed: closedShops,
        underRenovation,
        comingSoon
      },
      byCategory: categoryStats,
      byFloor: floorStats,
      totalViews
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get most viewed shops
exports.getMostViewedShops = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const shops = await Shop.find()
      .sort({ view_count: -1 })
      .limit(limit);

    res.json({
      count: shops.length,
      shops
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get shops open now
exports.getShopsOpenNow = async (req, res) => {
  try {
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
    const currentTime = now.toTimeString().slice(0, 5); // Format "HH:MM"

    // Find all open shops
    const openShops = await Shop.find({ status: 'OPEN' });

    // Filter shops that are open at current time
    const shopsOpenNow = openShops.filter(shop => {
      const todayHours = shop.opening_hours.find(h => h.day === currentDay);
      if (!todayHours) return false;

      return currentTime >= todayHours.open && currentTime <= todayHours.close;
    });

    res.json({
      currentDay,
      currentTime,
      count: shopsOpenNow.length,
      shops: shopsOpenNow
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get the shop of the logged-in shop admin
exports.getMyShop = async (req, res) => {
  try {
    // req.user should be set by verifyToken middleware
    const userId = req.user._id;

    // Populate the shop field
    const user = await User.findById(userId).populate('shop');

    // Return the shop or null if no shop assigned
    res.json(user.shop || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

