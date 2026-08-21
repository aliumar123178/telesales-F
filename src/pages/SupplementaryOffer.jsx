import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import WizardProgress from '../components/common/WizardProgress.jsx';
import { createSubscriber } from '../services/subscriberService.js';
import { useToast } from '../hooks/useToast.js';
import { useState } from 'react';

const WIZARD_STEPS = ['Customer', 'Offer', 'Confirm'];

export default function SupplementaryOffer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await createSubscriber({
        customer: state?.customer,
        paymentType: state?.paymentType,
        offerId: state?.offer?.id,
        numberTier: state?.numberTier,
      });
      setDone(true);
      showToast('Submitted — approval decision will arrive shortly', 'success');
    } catch {
      showToast('Could not submit registration. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
        <CheckCircle2 size={40} className="text-success" />
        <p className="font-display font-semibold text-ink text-lg">Registration submitted</p>
        <p className="text-slate-500 text-sm max-w-xs">
          The record has been created and is under review. You'll get an approval or rejection
          notice — with a reason if rejected — on the Messages tab and by SMS within about 30 seconds.
        </p>
        <Button onClick={() => navigate('/')} className="mt-4 max-w-xs">
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <WizardProgress steps={WIZARD_STEPS} currentStep={3} />
      <Card className="shadow-none border border-slate-100">
        <p className="text-sm text-slate-500 mb-1">Customer</p>
        <p className="font-medium text-ink">{state?.customer?.fullName || '—'}</p>
        <p className="text-sm text-slate-500 mt-1">{state?.customer?.phone}</p>
      </Card>
      {state?.customer?.photo && (
        <Card className="shadow-none border border-slate-100">
          <p className="text-sm text-slate-500 mb-2">Customer photo</p>
          <img
            src={state.customer.photo}
            alt="Captured customer"
            className="w-full max-h-48 object-cover rounded-xl border border-slate-200"
          />
        </Card>
      )}
      {(state?.customer?.region || state?.customer?.address) && (
        <Card className="shadow-none border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Location</p>
          <p className="font-medium text-ink text-sm">
            {[state?.customer?.address, state?.customer?.kebele, state?.customer?.woreda, state?.customer?.zone, state?.customer?.region, state?.customer?.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        </Card>
      )}
      {state?.customer?.emergencyContactName && (
        <Card className="shadow-none border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Emergency contact</p>
          <p className="font-medium text-ink text-sm">
            {state.customer.emergencyContactName} — {state.customer.emergencyContactPhone}
          </p>
        </Card>
      )}
      <Card className="shadow-none border border-slate-100">
        <p className="text-sm text-slate-500 mb-1">Payment type</p>
        <p className="font-medium text-ink">{state?.paymentType || '—'}</p>
      </Card>
      {state?.numberTier && (
        <Card className="shadow-none border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Number tier</p>
          <p className="font-medium text-ink">{state.numberTier}</p>
        </Card>
      )}
      <Card className="shadow-none border border-slate-100">
        <p className="text-sm text-slate-500 mb-1">Primary offer</p>
        <p className="font-medium text-ink">{state?.offer?.name || '—'}</p>
      </Card>

      <Button onClick={handleConfirm} loading={submitting}>
        Confirm and submit
      </Button>
    </div>
  );
}