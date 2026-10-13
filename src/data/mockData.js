// PitStop Mock Dataset

const svgToDataUri = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export const createAvatarDataUri = (label, start = '#34d399', end = '#0f172a') =>
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${start}"/>
          <stop offset="100%" stop-color="${end}"/>
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="40" fill="url(#g)"/>
      <circle cx="80" cy="60" r="28" fill="rgba(255,255,255,0.18)"/>
      <path d="M36 132c10-22 29-33 44-33s34 11 44 33" fill="rgba(255,255,255,0.18)"/>
      <text x="80" y="90" text-anchor="middle" font-size="34" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#ffffff">${label}</text>
    </svg>
  `);

export const createCoverDataUri = (label, start = '#0f172a', end = '#2563eb') =>
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
      <defs>
        <linearGradient id="cover" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${start}"/>
          <stop offset="100%" stop-color="${end}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="420" rx="28" fill="url(#cover)"/>
      <circle cx="120" cy="120" r="72" fill="rgba(255,255,255,0.08)"/>
      <circle cx="700" cy="320" r="110" fill="rgba(255,255,255,0.06)"/>
      <rect x="56" y="248" width="365" height="76" rx="18" fill="rgba(15,23,42,0.26)"/>
      <text x="80" y="300" font-size="42" font-weight="700" fill="#f8fafc" font-family="Arial, Helvetica, sans-serif">${label}</text>
    </svg>
  `);

export const INITIAL_USER = {
  id: 'usr_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@gigconnect.com',
  phone: '+91 98765 43210',
  role: 'gig_worker', // 'gig_worker' or 'merchant'
  avatar: createAvatarDataUri('AR', '#34d399', '#0f172a'),
  gigWorkerProfile: {
    skills: ['Express Delivery', 'Warehouse Sorting', 'Retail Stacking', 'Event Logistics'],
    rating: 4.9,
    totalGigsCompleted: 48,
    earningsThisMonth: '₹18,450',
    qrPassCode: 'GIG-PASS-98214',
    isFree: true,
  },
  merchantProfile: {
    businessName: 'Metro Dispatch & Hub Logistics',
    gstin: '07AAAAA0000A1Z5',
    subscription: {
      plan: 'pro', // 'none', 'starter', 'pro', 'enterprise'
      status: 'active', // 'inactive', 'active', 'expired'
      validUntil: '2026-11-30',
      price: '₹2,499/mo',
    },
    hubsCount: 3,
    activeAds: 2,
    upiId: 'metrohub@okaxis',
  },
  currentLocation: {
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place, Central Delhi, 110001',
  }
};

export const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter Merchant',
    price: '₹999',
    period: '/month',
    features: ['1 Hub Location Listing', 'Up to 5 Active Job Posts', 'Basic Ratings & Reviews', 'UPI QR Payout Support'],
    recommended: false,
    badge: 'Basic'
  },
  {
    id: 'pro',
    name: 'Business Pro Hub',
    price: '₹2,499',
    period: '/month',
    features: ['Up to 5 Hub Locations', 'Unlimited Job Posts', 'Featured Ad Banner Banner Boost', 'Priority Worker Matching', 'Real-time Live Tracking', '24/7 Priority Support'],
    recommended: true,
    badge: 'Most Popular'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Fleet',
    price: '₹4,999',
    period: '/month',
    features: ['Unlimited Hub Locations', 'Dedicated Account Manager', 'Custom API Integration', 'Instant Bulk Payouts via UPI', 'Custom Ad Campaigns', 'Advanced Analytics'],
    recommended: false,
    badge: 'Enterprise'
  }
];

