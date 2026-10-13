import React, { useState } from 'react';
import { 
  TrendingUp, 
  Bell, 
  Sparkles, 
  AlertCircle, 
  Megaphone, 
  CheckCircle2, 
  Building2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Plus,
  Search,
  X
} from 'lucide-react';

export default function UpdatesFeed({ updates, onAddUpdate, user }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'job_alert', 'feature', 'merchant'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');

  const filteredUpdates = updates.filter(up => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = 
        up.title.toLowerCase().includes(q) ||
        up.summary.toLowerCase().includes(q) ||
        up.author.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (filterType === 'all') return true;
    return up.type === filterType;
  });

  const handlePostUpdate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddUpdate({
      id: `up_${Date.now()}`,
      title: newTitle,
      time: 'Just now',
      type: 'merchant',
      summary: newSummary || 'Broadcast update from merchant hub.',
      author: user.merchantProfile?.businessName || user.name
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewSummary('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Real-Time App Updates & Alerts
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            System Updates & Hub Broadcast Feed
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Stay updated with shift alerts, app enhancements, and merchant bonus pay notices.
          </p>
        </div>

        {user.role === 'merchant' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center space-x-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Broadcast</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-3 rounded-2xl border border-slate-800">
        
        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search updates & alerts..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:border-teal-500 focus:outline-none transition"
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

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
              filterType === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All ({updates.length})
          </button>
          <button
            onClick={() => setFilterType('job_alert')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
              filterType === 'job_alert' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Shift Alerts
          </button>
          <button
            onClick={() => setFilterType('feature')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
              filterType === 'feature' ? 'bg-purple-500 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Features
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 my-4 space-y-3">
            <Search className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">
              No updates match {searchQuery ? `"${searchQuery}"` : 'the filter criteria'}.
            </p>
            {(searchQuery || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 transition"
              >
                Clear Search & Filter
              </button>
            )}
          </div>
        ) : (
          filteredUpdates.map((item) => (
          <div
            key={item.id}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.type === 'job_alert'
                    ? 'bg-amber-500/20 text-amber-400'
                    : item.type === 'feature'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-teal-500/20 text-teal-400'
                }`}>
                  {item.type === 'job_alert' ? <Megaphone className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base font-outfit">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{item.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed pl-13">{item.summary}</p>
          </div>
        )))}
      </div>

      {/* Add Broadcast Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-slate-700/60 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white font-outfit">Post Hub Broadcast</h3>
            <form onSubmit={handlePostUpdate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Broadcast Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 20 Extra Delivery Drivers Needed Now"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Broadcast Details</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Explain shift details or bonus offers..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-lg"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
