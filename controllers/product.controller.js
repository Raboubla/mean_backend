const Product = require('../models/Product');

// ==================== CRUD DE BASE ====================

// Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      message: 'Produit créé avec succès',
      product
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir tous les produits (avec pagination)
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate('shop', 'name category')
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    const total = await Product.countDocuments();

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop', 'name category floor');

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({
      message: 'Produit mis à jour avec succès',
      product
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================== FONCTIONS UTILES ====================

// Obtenir les produits d'une boutique spécifique
exports.getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find({ shop: req.params.shopId })
      .populate('shop', 'name category');

    res.json({
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rechercher des produits par nom ou catégorie
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Paramètre de recherche requis' });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).populate('shop', 'name category');

    res.json({
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Filtrer les produits par statut (actif/inactif)
exports.getProductsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const isActive = status.toLowerCase() === 'active';

    const products = await Product.find({ is_active: isActive })
      .populate('shop', 'name category');

    res.json({
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir tous les produits en promotion
exports.getPromotionalProducts = async (req, res) => {
  try {
    const now = new Date();

    const products = await Product.find({
      'promotion.discount_percent': { $exists: true, $gt: 0 },
      $or: [
        { 'promotion.end_date': { $gte: now } },
        { 'promotion.end_date': { $exists: false } }
      ],
      is_active: true
    }).populate('shop', 'name category');

    res.json({
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour le statut d'un produit (activer/désactiver)
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    product.is_active = !product.is_active;
    await product.save();

    res.json({
      message: `Produit ${product.is_active ? 'activé' : 'désactivé'} avec succès`,
      product
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les statistiques des produits par boutique
exports.getProductStatsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const totalProducts = await Product.countDocuments({ shop: shopId });
    const activeProducts = await Product.countDocuments({ shop: shopId, is_active: true });
    const inactiveProducts = await Product.countDocuments({ shop: shopId, is_active: false });

    const now = new Date();
    const promotionalProducts = await Product.countDocuments({
      shop: shopId,
      'promotion.discount_percent': { $exists: true, $gt: 0 },
      $or: [
        { 'promotion.end_date': { $gte: now } },
        { 'promotion.end_date': { $exists: false } }
      ]
    });

    // Grouper par catégorie
    const productsByCategory = await Product.aggregate([
      { $match: { shop: require('mongoose').Types.ObjectId(shopId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      shopId,
      statistics: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
        promotional: promotionalProducts
      },
      byCategory: productsByCategory
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les produits par catégorie
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      category: { $regex: category, $options: 'i' }
    }).populate('shop', 'name category');

    res.json({
      category,
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};