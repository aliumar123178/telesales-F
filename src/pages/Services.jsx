import { Link } from 'react-router-dom';
import { UserPlus, Smartphone, Users, Router, Search } from 'lucide-react';
import SectionLabel from '../components/common/SectionLabel.jsx';

const SALES_ACTIVITIES = [
  { to: '/services/new-subscriber', label: 'New registration', icon: UserPlus, tint: 'bg-brand-500' },
  { to: '/services/new-subscriber', label: 'Add subscriber', icon: Smartphone, tint: 'bg-info' },
  { to: '/services/new-subscriber', label: 'New Subscriber', icon: Users, tint: 'bg-brand-500' },
];

export default function Services() {
  return (
    <div className="space-y-6">
      <section>
        <SectionLabel>Sales activity</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {SALES_ACTIVITIES.map(({ to, label, icon: Icon, tint }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-2 text-center">
              <div className={`w-14 h-14 rounded-2xl ${tint} flex items-center justify-center text-white shadow-card`}>
                <Icon size={24} />
              </div>
              <span className="text-xs text-ink leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <button className="w-full text-left card flex items-center justify-between shadow-none border border-slate-100">
        <span className="section-label">
          <Router size={16} className="text-slate-500" />
          Fixed line and Fixed Broadband
        </span>
      </button>

      <button className="w-full text-left card flex items-center justify-between shadow-none border border-slate-100">
        <span className="section-label">
          <Search size={16} className="text-slate-500" />
          Query
        </span>
      </button>
    </div>
  );
}
