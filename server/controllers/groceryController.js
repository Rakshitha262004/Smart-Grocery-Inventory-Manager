const GroceryItem = require('../models/GroceryItem');

exports.getItems = async (req, res) => {
  try {
    const items = await GroceryItem.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addItem = async (req, res) => {
  try {
    const { name, category, quantity, unit, minStock, expiryDate } = req.body;
    const item = await GroceryItem.create({
      userId: req.user.id, name, category, quantity, unit, minStock, expiryDate
    });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await GroceryItem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await GroceryItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Item deleted.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { change } = req.body;
    const item = await GroceryItem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    item.quantity = Math.max(0, item.quantity + change);
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};