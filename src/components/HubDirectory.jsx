import React, { useState } from 'react';
import { 
  Building2, 
  Star, 
  Clock, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  Plus, 
  TrendingUp, 
  Megaphone, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Send,
  X,
  Search,
  QrCode,
  Zap,
  Briefcase
} from 'lucide-react';
import { MAGIC_FEATURES, createCoverDataUri } from '../data/mockData';

export default function HubDirectory({ 
  hubs, 
  ads, 
  user, 
  onAddReview, 
  onAddHub, 
  onAddAd, 
  onOpenSubscription 
}) {
  const [selectedHubForReview, setSelectedHubForReview] = useState(null);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'high_rating', 'ads', 'features'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for Merchant
  const [showAddHubModal, setShowAddHubModal] = useState(false);
  const [newHubName, setNewHubName] = useState('');
  const [newHubCategory, setNewHubCategory] = useState('Logistics & Dispatch');
  const [newHubAddress, setNewHubAddress] = useState('');

  // Merchant Ad creation state
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdTagline, setNewAdTagline] = useState('');
  const [newAdBadge, setNewAdBadge] = useState('MERCHANT PROMO');
  const [newAdCta, setNewAdCta] = useState('Claim Offer');

  const isMerchant = user.role === 'merchant';
  const isSubscribed = isMerchant && user.merchantProfile?.subscription?.status === 'active';

  // Filter hubs based on search query and active tab
  const filteredHubs = hubs.filter(hub => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = 
        hub.name.toLowerCase().includes(q) ||
        hub.category.toLowerCase().includes(q) ||
        hub.address.toLowerCase().includes(q) ||
        hub.merchantName?.toLowerCase().includes(q) ||
        hub.description?.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (activeTab === 'high_rating') return hub.rating >= 4.7;
    return true;
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedHubForReview || !commentInput.trim()) return;

    onAddReview(selectedHubForReview.id, {
      id: `r_${Date.now()}`,
      user: user.name,
      rating: ratingInput,
      comment: commentInput,
      date: 'Just now'
    });

    setSelectedHubForReview(null);
    setCommentInput('');
  };

  const handleCreateHub = (e) => {
    e.preventDefault();
    if (!isSubscribed) {
      onOpenSubscription();
      return;
    }

    onAddHub({
      id: `hub_${Date.now()}`,
      name: newHubName || `${user.merchantProfile?.businessName || 'Merchant'} Hub`,
      category: newHubCategory,
      address: newHubAddress || 'Outer Ring Road, Delhi NCR',
      lat: 28.6180 + (Math.random() - 0.5) * 0.02,
      lng: 77.2150 + (Math.random() - 0.5) * 0.02,
      rating: 5.0,
      reviewsCount: 1,
      status: 'Open Now',
      hours: '08:00 AM - 10:00 PM',
      distanceKm: 0.8,
      phone: user.phone || '+91 98000 11122',
      merchantId: user.id,
      merchantName: user.merchantProfile?.businessName || user.name,
      crowdingStatus: 'EMPTY',
      amenities: ['Free Charging', 'Chilled Water', 'Hot Chai'],
      image: createCoverDataUri('New Hub', '#1d4ed8', '#0f172a'),
      availableJobsCount: 2,
      description: 'Newly registered business hub offering instant gig shifts.',
      reviews: [{ id: 'r_init', user: user.name, rating: 5, comment: 'Welcome to our hub!', date: 'Just now' }]
    });

    setShowAddHubModal(false);
    setNewHubName('');
  };

  const handleCreateAd = (e) => {
    e.preventDefault();
    if (!isSubscribed) {
      onOpenSubscription();
      return;
    }

    const newAd = {
      id: `ad_${Date.now()}`,
      title: newAdTitle || 'Special Merchant Offer',
      tagline: newAdTagline || 'Exclusive rider benefit provided by merchant hub.',
      merchant: user.merchantProfile?.businessName || user.name || 'Merchant Hub',
      cta: newAdCta || 'Claim Offer',
      badge: newAdBadge || 'MERCHANT PROMO',
      bgColor: 'from-amber-500/20 to-orange-600/20',
      borderColor: 'border-amber-500/40',
      image: createCoverDataUri('Merchant Offer', '#f59e0b', '#b45309')
    };

    if (onAddAd) {
      onAddAd(newAd);
    }

    setShowAddAdModal(false);
    setNewAdTitle('');
    setNewAdTagline('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Sub-Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" /> PitStop Hub Directory & Merchant Ads
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
            Merchant Hubs, Ratings & Active Campaigns
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Check verified ratings, read reviews from gig workers, and view merchant-run promotions.
          </p>
        </div>

        {/* Merchant Controls */}
        {isMerchant ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSubscribed) {
                  setShowAddAdModal(true);
                } else {
                  onOpenSubscription();
                }
              }}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 flex items-center space-x-2 shrink-0 transition hover:brightness-110"
            >
              <Megaphone className="w-4 h-4" />
              <span>+ Post Merchant Ad</span>
            </button>

            <button
              onClick={() => {
                if (isSubscribed) {
                  setShowAddHubModal(true);
                } else {
                  onOpenSubscription();
                }
              }}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-600/20 flex items-center space-x-2 shrink-0 transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Hub</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Gig Worker: Verified Access</span>
          </div>
        )}
      </div>

      {/* =========================================================
          MAGIC FEATURES SECTION (DIRECTLY MATCHING USER SLIDE)
         ========================================================= */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> (Our Services)
            </div>
            <h2 className="text-2xl font-black text-white font-outfit mt-0.5">
              Magic Features
            </h2>
          </div>
          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            5 Core Pillars of PitStop
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {MAGIC_FEATURES.map((mf) => (
            <div 
              key={mf.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {mf.badge}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center text-xs">
                    ★
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-base font-outfit">{mf.title}</h3>
                <p className="text-emerald-400 text-[11px] font-semibold mt-0.5">{mf.subtitle}</p>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">{mf.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          MERCHANT ADS SHOWCASE ("jo add run ho rahi h wo merchant ka kar do")
         ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-amber-400 animate-bounce" />
            <h2 className="text-xl font-bold text-white font-outfit">Active Merchant Advertisements</h2>
          </div>
          <span className="text-xs text-amber-400/90 font-semibold">Exclusively Run by Merchant Hubs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className={`p-5 rounded-3xl bg-gradient-to-br ${ad.bgColor || 'from-amber-500/20 to-orange-600/20'} border ${ad.borderColor || 'border-amber-500/40'} relative overflow-hidden flex flex-col justify-between group hover:border-amber-400/60 transition shadow-xl`}
            >
              <div className="flex items-start justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950 tracking-wider shadow">
                  {ad.badge}
                </span>
                <span className="text-xs text-slate-300 font-semibold truncate max-w-[150px]">
                  {ad.merchant}
                </span>
              </div>

              <div className="my-4">
                <h3 className="text-lg font-extrabold text-white font-outfit leading-snug">{ad.title}</h3>
                <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">{ad.tagline}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  className="py-2 px-3.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-amber-400 transition shadow flex items-center space-x-1.5"
                >
                  <span>{ad.cta || 'Claim Offer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-emerald-400 font-semibold">Verified Merchant Ad</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          HUB DIRECTORY LIST WITH RATINGS & REVIEWS
         ========================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <h2 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Merchant Hub Ratings & Verified Reviews</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Directory Search Bar */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hubs, areas..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white transition"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Hubs ({hubs.length})
              </button>
              <button
                onClick={() => setActiveTab('high_rating')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  activeTab === 'high_rating'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Top Rated ★4.7+
              </button>
            </div>
          </div>
        </div>

        {/* Hub Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHubs.map((hub) => (
            <div 
              key={hub.id}
              className="glass-panel rounded-3xl border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img 
                    src={hub.image} 
                    alt={hub.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-700 backdrop-blur-md">
                      {hub.category}
                    </span>
                    {hub.crowdingStatus && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        hub.crowdingStatus === 'EMPTY' ? 'bg-emerald-500/80 text-white' :
                        hub.crowdingStatus === 'CROWDED' ? 'bg-rose-500/80 text-white' : 'bg-amber-500/80 text-slate-950'
                      }`}>
                        ● {hub.crowdingStatus}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-amber-500/90 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{hub.rating}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-extrabold text-white text-lg font-outfit">{hub.name}</h3>
                    <p className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {hub.address}
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-slate-400 text-xs leading-relaxed">{hub.description}</p>

                  {/* Amenities */}
                  {hub.amenities && (
                    <div className="flex flex-wrap gap-1.5">
                      {hub.amenities.map((a, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          ✓ {a}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Recent Review Snippets */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Recent Gig Worker Reviews ({hub.reviews?.length || 0})</span>
                      <button 
                        onClick={() => setSelectedHubForReview(hub)}
                        className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" /> + Write Review
                      </button>
                    </div>

                    {hub.reviews && hub.reviews.slice(0, 2).map((rev) => (
                      <div key={rev.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{rev.user}</span>
                          <span className="text-amber-400 font-bold">★ {rev.rating}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedHubForReview(hub)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs transition flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Rate Hub & Post Experience</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {selectedHubForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-slate-700/60 p-6 shadow-2xl">
            <button 
              onClick={() => setSelectedHubForReview(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-outfit">Review {selectedHubForReview.name}</h3>
            <p className="text-slate-400 text-xs mt-1">Provide honest feedback on hub facilities & payouts.</p>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className={`p-2 rounded-xl border text-base ${
                        star <= ratingInput 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Comment</label>
                <textarea
                  rows={3}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tell other riders about water, charging, staff behavior and payouts..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Verified Review</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Merchant Add Hub Modal */}
      {showAddHubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-slate-700/60 p-6 shadow-2xl">
            <button 
              onClick={() => setShowAddHubModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-outfit">Create Merchant Hub Listing</h3>
            <p className="text-slate-400 text-xs mt-1">Merchant Business Pro Feature</p>

            <form onSubmit={handleCreateHub} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hub Name</label>
                <input
                  type="text"
                  value={newHubName}
                  onChange={(e) => setNewHubName(e.target.value)}
                  placeholder="e.g. South Delhi Fulfillment Hub"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newHubCategory}
                  onChange={(e) => setNewHubCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                >
                  <option value="Chai, Food & EV Rest Hub">Chai, Food & EV Rest Hub</option>
                  <option value="Logistics & Dispatch">Logistics & Dispatch</option>
                  <option value="Retail & Grocery">Retail & Grocery</option>
                  <option value="E-Commerce Hub">E-Commerce Hub</option>
                  <option value="Food Delivery Depot">Food Delivery Depot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={newHubAddress}
                  onChange={(e) => setNewHubAddress(e.target.value)}
                  placeholder="Full street address in New Delhi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-xl"
              >
                Publish Hub & Map Marker
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Merchant Post Ad Campaign Modal ("jo add run ho rahi h wo merchant ka kar do") */}
      {showAddAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-slate-700/60 p-6 shadow-2xl">
            <button 
              onClick={() => setShowAddAdModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase mb-1">
              <Megaphone className="w-4 h-4" /> Merchant Ad Campaign
            </div>
            <h3 className="text-xl font-bold text-white font-outfit">Create & Run Merchant Ad</h3>
            <p className="text-slate-400 text-xs mt-1">Run promoted offers across all rider dashboards.</p>

            <form onSubmit={handleCreateAd} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Campaign Title</label>
                <input
                  type="text"
                  value={newAdTitle}
                  onChange={(e) => setNewAdTitle(e.target.value)}
                  placeholder="e.g. ☕ Free Cutting Chai & ₹50 Fuel Coupon"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Offer Tagline / Details</label>
                <textarea
                  rows={2}
                  value={newAdTagline}
                  onChange={(e) => setNewAdTagline(e.target.value)}
                  placeholder="e.g. Available for all gig riders reporting shifts this afternoon at Sharma Dhaba."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Tag</label>
                  <select
                    value={newAdBadge}
                    onChange={(e) => setNewAdBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="MERCHANT PROMO">MERCHANT PROMO</option>
                    <option value="SPECIAL OFFER">SPECIAL OFFER</option>
                    <option value="SPONSORED CAMPAIGN">SPONSORED CAMPAIGN</option>
                    <option value="FUEL BONUS">FUEL BONUS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Button CTA</label>
                  <input
                    type="text"
                    value={newAdCta}
                    onChange={(e) => setNewAdCta(e.target.value)}
                    placeholder="e.g. Claim Offer"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 transition flex items-center justify-center space-x-2"
              >
                <Megaphone className="w-4 h-4" />
                <span>Launch & Run Merchant Ad</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