export const MOCK_HUBS = [
  {
    id: 'hub_sharma',
    name: 'Sharma Dhaba',
    category: 'Chai, Food & EV Rest Hub',
    address: 'Near Delhi Bypass, Outer Ring Road',
    lat: 28.6150,
    lng: 77.2110,
    rating: 4.9,
    reviewsCount: 382,
    status: 'Open Now',
    hours: '24 Hours',
    distanceKm: 0.2,
    phone: '+91 98111 44552',
    merchantId: 'merch_sharma',
    merchantName: 'Sharma Dhaba & Rest Point',
    crowdingStatus: 'EMPTY', // 'EMPTY' (green), 'MODERATE' (yellow), 'CROWDED' (red)
    crowdingLabel: 'EMPTY (Low Crowd)',
    dwellTimeAvg: '24 mins',
    amenities: ['Free Charging', 'Chilled Water', 'Hot Chai', 'Clean Washroom'],
    hasChai: true,
    hasEv: true,
    hasWashroom: true,
    hasFood: true,
    image: createCoverDataUri('Sharma Dhaba', '#f59e0b', '#7c2d12'),
    availableJobsCount: 5,
    description: 'Popular rider rest stop with high-speed EV charging, fresh cutting chai, chilled RO water, and clean resting washrooms.',
    reviews: [
      { id: 'rs1', user: 'Sunil V. (Zomato Rider)', rating: 5, comment: 'Chilled water and free mobile charging is a lifesaver during afternoon heat!', date: 'Today' },
      { id: 'rs2', user: 'Harish M. (Blinkit Rider)', rating: 5, comment: 'Very respectful staff, fast food and great tea.', date: 'Yesterday' }
    ]
  },
  {
    id: 'hub_1',
    name: 'Central Express Logistics Hub',
    category: 'Logistics & Dispatch',
    address: 'Block B, Connaught Place, New Delhi',
    lat: 28.6145,
    lng: 77.2095,
    rating: 4.8,
    reviewsCount: 142,
    status: 'Open Now',
    hours: '06:00 AM - 11:00 PM',
    distanceKm: 0.4,
    phone: '+91 98111 22334',
    merchantId: 'merch_01',
    merchantName: 'Apex Supply Chain Ltd',
    crowdingStatus: 'CROWDED',
    crowdingLabel: 'CROWDED (High Rush)',
    dwellTimeAvg: '15 mins',
    amenities: ['Package Sorting', 'EV Dock', 'Washroom'],
    hasChai: false,
    hasEv: true,
    hasWashroom: true,
    hasFood: false,
    image: createCoverDataUri('Central Hub', '#1d4ed8', '#0f172a'),
    availableJobsCount: 4,
    description: 'Premier urban fulfillment center offering instant payout shifts for package handlers and delivery drivers.',
    reviews: [
      { id: 'r1', user: 'Rahul S.', rating: 5, comment: 'Super fast UPI payouts right after shift completion!', date: '2 days ago' },
      { id: 'r2', user: 'Pooja M.', rating: 4.5, comment: 'Clean facility, friendly hub manager.', date: '1 week ago' }
    ]
  },
  {
    id: 'hub_2',
    name: 'GreenFresh Agro Market Depot',
    category: 'Retail & Grocery',
    address: 'Mandi House, Barakhamba Road, New Delhi',
    lat: 28.6230,
    lng: 77.2300,
    rating: 4.6,
    reviewsCount: 98,
    status: 'Open Now',
    hours: '05:00 AM - 09:00 PM',
    distanceKm: 1.2,
    phone: '+91 98222 33445',
    merchantId: 'merch_02',
    merchantName: 'GreenFresh Retailers',
    crowdingStatus: 'MODERATE',
    crowdingLabel: 'MODERATE (Normal)',
    dwellTimeAvg: '18 mins',
    amenities: ['Chilled Water', 'Washroom', 'EV Charge'],
    hasChai: true,
    hasEv: true,
    hasWashroom: true,
    hasFood: true,
    image: createCoverDataUri('GreenFresh', '#22c55e', '#14532d'),
    availableJobsCount: 6,
    description: 'High-volume organic grocery sorting and quick delivery distribution node.',
    reviews: [
      { id: 'r3', user: 'Vikas K.', rating: 5, comment: 'Great atmosphere and hourly bonus pay on weekends.', date: 'Yesterday' }
    ]
  },
  {
    id: 'hub_3',
    name: 'TechPark Quick-Parcel Hub',
    category: 'E-Commerce Hub',
    address: 'IT Park Phase 2, Okhla, New Delhi',
    lat: 28.6000,
    lng: 77.2180,
    rating: 4.9,
    reviewsCount: 215,
    status: 'Open 24/7',
    hours: '24 Hours',
    distanceKm: 2.1,
    phone: '+91 98333 44556',
    merchantId: 'merch_03',
    merchantName: 'HyperFast Logistics',
    crowdingStatus: 'EMPTY',
    crowdingLabel: 'EMPTY (Smooth)',
    dwellTimeAvg: '28 mins',
    amenities: ['Free Charging', 'Rest Room', 'Chilled Water', 'Hot Chai'],
    hasChai: true,
    hasEv: true,
    hasWashroom: true,
    hasFood: false,
    image: createCoverDataUri('TechPark', '#06b6d4', '#0f172a'),
    availableJobsCount: 8,
    description: 'Automated 24/7 e-commerce parcel sorting facility with instant QR check-in.',
    reviews: [
      { id: 'r4', user: 'Amit P.', rating: 5, comment: 'QR scan check-in makes starting work seamless.', date: '3 days ago' }
    ]
  },
  {
    id: 'hub_4',
    name: 'Urban Bite Cloud Kitchen Hub',
    category: 'Food Delivery Depot',
    address: 'Khan Market South, New Delhi',
    lat: 28.6005,
    lng: 77.2270,
    rating: 4.7,
    reviewsCount: 164,
    status: 'Busy',
    hours: '11:00 AM - 02:00 AM',
    distanceKm: 1.8,
    phone: '+91 98444 55667',
    merchantId: 'merch_04',
    merchantName: 'Urban Bite Brands',
    crowdingStatus: 'MODERATE',
    crowdingLabel: 'MODERATE',
    dwellTimeAvg: '12 mins',
    amenities: ['Chai Counter', 'Washroom', 'Quick Bite'],
    hasChai: true,
    hasEv: false,
    hasWashroom: true,
    hasFood: true,
    image: createCoverDataUri('Urban Bite', '#f97316', '#7c2d12'),
    availableJobsCount: 3,
    description: 'Multi-brand cloud kitchen dispatch point with peak-hour delivery incentives.',
    reviews: [
      { id: 'r5', user: 'Sanjay T.', rating: 4, comment: 'High demand during lunch and dinner slots.', date: '4 days ago' }
    ]
  }
];

