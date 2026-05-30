const GroceryItem = require('../models/GroceryItem');

exports.getSummary = async (req, res) => {
  try {
    const allItems = await GroceryItem.find({ userId: req.user.id });
    const today = new Date();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    res.json({
      totalItems: allItems.length,
      lowStockItems: allItems.filter(i => i.quantity <= i.minStock),
      expiringSoonItems: allItems.filter(i =>
        i.expiryDate &&
        new Date(i.expiryDate) <= sevenDaysLater &&
        new Date(i.expiryDate) >= today
      ),
      categoryBreakdown: allItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};