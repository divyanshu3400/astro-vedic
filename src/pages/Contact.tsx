import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Send, Clock, Mail } from 'lucide-react';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { supabase } from '../lib/supabase';
import { CONTACT } from '../lib/config';

const COSMOS = '#06040f';
const COSMOS_MID = '#0a0618';
const COSMOS_BLUE = '#0d0a1e';

const STARS = Array.from({ length: 55 }, (_, i) => ({
  cx: `${(i * 39 + 7) % 100}%`,
  cy: `${(i * 59 + 11) % 100}%`,
  r: i % 7 === 0 ? 1.5 : 0.7,
  op: 0.12 + (i % 5) * 0.1,
}));

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name, email: formData.email,
        subject: formData.subject, message: formData.message,
      });
      if (error) throw error;
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const infoCards = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Visit Us',
      content: CONTACT.address,
      color: '#F59E0B',
      glyph: '📍',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Call Us',
      content: CONTACT.phoneDisplay,
      href: `tel:${CONTACT.phone}`,
      color: '#10B981',
      glyph: '📞',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Working Hours',
      content: `Mon – Sat: ${CONTACT.hoursWeekday}\nSunday: ${CONTACT.hoursSunday}`,
      color: '#8B5CF6',
      glyph: '⏰',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email Us',
      content: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      color: '#3B82F6',
      glyph: '✉️',
    },
  ];

  return (
    <div style={{ background: COSMOS }} className="min-h-screen">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pt-24 pb-24 flex items-center"
        style={{ background: `linear-gradient(135deg, ${COSMOS} 0%, ${COSMOS_MID} 50%, ${COSMOS_BLUE} 100%)`, minHeight: '58vh' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {STARS.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />)}
        </svg>

        {/* Om symbol watermark */}
        <motion.div
          className="absolute right-16 top-1/2 -translate-y-1/2 text-9xl font-serif select-none pointer-events-none"
          style={{ color: 'rgba(245,158,11,0.04)' }}
          animate={{ scale: [1, 1.04, 1], rotate: [0, 3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
          ॐ
        </motion.div>

        <div className="absolute top-16 right-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-10 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center w-full">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
              🙏 Seek the Oracle
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mb-4"
          >
            Connect <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>With Us</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-white/60 mb-2">
            Begin your journey — reach out for consultations, inquiries, or simply to seek guidance
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-sm font-serif italic" style={{ color: 'rgba(252,211,77,0.45)' }}>
            सम्पर्क करें — The stars await your question
          </motion.p>
        </div>
      </div>

      {/* ── INFO CARDS ── */}
      <section className="py-16" style={{ background: '#08060f' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {infoCards.map((card, i) => (
              <motion.div key={card.title}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-6 transition-all duration-300 group"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.08)` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = card.color + '33'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${card.color}11`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}30`, color: card.color }}>
                  {card.icon}
                </div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.title}</p>
                {card.href ? (
                  <a href={card.href} className="text-white/70 text-sm hover:text-white transition-colors" style={{ whiteSpace: 'pre-line' }}>
                    {card.content}
                  </a>
                ) : (
                  <p className="text-white/70 text-sm" style={{ whiteSpace: 'pre-line' }}>{card.content}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              <div className="h-64 relative">
                <iframe
                  src={CONTACT.mapEmbed}
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
              <div className="p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-saffron" />
                  <h3 className="font-serif font-semibold text-white">Our Sacred Location</h3>
                </div>
                <p className="text-white/50 text-sm">{CONTACT.address}</p>
                <p className="text-white/30 text-xs mt-2">Easy access by metro · Ample parking available</p>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="rounded-2xl p-8 h-full"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

                {isSuccess ? (
                  <div className="text-center py-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}>
                      <Send className="w-8 h-8" style={{ color: '#10B981' }} />
                    </motion.div>
                    <h3 className="text-2xl font-serif text-white mb-3">Message Sent! 🙏</h3>
                    <p className="text-white/50 mb-6">We'll connect with you within 24 hours. The stars shall guide our conversation.</p>
                    <button onClick={() => setIsSuccess(false)}
                      className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
                      style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-serif font-bold text-white mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Your Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
                        <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                      </div>
                      <Input label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this about?" required />
                      <Textarea label="Message" name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." rows={4} required />
                      <button type="submit" disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                        style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', color: '#06040f' }}>
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP MEGA CTA ── */}
      <section className="py-20" style={{ background: `linear-gradient(180deg, ${COSMOS} 0%, ${COSMOS_MID} 100%)` }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="rounded-3xl p-10"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4">💬</motion.div>
              <h2 className="text-3xl font-serif text-white mb-3">Prefer Instant Connection?</h2>
              <p className="text-white/50 mb-8">
                Chat directly on WhatsApp for quick queries, appointment scheduling, or anything on your mind.
              </p>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Namaste! I would like to know more about your astrology services.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', boxShadow: '0 0 40px rgba(37,211,102,0.3)' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
