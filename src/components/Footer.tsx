import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { CONTACT } from '../lib/config';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
];

const serviceLinks = [
  { name: 'Kundli Analysis', path: '/services', glyph: '♈' },
  { name: 'Marriage Matching', path: '/services', glyph: '♀' },
  { name: 'Career Guidance', path: '/services', glyph: '♃' },
  { name: 'Vastu Consultation', path: '/services', glyph: '⊕' },
  { name: 'Gemstone Advice', path: '/services', glyph: '♦' },
  { name: 'Online Puja', path: '/services', glyph: '🔥' },
];

const socialLinks = [
  {
    label: 'Instagram', href: '#', color: '#E1306C',
    svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  },
  {
    label: 'YouTube', href: '#', color: '#FF0000',
    svg: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  },
  {
    label: 'Facebook', href: '#', color: '#1877F2',
    svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  },
  {
    label: 'Twitter / X', href: '#', color: '#1DA1F2',
    svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.258 5.629 5.906-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  },
];

// 27 Nakshatras — sacred lunar mansions of Vedic astrology
const nakshatras = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu',
  'Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta',
  'Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha',
  'Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada',
  'Uttara Bhadrapada','Revati',
];

const panchangItems = [
  { label: 'Weekdays', value: `Mon – Sat  ${CONTACT.hoursWeekday}` },
  { label: 'Sunday', value: CONTACT.hoursSunday },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setIsSubscribed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: '#080502', color: '#fff', position: 'relative', overflow: 'hidden' }}>

      {/* ── Top golden threshold bar ───────────────────────── */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #F59E0B 20%, #FCD34D 50%, #F59E0B 80%, transparent)' }} />

      {/* ── Nakshatra watermark belt ──────────────────────── */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none select-none" style={{ height: '48px' }}>
        <div className="flex items-center gap-8 opacity-[0.06] whitespace-nowrap text-saffron text-xs tracking-[0.25em] font-serif"
          style={{ animation: 'marquee 60s linear infinite', width: 'max-content' }}>
          {[...nakshatras, ...nakshatras].map((n, i) => (
            <span key={i}>✦ {n}</span>
          ))}
        </div>
      </div>

      {/* ── Sacred geometry SVG watermark ─────────────────── */}
      <div className="absolute right-[-80px] top-[-80px] pointer-events-none select-none opacity-[0.03]">
        <svg width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="240" fill="none" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="250" cy="250" r="180" fill="none" stroke="#F59E0B" strokeWidth="0.8" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="#F59E0B" strokeWidth="0.6" />
          <polygon points="250,10 475,390 25,390" fill="none" stroke="#F59E0B" strokeWidth="0.8" />
          <polygon points="250,490 25,110 475,110" fill="none" stroke="#F59E0B" strokeWidth="0.8" />
          {[...Array(12)].map((_, i) => {
            const a = (i * 30 - 90) * Math.PI / 180;
            return <line key={i} x1={250 + 120 * Math.cos(a)} y1={250 + 120 * Math.sin(a)}
              x2={250 + 240 * Math.cos(a)} y2={250 + 240 * Math.sin(a)}
              stroke="#F59E0B" strokeWidth="0.5" />;
          })}
          <text x="250" y="262" textAnchor="middle" fontSize="60" fill="#F59E0B" fontFamily="serif">ॐ</text>
        </svg>
      </div>

      {/* ── Main grid ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">

        {/* Newsletter mega-strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl mb-16 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(180,83,9,0.08) 100%)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <div className="absolute inset-0 pointer-events-none">
            {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((g, i) => (
              <span key={i} className="absolute text-saffron/10 font-serif text-2xl select-none"
                style={{ left: `${i * 8.5}%`, top: '50%', transform: 'translateY(-50%)' }}>{g}</span>
            ))}
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <Sparkles className="w-5 h-5 text-saffron" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-lg leading-tight">Receive Cosmic Insights Weekly</h3>
                <p className="text-white/55 text-sm mt-0.5">Horoscopes, Panchang, festival alerts & exclusive offers</p>
              </div>
            </div>
            {isSubscribed ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 text-saffron font-medium text-sm shrink-0">
                <span className="text-lg">🙏</span> Subscribed! Blessings await in your inbox.
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto shrink-0">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 md:w-64 px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-saffron"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-deep-blue"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                  <Send className="w-4 h-4" />
                  Subscribe
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Four columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1 — Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                <span className="text-deep-blue font-bold text-xl font-serif">ज</span>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white block leading-none">Jyotify</span>
                <span className="text-saffron/70 text-[10px] tracking-widest">VEDIC WISDOM</span>
              </div>
            </div>

            <p className="text-white/65 text-sm leading-relaxed mb-5">
              Rooted in 5,000 years of Vedic tradition, Jyotify brings authentic Jyotish — the science of light — to guide your life's journey with clarity and purpose.
            </p>

            {/* Sanskrit tagline */}
            <div className="mb-6 px-4 py-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <p className="text-saffron text-sm font-serif italic text-center">"ज्योतिषं वेदचक्षुः"</p>
              <p className="text-white/45 text-xs text-center mt-1">Jyotisha is the eye of the Vedas</p>
            </div>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map(({ svg, href, label, color }) => (
                <motion.a key={label} href={href} aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="group w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = color + '22'; (e.currentTarget as HTMLElement).style.borderColor = color + '55'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/60 group-hover:text-white transition-colors">{svg}</svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Col 2 — Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
            <h3 className="font-serif text-base font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-5 h-px" style={{ background: 'linear-gradient(90deg, #F59E0B, transparent)' }} />
              Explore
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, i) => (
                <motion.li key={link.path} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.04 }}>
                  <Link to={link.path}
                    className="group flex items-center gap-2 text-white/65 text-sm hover:text-white transition-colors duration-200">
                    <ArrowRight className="w-3 h-3 text-saffron/50 group-hover:text-saffron group-hover:translate-x-0.5 transition-all" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Working hours mini-card */}
            <div className="mt-7 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Working Hours</p>
              {panchangItems.map(item => (
                <div key={item.label} className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50">{item.label}</span>
                  <span className="text-white/80">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Col 3 — Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.16 }}>
            <h3 className="font-serif text-base font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-5 h-px" style={{ background: 'linear-gradient(90deg, #F59E0B, transparent)' }} />
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((s, i) => (
                <motion.li key={s.path + s.name} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.18 + i * 0.04 }}>
                  <Link to={s.path}
                    className="group flex items-center gap-2.5 text-white/65 text-sm hover:text-white transition-colors duration-200">
                    <span className="text-saffron text-xs w-4 shrink-0 group-hover:scale-110 transition-transform">{s.glyph}</span>
                    {s.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Auspicious CTA */}
            <motion.div whileHover={{ scale: 1.02 }} className="mt-7">
              <Link to="/book"
                className="flex items-center justify-between px-4 py-3.5 rounded-xl group transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(180,83,9,0.1))', border: '1px solid rgba(245,158,11,0.25)' }}>
                <div>
                  <p className="text-white text-sm font-semibold">Book a Consultation</p>
                  <p className="text-white/45 text-xs mt-0.5">Personalized Kundli reading</p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(245,158,11,0.2)' }}>
                  <ArrowRight className="w-4 h-4 text-saffron group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Col 4 — Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.24 }}>
            <h3 className="font-serif text-base font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-5 h-px" style={{ background: 'linear-gradient(90deg, #F59E0B, transparent)' }} />
              Get in Touch
            </h3>

            <ul className="space-y-4 mb-6">
              <li>
                <a href={`tel:${CONTACT.phone}`}
                  className="group flex items-start gap-3 hover:text-saffron transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Phone className="w-3.5 h-3.5 text-saffron" />
                  </div>
                  <div>
                    <p className="text-white/45 text-[10px] uppercase tracking-widest mb-0.5">Call Us</p>
                    <p className="text-white/85 text-sm group-hover:text-saffron transition-colors">{CONTACT.phoneDisplay}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`}
                  className="group flex items-start gap-3 hover:text-saffron transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Mail className="w-3.5 h-3.5 text-saffron" />
                  </div>
                  <div>
                    <p className="text-white/45 text-[10px] uppercase tracking-widest mb-0.5">Email</p>
                    <p className="text-white/85 text-sm group-hover:text-saffron transition-colors">{CONTACT.email}</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <MapPin className="w-3.5 h-3.5 text-saffron" />
                </div>
                <div>
                  <p className="text-white/45 text-[10px] uppercase tracking-widest mb-0.5">Visit Us</p>
                  <p className="text-white/75 text-sm leading-snug">{CONTACT.address}</p>
                </div>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <motion.a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.3)]"
              style={{ background: 'linear-gradient(135deg, #1a7a35, #25D366)' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
            </motion.a>
          </motion.div>
        </div>

        {/* ── Nakshatra dots divider ──────────────────────── */}
        <div className="mt-14 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3))' }} />
            <div className="flex items-center gap-1.5">
              {[...Array(27)].map((_, i) => (
                <div key={i} className={`rounded-full ${i === 13 ? 'w-2 h-2 bg-saffron' : 'w-1 h-1 bg-saffron/30'}`} />
              ))}
            </div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.3), transparent)' }} />
          </div>
          {/* Vedic wisdom quote */}
          <p className="text-center text-white/30 text-xs italic mt-4 tracking-wide">
            ✦ &nbsp; "The stars incline, they do not compel — wisdom is your compass" &nbsp; ✦
          </p>
        </div>

        {/* ── Bottom bar ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-saffron text-sm">ॐ</span>
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Jyotify. All rights reserved. &nbsp;·&nbsp; Crafted with cosmic care.
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs text-white/35">
            <a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a>
            <span className="text-white/15">|</span>
            <a href="#" className="hover:text-saffron transition-colors">Terms of Service</a>
            <span className="text-white/15">|</span>
            <a href="#" className="hover:text-saffron transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
