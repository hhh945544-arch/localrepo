import React from 'react';
import {
  ArrowRight,
  Bell,
  Briefcase,
  Building2,
  Megaphone,
  Users
} from 'lucide-react';

export default function MerchantDashboard({ user, hubs, jobs, ads, onNavigate }) {
  const merchantJobs = jobs.filter(job => job.merchantId === user.id);
  const applications = merchantJobs.flatMap(job =>
    (job.applicants || []).map(applicant => ({ ...applicant, jobTitle: job.title }))
  );
  const merchantHubs = hubs.filter(hub => hub.merchantId === user.id);
  const merchantAds = ads.filter(ad => ad.merchantId === user.id || ad.merchant === user.merchantProfile?.businessName);
  const hubCount = merchantHubs.length || user.merchantProfile?.hubsCount || 0;
  const adCount = merchantAds.length || user.merchantProfile?.activeAds || 0;

  const stats = [
    { label: 'Your Hubs', value: hubCount, icon: Building2, color: 'text-blue-400' },
    { label: 'Active Job Posts', value: merchantJobs.length, icon: Briefcase, color: 'text-amber-400' },
    { label: 'Received Applications', value: applications.length, icon: Users, color: 'text-emerald-400' },
    { label: 'Active Ads', value: adCount, icon: Megaphone, color: 'text-purple-400' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Merchant Dashboard</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white font-outfit">
          Welcome, {user.merchantProfile?.businessName || user.name}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage your hubs, job posts, and applications from one place.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{label}</span>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Recent Gig Worker Applications</h2>
              <p className="text-xs text-slate-400">Applications received for your job posts</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('jobs')}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-slate-800"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {applications.length ? (
          <div className="mt-5 divide-y divide-slate-800">
            {applications.slice(0, 5).map((application, index) => (
              <div key={`${application.id}-${index}`} className="flex items-center gap-3 py-3">
                {application.avatar ? (
                  <img src={application.avatar} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    <Users className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-white">{application.name}</p>
                  <p className="text-xs text-slate-400">Applied for {application.jobTitle}</p>
                </div>
                {application.rating && (
                  <span className="ml-auto text-xs text-amber-400">★ {application.rating}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-700 p-6 text-center">
            <p className="text-sm font-semibold text-slate-300">No applications received yet</p>
            <p className="mt-1 text-xs text-slate-500">When gig workers apply to your jobs, their applications will appear here.</p>
            <button
              onClick={() => onNavigate('jobs')}
              className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950"
            >
              Explore jobs
            </button>
          </div>
        )}
      </section>
    </div>
  );
}