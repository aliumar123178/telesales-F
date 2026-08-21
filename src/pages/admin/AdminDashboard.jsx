import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Users, ClipboardList, KeyRound, Ban, RotateCcw, ChevronDown, ChevronUp, IdCard, MapPin, Phone as PhoneIcon } from 'lucide-react';
import {
  getAgents,
  getRegistrations,
  decideRegistration,
  setAgentActive,
  resetAgentPassword,
} from '../../services/adminService.js';
import api from '../../services/api.js';
import { useToast } from '../../hooks/useToast.js';
import { useAuth } from '../../hooks/useAuth.js';
import Card from '../../components/common/Card.jsx';
import Loader from '../../components/common/Loader.jsx';
import SectionLabel from '../../components/common/SectionLabel.jsx';

function formatLocation(customer) {
  return [customer.address, customer.kebele, customer.woreda, customer.zone, customer.region, customer.country]
    .filter(Boolean)
    .join(', ');
}

export default function AdminDashboard() {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [agents, setAgents] = useState([]);
  const [pending, setPending] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyAgentId, setBusyAgentId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [agentList, regResult, customerResult] = await Promise.all([
        getAgents(),
        getRegistrations({ status: 'PENDING' }),
        api.get('/subscribers', { params: { pageSize: 50 } }).then((r) => r.data),
      ]);
      setAgents(agentList);
      setPending(regResult.items);
      setAllCustomers(customerResult.items);
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
            {pending.map((reg) => {
              const isExpanded = expandedId === reg.id;
              return (
                <Card key={reg.id} className="shadow-none border border-slate-100">
                  <button
                    className="w-full flex items-start justify-between text-left"
                    onClick={() => setExpandedId(isExpanded ? null : reg.id)}
                  >
                    <div>
                      <p className="font-medium text-ink">{reg.customer.fullName}</p>
                      <p className="text-sm text-slate-500">{reg.offer.name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Agent: {reg.agent.fullName} ({reg.agent.agentCode})
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                      {reg.customer.photoDataUrl && (
                        <img
                          src={reg.customer.photoDataUrl}
                          alt={reg.customer.fullName}
                          className="w-full max-h-40 object-cover rounded-lg border border-slate-200"
                        />
                      )}
                      <DetailRow icon={PhoneIcon} label="Phone" value={reg.customer.phone} />
                      <DetailRow icon={IdCard} label="ID number" value={reg.customer.idNumber} />
                      <DetailRow icon={MapPin} label="Location" value={formatLocation(reg.customer)} />
                      {reg.customer.emergencyContactName && (
                        <DetailRow
                          icon={PhoneIcon}
                          label="Emergency contact"
                          value={`${reg.customer.emergencyContactName} — ${reg.customer.emergencyContactPhone}`}
                        />
                      )}
                      <DetailRow label="Payment type" value={reg.paymentType} />
                      <DetailRow label="Number tier" value={reg.numberTier} />
                    </div>
                  )}

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
              );
            })}
          </div>
        )}
      </section>

      <section>
        <SectionLabel>
          <IdCard size={14} className="inline mr-1" />
          All customers ({allCustomers.length})
        </SectionLabel>
        {allCustomers.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">No customers registered yet.</p>
        ) : (
          <div className="space-y-2">
            {allCustomers.map((c) => (
              <Card key={c.id} className="shadow-none border border-slate-100 py-3">
                <div className="flex items-center gap-3">
                  {c.photoDataUrl ? (
                    <img src={c.photoDataUrl} alt={c.fullName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 text-sm font-semibold">
                      {c.fullName?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{c.fullName}</p>
                    <p className="text-xs text-slate-400">{c.phone} · {c.idNumber}</p>
                  </div>
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

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      {Icon && <Icon size={14} className="text-slate-400 mt-0.5 shrink-0" />}
      <span className="text-slate-500 shrink-0">{label}:</span>
      <span className="text-ink font-medium">{value}</span>
    </div>
  );
}