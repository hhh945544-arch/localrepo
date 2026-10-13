import React, { useState } from 'react';
import { 
  QrCode, 
  ScanLine, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  History, 
  Smartphone, 
  RefreshCw,
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Sparkles,
  DollarSign,
  Search,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UpiQrScanner({ 
  user, 
  transactions, 
  onAddTransaction 
}) {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan', 'my_qr', 'history'
  const [isScanning, setIsScanning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scannedResult, setScannedResult] = useState(null);
  const [txSearchQuery, setTxSearchQuery] = useState('');
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('1,250');
  const [upiIdInput, setUpiIdInput] = useState('alex.rivera@okicici');
  const [paymentNote, setPaymentNote] = useState('Shift Payout - Central Hub');
  const [selectedApp, setSelectedApp] = useState('gpay'); // 'gpay', 'phonepe', 'paytm', 'bhim'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Trigger Scanner Match Simulation
  const handleSimulateScan = () => {
    setIsScanning(false);
    const mockScanData = {
      type: 'upi_payment',
      title: 'Central Hub - Shift Payout QR',
      merchantName: 'Central Express Logistics Hub',
      upiId: 'centralhub@okicici',
      defaultAmount: '1,400',
      valid: true
    };
    setScannedResult(mockScanData);
    setPaymentAmount(mockScanData.defaultAmount);
    setShowPaymentModal(true);
  };

  const handleConfirmPay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      // Add to Ledger
      onAddTransaction({
        id: `tx_${Date.now()}`,
        title: paymentNote || 'Instant UPI Payout',
        type: 'credit',
        amount: `₹${paymentAmount}`,
        date: 'Just now',
        status: 'Completed',
        upiId: upiIdInput,
        hubName: scannedResult?.merchantName || 'PitStop Platform',
        ref: `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/HUB`
      });

      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPaymentModal(false);
        setIsScanning(true);
        setScannedResult(null);
      }, 2000);
    }, 1600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Sub-Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <QrCode className="w-3.5 h-3.5" /> 3rd Tab: Scan UPI & QR Scanner Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
            Instant UPI Scan, Payout & Access Pass
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Scan Hub QR codes for instant shifts check-in and zero-fee UPI payouts.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'scan'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            <span>QR Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('my_qr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'my_qr'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>My Pass QR</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>UPI History</span>
          </button>
        </div>
      </div>

      {/* Main Scanner View */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Scanner Viewport (Left 2 Columns) */}
          <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Camera Viewport Active</span>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                  title="Toggle Audio Feedback"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Simulated Live Camera Box */}
            <div className="relative aspect-video max-h-[360px] w-full rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center group shadow-2xl">
              
              {/* Background Mock Video Frame Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Scanning Laser Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_#a855f7] animate-[bounce_2s_infinite]"></div>

              {/* Viewfinder Target Reticle Frame */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 border-2 border-dashed border-purple-400/60 rounded-3xl flex flex-col items-center justify-center p-4">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-purple-500 rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-purple-500 rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-purple-500 rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-purple-500 rounded-br-xl"></div>

                <ScanLine className="w-16 h-16 text-purple-400 animate-pulse opacity-80" />
                <p className="text-[11px] text-slate-300 font-mono mt-3 font-semibold text-center bg-slate-950/80 px-3 py-1 rounded-full border border-purple-500/30">
                  Align UPI QR or Hub QR inside frame
                </p>
              </div>

              {/* Bottom Quick Test Scanner Trigger Button */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  onClick={handleSimulateScan}
                  className="py-2.5 px-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-extrabold text-xs shadow-xl shadow-purple-500/30 hover:brightness-110 transition flex items-center space-x-2 animate-bounce"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Simulate Instant QR Scan</span>
                </button>
              </div>

            </div>

            {/* Upload image fallback */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Upload QR Image File</h4>
                  <p className="text-[11px] text-slate-400">Select saved UPI QR screenshot from device</p>
                </div>
              </div>

              <button
                onClick={handleSimulateScan}
                className="w-full sm:w-auto py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Browse QR File
              </button>
            </div>

          </div>

          {/* Quick Payment Apps & Stats (Right Column) */}
          <div className="space-y-6">
            
            {/* Direct App Launchers */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm font-outfit uppercase tracking-wider text-slate-300">
                Supported UPI Payment Apps
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={handleSimulateScan}
                  className="cursor-pointer p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition flex items-center space-x-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    GP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Google Pay</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">Instant UPI</span>
                  </div>
                </div>

                <div 
                  onClick={handleSimulateScan}
                  className="cursor-pointer p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition flex items-center space-x-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    Pe
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">PhonePe</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">Verified</span>
                  </div>
                </div>

                <div 
                  onClick={handleSimulateScan}
                  className="cursor-pointer p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition flex items-center space-x-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    TM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Paytm UPI</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">Zero Fee</span>
                  </div>
                </div>

                <div 
                  onClick={handleSimulateScan}
                  className="cursor-pointer p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition flex items-center space-x-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                    BH
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">BHIM UPI</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">Direct</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gig Worker Instant Payout Perks */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Payout Assurance</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Scan Hub QR after completing your shift. Funds are deposited into your linked UPI VPA within 3 seconds with zero deduction.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* My Gig Pass QR (Tab 2) */}
      {activeTab === 'my_qr' && (
        <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Gig Worker Personal QR Pass
            </span>
            <h2 className="text-2xl font-extrabold text-white font-outfit mt-2">{user.name}</h2>
            <p className="text-slate-400 text-xs mt-1">Show this QR code at Hub entrance for instant attendance check-in.</p>
          </div>

          {/* Dynamic Rendered QR Card */}
          <div className="p-6 rounded-3xl bg-white text-slate-950 shadow-2xl max-w-[260px] mx-auto space-y-3">
            <div className="w-48 h-48 mx-auto p-2 bg-slate-100 rounded-2xl border-2 border-slate-900 flex items-center justify-center">
              <QrCode className="w-40 h-40 text-slate-900" />
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs font-mono font-bold text-slate-900">{user.gigWorkerProfile?.qrPassCode || 'GIG-PASS-98214'}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Verified Worker VPA</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-emerald-400">Hub Check-In Ready: </span>
            <span>Automatically logs shift start time upon hub scanner read.</span>
          </div>
        </div>
      )}

      {/* UPI Transaction Ledger (Tab 3) */}
      {activeTab === 'history' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <span>UPI Transaction Ledger & Shift Receipts</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Recorded shift payouts and subscriptions</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Transaction Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={txSearchQuery}
                  onChange={(e) => setTxSearchQuery(e.target.value)}
                  placeholder="Search receipt, hub, UPI ID..."
                  className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition"
                />
                {txSearchQuery && (
                  <button
                    onClick={() => setTxSearchQuery('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-white transition"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
                Total: {transactions.length}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {transactions
              .filter(tx => {
                if (!txSearchQuery.trim()) return true;
                const q = txSearchQuery.toLowerCase();
                return (
                  tx.title.toLowerCase().includes(q) ||
                  tx.hubName.toLowerCase().includes(q) ||
                  tx.ref.toLowerCase().includes(q) ||
                  tx.upiId.toLowerCase().includes(q) ||
                  tx.amount.toLowerCase().includes(q)
                );
              }).length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 my-4 space-y-3">
                  <Search className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400">
                    No transactions match "{txSearchQuery}".
                  </p>
                  <button
                    onClick={() => setTxSearchQuery('')}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                transactions
                  .filter(tx => {
                    if (!txSearchQuery.trim()) return true;
                    const q = txSearchQuery.toLowerCase();
                    return (
                      tx.title.toLowerCase().includes(q) ||
                      tx.hubName.toLowerCase().includes(q) ||
                      tx.ref.toLowerCase().includes(q) ||
                      tx.upiId.toLowerCase().includes(q) ||
                      tx.amount.toLowerCase().includes(q)
                    );
                  })
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          tx.type === 'credit'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {tx.type === 'credit' ? '+' : '-'}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{tx.title}</h4>
                          <p className="text-slate-400 text-xs mt-0.5">{tx.hubName} • <span className="font-mono">{tx.ref}</span></p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{tx.date}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-base font-extrabold font-outfit ${
                          tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                        }`}>
                          {tx.amount}
                        </span>
                        <span className="block text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-1">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))
              )}
          </div>
        </div>
      )}

      {/* UPI Payment Workflow Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-slate-700/60 p-6 shadow-2xl">
            
            {paymentSuccess ? (
              <div className="text-center py-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-white font-outfit">UPI Payment Approved!</h3>
                <p className="text-slate-300 text-sm mt-2">
                  ₹{paymentAmount} sent to <span className="font-mono text-emerald-400 font-bold">{upiIdInput}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2 font-mono">Status: SETTLED • Zero Processing Fee</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmPay} className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                    Scanned UPI Merchant QR
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 font-outfit">
                    {scannedResult?.merchantName || 'Central Express Logistics Hub'}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-mono">{scannedResult?.upiId || 'centralhub@okicici'}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Payout Amount (₹)</label>
                  <input
                    type="text"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-outfit font-extrabold text-2xl text-center focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Note</label>
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="w-1/3 py-3 rounded-xl bg-slate-900 text-slate-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <span>Processing UPI Transfer...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Confirm Pay ₹{paymentAmount}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
