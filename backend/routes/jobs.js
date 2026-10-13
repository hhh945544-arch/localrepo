const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { verifyToken } = require('../middleware/auth');

// GET /api/jobs ───────────────────────────────────────────────────────────────
// Query params: ?hubId=  ?category=  ?urgent=true
router.get('/', (req, res) => {
  let result = [...store.jobs];

  const { hubId, category, urgent } = req.query;
  if (hubId) result = result.filter(j => j.hubId === hubId);
  if (category) result = result.filter(j => j.category.toLowerCase().includes(category.toLowerCase()));
  if (urgent === 'true') result = result.filter(j => j.urgent);

  res.json(result);
});

// GET /api/jobs/:id ───────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const job = store.findJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found.' });
  res.json(job);
});

// POST /api/jobs ──────────────────────────────────────────────────────────────
// Auth required (merchant)
router.post('/', verifyToken, (req, res, next) => {
  try {
    if (req.user.role !== 'merchant')
      return res.status(403).json({ error: 'Only merchants can post jobs.' });

    const { title, hubId, hubName, category, payRate, shift, spotsLeft, requirements, description, urgent } = req.body;

    if (!title || !hubId || !category || !payRate)
      return res.status(400).json({ error: 'title, hubId, category, and payRate are required.' });

    const newJob = {
      id: `job_${uuidv4().slice(0, 8)}`,
      title,
      hubId,
      hubName: hubName || hubId,
      category,
      payRate,
      shift: shift || 'Flexible',
      spotsLeft: Number(spotsLeft) || 1,
      requirements: requirements || [],
      description: description || '',
      urgent: Boolean(urgent),
      applied: false,
      postedBy: req.user.id,
      postedAt: new Date().toISOString()
    };

    store.addJob(newJob);

    // Update hub's availableJobsCount
    const hub = store.findHubById(hubId);
    if (hub) store.updateHub(hubId, { availableJobsCount: (hub.availableJobsCount || 0) + 1 });

    res.status(201).json(newJob);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/jobs/:id/apply ──────────────────────────────────────────────────
// Mark job as applied (gig worker)
router.patch('/:id/apply', verifyToken, (req, res, next) => {
  try {
    const job = store.findJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });
    if (job.applied) return res.status(409).json({ error: 'You have already applied to this job.' });
    if (job.spotsLeft <= 0) return res.status(409).json({ error: 'No spots left for this job.' });

    const updated = store.updateJob(req.params.id, {
      applied: true,
      status: 'In Progress',
      spotsLeft: job.spotsLeft - 1,
      appliedBy: req.user.id,
      appliedAt: new Date().toISOString()
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
