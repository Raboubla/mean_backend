const Sales = require('../models/Sales');

// ==================== BASIC CRUD ====================

// Create a new sale
exports.createSale = async (req, res) => {
  try {
    const sale = new Sales(req.body);
    await sale.save();

    res.status(201).json({
      message: 'Sale recorded successfully',
      sale
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all sales — supports ?query (product name regex), ?shopId
exports.getAllSales = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { query, shopId } = req.query;
    const filter = {};

    if (shopId) {
      // $match needs ObjectId, not raw string
      try { filter.shop = new mongoose.Types.ObjectId(shopId); }
      catch (_) { filter.shop = shopId; }
    }

    let sales;

    if (query) {
      // Aggregation needed to filter on populated product.name
      const pipeline = [
        { $match: filter },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'productInfo'
          }
        },
        { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
        {
          $match: {
            'productInfo.name': { $regex: query, $options: 'i' }
          }
        },
        {
          $lookup: {
            from: 'shops',
            localField: 'shop',
            foreignField: '_id',
            as: 'shopInfo'
          }
        },
        { $unwind: { path: '$shopInfo', preserveNullAndEmptyArrays: true } },
        { $sort: { sold_at: -1 } }
      ];

      const raw = await Sales.aggregate(pipeline);
      sales = raw.map(s => ({
        ...s,
        product: s.productInfo || s.product,
        shop: s.shopInfo || s.shop
      }));
    } else {
      sales = await Sales.find(filter)
        .populate('shop', 'name category floor')
        .populate('product', 'name price category')
        .sort({ sold_at: -1 });
    }

    res.json({ count: sales.length, sales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id)
      .populate('shop', 'name category floor')
      .populate('product', 'name price category');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update sale
exports.updateSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('shop', 'name category')
      .populate('product', 'name price category');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json({
      message: 'Sale updated successfully',
      sale
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete sale
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Get sales by shop
exports.getSalesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const sales = await Sales.find({ shop: shopId })
      .populate('shop', 'name category floor')
      .populate('product', 'name price category')
      .sort({ sold_at: -1 });

    res.json({
      shopId,
      count: sales.length,
      sales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get sales by date range
exports.getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Start date and end date are required'
      });
    }

    const sales = await Sales.find({
      sold_at: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
      .populate('shop', 'name category')
      .populate('product', 'name price category')
      .sort({ sold_at: -1 });

    res.json({
      dateRange: { startDate, endDate },
      count: sales.length,
      sales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get today's sales
exports.getTodaySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await Sales.find({
      sold_at: {
        $gte: today,
        $lt: tomorrow
      }
    })
      .populate('shop', 'name category')
      .populate('product', 'name price category')
      .sort({ sold_at: -1 });

    res.json({
      date: today.toISOString().split('T')[0],
      count: sales.length,
      sales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get sales statistics
exports.getSalesStatistics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Execute all queries in parallel for better performance
    const [
      totalSales,
      todaySalesCount,
      monthSalesCount,
      revenueData
    ] = await Promise.all([
      Sales.countDocuments(),
      Sales.countDocuments({ sold_at: { $gte: today } }),
      Sales.countDocuments({ sold_at: { $gte: firstDayOfMonth } }),
      Sales.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: { $toDouble: '$total_price' }
            },
            totalQuantity: { $sum: '$quantity' },
            averageOrderValue: {
              $avg: { $toDouble: '$total_price' }
            }
          }
        }
      ])
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0] : {
      totalRevenue: 0,
      totalQuantity: 0,
      averageOrderValue: 0
    };

    res.json({
      statistics: {
        totalSales,
        todaySales: todaySalesCount,
        monthSales: monthSalesCount
      },
      revenue: {
        total: revenue.totalRevenue,
        totalQuantity: revenue.totalQuantity,
        averageOrderValue: revenue.averageOrderValue
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get sales statistics by shop
exports.getSalesStatsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const totalSales = await Sales.countDocuments({ shop: shopId });

    // Calculate revenue for this shop
    const revenueData = await Sales.aggregate([
      { $match: { shop: require('mongoose').Types.ObjectId(shopId) } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $toDouble: '$total_price' }
          },
          totalQuantity: { $sum: '$quantity' },
          averageOrderValue: {
            $avg: { $toDouble: '$total_price' }
          }
        }
      }
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0] : {
      totalRevenue: 0,
      totalQuantity: 0,
      averageOrderValue: 0
    };

    // Today's sales for this shop
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySalesCount = await Sales.countDocuments({
      shop: shopId,
      sold_at: { $gte: today }
    });

    res.json({
      shopId,
      statistics: {
        totalSales,
        todaySales: todaySalesCount
      },
      revenue: {
        total: revenue.totalRevenue,
        totalQuantity: revenue.totalQuantity,
        averageOrderValue: revenue.averageOrderValue
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get revenue by date range
exports.getRevenueByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Start date and end date are required'
      });
    }

    const revenueData = await Sales.aggregate([
      {
        $match: {
          sold_at: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $toDouble: '$total_price' }
          },
          totalQuantity: { $sum: '$quantity' },
          totalSales: { $sum: 1 },
          averageOrderValue: {
            $avg: { $toDouble: '$total_price' }
          }
        }
      }
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0] : {
      totalRevenue: 0,
      totalQuantity: 0,
      totalSales: 0,
      averageOrderValue: 0
    };

    res.json({
      dateRange: { startDate, endDate },
      revenue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get top selling shops
exports.getTopSellingShops = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topShops = await Sales.aggregate([
      {
        $group: {
          _id: '$shop',
          totalSales: { $sum: 1 },
          totalRevenue: {
            $sum: { $toDouble: '$total_price' }
          },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } },
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
        totalSales: shop.totalSales,
        totalRevenue: shop.totalRevenue,
        totalQuantity: shop.totalQuantity
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};