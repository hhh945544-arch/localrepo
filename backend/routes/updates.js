const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { verifyToken } = require('../middleware/auth');

// GET /api/updates ─────────────────────────────────────────────────────────────
// Query params: ?type=feature|job_alert|merchant|app_update|system
router.get('/', (req, res) => {
  let result = [...store.updates];
  if (req.query.type) result = result.filter(u => u.type === req.query.type);
  res.json(result);
});

// POST /api/updates ────────────────────────────────────────────────────────────
// Auth required
router.post('/', verifyToken, (req, res, next) => {
  try {
    const { title, summary, type, author } = req.body;

    if (!title || !summary)
      return res.status(400).json({ error: 'title and summary are required.' });

    const validTypes = ['feature', 'job_alert', 'merchant', 'app_update', 'system'];
    const resolvedType = validTypes.includes(type) ? type : 'system';

    const newUpdate = {
      id: `up_${uuidv4().slice(0, 8)}`,
      title,
      time: 'Just now',
      type: resolvedType,
      summary,
      author: author || req.user.id,
      createdAt: new Date().toISOString()
    };

    store.addUpdate(newUpdate);
    res.status(201).json(newUpdate);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
