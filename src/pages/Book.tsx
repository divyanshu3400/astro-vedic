import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck as CheckCircle, Phone, CreditCard, CircleAlert as AlertCircle, Sparkles, Clock, Shield, Star } from 'lucide-react';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { useServices } from '../hooks/useDynamicData';
import { supabase } from '../lib/supabase';
import { Loading } from '../components/Loading';
import { CONTACT } from '../lib/config';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void; close: () => void; };
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string; description: string; order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
}

const COSMOS = '#06040f';
const COSMOS_MID = '#0a0618';
const COSMOS_BLUE = '#0d0a1e';
const STARS = Array.from({ length: 45 }, (_, i) => ({
  cx: `${(i * 43 + 9) % 100}%`, cy: `${(i * 57 + 7) % 100}%`,
  r: i % 6 === 0 ? 1.4 : 0.7, op: 0.12 + (i % 4) * 0.1,
}));

function buildWhatsAppMessage(formData: {
  name: string; phone: string; email: string; birthDate: string;
  birthTime: string; birthPlace: string; consultationType: string;
  preferredDate: string; message: string;
}, serviceName: string, servicePrice: string, serviceDuration: string) {
  const lines = [
    '🙏 *Namaste! Booking Confirmed* 🙏',
    '',
    `*Consultation:* ${serviceName} (${serviceDuration}) — ${servicePrice}`,
    '',
    '👤 *Client Details*',
    `*Name:* ${formData.name}`,
    `*Phone:* ${formData.phone}`,
    `*Email:* ${formData.email}`,
    '',
    '🌟 *Birth Details*',
    `*Date:* ${formData.birthDate}`,
    `*Time:* ${formData.birthTime}`,
    `*Place:* ${formData.birthPlace}`,
    '',
    `📅 *Preferred Date:* ${formData.preferredDate}`,
    formData.message ? `\n💬 *Notes:* ${formData.message}` : '',
    '',
    '✅ *Payment confirmed via Razorpay*',
    '',
    '_Sent from Jyotify booking portal_',
  ];
  return lines.filter(l => l !== undefined).join('\n');
}

function CountdownCircle({ seconds }: { seconds: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / 3) * circumference;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
      <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
      <circle cx="40" cy="40" r={radius} fill="none" stroke="#22c55e" strokeWidth="4"
        strokeDasharray={circumference} strokeDashoffset={circumference - progress}
        strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px', transition: 'stroke-dashoffset 0.9s linear' }} />
      <text x="40" y="46" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">{seconds}</text>
    </svg>
  );
}

