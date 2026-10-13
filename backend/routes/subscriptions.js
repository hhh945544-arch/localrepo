const router = require('express').Router();
const store = require('../data/store');
const { verifyToken } = require('../middleware/auth');

// GET /api/subscriptions/plans ────────────────────────────────────────────────
router.get('/plans', (req, res) => {
  res.json(store.subscriptionPlans);
});

// POST /api/subscriptions/activate ───────────────────────────────────────────
// Auth required. Body: { planId: 'starter' | 'pro' | 'enterprise' }
router.post('/activate', verifyToken, (req, res, next) => {
  try {
    const { planId, upiId } = req.body;

    if (!planId)
      return res.status(400).json({ error: 'planId is required.' });

    const plan = store.subscriptionPlans.find(p => p.id === planId);
    if (!plan)
      return res.status(404).json({ error: `Subscription plan "${planId}" not found.` });

    // Calculate expiry (~30 days from now)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const validUntil = expiry.toISOString().split('T')[0];

    const user = store.findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Update user's merchant profile
    const updatedUser = store.updateUser(req.user.id, {
      role: 'merchant',
      merchantProfile: {
        ...(user.merchantProfile || {}),
        businessName: user.merchantProfile?.businessName || `${user.name}'s Hub`,
        upiId: upiId || user.merchantProfile?.upiId || '',
        subscription: {
          plan: plan.id,
          status: 'active',
          validUntil,
          price: `${plan.price}/mo`
        }
      }
    });

    // Auto-create a debit transaction for the subscription
    const now = new Date();
    const dateStr = now.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    const tx = {
      id: `tx_${Date.now()}`,
      title: `Merchant Subscription - ${plan.name}`,
      type: 'debit',
      amount: plan.price,
      date: dateStr,
      status: 'Completed',
      upiId: upiId || 'pitstop.merchant@okaxis',
      hubName: 'PitStop Merchant Platform',
      ref: `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/SUB`,
      userId: req.user.id,
      createdAt: now.toISOString()
    };
    store.addTransaction(tx);

    // Broadcast update
    store.addUpdate({
      id: `up_${Date.now()}`,
      title: `🎉 ${updatedUser.name} Activated ${plan.name}`,
      time: 'Just now',
      type: 'merchant',
      summary: 'New merchant hub unlocked multi-location map pins and featured ad postings.',
      author: 'Merchant Network',
      createdAt: now.toISOString()
    });

    const { passwordHash, ...safeUser } = updatedUser;
    res.json({ plan, user: safeUser, transaction: tx });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
