import { NavLink } from 'react-router-dom';
import { Home, Package, MessageCircle, User } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/services', label: 'Services', icon: Package, end: false },
  { to: '/messages', label: 'Messages', icon: MessageCircle, end: false },
  { to: '/profile', label: 'Me', icon: User, end: false },
];

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-10 bg-white border-t border-slate-100">
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? 'text-brand-500' : 'text-slate-400'
                }`
              }
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
