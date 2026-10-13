const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { verifyToken } = require('../middleware/auth');

// GET /api/hubs ───────────────────────────────────────────────────────────────
// Query params: ?category=  ?crowding=EMPTY|MODERATE|CROWDED  ?hasChai=  ?hasEv=
router.get('/', (req, res) => {
  let result = [...store.hubs];

  const { category, crowding, hasChai, hasEv, hasWashroom, hasFood } = req.query;
  if (category) result = result.filter(h => h.category.toLowerCase().includes(category.toLowerCase()));
  if (crowding) result = result.filter(h => h.crowdingStatus === crowding.toUpperCase());
  if (hasChai === 'true') result = result.filter(h => h.hasChai);
  if (hasEv === 'true') result = result.filter(h => h.hasEv);
  if (hasWashroom === 'true') result = result.filter(h => h.hasWashroom);
  if (hasFood === 'true') result = result.filter(h => h.hasFood);

  res.json(result);
});

// GET /api/hubs/:id ───────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const hub = store.findHubById(req.params.id);
  if (!hub) return res.status(404).json({ error: 'Hub not found.' });
  res.json(hub);
});

// POST /api/hubs ─────────────────────────────────────────────────────────────
// Auth required (merchant)
router.post('/', verifyToken, (req, res, next) => {
  try {
    const { name, category, address, lat, lng, phone, hours, amenities, description, image } = req.body;

    if (!name || !category || !address)
      return res.status(400).json({ error: 'name, category, and address are required.' });

    const newHub = {
      id: `hub_${uuidv4().slice(0, 8)}`,
      name,
      category,
      address,
      lat: lat || 28.6139,
      lng: lng || 77.2090,
      rating: 0,
      reviewsCount: 0,
      status: 'Open Now',
      hours: hours || '09:00 AM - 09:00 PM',
      distanceKm: 0,
      phone: phone || '',
      merchantId: req.user.id,
      merchantName: req.body.merchantName || name,
      crowdingStatus: 'EMPTY',
      crowdingLabel: 'EMPTY (Low Crowd)',
      dwellTimeAvg: '0 mins',
      amenities: amenities || [],
      hasChai: (amenities || []).some(a => a.toLowerCase().includes('chai')),
      hasEv: (amenities || []).some(a => a.toLowerCase().includes('ev') || a.toLowerCase().includes('charg')),
      hasWashroom: (amenities || []).some(a => a.toLowerCase().includes('wash')),
      hasFood: (amenities || []).some(a => a.toLowerCase().includes('food') || a.toLowerCase().includes('bite')),
      image: image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      availableJobsCount: 0,
      description: description || '',
      reviews: []
    };

    store.addHub(newHub);
    res.status(201).json(newHub);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/hubs/:id/crowding ────────────────────────────────────────────────
// Update crowding status: EMPTY | MODERATE | CROWDED
router.patch('/:id/crowding', verifyToken, (req, res, next) => {
  try {
    const { crowdingStatus } = req.body;
    if (!['EMPTY', 'MODERATE', 'CROWDED'].includes(crowdingStatus))
      return res.status(400).json({ error: 'crowdingStatus must be EMPTY, MODERATE, or CROWDED.' });

    const labelMap = {
      EMPTY: 'EMPTY (Low Crowd)',
      MODERATE: 'MODERATE (Normal)',
      CROWDED: 'CROWDED (High Rush)'
    };

    const updated = store.updateHub(req.params.id, {
      crowdingStatus,
      crowdingLabel: labelMap[crowdingStatus]
    });
    if (!updated) return res.status(404).json({ error: 'Hub not found.' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/hubs/:id/reviews ──────────────────────────────────────────────────
router.post('/:id/reviews', verifyToken, (req, res, next) => {
  try {
    const hub = store.findHubById(req.params.id);
    if (!hub) return res.status(404).json({ error: 'Hub not found.' });

    const { rating, comment } = req.body;
    if (!rating || !comment)
      return res.status(400).json({ error: 'rating and comment are required.' });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ error: 'rating must be between 1 and 5.' });

    const review = {
      id: `rev_${uuidv4().slice(0, 8)}`,
      user: req.user.id,
      rating: Number(rating),
      comment,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updatedReviews = [review, ...(hub.reviews || [])];
    const avgRating = Number(
      (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1)
    );

    const updated = store.updateHub(req.params.id, {
      reviews: updatedReviews,
      reviewsCount: updatedReviews.length,
      rating: avgRating
    });

    res.status(201).json({ review, hub: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
