import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import BottomNav from './BottomNav.jsx';

const TITLES = {
  '/': null,
  '/services': 'Services',
  '/services/new-subscriber': 'New Subscriber',
  '/services/primary-offer': 'Primary Offer',
  '/services/primary-offer/supplementary': 'Confirm Registration',
  '/messages': 'Messages',
  '/profile': 'Me',
  '/admin': 'Admin Panel',
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-canvas max-w-md mx-auto shadow-card">
      <Navbar title={title} />
      <main className="flex-1 px-5 py-5 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
