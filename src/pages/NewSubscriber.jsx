import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, RotateCcw, CheckCircle2 } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import WizardProgress from '../components/common/WizardProgress.jsx';
import CameraCapture from '../components/common/CameraCapture.jsx';
import { lookupExistingCustomer } from '../services/subscriberService.js';
import { useToast } from '../hooks/useToast.js';

const WIZARD_STEPS = ['Customer', 'Offer', 'Confirm'];

const CUSTOMER_TYPES = [
  { value: 'existing', label: 'Exist Customer' },
  { value: 'new', label: 'New Customer' },
];

const newCustomerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(9, 'Enter a valid phone number'),
  idNumber: z.string().min(4, 'ID number is required'),
  address: z.string().min(2, 'Address is required'),
});

export default function NewSubscriber() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [customerType, setCustomerType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(newCustomerSchema) });

  const handleSearch = async () => {
    setSearchError('');
    setSearching(true);
    try {
      const result = await lookupExistingCustomer(searchQuery);
      if (result) {
        showToast('Customer found', 'success');
        navigate('/services/primary-offer', { state: { customer: result } });
      } else {
        setSearchError('No customer found for that ID or phone number');
        showToast('No customer found', 'error');
      }
    } catch {
      setSearchError('Could not complete lookup. Try again.');
      showToast('Lookup failed. Try again.', 'error');
    } finally {
      setSearching(false);
    }
  };

  const onSubmitNewCustomer = (values) => {
    if (!customerPhoto) {
      setPhotoError('A clear customer photo is required before continuing.');
      showToast('Capture a customer photo to continue', 'error');
      return;
    }
    navigate('/services/primary-offer', { state: { customer: { ...values, photo: customerPhoto } } });
  };

  const handlePhotoCaptured = (dataUrl) => {
    setCustomerPhoto(dataUrl);
    setShowCamera(false);
    setPhotoError('');
    showToast('Photo captured', 'success');
  };

  return (
    <div className="space-y-6">
      <WizardProgress steps={WIZARD_STEPS} currentStep={1} />
      <div className="flex gap-6">
        {CUSTOMER_TYPES.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="customerType"
              value={value}
              checked={customerType === value}
              onChange={() => setCustomerType(value)}
              className="w-4 h-4 accent-brand-500"
            />
            <span className="text-sm font-medium text-ink">{label}</span>
          </label>
        ))}
      </div>

      {customerType === 'existing' && (
        <div className="space-y-3">
          <Input
            label="Search by ID or phone number"
            placeholder="e.g. 982017570"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchError && <p className="text-danger text-sm">{searchError}</p>}
          <Button onClick={handleSearch} loading={searching} disabled={!searchQuery}>
            Search
          </Button>
        </div>
      )}

      {customerType === 'new' && (
        <form onSubmit={handleSubmit(onSubmitNewCustomer)} className="space-y-4">
          <Input label="Full name" placeholder="Customer's full name" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Phone number" placeholder="09XXXXXXXX" error={errors.phone?.message} {...register('phone')} />
          <Input label="ID number" placeholder="National ID or passport no." error={errors.idNumber?.message} {...register('idNumber')} />
          <Input label="Address" placeholder="Region, city, sub-city" error={errors.address?.message} {...register('address')} />

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Customer photo</label>
            {customerPhoto ? (
              <div className="flex items-center gap-3">
                <img src={customerPhoto} alt="Captured customer" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
                <div className="flex-1">
                  <p className="text-sm text-success flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 size={16} /> Photo captured
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="text-sm text-brand-500 font-medium flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} /> Retake
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-6 text-slate-500 hover:border-brand-300 hover:text-brand-500 transition-colors"
              >
                <Camera size={20} />
                <span className="text-sm font-medium">Open camera to capture photo</span>
              </button>
            )}
            {photoError && <p className="text-danger text-xs mt-1.5">{photoError}</p>}
            <p className="text-xs text-slate-400 mt-1.5">
              Photo must be captured live with the camera — uploads aren't accepted. Blurry,
              too dark, or overexposed photos are automatically rejected; you'll be asked to retake.
            </p>
          </div>

          <Button type="submit" className="mt-2">
            Continue to offer selection
          </Button>
        </form>
      )}

      {showCamera && (
        <CameraCapture onCapture={handlePhotoCaptured} onCancel={() => setShowCamera(false)} />
      )}
    </div>
  );
}
