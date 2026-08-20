import { useEffect, useMemo, useState } from 'react';
import { UserPlus, FileEdit, UserMinus, ArrowLeftRight, IdCard, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboardStats } from '../services/subscriberService.js';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';

const STAT_TILES = [
  { key: 'newRegistrations', label: 'New registration', icon: UserPlus, tint: 'bg-info/10 text-info' },
  { key: 'changeOffer', label: 'Change offer', icon: FileEdit, tint: 'bg-warning/10 text-warning' },
  { key: 'terminated', label: 'Terminate service no', icon: UserMinus, tint: 'bg-danger/10 text-danger' },
  { key: 'transfers', label: 'Transfer ownership', icon: ArrowLeftRight, tint: 'bg-coral-500/10 text-coral-600' },
];

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDashboardStats()
      .then((data) => active && setStats(data))
      .catch(() => active && setStats({ newRegistrations: 0, changeOffer: 0, terminated: 0, transfers: 0 }))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const chartData = useMemo(
    () =>
      STAT_TILES.map(({ key, label }) => ({
        name: label.split(' ')[0],
        value: stats?.[key] ?? 0,
      })),
    [stats]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm">Welcome</p>
          <p className="font-display font-semibold text-ink">{user?.username || 'Agent'}</p>
        </div>
        <p className="text-slate-500 text-sm">{today}</p>
      </div>

      <Card className="flex items-center justify-around py-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500">
            <IdCard size={22} />
          </div>
          <p className="text-sm font-medium text-ink">{user?.agentCode || '—'}</p>
        </div>
        <div className="w-px h-12 bg-slate-100" />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500">
            <Award size={22} />
          </div>
          <p className="text-sm font-medium text-ink">Level {user?.level ?? 1}</p>
        </div>
      </Card>

      {loading ? (
        <Loader label="Loading dashboard…" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {STAT_TILES.map(({ key, label, icon: Icon, tint }) => (
            <Card key={key} className="border border-brand-100 shadow-none">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tint}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-display font-semibold text-ink">{stats?.[key] ?? 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </Card>
          ))}
        </div>
      )}

      {!loading && (
        <Card className="shadow-none border border-slate-100">
          <p className="text-sm font-medium text-ink mb-3">Activity overview</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F5F8FA' }} />
              <Bar dataKey="value" fill="#0B4F6C" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
