import { Link } from 'react-router-dom';
import { LogOut, IdCard, Award, Mail, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';

const ADMIN_ROLES = ['SUPERVISOR', 'ADMIN'];

export default function Profile() {
  const { user, logout } = useAuth();
  const canAccessAdmin = user?.role && ADMIN_ROLES.includes(user.role);

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center font-display text-xl font-semibold">
          {user?.username?.[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <p className="font-display font-semibold text-ink">{user?.username || 'Agent'}</p>
          <p className="text-sm text-slate-500">{user?.email || 'agent@nexora.com'}</p>
        </div>
      </Card>

      <Card className="divide-y divide-slate-100 shadow-none border border-slate-100">
        <Row icon={IdCard} label="Agent code" value={user?.agentCode || '—'} />
        <Row icon={Award} label="Level" value={`Level ${user?.level ?? 1}`} />
        <Row icon={Mail} label="Email" value={user?.email || '—'} />
      </Card>

      {canAccessAdmin && (
        <Link
          to="/admin"
          className="card shadow-none border border-slate-100 flex items-center justify-between py-3"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-ink">
            <ShieldCheck size={18} className="text-brand-500" />
            Admin panel
          </span>
          <ChevronRight size={16} className="text-slate-400" />
        </Link>
      )}

      <Button variant="secondary" onClick={logout} className="flex items-center justify-center gap-2">
        <LogOut size={18} />
        Log out
      </Button>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon size={18} className="text-slate-400" />
      <span className="text-sm text-slate-500 flex-1">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
