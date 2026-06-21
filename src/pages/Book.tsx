import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle, Phone, MessageSquare, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { services } from '../data/services';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export function Book() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    consultationType: '',
    preferredDate: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(script);
  }, []);

  const selectedService = services.find(s => s.title === formData.consultationType);
  const priceAmount = selectedService ? parseInt(selectedService.price.replace(/[^0-9]/g, '')) : 0;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.birthTime) newErrors.birthTime = 'Birth time is required';
    if (!formData.birthPlace.trim()) newErrors.birthPlace = 'Birth place is required';
    if (!formData.consultationType) newErrors.consultationType = 'Please select a consultation type';
    if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment?action=create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          amount: priceAmount,
          receipt: `booking_${Date.now()}`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  };

  const verifyPayment = async (
    paymentId: string,
    orderId: string,
    signature: string,
    bookingId: string
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment?action=verify-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          bookingId,
        }),
      }
    );

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setPaymentError(null);

    try {
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          birth_date: formData.birthDate,
          birth_time: formData.birthTime,
          birth_place: formData.birthPlace,
          consultation_type: formData.consultationType,
          preferred_date: formData.preferredDate,
          message: formData.message || null,
          payment_amount: priceAmount,
          payment_status: 'pending',
        })
        .select('id')
        .single();

      if (bookingError) throw bookingError;
      if (!bookingData) throw new Error('Failed to create booking');

      const orderData = await createOrder();

      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error('Payment system not loaded. Please refresh and try again.');
      }

      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AstroVedic Consultation',
        description: `${selectedService?.title} - ${selectedService?.duration}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            setIsSubmitting(true);
            const result = await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              bookingData.id
            );

            if (result.success) {
              setIsSuccess(true);
            } else {
              setPaymentError(result.error || 'Payment verification failed');
            }
          } catch (err) {
            setPaymentError('Payment verification failed. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#F59E0B',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setPaymentError('Payment cancelled. You can try again.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Booking error:', err);
      setPaymentError(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto px-4 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your consultation has been booked successfully. We will contact you shortly to confirm your appointment.
          </p>
          <Button variant="primary" onClick={() => {
            setIsSuccess(false);
            setFormData({
              name: '', phone: '', email: '', birthDate: '', birthTime: '',
              birthPlace: '', consultationType: '', preferredDate: '', message: ''
            });
          }}>
            Book Another Consultation
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative py-20 bg-gradient-to-b from-deep-blue to-deep-blue-dark text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Book Your <span className="gradient-text">Consultation</span>
          </h1>
          <p className="text-lg text-white/80">
            Fill out the form below to schedule your personalized astrology consultation
          </p>
        </motion.div>
      </div>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                {paymentError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 dark:text-red-400 font-medium">Payment Error</p>
                      <p className="text-red-600 dark:text-red-400 text-sm">{paymentError}</p>
                    </div>
                  </motion.div>
                )}

                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Input
                      label="Full Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Input
                      label="Phone Number *"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Input
                      label="Email Address *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <Input
                      label="Birth Date *"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      error={errors.birthDate}
                    />
                  </div>
                  <div>
                    <Input
                      label="Birth Time *"
                      name="birthTime"
                      type="time"
                      value={formData.birthTime}
                      onChange={handleChange}
                      error={errors.birthTime}
                    />
                  </div>
                  <div>
                    <Input
                      label="Birth Place *"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleChange}
                      error={errors.birthPlace}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  Consultation Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Consultation Type *
                    </label>
                    <select
                      name="consultationType"
                      value={formData.consultationType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                    >
                      <option value="">Select consultation type</option>
                      {services.map(service => (
                        <option key={service.id} value={service.title}>
                          {service.title} - {service.price} ({service.duration})
                        </option>
                      ))}
                    </select>
                    {errors.consultationType && (
                      <p className="mt-1 text-sm text-red-500">{errors.consultationType}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      label="Preferred Date *"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      error={errors.preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {selectedService && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-saffron/10 border border-saffron/20 rounded-xl"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedService.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedService.duration} session</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-saffron">{selectedService.price}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mb-8">
                  <Textarea
                    label="Additional Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any specific questions or concerns you'd like to address..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !razorpayLoaded}
                >
                  <CreditCard className="w-5 h-5" />
                  {isSubmitting ? 'Processing...' : !formData.consultationType ? 'Select a Service' : `Pay ${selectedService?.price || ''}`}
                </Button>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Secure payment powered by Razorpay
                </p>
              </motion.form>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <h3 className="font-serif font-semibold text-gray-900 dark:text-white mb-4">
                  Why Book With Us?
                </h3>
                <ul className="space-y-3">
                  {[
                    '25+ Years of Experience',
                    '50,000+ Consultations',
                    'Accurate Predictions',
                    'Personalized Guidance',
                    '100% Confidential',
                    'Satisfaction Guaranteed'
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-saffron shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-saffron to-gold rounded-2xl p-6 text-deep-blue"
              >
                <h3 className="font-serif font-semibold mb-4">Need Help?</h3>
                <p className="mb-4 text-sm opacity-80">
                  Contact us directly for immediate assistance
                </p>
                <div className="space-y-3">
                  <a href="tel:+919565901765" className="flex items-center gap-3 text-sm hover:opacity-80">
                    <Phone className="w-4 h-4" />
                    +91 98765 43210
                  </a>
                  <a href="https://wa.me/919565901765" className="flex items-center gap-3 text-sm hover:opacity-80">
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-deep-blue rounded-2xl p-6 text-white"
              >
                <h3 className="font-serif font-semibold mb-4">Working Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Monday - Saturday</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Sunday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
