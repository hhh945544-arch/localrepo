const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { verifyToken } = require('../middleware/auth');

// GET /api/transactions ────────────────────────────────────────────────────────
// Query params: ?type=credit|debit
router.get('/', verifyToken, (req, res) => {
  let result = [...store.transactions];
  if (req.query.type) result = result.filter(t => t.type === req.query.type);
  res.json(result);
});

// POST /api/transactions ───────────────────────────────────────────────────────
router.post('/', verifyToken, (req, res, next) => {
  try {
    const { title, type, amount, upiId, hubName } = req.body;

    if (!title || !type || !amount)
      return res.status(400).json({ error: 'title, type, and amount are required.' });

    if (!['credit', 'debit'].includes(type))
      return res.status(400).json({ error: 'type must be "credit" or "debit".' });

    const now = new Date();
    const dateStr = now.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    const newTx = {
      id: `tx_${uuidv4().slice(0, 8)}`,
      title,
      type,
      amount,
      date: dateStr,
      status: 'Completed',
      upiId: upiId || '',
      hubName: hubName || 'PitStop Platform',
      ref: `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/HUB`,
      userId: req.user.id,
      createdAt: now.toISOString()
    };

    store.addTransaction(newTx);
    res.status(201).json(newTx);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