export const MOCK_ADS = [
  {
    id: 'ad_sharma',
    title: '☕ Special ₹10 Kadak Chai & Free Mobile Charging',
    tagline: 'Exclusive for registered PitStop riders at Sharma Dhaba. Relax in air-cooled lounge.',
    merchant: 'Sharma Dhaba & Rest Point',
    cta: 'Claim Offer',
    hubId: 'hub_sharma',
    bgColor: 'from-amber-500/20 to-orange-600/20',
    borderColor: 'border-amber-500/40',
    badge: 'MERCHANT PROMO',
    image: createCoverDataUri('Chai Offer', '#f59e0b', '#b45309')
  },
  {
    id: 'ad_1',
    title: '⚡ Weekend Surge Bonus at Central Hub!',
    tagline: 'Earn +₹150 extra per shift completed this Saturday & Sunday.',
    merchant: 'Central Express Logistics Hub',
    cta: 'View Open Shifts',
    hubId: 'hub_1',
    bgColor: 'from-amber-500/20 to-orange-600/20',
    borderColor: 'border-amber-500/40',
    badge: 'SPONSORED AD',
    image: createCoverDataUri('Weekend Bonus', '#1d4ed8', '#0f172a')
  },
  {
    id: 'ad_2',
    title: '🚀 Free Fuel Allowance for Express Drivers',
    tagline: 'Get ₹200 daily fuel coupon when you complete 5 deliveries at TechPark Hub.',
    merchant: 'TechPark Quick-Parcel Hub',
    cta: 'Apply Now',
    hubId: 'hub_3',
    bgColor: 'from-blue-500/20 to-cyan-600/20',
    borderColor: 'border-blue-500/40',
    badge: 'MERCHANT PROMO',
    image: createCoverDataUri('Fuel Allowance', '#06b6d4', '#0f172a')
  }
];

