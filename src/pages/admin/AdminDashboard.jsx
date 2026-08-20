import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Users, ClipboardList } from 'lucide-react';
import { getAgents, getRegistrations, decideRegistration } from '../../services/adminService.js';
import { useToast } from '../../hooks/useToast.js';
import Card from '../../components/common/Card.jsx';
import Loader from '../../components/common/Loader.jsx';
import SectionLabel from '../../components/common/SectionLabel.jsx';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [agents, setAgents] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [agentList, regResult] = await Promise.all([
        getAgents(),
        getRegistrations({ status: 'PENDING' }),
      ]);
      setAgents(agentList);
      setPending(regResult.items);
    } catch {
      showToast('Could not load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      await decideRegistration(id, decision);
      setPending((prev) => prev.filter((r) => r.id !== id));
      showToast(decision === 'APPROVED' ? 'Registration approved' : 'Registration rejected', 'success');
    } catch {
      showToast('Could not update registration', 'error');
    }
  };

  if (loading) return <Loader label="Loading admin panel…" />;

  return (
    <div className="space-y-6">
      <section>
        <SectionLabel>
          <ClipboardList size={14} className="inline mr-1" />
          Pending registrations ({pending.length})
        </SectionLabel>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">No registrations awaiting review.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((reg) => (
              <Card key={reg.id} className="shadow-none border border-slate-100">
                <p className="font-medium text-ink">{reg.customer.fullName}</p>
                <p className="text-sm text-slate-500">{reg.offer.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Agent: {reg.agent.fullName} ({reg.agent.agentCode})
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDecision(reg.id, 'APPROVED')}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-success/10 text-success text-sm font-medium py-2"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleDecision(reg.id, 'REJECTED')}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-danger/10 text-danger text-sm font-medium py-2"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionLabel>
          <Users size={14} className="inline mr-1" />
          Agents ({agents.length})
        </SectionLabel>
        <div className="space-y-2">
          {agents.map((agent) => (
            <Card key={agent.id} className="shadow-none border border-slate-100 flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-ink">{agent.fullName}</p>
                <p className="text-xs text-slate-400">
                  {agent.agentCode} · {agent.username}
                </p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-brand-50 text-brand-500">
                {agent.role}
              </span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
