import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Zap, 
  QrCode, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Check
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

export default function SubscriptionModal({ 
  user, 
  isOpen, 
  onClose, 
  onActivateSubscription 
}) {
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [showUpiCheckout, setShowUpiCheckout] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('metrohub@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const handleStartPayment = () => {
    setShowUpiCheckout(true);
  };

  const handleConfirmUpiPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        onActivateSubscription(selectedPlan);
        setPaymentSuccess(false);
        setShowUpiCheckout(false);
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!showUpiCheckout ? (
          <>
            {/* Modal Header */}
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Building2 className="w-3.5 h-3.5" /> Merchant Business Subscription
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
                Unlock Hub Locations, Job Posts & Ads
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Merchant account activation requires a subscription plan after login. Choose your plan to start listing hubs.
              </p>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-gradient-to-b from-blue-950/60 to-slate-900 border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02]'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-white font-outfit">{plan.name}</h3>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                      </div>

                      <div className="mb-4">
                        <span className="text-3xl font-extrabold text-white font-outfit">{plan.price}</span>
                        <span className="text-slate-400 text-xs">{plan.period}</span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanId(plan.id);
                          handleStartPayment();
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                          isSelected
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>Select & Pay UPI</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Summary Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Instant Activation via UPI</h4>
                  <p className="text-xs text-slate-400">Support for GPay, PhonePe, Paytm, BHIM or direct UPI ID</p>
                </div>
              </div>

              <button
                onClick={handleStartPayment}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-sm hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
              >
                <span>Pay {selectedPlan.price} & Activate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* UPI Payment Checkout Drawer */
          <div className="max-w-md mx-auto py-4">
            
            {paymentSuccess ? (
              <div className="text-center py-8 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-white font-outfit">Payment Successful!</h3>
                <p className="text-slate-300 text-sm mt-2">
                  Your Merchant {selectedPlan.name} is now ACTIVE.
                </p>
                <div className="mt-4 px-4 py-2 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono">
                  Txn Ref: UPI/9812450912/{selectedPlan.id.toUpperCase()}
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmUpiPayment} className="space-y-5">
                
                <div className="text-center mb-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    UPI Payment Checkout
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 font-outfit">Merchant Subscription Activation</h3>
                  <div className="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800 inline-block">
                    <span className="text-slate-400 text-xs">Total Amount: </span>
                    <span className="text-xl font-extrabold text-white ml-2">{selectedPlan.price}</span>
                  </div>
                </div>

                {/* Simulated QR Code display */}
                <div className="p-5 rounded-2xl bg-white text-slate-950 text-center shadow-2xl max-w-[220px] mx-auto relative group">
                  <div className="w-40 h-40 mx-auto bg-slate-100 p-2 rounded-lg border-2 border-dashed border-slate-400 flex flex-col items-center justify-center">
                    <QrCode className="w-32 h-32 text-slate-900" />
                  </div>
                  <p className="text-[10px] text-slate-600 font-mono font-bold mt-2">Scan with GPay / PhonePe / Paytm</p>
                </div>

                {/* UPI ID Input Option */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Or Enter Merchant UPI ID</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="business@upi"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-blue-500 focus:outline-none"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUpiCheckout(false)}
                    className="w-1/3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl transition flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <span>Verifying Payment...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Confirm & Approve Pay</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
