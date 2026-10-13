import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Plus, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Building2,
  X
} from 'lucide-react';

export default function JobExplorer({ 
  jobs, 
  user, 
  onApplyJob, 
  onPostJob, 
  onOpenSubscription 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAppliedOnly, setShowAppliedOnly] = useState(false);

  // Post Job Modal State for Merchants
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('Delivery');
  const [jobPayRate, setJobPayRate] = useState('350');
  const [jobShift, setJobShift] = useState('4 Hours (Evening)');

  const isMerchant = user.role === 'merchant';
  const isSubscribed = isMerchant && user.merchantProfile?.subscription?.status === 'active';

  const filteredJobs = jobs.filter(job => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm.trim() ||
                          job.title.toLowerCase().includes(q) || 
                          job.hubName.toLowerCase().includes(q) ||
                          job.category.toLowerCase().includes(q) ||
                          job.payRate.toLowerCase().includes(q) ||
                          job.description?.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || job.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesApplied = showAppliedOnly ? job.applied : true;
    return matchesSearch && matchesCategory && matchesApplied;
  });

  const handlePostJobSubmit = (e) => {
    e.preventDefault();
    if (!isSubscribed) {
      onOpenSubscription();
      return;
    }

    onPostJob({
      id: `job_${Date.now()}`,
      title: jobTitle || 'Parcel Delivery Helper',
      hubId: 'hub_1',
      hubName: user.merchantProfile?.businessName || 'Central Express Logistics Hub',
      category: jobCategory,
      payRate: `₹${jobPayRate} / hour`,
      shift: jobShift,
      spotsLeft: 4,
      requirements: ['Smartphone with GPS', 'Punctuality'],
      description: 'Instant payout shift posted by merchant hub.',
      urgent: true,
      applied: false
    });

    setShowPostJobModal(false);
    setJobTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Sub-Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" /> 4th Tab: Explore Gig Jobs
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
            Find High-Paying Hub Shifts & Apply Instantly
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse open jobs posted by merchant hubs with verified instant UPI payouts.
          </p>
        </div>

        {isMerchant ? (
          <button
            onClick={() => {
              if (isSubscribed) {
                setShowPostJobModal(true);
              } else {
                onOpenSubscription();
              }
            }}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 shrink-0 transition hover:brightness-110"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubscribed ? '+ Post New Shift Job' : 'Subscribe to Post Jobs'}</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2.5 rounded-2xl text-xs text-emerald-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Gig Worker: 100% Free Application</span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or hub..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white transition"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setSelectedCategory('delivery')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
              selectedCategory === 'delivery' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Delivery
          </button>
          <button
            onClick={() => setSelectedCategory('warehouse')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
              selectedCategory === 'warehouse' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Warehouse
          </button>
          <button
            onClick={() => setSelectedCategory('retail')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
              selectedCategory === 'retail' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Retail
          </button>

          <button
            onClick={() => setShowAppliedOnly(!showAppliedOnly)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition border ${
              showAppliedOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {showAppliedOnly ? 'Showing My Applied Jobs' : 'Filter Applied'}
          </button>
        </div>

      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`glass-card rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
              job.applied
                ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                : 'border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div>
              
              {/* Job Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {job.category}
                    </span>
                    {job.urgent && (
                      <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
                        ⚡ URGENT SHIFT
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-white text-lg font-outfit mt-1.5">{job.title}</h3>
                  <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{job.hubName}</span>
                  </p>
                </div>

                {/* Pay Rate Badge */}
                <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-2xl text-right">
                  <span className="text-emerald-400 font-extrabold text-base font-outfit block">{job.payRate}</span>
                  <span className="text-[10px] text-slate-400">Instant UPI</span>
                </div>
              </div>

              <p className="text-slate-300 text-xs mt-3 leading-relaxed">{job.description}</p>

              {/* Requirements Tags */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {job.requirements.map((req, idx) => (
                    <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] px-2.5 py-0.5 rounded-lg">
                      • {req}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> {job.shift}
                </span>
                <span className="text-amber-400 font-semibold">{job.spotsLeft} spots left</span>
              </div>

              {job.applied ? (
                <div className="flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied ({job.status || 'Active'})</span>
                </div>
              ) : (
                <button
                  onClick={() => onApplyJob(job.id)}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1"
                >
                  <span>1-Click Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Post Job Modal for Merchants */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-slate-700/60 p-6 shadow-2xl">
            <button 
              onClick={() => setShowPostJobModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-outfit">Post Merchant Shift Job</h3>
            <p className="text-slate-400 text-xs mt-1">Merchant Business Pro Feature</p>

            <form onSubmit={handlePostJobSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shift Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Express Courier Rider"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                >
                  <option value="Delivery">Delivery</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Retail">Retail</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pay Rate (₹ / hour)</label>
                <input
                  type="number"
                  value={jobPayRate}
                  onChange={(e) => setJobPayRate(e.target.value)}
                  placeholder="350"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shift Duration & Time</label>
                <input
                  type="text"
                  value={jobShift}
                  onChange={(e) => setJobShift(e.target.value)}
                  placeholder="4 Hours (Evening)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl"
              >
                Publish Shift Job Listing
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
