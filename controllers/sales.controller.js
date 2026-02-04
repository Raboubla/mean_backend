const Sales = require('../models/Sales');

exports.createSale = async (req, res) => {
  try {
    const sale = new Sales(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    // On récupère les ventes et on affiche les détails du shop lié
    const sales = await Sales.find().populate('shop');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};