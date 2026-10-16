import React, { useState } from 'react';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import HubDirectory from './components/HubDirectory';
import UpiQrScanner from './components/UpiQrScanner';
import JobExplorer from './components/JobExplorer';
import UpdatesFeed from './components/UpdatesFeed';
import MerchantDashboard from './components/MerchantDashboard';
import RoleAuthModal from './components/RoleAuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import AuthModal from './components/AuthModal';

import { 
  INITIAL_USER, 
  MOCK_HUBS, 
  MOCK_ADS, 
  MOCK_JOBS, 
  MOCK_UPDATES, 
  MOCK_TRANSACTIONS,
  createAvatarDataUri
} from './data/mockData';

export default function App() {
  // Pre-configured registered users (Sharma Dhaba merchant + Alex Rivera gig worker)
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      id: 'usr_sharma',
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
    },
    INITIAL_USER
  ]);

  const [user, setUser] = useState(INITIAL_USER);
  // Start with login requirement as requested by the user:
  // "starting me lodin ka option do or uske niche create new acount ka option do"
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);

  const [activeTab, setActiveTab] = useState('map'); // 'map', 'hubs', 'scanner', 'jobs', 'updates'
  
  const [hubs, setHubs] = useState(MOCK_HUBS);
  const [ads, setAds] = useState(MOCK_ADS);
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [updates, setUpdates] = useState(MOCK_UPDATES);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  // Secondary modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Handle Login & Register Success from AuthModal
  const handleAuthSuccess = (authenticatedUser, isFinalLogin = true) => {
    // Add to registered users store if not already present
    setRegisteredUsers(prev => {
      const exists = prev.some(u => u.email === authenticatedUser.email || u.phone === authenticatedUser.phone);
      return exists ? prev : [authenticatedUser, ...prev];
    });

    if (isFinalLogin) {
      setUser(authenticatedUser);
      setActiveTab(authenticatedUser.role === 'merchant' ? 'dashboard' : 'map');
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);

      // System notification
      const welcomeUpdate = {
        id: `up_${Date.now()}`,
        title: `Welcome ${authenticatedUser.name} (${authenticatedUser.role === 'merchant' ? 'Merchant Hub' : 'Gig Rider'})`,
        time: 'Just now',
        type: authenticatedUser.role === 'merchant' ? 'merchant' : 'system',
        summary: `Successfully verified and logged in with UIDAI secure credentials to PitStop.`,
        author: 'PitStop Security'
      };
      setUpdates(prev => [welcomeUpdate, ...prev]);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
  };

  // Role Switch Handler
  const handleSwitchRole = (newRole, extraData = {}) => {
    setActiveTab(newRole === 'merchant' ? 'dashboard' : 'map');
    setUser(prev => ({
      ...prev,
      role: newRole,
      merchantProfile: newRole === 'merchant' ? {
        ...prev.merchantProfile,
        businessName: extraData.businessName || prev.merchantProfile?.businessName || 'My Merchant Hub',
      } : prev.merchantProfile
    }));
  };

  // Subscription Activation Handler
  const handleActivateSubscription = (plan) => {
    setActiveTab('dashboard');
    setUser(prev => ({
      ...prev,
      role: 'merchant',
      merchantProfile: {
        ...prev.merchantProfile,
        subscription: {
          plan: plan.id,
          status: 'active',
          validUntil: '2026-11-30',
          price: `${plan.price}/mo`
        }
      }
    }));

    // Add subscription record to transactions
    const newTx = {
      id: `tx_${Date.now()}`,
      title: `Merchant Subscription - ${plan.name}`,
      type: 'debit',
      amount: plan.price,
      date: 'Just now',
      status: 'Completed',
      upiId: 'pitstop.merchant@okaxis',
      hubName: 'PitStop Merchant Platform',
      ref: `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/SUB`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Broadcast system update
    const newUpdate = {
      id: `up_${Date.now()}`,
      title: `🎉 ${user.name} Activated Merchant ${plan.name}`,
      time: 'Just now',
      type: 'merchant',
      summary: 'New merchant hub unlocked multi-location map pins and featured ad postings.',
      author: 'Merchant Network'
    };
    setUpdates(prev => [newUpdate, ...prev]);
  };

  // Add Hub review
  const handleAddReview = (hubId, review) => {
    setHubs(prev => prev.map(h => {
      if (h.id === hubId) {
        const updatedReviews = [review, ...(h.reviews || [])];
        const avgRating = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...h,
          rating: avgRating,
          reviewsCount: updatedReviews.length,
          reviews: updatedReviews
        };
      }
      return h;
    }));
  };

  // Add Hub
  const handleAddHub = (newHub) => {
    setHubs(prev => [newHub, ...prev]);
  };

  // Apply to Job
  const handleApplyJob = (jobId, applicant) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const applicants = j.applicants || [];
        if (applicants.some(existingApplicant => existingApplicant.id === applicant.id)) return j;
        return {
          ...j,
          applicants: [{
            id: applicant.id,
            name: applicant.name,
            avatar: applicant.avatar,
            phone: applicant.phone,
            rating: applicant.gigWorkerProfile?.rating,
            appliedAt: new Date().toISOString()
          }, ...applicants],
          applied: true,
          status: 'In Progress'
        };
      }
      return j;
    }));
  };

  // Post Job
  const handlePostJob = (newJob) => {
    setJobs(prev => [newJob, ...prev]);
  };

  // Add Transaction
  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  // Add Update Broadcast
  const handleAddUpdate = (newUpdate) => {
    setUpdates(prev => [newUpdate, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 lg:pb-0">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        isAuthenticated={isAuthenticated}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onLogout={handleLogout}
        unreadCount={updates.length}
      />

      {/* Main Tab Content Render */}
      <main className="flex-1">
        {activeTab === 'dashboard' && user.role === 'merchant' && (
          <MerchantDashboard
            user={user}
            hubs={hubs}
            jobs={jobs}
            ads={ads}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            hubs={hubs}
            userLocation={user.currentLocation}
            onSelectHub={(hub) => setActiveTab('hubs')}
            onSelectJob={(hub) => setActiveTab('jobs')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'hubs' && (
          <HubDirectory
            hubs={hubs}
            ads={ads}
            user={user}
            onAddReview={handleAddReview}
            onAddHub={handleAddHub}
            onAddAd={(ad) => setAds(prev => [ad, ...prev])}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeTab === 'scanner' && (
          <UpiQrScanner
            user={user}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {activeTab === 'jobs' && (
          <JobExplorer
            jobs={jobs}
            user={user}
            onApplyJob={handleApplyJob}
            onPostJob={handlePostJob}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeTab === 'updates' && (
          <UpdatesFeed
            updates={updates}
            onAddUpdate={handleAddUpdate}
            user={user}
          />
        )}
      </main>

      {/* PRIMARY AUTH MODAL (Login with OTP, Create Account with Aadhaar OTP) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthSuccess}
        registeredUsers={registeredUsers}
      />

      {/* Secondary Role Switcher Modal */}
      <RoleAuthModal
        user={user}
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSwitchRole={handleSwitchRole}
        onOpenSubscription={() => {
          setIsRoleModalOpen(false);
          setIsSubscriptionModalOpen(true);
        }}
      />

      {/* Merchant Subscription Checkout Modal */}
      <SubscriptionModal
        user={user}
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onActivateSubscription={handleActivateSubscription}
      />

    </div>
  );
}
