const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { verifyToken } = require('../middleware/auth');

// GET /api/ads ─────────────────────────────────────────────────────────────────
// Query params: ?hubId=
router.get('/', (req, res) => {
  let result = [...store.ads];
  if (req.query.hubId) result = result.filter(a => a.hubId === req.query.hubId);
  res.json(result);
});

// POST /api/ads ────────────────────────────────────────────────────────────────
// Auth required
router.post('/', verifyToken, (req, res, next) => {
  try {
    const { title, tagline, merchant, cta, hubId, badge, image, bgColor, borderColor } = req.body;

    if (!title || !hubId)
      return res.status(400).json({ error: 'title and hubId are required.' });

    const newAd = {
      id: `ad_${uuidv4().slice(0, 8)}`,
      title,
      tagline: tagline || '',
      merchant: merchant || req.user.id,
      cta: cta || 'Learn More',
      hubId,
      bgColor: bgColor || 'from-amber-500/20 to-orange-600/20',
      borderColor: borderColor || 'border-amber-500/40',
      badge: badge || 'MERCHANT PROMO',
      image: image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
      createdBy: req.user.id,
      createdAt: new Date().toISOString()
    };

    store.addAd(newAd);
    res.status(201).json(newAd);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
