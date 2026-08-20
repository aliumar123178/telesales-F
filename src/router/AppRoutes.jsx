import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';

import Login from '../pages/auth/Login.jsx';
import Signup from '../pages/auth/Signup.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import Home from '../pages/Home.jsx';
import Services from '../pages/Services.jsx';
import NewSubscriber from '../pages/NewSubscriber.jsx';
import PrimaryOffer from '../pages/PrimaryOffer.jsx';
import SupplementaryOffer from '../pages/SupplementaryOffer.jsx';
import Messages from '../pages/Messages.jsx';
import Profile from '../pages/Profile.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/new-subscriber" element={<NewSubscriber />} />
          <Route path="/services/primary-offer" element={<PrimaryOffer />} />
          <Route path="/services/primary-offer/supplementary" element={<SupplementaryOffer />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
