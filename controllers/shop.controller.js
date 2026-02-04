const Shop = require('../models/Shop');

exports.createShop = async (req, res) => {
  try {
    const newShop = new Shop(req.body);
    const savedShop = await newShop.save();
    res.status(201).json(savedShop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Boutique non trouvée" });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