export function Book() {
  const [searchParams] = useSearchParams();
  const { services, loading: servicesLoading, error: servicesError } = useServices();
  const preselectedService = searchParams.get('service') ?? '';
  const preselectedApplied = useRef(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', birthDate: '', birthTime: '',
    birthPlace: '', consultationType: '', preferredDate: '', message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // WhatsApp redirect state
  const [countdown, setCountdown] = useState(3);
  const [waUrl, setWaUrl] = useState('');
  const [redirectBlocked, setRedirectBlocked] = useState(false);
  const successFormData = useRef(formData);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (preselectedApplied.current) return;
    if (!preselectedService || services.length === 0) return;
    const match = services.find(s => s.title.toLowerCase() === decodeURIComponent(preselectedService).toLowerCase());
    if (match) {
      setFormData(prev => ({ ...prev, consultationType: match.title }));
      preselectedApplied.current = true;
    }
  }, [preselectedService, services]);

  useEffect(() => {
    const pending = localStorage.getItem('pending_booking');
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('razorpay_payment_id');
    const signature = params.get('razorpay_signature');
    const orderId = params.get('razorpay_order_id');
    if (pending && paymentId && signature && orderId) {
      const { bookingId } = JSON.parse(pending);
      localStorage.removeItem('pending_booking');
      verifyPayment(paymentId, orderId, signature, bookingId).then(result => {
        if (result.success) setIsSuccess(true);
        else setPaymentError(result.error);
      });
    }
  }, []);

  // WhatsApp countdown on success
  useEffect(() => {
    if (!isSuccess) return;
    const svc = services.find(s => s.title === successFormData.current.consultationType);
    const msg = buildWhatsAppMessage(
      successFormData.current,
      svc?.title ?? successFormData.current.consultationType,
      svc?.price ?? '',
      svc?.duration ?? ''
    );
    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
    setWaUrl(url);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          try {
            const opened = window.open(url, '_blank');
            if (!opened) setRedirectBlocked(true);
          } catch {
            setRedirectBlocked(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSuccess, services]);

  const selectedService = services.find(s => s.title === formData.consultationType);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) e.phone = 'Please enter a valid 10-digit phone number';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email address';
    if (!formData.birthDate) e.birthDate = 'Birth date is required';
    if (!formData.birthTime) e.birthTime = 'Birth time is required';
    if (!formData.birthPlace.trim()) e.birthPlace = 'Birth place is required';
    if (!formData.consultationType) e.consultationType = 'Please select a consultation type';
    if (!formData.preferredDate) e.preferredDate = 'Preferred date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const createOrder = async (serviceId: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment?action=create-order`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ serviceId, receipt: `booking_${Date.now()}` }) }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create order');
    return data;
  };

  const verifyPayment = async (paymentId: string, orderId: string, signature: string, bookingId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment?action=verify-payment`,
        { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature, bookingId }) }
      );
      return await response.json();
    } catch {
      return { success: false, error: 'Network error during verification' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!selectedService) return;
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings').insert({
          name: formData.name, phone: formData.phone, email: formData.email,
          birth_date: formData.birthDate, birth_time: formData.birthTime,
          birth_place: formData.birthPlace, consultation_type: formData.consultationType,
          preferred_date: formData.preferredDate, message: formData.message || null,
          payment_amount: selectedService.price_amount, payment_status: 'pending',
        }).select('id').single();
      if (bookingError) throw bookingError;
      if (!bookingData) throw new Error('Failed to create booking');
      const orderData = await createOrder(selectedService.id);
      if (!razorpayLoaded || !window.Razorpay) throw new Error('Payment system not loaded. Please refresh and try again.');
      const options: RazorpayOptions = {
        key: orderData.key_id, amount: orderData.amount, currency: orderData.currency,
        name: CONTACT.businessName, description: `${selectedService.title} - ${selectedService.duration}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            setIsSubmitting(true);
            localStorage.removeItem('pending_booking');
            const result = await verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature, bookingData.id);
            if (result.success) {
              successFormData.current = { ...formData };
              setIsSuccess(true);
            } else {
              setPaymentError(result.error || 'Payment verification failed');
            }
          } catch {
            setPaymentError('Payment verification failed. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: '#F59E0B' },
        modal: { ondismiss: () => { setIsSubmitting(false); setPaymentError('Payment cancelled. You can try again.'); } },
      };
      localStorage.setItem('pending_booking', JSON.stringify({ bookingId: bookingData.id, orderId: orderData.order_id }));
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── LOADING ──
  if (servicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COSMOS }}>
        <Loading />
      </div>
    );
  }

  // ── ERROR ──
  if (servicesError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COSMOS }}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#EF4444' }} />
          <p className="text-white/40">Failed to load services. Please try again later.</p>
        </div>
      </div>
    );
  }

  // ── SUCCESS + WHATSAPP REDIRECT ──
  if (isSuccess) {
    const svc = services.find(s => s.title === successFormData.current.consultationType);
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${COSMOS} 0%, ${COSMOS_MID} 50%, ${COSMOS_BLUE} 100%)` }}>
        {/* Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {STARS.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />)}
        </svg>

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative z-10 w-full max-w-lg"
          >
            <div className="rounded-3xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(30px)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>

              {/* Animated checkmark ring */}
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', boxShadow: '0 0 40px rgba(34,197,94,0.25)' }}>
                <CheckCircle className="w-12 h-12" style={{ color: '#22c55e' }} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-3xl font-serif font-bold text-white mb-1">Payment Confirmed!</h2>
                <p className="text-saffron font-serif text-sm italic mb-5">🙏 Shubh Muhurta — An auspicious beginning</p>
              </motion.div>

              {/* Booking summary */}
              {svc && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="rounded-2xl p-4 mb-6 text-left"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(245,158,11,0.7)' }}>Booking Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Consultation</span>
                      <span className="text-white font-medium">{svc.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Duration</span>
                      <span className="text-white">{svc.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Amount Paid</span>
                      <span className="text-saffron font-bold">{svc.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Preferred Date</span>
                      <span className="text-white">{successFormData.current.preferredDate}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* WhatsApp redirect section */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="rounded-2xl p-5 mb-5"
                style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: '#25D366' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <p className="text-white/80 text-sm font-medium">Sending your booking details to WhatsApp</p>
                </div>

                {countdown > 0 ? (
                  <div>
                    <CountdownCircle seconds={countdown} />
                    <p className="text-white/40 text-xs mt-2">Opening WhatsApp in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
                  </div>
                ) : (
                  <p className="text-green-400 text-sm">✓ WhatsApp opened with your booking details</p>
                )}
              </motion.div>

              {/* Fallback / manual button */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="space-y-3">
                {(countdown === 0 || redirectBlocked) && (
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', boxShadow: '0 0 30px rgba(37,211,102,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {redirectBlocked ? 'Open WhatsApp (blocked — tap here)' : 'Open WhatsApp Again'}
                  </a>
                )}

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setCountdown(3);
                    setRedirectBlocked(false);
                    setFormData({ name: '', phone: '', email: '', birthDate: '', birthTime: '', birthPlace: '', consultationType: '', preferredDate: '', message: '' });
                  }}
                  className="w-full py-3 rounded-xl text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  Book Another Consultation
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── MAIN BOOKING FORM ──
  return (
    <div style={{ background: COSMOS }} className="min-h-screen">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pt-24 pb-20 flex items-center"
        style={{ background: `linear-gradient(135deg, ${COSMOS} 0%, ${COSMOS_MID} 50%, ${COSMOS_BLUE} 100%)`, minHeight: '52vh' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {STARS.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />)}
        </svg>
        <div className="absolute top-10 right-1/3 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center w-full">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
              <Sparkles className="w-3 h-3" /> Begin Your Sacred Journey
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            Book Your <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Consultation</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-white/60">
            Fill in your birth details and let the stars guide your path
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-sm font-serif italic mt-2" style={{ color: 'rgba(252,211,77,0.45)' }}>
            नक्षत्रेभ्यो नमः — Salutations to the Nakshatras
          </motion.p>
        </div>
      </div>

      {/* ── FORM + SIDEBAR ── */}
      <section className="py-16" style={{ background: '#08060f' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-8"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

                {paymentError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl flex items-start gap-3"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 font-medium text-sm">Payment Error</p>
                      <p className="text-red-400/70 text-xs mt-1">{paymentError}</p>
                    </div>
                  </motion.div>
                )}

                {/* Section: Personal Info */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>1</div>
                  <h2 className="text-xl font-serif font-bold text-white">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <Input label="Full Name *" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Enter your full name" />
                  <Input label="Phone Number *" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="Enter your phone number" />
                  <Input label="Email Address *" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="Enter your email address" />
                  <Input label="Birth Date *" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} />
                  <Input label="Birth Time *" name="birthTime" type="time" value={formData.birthTime} onChange={handleChange} error={errors.birthTime} />
                  <Input label="Birth Place *" name="birthPlace" value={formData.birthPlace} onChange={handleChange} error={errors.birthPlace} placeholder="City, State" />
                </div>

                {/* Section: Consultation */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>2</div>
                  <h2 className="text-xl font-serif font-bold text-white">Consultation Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Consultation Type *
                    </label>
                    <select name="consultationType" value={formData.consultationType} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${errors.consultationType ? '#EF4444' : 'rgba(255,255,255,0.12)'}` }}>
                      <option value="" style={{ background: '#0a0618' }}>Select consultation type</option>
                      {services.map(service => (
                        <option key={service.id} value={service.title} style={{ background: '#0a0618' }}>
                          {service.title} — {service.price} ({service.duration})
                        </option>
                      ))}
                    </select>
                    {errors.consultationType && <p className="mt-1 text-xs text-red-400">{errors.consultationType}</p>}
                  </div>
                  <Input label="Preferred Date *" name="preferredDate" type="date" value={formData.preferredDate}
                    onChange={handleChange} error={errors.preferredDate} min={new Date().toISOString().split('T')[0]} />
                </div>

                {/* Selected service preview */}
                <AnimatePresence>
                  {selectedService && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 rounded-xl overflow-hidden"
                      style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white text-sm">{selectedService.title}</p>
                          <p className="text-white/40 text-xs mt-0.5">{selectedService.duration} session</p>
                        </div>
                        <p className="text-2xl font-bold font-serif" style={{ color: '#F59E0B' }}>{selectedService.price}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-6">
                  <Textarea label="Additional Notes" name="message" value={formData.message} onChange={handleChange}
                    placeholder="Any specific questions or concerns you'd like to address..." rows={3} />
                </div>

                <button type="button" onClick={handleSubmit}
                  disabled={isSubmitting || !razorpayLoaded}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', color: '#06040f', boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}>
                  <CreditCard className="w-5 h-5" />
                  {isSubmitting ? 'Processing...' : !formData.consultationType ? 'Select a Service First' : `Pay Securely — ${selectedService?.price || ''}`}
                </button>
                <p className="mt-3 text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  🔒 Secured by Razorpay · 256-bit SSL encryption
                </p>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Why Book With Us */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-serif font-semibold text-white mb-5 flex items-center gap-2">
                  <Star className="w-4 h-4 text-saffron" /> Why Book With Us?
                </h3>
                <ul className="space-y-3">
                  {[
                    '25+ Years of Experience',
                    '50,000+ Consultations',
                    'Vedically Accurate Predictions',
                    'Personalized Birth Chart Reading',
                    '100% Confidential',
                    'Satisfaction Guaranteed',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0 text-saffron" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl p-6"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(252,211,77,0.06))', border: '1px solid rgba(245,158,11,0.2)' }}>
                <h3 className="font-serif font-semibold text-white mb-3">Need Help?</h3>
                <p className="text-white/50 text-xs mb-4">Contact us directly for immediate assistance</p>
                <div className="space-y-3">
                  <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-saffron" />
                    {CONTACT.phoneDisplay}
                  </a>
                  <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" style={{ color: '#25D366' }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </motion.div>

              {/* Process steps */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-serif font-semibold text-white mb-5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-saffron" /> How It Works
                </h3>
                {[
                  { step: '01', label: 'Fill your birth details' },
                  { step: '02', label: 'Select consultation & date' },
                  { step: '03', label: 'Complete secure payment' },
                  { step: '04', label: 'Receive WhatsApp confirmation' },
                  { step: '05', label: 'Session with your Jyotishi' },
                ].map(item => (
                  <div key={item.step} className="flex items-center gap-3 mb-3 last:mb-0">
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: 'rgba(245,158,11,0.7)' }}>{item.step}</span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Security badge */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <Shield className="w-8 h-8 flex-shrink-0" style={{ color: '#10B981' }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#10B981' }}>Secured Payment</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>256-bit SSL · Razorpay certified</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
