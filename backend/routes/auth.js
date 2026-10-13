const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { verifyToken } = require('../middleware/auth');

// ── Helper: generate JWT ──────────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── Strip passwordHash from user before sending ───────────────────────────────
const sanitize = (user) => {
  const { passwordHash, ...safe } = user;
  return safe;
};

// POST /api/auth/register ─────────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, role, password, businessName } = req.body;

    if (!name || !email || !phone || !role || !password)
      return res.status(400).json({ error: 'name, email, phone, role, and password are required.' });

    if (!['gig_worker', 'merchant'].includes(role))
      return res.status(400).json({ error: 'role must be "gig_worker" or "merchant".' });

    if (store.findUserByEmail(email))
      return res.status(409).json({ error: 'An account with this email already exists.' });

    if (store.findUserByPhone(phone))
      return res.status(409).json({ error: 'An account with this phone number already exists.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${uuidv4().slice(0, 8)}`,
      name,
      email,
      phone,
      passwordHash,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
      gigWorkerProfile: role === 'gig_worker' ? {
        skills: [],
        rating: 0,
        totalGigsCompleted: 0,
        earningsThisMonth: '₹0',
        qrPassCode: `GIG-PASS-${Math.floor(10000 + Math.random() * 90000)}`,
        isFree: true
      } : undefined,
      merchantProfile: role === 'merchant' ? {
        businessName: businessName || `${name}'s Hub`,
        gstin: '',
        subscription: { plan: 'none', status: 'inactive', validUntil: null, price: null },
        hubsCount: 0,
        activeAds: 0,
        upiId: ''
      } : undefined,
      currentLocation: { lat: 28.6139, lng: 77.2090, address: 'Delhi, India' }
    };

    store.addUser(newUser);
    const token = signToken(newUser);

    res.status(201).json({ token, user: sanitize(newUser) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login ────────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password)
      return res.status(400).json({ error: 'Provide email or phone, plus password.' });

    const user = email ? store.findUserByEmail(email) : store.findUserByPhone(phone);
    if (!user)
      return res.status(401).json({ error: 'No account found with these credentials.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ error: 'Incorrect password.' });

    const token = signToken(user);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me ─────────────────────────────────────────────────────────────
router.get('/me', verifyToken, (req, res) => {
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(sanitize(user));
});

module.exports = router;
