import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { getPrimaryOffers } from '../services/offerService.js';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import Input from '../components/common/Input.jsx';
import WizardProgress from '../components/common/WizardProgress.jsx';

const PAYMENT_TYPES = ['Prepaid', 'Postpaid'];
const WIZARD_STEPS = ['Customer', 'Offer', 'Confirm'];
const NUMBER_TIERS = [
  { value: 'NORMAL', label: 'Normal', tint: 'border-slate-200 bg-white' },
  { value: 'SILVER', label: 'Silver', tint: 'border-slate-300 bg-slate-50' },
  { value: 'GOLD', label: 'Gold', tint: 'border-warning bg-warning/5' },
  { value: 'ICCD', label: 'ICCD', tint: 'border-info bg-info/5' },
];

export default function PrimaryOffer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('Prepaid');
  const [numberTier, setNumberTier] = useState('NORMAL');
  const [offers, setOffers] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  const filteredOffers = useMemo(() => {
    if (!filterText.trim()) return offers;
    const q = filterText.toLowerCase();
    return offers.filter((o) => o.name.toLowerCase().includes(q));
  }, [offers, filterText]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPrimaryOffers(paymentType)
      .then((data) => active && setOffers(data))
      .catch(() => active && setOffers([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [paymentType]);

  const handleNext = () => {
    navigate('/services/primary-offer/supplementary', {
      state: { customer: state?.customer, paymentType, offer: selectedOffer, numberTier },
    });
  };

  return (
    <div className="space-y-6 pb-4">
      <WizardProgress steps={WIZARD_STEPS} currentStep={2} />
      <div>
        <p className="text-sm font-medium text-ink mb-2">
          <span className="text-danger">*</span> Payment type
        </p>
        <div className="flex gap-3">
          {PAYMENT_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === type}
                onChange={() => setPaymentType(type)}
                className="w-4 h-4 accent-info"
              />
              <span className="text-sm text-ink">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-ink mb-2">Number tier</p>
        <div className="grid grid-cols-4 gap-2">
          {NUMBER_TIERS.map(({ value, label, tint }) => (
            <button
              key={value}
              type="button"
              onClick={() => setNumberTier(value)}
              className={`rounded-lg border py-2.5 text-xs font-medium text-center transition-colors ${tint} ${
                numberTier === value ? 'ring-2 ring-brand-500' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-500 mb-3">Available Primary Offer</p>
        {!loading && offers.length > 0 && (
          <Input
            icon={Search}
            placeholder="Filter offers by name"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="mb-3"
          />
        )}
        {loading ? (
          <Loader label="Loading offers…" />
        ) : filteredOffers.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No offers match that search.</p>
        ) : (
          <div className="space-y-3">
            {filteredOffers.map((offer) => (
              <button
                key={offer.id}
                onClick={() => setSelectedOffer(offer)}
                className={`w-full text-left rounded-xl border px-4 py-4 transition-colors ${
                  selectedOffer?.id === offer.id
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-coral-200 bg-white hover:bg-coral-50/50'
                }`}
              >
                <span className="text-coral-600 font-medium">{offer.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="w-full flex items-center justify-between text-sm text-slate-500 py-2">
        Mobile Available Supplementary Offer
        <ChevronRight size={16} />
      </button>

      <Button onClick={handleNext} disabled={!selectedOffer}>
        Next
      </Button>
    </div>
  );
}