export const MOCK_JOBS = [
  {
    id: 'job_101',
    title: 'Express Parcel Delivery Partner',
    hubId: 'hub_1',
    hubName: 'Central Express Logistics Hub',
    category: 'Delivery',
    payRate: '₹350 / hour',
    shift: '4 Hours (Evening)',
    spotsLeft: 3,
    requirements: ['Own Two-Wheeler / EV', 'Valid Driving License', 'Smartphone with GPS'],
    description: 'Deliver retail packages in 3-5 km radius. Instant UPI payout upon shift report.',
    urgent: true,
    applied: false
  },
  {
    id: 'job_102',
    title: 'Warehouse Package Sorter & Loader',
    hubId: 'hub_1',
    hubName: 'Central Express Logistics Hub',
    category: 'Warehouse',
    payRate: '₹280 / hour',
    shift: '6 Hours (Morning)',
    spotsLeft: 5,
    requirements: ['Physical Stamina', 'Basic English/Hindi Reading'],
    description: 'Sort inbound packages into postal code bins using barcode scanner.',
    urgent: false,
    applied: true,
    status: 'In Progress'
  },
  {
    id: 'job_103',
    title: 'Fresh Produce Quality Inspector',
    hubId: 'hub_2',
    hubName: 'GreenFresh Agro Market Depot',
    category: 'Retail & Sorting',
    payRate: '₹300 / hour',
    shift: '5 Hours (Early Morning)',
    spotsLeft: 2,
    requirements: ['Attention to Detail', 'Punctuality'],
    description: 'Inspect fresh fruit and vegetable crates, weigh batches, and tag crates.',
    urgent: true,
    applied: false
  },
  {
    id: 'job_104',
    title: 'Night Shift Fleet Coordinator',
    hubId: 'hub_3',
    hubName: 'TechPark Quick-Parcel Hub',
    category: 'Operations',
    payRate: '₹420 / hour',
    shift: '8 Hours (Night)',
    spotsLeft: 1,
    requirements: ['Prior Dispatch Experience', 'QR Attendance Management'],
    description: 'Manage dispatch line and assign outgoing delivery manifests to drivers.',
    urgent: false,
    applied: false
  }
];

export const MOCK_UPDATES = [
  {
    id: 'up_1',
    title: '⚡ Instant UPI Payout Engine Online',
    time: '10 mins ago',
    type: 'feature',
    summary: 'Gig workers can now scan QR codes at hubs to receive instant zero-fee payouts directly to GPay, PhonePe, or Paytm.',
    author: 'PitStop System Admin'
  },
  {
    id: 'up_2',
    title: '📢 Central Express Hub Added 12 Evening Shifts',
    time: '1 hour ago',
    type: 'job_alert',
    summary: 'High demand for parcel delivery partners near Connaught Place. Base pay increased by ₹50/hr.',
    author: 'Central Express Hub Manager'
  },
  {
    id: 'up_3',
    title: '🏷️ New Merchant Subscription Discounts Launched',
    time: '3 hours ago',
    type: 'merchant',
    summary: 'Merchants signing up for Business Pro plan get 1 free Featured Ad banner boost.',
    author: 'Growth Team'
  },
  {
    id: 'up_4',
    title: '📍 Live Tracking Map Upgrade Released',
    time: 'Yesterday',
    type: 'app_update',
    summary: 'Real-time proximity markers now accurately update worker distance to nearest hiring hubs within 50 meters.',
    author: 'Product Team'
  }
];

export const MOCK_TRANSACTIONS = [
  {
    id: 'tx_901',
    title: 'Shift Payout - Parcel Delivery',
    type: 'credit',
    amount: '₹1,400',
    date: '11 Oct 2026, 02:15 PM',
    status: 'Completed',
    upiId: 'alex.rivera@okicici',
    hubName: 'Central Express Logistics Hub',
    ref: 'UPI/9812739182/HUB'
  },
  {
    id: 'tx_902',
    title: 'Shift Payout - Warehouse Sorting',
    type: 'credit',
    amount: '₹1,680',
    date: '09 Oct 2026, 06:30 PM',
    status: 'Completed',
    upiId: 'alex.rivera@okicici',
    hubName: 'TechPark Quick-Parcel Hub',
    ref: 'UPI/9812700921/HUB'
  },
  {
    id: 'tx_903',
    title: 'Merchant Subscription - Business Pro',
    type: 'debit',
    amount: '₹2,499',
    date: '01 Oct 2026, 10:00 AM',
    status: 'Completed',
    upiId: 'metrohub@okaxis',
    hubName: 'PitStop Merchant Platform',
    ref: 'UPI/9811100451/SUB'
  }
];
