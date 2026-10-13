import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  CreditCard, 
  Check, 
  AlertCircle,
  QrCode
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

export default function RoleAuthModal({ 
  user, 
  isOpen, 
  onClose, 
  onSwitchRole, 
  onOpenSubscription 
}) {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [merchantName, setMerchantName] = useState(user.merchantProfile?.businessName || '');
  const [phone, setPhone] = useState(user.phone || '');

  if (!isOpen) return null;

  const handleSaveRole = (e) => {
    e.preventDefault();
    onSwitchRole(selectedRole, {
      businessName: merchantName,
      phone
    });

    if (selectedRole === 'merchant' && user.merchantProfile?.subscription?.status !== 'active') {
      onOpenSubscription();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Select Platform Role
          </div>
          <h2 className="text-2xl font-bold text-white font-outfit">Choose How You Want To Use PitStop</h2>
          <p className="text-slate-400 text-sm mt-1">
            Switch between free Gig Worker access or Merchant Business Hub management.
          </p>
        </div>

        {/* Role Cards */}
        <form onSubmit={handleSaveRole} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Gig Worker Card (Free) */}
            <div 
              onClick={() => setSelectedRole('gig_worker')}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden ${
                selectedRole === 'gig_worker'
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  100% Free
                </span>
              </div>
              <h3 className="font-bold text-white text-lg font-outfit">Gig Worker</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Find nearby hub shifts, scan QR for instant check-in, and get instant payouts via UPI.
              </p>
              
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Free Registration</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Live Interactive Map</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Instant UPI Payouts</li>
              </ul>
            </div>

            {/* Merchant Card (Subscription required) */}
            <div 
              onClick={() => setSelectedRole('merchant')}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden ${
                selectedRole === 'merchant'
                  ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Subscription
                </span>
              </div>
              <h3 className="font-bold text-white text-lg font-outfit">Merchant / Business</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                List your business Hub locations, post urgent gig shifts, and run promotional ad banners.
              </p>
              
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> Multi-Hub Map Pins</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> Sponsored Ad Banners</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> First Login → Subscription</li>
              </ul>
            </div>

          </div>

          {/* Extra inputs for Merchant */}
          {selectedRole === 'merchant' && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-amber-400 font-medium bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  Merchant access requires an active Subscription plan after first login.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business / Hub Name</label>
                <input 
                  type="text" 
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g. Apex Express Fulfillment Hub"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Action Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition shadow-xl ${
                selectedRole === 'merchant'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950'
              }`}
            >
              <span>{selectedRole === 'merchant' ? 'Proceed to Merchant Setup & Subscription' : 'Continue as Free Gig Worker'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
