import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  QrCode, 
  Briefcase, 
  TrendingUp, 
  User, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  Menu, 
  X,
  Compass,
  LayoutDashboard,
  LogOut,
  LogIn
} from 'lucide-react';

export default function Navbar({ 
  user, 
  isAuthenticated = false,
  activeTab, 
  setActiveTab, 
  onOpenAuthModal, 
  onOpenSubscriptionModal,
  onLogout,
  unreadCount = 0 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMerchant = user.role === 'merchant';
  const isSubscribed = isMerchant && user.merchantProfile?.subscription?.status === 'active';
  const homeTab = isMerchant ? 'dashboard' : 'map';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(homeTab)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-outfit">Pit<span className="text-emerald-400">Stop</span></span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">v2.5</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">Merchant Hubs & Gig Mobility</p>
            </div>
          </div>

          {/* Nav Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab(homeTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === homeTab
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {isMerchant ? <LayoutDashboard className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              <span>{isMerchant ? 'Dashboard' : 'Map & Rest Hubs'}</span>
            </button>

            <button
              onClick={() => setActiveTab('hubs')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'hubs'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hubs & Merchant Ads</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'scanner'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-md shadow-purple-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>UPI & QR Scan</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Jobs</span>
            </button>

            <button
              onClick={() => setActiveTab('updates')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'updates'
                  ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Updates</span>
            </button>
          </nav>

          {/* Right Action Controls: Auth, Role & Subscription */}
          <div className="flex items-center space-x-3">

            {/* Notification Bell */}
            <button 
              onClick={() => setActiveTab('updates')}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Updates & Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Auth / Role Switcher Pill & Subscription Badge */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                {/* Current Role Indicator */}
                <button 
                  onClick={onOpenAuthModal}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isMerchant 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                  title="Switch Role or Account"
                >
                  {isMerchant ? (
                    <>
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Merchant</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Gig Worker</span>
                    </>
                  )}
                </button>

                {/* Merchant Subscription Button / Status */}
                {isMerchant && (
                  <button
                    onClick={onOpenSubscriptionModal}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                      isSubscribed 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 animate-pulse'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isSubscribed ? 'Pro' : 'Subscribe'}</span>
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </button>
            )}

            {/* User Profile Avatar */}
            {isAuthenticated && (
              <div 
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 cursor-pointer p-1 rounded-xl hover:bg-slate-900 transition border border-transparent hover:border-slate-800"
                title={`${user.name} (${user.role})`}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/40"
                />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE NAV TABS BOTTOM BAR (MATCHING IMAGE 1 & 2 EXACTLY!)
          Map, Hubs, Scan, Explore
         ======================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl py-1.5 px-3 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab(homeTab)}
          className={`flex flex-col items-center text-[10px] font-bold py-1 px-3 rounded-2xl transition ${
            activeTab === homeTab
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isMerchant ? <LayoutDashboard className="w-5 h-5 mb-0.5" /> : <MapPin className="w-5 h-5 mb-0.5" />}
          <span>{isMerchant ? 'Dashboard' : 'Map'}</span>
        </button>

        <button
          onClick={() => setActiveTab('hubs')}
          className={`flex flex-col items-center text-[10px] font-bold py-1 px-3 rounded-2xl transition ${
            activeTab === 'hubs' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span>Hubs</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center text-[10px] font-bold py-1 px-3 rounded-2xl transition ${
            activeTab === 'scanner' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-5 h-5 mb-0.5" />
          <span>Scan</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex flex-col items-center text-[10px] font-bold py-1 px-3 rounded-2xl transition ${
            activeTab === 'jobs' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span>Explore</span>
        </button>
      </div>

    </header>
  );
}
