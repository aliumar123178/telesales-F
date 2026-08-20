import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Users, ClipboardList, KeyRound, Ban, RotateCcw } from 'lucide-react';
import {
  getAgents,
  getRegistrations,
  decideRegistration,
  setAgentActive,
  resetAgentPassword,
} from '../../services/adminService.js';
import { useToast } from '../../hooks/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import Card from '../../components/common/Card.jsx';
import Loader from '../../components/common/Loader.jsx';
import SectionLabel from '../../components/common/SectionLabel.jsx';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [agents, setAgents] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyAgentId, setBusyAgentId] = useState(null);

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

  const handleToggleActive = async (agent) => {
    const nextActive = !agent.isActive;
    const verb = nextActive ? 'reactivate' : 'deactivate';
    if (!window.confirm(`Are you sure you want to ${verb} ${agent.fullName}?`)) return;

    setBusyAgentId(agent.id);
    try {
      await setAgentActive(agent.id, nextActive);
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, isActive: nextActive } : a)));
      showToast(nextActive ? 'Agent reactivated' : 'Agent deactivated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update agent', 'error');
    } finally {
      setBusyAgentId(null);
    }
  };

  const handleResetPassword = async (agent) => {
    const newPassword = window.prompt(
      `Enter a new password for ${agent.fullName} (${agent.username}). Minimum 6 characters.`
    );
    if (!newPassword) return;
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setBusyAgentId(agent.id);
    try {
      await resetAgentPassword(agent.id, newPassword);
      showToast(`Password updated for ${agent.username}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not reset password', 'error');
    } finally {
      setBusyAgentId(null);
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
          {agents.map((agent) => {
            const isSelf = agent.id === currentUser?.id;
            const isBusy = busyAgentId === agent.id;
            return (
              <Card key={agent.id} className="shadow-none border border-slate-100 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{agent.fullName}</p>
                    <p className="text-xs text-slate-400">
                      {agent.agentCode} · {agent.username}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!agent.isActive && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-danger/10 text-danger">
                        Deactivated
                      </span>
                    )}
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-brand-50 text-brand-500">
                      {agent.role}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleResetPassword(agent)}
                    disabled={isBusy}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-brand-50 text-brand-500 text-xs font-medium py-2 disabled:opacity-50"
                  >
                    <KeyRound size={14} /> Reset password
                  </button>
                  {!isSelf && (
                    <button
                      onClick={() => handleToggleActive(agent)}
                      disabled={isBusy}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium py-2 disabled:opacity-50 ${
                        agent.isActive ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                      }`}
                    >
                      {agent.isActive ? (
                        <>
                          <Ban size={14} /> Deactivate
                        </>
                      ) : (
                        <>
                          <RotateCcw size={14} /> Reactivate
                        </>
                      )}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}