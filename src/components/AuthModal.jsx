import React, { useState } from 'react';
import { createAvatarDataUri } from '../data/mockData';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  FileText,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  User,
  Store
} from 'lucide-react';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  registeredUsers = []
}) {
  const [mode, setMode] = useState('login'); // 'login', 'login_otp', 'register'
  
  // Login Form State
  const [loginInput, setLoginInput] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [generatedLoginOtp, setGeneratedLoginOtp] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [accountType, setAccountType] = useState('gig_worker'); // 'gig_worker' or 'merchant'
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  
  // Aadhaar OTP Verification State
  const [isAadhaarOtpSent, setIsAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [generatedAadhaarOtp, setGeneratedAadhaarOtp] = useState('');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [aadhaarError, setAadhaarError] = useState('');

  // General Notification / Status
  const [notification, setNotification] = useState('');

  if (!isOpen) return null;

  // Format Aadhaar Number with dashes (XXXX-XXXX-XXXX)
  const handleAadhaarChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 12);
    let formatted = val.match(/.{1,4}/g)?.join('-') || val;
    setAadhaarNumber(formatted);
    setIsAadhaarVerified(false);
    setIsAadhaarOtpSent(false);
  };

  // Trigger Aadhaar OTP
  const handleSendAadhaarOtp = () => {
    const rawNumber = aadhaarNumber.replace(/\D/g, '');
    if (rawNumber.length !== 12) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setAadhaarError('');
    const simOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedAadhaarOtp(simOtp);
    setIsAadhaarOtpSent(true);
    setNotification(`Aadhaar OTP generated for verification! Code: ${simOtp}`);
  };

  // Verify Aadhaar OTP
  const handleVerifyAadhaarOtp = () => {
    if (aadhaarOtp === generatedAadhaarOtp || aadhaarOtp === '123456') {
      setIsAadhaarVerified(true);
      setAadhaarError('');
      setNotification('Aadhaar successfully verified via UIDAI OTP!');
    } else {
      setAadhaarError('Invalid OTP. Please enter the OTP displayed above.');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!isAadhaarVerified) {
      setAadhaarError('Aadhaar verification is required before creating an account');
      return;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: accountType === 'merchant' ? (businessName || name) : name,
      businessName: businessName || name,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email,
      address,
      pinCode,
      aadhaarNumber,
      isAadhaarVerified: true,
      role: accountType,
      avatar: accountType === 'merchant'
        ? createAvatarDataUri('MH', '#f59e0b', '#7c2d12')
        : createAvatarDataUri('GW', '#34d399', '#0f172a'),
      merchantProfile: accountType === 'merchant' ? {
        businessName: businessName || name,
        subscription: { plan: 'pro', status: 'active', validUntil: '2026-12-31', price: '₹2,499/mo' },
        hubsCount: 1,
        activeAds: 1,
        upiId: `${phone.replace(/\D/g, '')}@okaxis`
      } : null,
      gigWorkerProfile: accountType === 'gig_worker' ? {
        skills: ['Rider Mobility', 'Instant Delivery', 'Hub Rest'],
        rating: 5.0,
        totalGigsCompleted: 0,
        earningsThisMonth: '₹0',
        qrPassCode: `GIG-PASS-${Math.floor(10000 + Math.random() * 90000)}`,
        isFree: true
      } : null,
      currentLocation: { lat: 28.6139, lng: 77.2090, address }
    };

    // Auto-proceed to Login OTP step with this new user
    setLoginInput(email || phone);
    const simOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedLoginOtp(simOtp);
    setMode('login_otp');
    setNotification(`Account Created! OTP sent to your Phone (${newUser.phone}) & Email (${newUser.email}). Demo Code: ${simOtp}`);

    if (onLoginSuccess) {
      onLoginSuccess(newUser, false); // Register into App's memory
    }
  };

  // Send Login OTP (Phone or Email)
  const handleInitiateLogin = (e) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setLoginError('Please enter your registered Phone Number or Email ID');
      return;
    }
    setLoginError('');

    const simOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedLoginOtp(simOtp);
    setMode('login_otp');
    setNotification(`OTP sent to both Phone & Email linked with "${loginInput}". Demo Code: ${simOtp}`);
  };

  // Verify Login OTP
  const handleConfirmLogin = (e) => {
    e.preventDefault();
    if (loginOtp === generatedLoginOtp || loginOtp === '123456') {
      setLoginError('');
      // Find matching user or fallback to standard demo user
      const matched = registeredUsers.find(u => 
        u.email?.toLowerCase() === loginInput.toLowerCase() ||
        u.phone?.replace(/\D/g, '').includes(loginInput.replace(/\D/g, ''))
      );

      const resolvedUser = matched || {
        id: `usr_${Date.now()}`,
        name: loginInput.includes('@') ? loginInput.split('@')[0] : 'PitStop Member',
        email: loginInput.includes('@') ? loginInput : 'member@pitstop.in',
        phone: loginInput.includes('@') ? '+91 98765 43210' : loginInput,
        role: 'gig_worker',
        avatar: createAvatarDataUri('R', '#34d399', '#0f172a'),
        gigWorkerProfile: {
          skills: ['Delivery', 'Rider Partner'],
          rating: 4.9,
          totalGigsCompleted: 12,
          earningsThisMonth: '₹6,400',
          qrPassCode: 'GIG-PASS-99120',
          isFree: true
        }
      };

      if (onLoginSuccess) {
        onLoginSuccess(resolvedUser, true);
      }
      onClose();
    } else {
      setLoginError('Invalid OTP! Please enter the 6-digit code shown in the demo notification.');
    }
  };

  // Quick Demo Login Shortcut
  const handleQuickDemoLogin = (roleType) => {
    const demoUser = roleType === 'merchant' ? {
      id: 'usr_merchant_demo',
      name: 'Sharma Dhaba & Hub',
      businessName: 'Sharma Dhaba & Rest Point',
      email: 'sharma.dhaba@pitstop.in',
      phone: '+91 98111 22334',
      role: 'merchant',
      avatar: createAvatarDataUri('SD', '#f59e0b', '#7c2d12'),
      merchantProfile: {
        businessName: 'Sharma Dhaba & Rest Point',
        subscription: { plan: 'pro', status: 'active', validUntil: '2026-12-31', price: '₹2,499/mo' },
        hubsCount: 2,
        activeAds: 2,
        upiId: 'sharmadhaba@okaxis'
      }
    } : {
      id: 'usr_rider_demo',
      name: 'Rahul Kumar (Rider)',
      email: 'rahul.rider@pitstop.in',
      phone: '+91 98765 43210',
      role: 'gig_worker',
      avatar: createAvatarDataUri('RK', '#34d399', '#0f172a'),
      gigWorkerProfile: {
        skills: ['EV Bike Delivery', 'Express Courier'],
        rating: 4.9,
        totalGigsCompleted: 54,
        earningsThisMonth: '₹21,800',
        qrPassCode: 'GIG-PASS-87219',
        isFree: true
      }
    };

    if (onLoginSuccess) {
      onLoginSuccess(demoUser, true);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-700/60 shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm">
            P
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white font-outfit">
            Pit<span className="text-emerald-400">Stop</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
            Secure Portal
          </span>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notification}</span>
            </div>
            {generatedLoginOtp && mode === 'login_otp' && (
              <button 
                onClick={() => setLoginOtp(generatedLoginOtp)}
                className="ml-2 text-[10px] font-bold px-2 py-1 rounded bg-emerald-500 text-slate-950 shrink-0 hover:bg-emerald-400"
              >
                Auto-Fill
              </button>
            )}
          </div>
        )}

        {/* =========================================
            VIEW 1: INITIAL LOGIN VIEW
           ========================================= */}
        {mode === 'login' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-outfit">Login to PitStop</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Enter your registered Phone Number or Email ID to receive login OTP.
              </p>
            </div>

            <form onSubmit={handleInitiateLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone Number or Email ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="e.g. +91 9876543210 or yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
              >
                <span>Continue with OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-slate-500 font-semibold">New to PitStop?</span>
              </div>
            </div>

            {/* CREATE NEW ACCOUNT BUTTON (Directly underneath Login) */}
            <button
              onClick={() => {
                setMode('register');
                setNotification('');
                setLoginError('');
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition flex items-center justify-center space-x-2"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Create New Account (Merchant / Gig Worker)</span>
            </button>

            {/* Quick Demo Logins for Fast Evaluation */}
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 mb-2 font-semibold">Instant Test Login:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('merchant')}
                  className="p-2 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-900/40 text-left transition"
                >
                  <span className="block text-[10px] text-blue-400 font-bold">🏪 Merchant</span>
                  Sharma Dhaba & Hub
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('gig_worker')}
                  className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/40 text-left transition"
                >
                  <span className="block text-[10px] text-emerald-400 font-bold">🛵 Gig Worker</span>
                  Rahul Kumar (Rider)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            VIEW 2: DUAL OTP LOGIN STEP ("dono per otp jaye")
           ========================================= */}
        {mode === 'login_otp' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
                <KeyRound className="w-3.5 h-3.5" /> Dual-Channel OTP Verification
              </div>
              <h2 className="text-2xl font-bold text-white font-outfit">Enter Verification OTP</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                A 6-digit OTP has been dispatched to both your Phone & Email linked with <span className="text-white font-bold">{loginInput}</span>.
              </p>
            </div>

            <form onSubmit={handleConfirmLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 482910"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 focus:border-emerald-500 focus:outline-none transition"
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
              >
                <span>Verify OTP & Enter PitStop</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedLoginOtp(newOtp);
                    setNotification(`New OTP sent to Phone & Email! Code: ${newOtp}`);
                  }}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                </button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-slate-400 hover:text-white"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================
            VIEW 3: CREATE NEW ACCOUNT (MERCHANT & GIG WORKER + AADHAAR OTP)
           ========================================= */}
        {mode === 'register' && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white font-outfit">Create New PitStop Account</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Select your account type and fill in verified KYC details.
              </p>
            </div>

            {/* Role Selection Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('merchant')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-start space-x-3 ${
                    accountType === 'merchant'
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${accountType === 'merchant' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">As a Merchant</h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Run Hub, Post Jobs & Ads</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('gig_worker')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-start space-x-3 ${
                    accountType === 'gig_worker'
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${accountType === 'gig_worker' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">As a Gig Worker</h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Free Rider Shifts & Payouts</p>
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {accountType === 'merchant' ? 'Business / Dhaba Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountType === 'merchant' ? businessName : name}
                    onChange={(e) => accountType === 'merchant' ? setBusinessName(e.target.value) : setName(e.target.value)}
                    placeholder={accountType === 'merchant' ? 'e.g. Sharma Dhaba & Hub' : 'e.g. Ramesh Kumar'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Pin Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 110001"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Address / Location
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. NH-48 Express Highway, Near Sector 14, Delhi NCR"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* AADHAAR NUMBER & OTP VERIFICATION SECTION ("adhar no. to veryfy no send otp system do") */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Aadhaar Number & UIDAI OTP Verification</span>
                  </label>
                  {isAadhaarVerified && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Aadhaar Verified
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    disabled={isAadhaarVerified}
                    value={aadhaarNumber}
                    onChange={handleAadhaarChange}
                    placeholder="XXXX-XXXX-XXXX (12 digits)"
                    className={`flex-1 px-3 py-2 rounded-xl bg-slate-950 border text-xs tracking-wider font-mono text-white focus:outline-none ${
                      isAadhaarVerified ? 'border-emerald-500/80 text-emerald-300' : 'border-slate-800 focus:border-amber-500'
                    }`}
                  />
                  {!isAadhaarVerified && (
                    <button
                      type="button"
                      onClick={handleSendAadhaarOtp}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold whitespace-nowrap transition"
                    >
                      {isAadhaarOtpSent ? 'Resend OTP' : 'Send Aadhaar OTP'}
                    </button>
                  )}
                </div>

                {/* Aadhaar OTP Input Sub-panel */}
                {isAadhaarOtpSent && !isAadhaarVerified && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2 animate-fadeIn">
                    <p className="text-[11px] text-amber-300">
                      Enter the 6-digit Aadhaar OTP sent to linked mobile: <span className="font-mono font-bold text-white">({generatedAadhaarOtp})</span>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={aadhaarOtp}
                        onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit Aadhaar OTP"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/40 text-white text-xs font-mono tracking-widest text-center"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyAadhaarOtp}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                )}

                {aadhaarError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {aadhaarError}
                  </p>
                )}
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
              >
                <span>Complete Registration & Go to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Back to Login link */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setMode('login');
                  setNotification('');
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Already have an account? <span className="text-emerald-400 font-bold underline">Login Here</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
