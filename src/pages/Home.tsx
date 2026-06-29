import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Calendar, Moon as MoonIcon, CircleAlert as AlertCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/Button';
import { SectionTitle } from '../components/SectionTitle';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceModal } from '../components/ServiceModal';
import { TestimonialCard } from '../components/TestimonialCard';
import { BlogCard } from '../components/BlogCard';
import { BlogModal } from '../components/BlogModal';
import StarField from '../components/StarField';
import { Loading } from '../components/Loading';
import {
  useServices,
  useTestimonials,
  useBlogs,
  useZodiacSigns,
  useDailyHoroscopes,
  useFestivals
} from '../hooks/useDynamicData';
import type { Service, BlogPost } from '../types';

export function Home() {
  const navigate = useNavigate();
  const { services, loading: servicesLoading } = useServices();
  const { testimonials, loading: testimonialsLoading } = useTestimonials();
  const { blogs, loading: blogsLoading } = useBlogs();
  const { signs: zodiacSigns, loading: zodiacLoading } = useZodiacSigns();
  const { horoscopes: dailyHoroscopes, loading: horoscopesLoading } = useDailyHoroscopes();
  const { festivals, loading: festivalsLoading } = useFestivals();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const todayPanchang = {
    tithi: 'Shukla Paksha, Dashami',
    nakshatra: 'Hasta',
    yoga: 'Siddhi',
    moonPhase: 'Waxing Gibbous'
  };

  const isLoading = servicesLoading || testimonialsLoading || blogsLoading || zodiacLoading || horoscopesLoading || festivalsLoading;

  const zodiacGlyphs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  return (
    <div className="overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Deep cosmic base */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #03071e 0%, #0a0f2e 40%, #0d0b2e 70%, #080518 100%)' }} />

        {/* Nebula blobs */}
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full"
          style={{
            willChange: 'transform, opacity',  // ← add this
            transform: 'translateZ(0)', background: 'radial-gradient(circle, rgba(67,56,202,0.18) 0%, transparent 70%)'
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', willChange: 'transform, opacity',  // ← add this
            transform: 'translateZ(0)',
          }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-[30%] w-[500px] h-[500px] rounded-full -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', willChange: 'transform, opacity',  // ← add this
            transform: 'translateZ(0)',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Star field */}
        <StarField />

        {/* Floating zodiac glyphs in background */}
        {zodiacGlyphs.map((glyph, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5 font-serif select-none pointer-events-none"
            style={{
              fontSize: `${Math.random() * 30 + 20}px`,
              left: `${(i * 8.5) % 95}%`,
              top: `${(i * 13 + 10) % 85}%`,
            }}
            animate={{ y: [-8, 8, -8], opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          >
            {glyph}
          </motion.div>
        ))}

        {/* Shooting stars */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] rounded-full"
            style={{
              height: '60px',
              background: 'linear-gradient(180deg, rgba(245,158,11,0.8), transparent)',
              top: `${15 + i * 18}%`,
              left: `${5 + i * 22}%`,
              rotate: '45deg',
            }}
            animate={{ x: [0, 200], y: [0, 200], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 3 + 1, repeatDelay: 6 }}
          />
        ))}

        {/* ── GRID ──────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">

          {/* LEFT: Content */}
          <div className="flex flex-col items-start">

            {/* Eyebrow pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-7"
            >
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-saffron/30 bg-saffron/8"
                style={{ background: 'rgba(245,158,11,0.08)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron" />
                </span>
                <span className="text-saffron text-sm font-medium tracking-wide">Ancient Wisdom · Modern Guidance</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif font-bold leading-[1.1] text-white mb-2"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Unlock the Secrets
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="font-serif font-bold leading-[1.1] text-white mb-2"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Written in the
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="font-serif font-bold leading-[1.1] shimmer-text mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Stars Above You
            </motion.h1>

            {/* Divider accent */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="origin-left h-[2px] w-24 rounded-full mb-6"
              style={{ background: 'linear-gradient(90deg, #F59E0B, #FCD34D, transparent)' }}
            />

            {/* Sub-description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg"
            >
              Expert Vedic astrology, Kundli analysis, and spiritual guidance —
              personalized to your birth chart. Trusted by 50,000+ seekers across 30 countries.
            </motion.p>

            {/* Service chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {['Kundli Analysis', 'Matchmaking', 'Numerology', 'Gemstone', 'Online Puja'].map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/50"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {s}
                </span>
              ))}
            </motion.div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <button
                onClick={() => navigate('/book')}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-deep-blue transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
              >
                <Phone className="w-4 h-4" />
                Book Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white/80 border border-white/15 transition-all duration-300 hover:border-saffron/50 hover:text-saffron hover:bg-saffron/5"
              >
                Explore Services
              </button>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {['👨‍💼', '👩‍🦱', '🧑‍🦳', '👩', '👨‍🦲'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm"
                    style={{ borderColor: '#0a0f2e', background: 'rgba(245,158,11,0.15)' }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-saffron text-saffron" />
                  ))}
                  <span className="text-white/70 text-xs ml-1">4.9</span>
                </div>
                <p className="text-white/40 text-xs">50,000+ happy clients worldwide</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Animated Kundli / Mandala SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center justify-center relative"
          >
            {/* Ambient glow behind mandala */}
            <div className="absolute w-[420px] h-[420px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)', filter: 'blur(30px)' }}
            />

            <svg
              viewBox="0 0 500 500"
              className="w-full max-w-[520px] drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.15))' }}
            >
              {/* ── Outer decorative ring (spinning) ── */}
              <g className="spin-slow" style={{ transformOrigin: '250px 250px' }}>
                <circle cx="250" cy="250" r="235" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
                {/* 12 house division tick marks */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const x1 = 250 + 220 * Math.cos(angle);
                  const y1 = 250 + 220 * Math.sin(angle);
                  const x2 = 250 + 235 * Math.cos(angle);
                  const y2 = 250 + 235 * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(245,158,11,0.5)" strokeWidth="2" />;
                })}
                {/* Zodiac glyphs on outer ring */}
                {zodiacGlyphs.map((g, i) => {
                  const angle = (i * 30 - 75) * (Math.PI / 180);
                  const x = 250 + 208 * Math.cos(angle);
                  const y = 250 + 208 * Math.sin(angle);
                  return (
                    <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                      fontSize="14" fill="rgba(245,158,11,0.6)" fontFamily="serif">{g}</text>
                  );
                })}
                {/* 72 minor tick marks */}
                {[...Array(72)].map((_, i) => {
                  const angle = (i * 5 - 90) * (Math.PI / 180);
                  const x1 = 250 + 228 * Math.cos(angle);
                  const y1 = 250 + 228 * Math.sin(angle);
                  const x2 = 250 + 235 * Math.cos(angle);
                  const y2 = 250 + 235 * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(245,158,11,0.2)" strokeWidth="0.8" />;
                })}
              </g>

              {/* ── Second ring (counter-spinning) ── */}
              <g className="spin-reverse" style={{ transformOrigin: '250px 250px' }}>
                <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="1" strokeDasharray="4 8" />
                {/* 8 planet markers */}
                {['☉', '☽', '♂', '♃', '♄', '♀', '☿', '⬆'].map((planet, i) => {
                  const angle = (i * 45 - 90) * (Math.PI / 180);
                  const x = 250 + 172 * Math.cos(angle);
                  const y = 250 + 172 * Math.sin(angle);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="12" fill="rgba(124,58,237,0.25)" stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
                      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="rgba(255,255,255,0.8)">{planet}</text>
                    </g>
                  );
                })}
              </g>

              {/* ── Third ring (medium spin) ── */}
              <g className="spin-medium" style={{ transformOrigin: '250px 250px' }}>
                <circle cx="250" cy="250" r="145" fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="0.8" />
                {/* Decorative dots */}
                {[...Array(24)].map((_, i) => {
                  const angle = (i * 15 - 90) * (Math.PI / 180);
                  const x = 250 + 145 * Math.cos(angle);
                  const y = 250 + 145 * Math.sin(angle);
                  return <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 1.5} fill={i % 3 === 0 ? 'rgba(245,158,11,0.7)' : 'rgba(245,158,11,0.3)'} />;
                })}
              </g>

              {/* ── North India Kundli square chart ── */}
              <g opacity="0.6">
                {/* Outer square */}
                <rect x="110" y="110" width="280" height="280" fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="1.5" />
                {/* Inner square (rotated 45°) */}
                <polygon points="250,120 380,250 250,380 120,250" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                {/* Diagonal lines */}
                <line x1="110" y1="110" x2="390" y2="390" stroke="rgba(245,158,11,0.12)" strokeWidth="1" />
                <line x1="390" y1="110" x2="110" y2="390" stroke="rgba(245,158,11,0.12)" strokeWidth="1" />
                <line x1="250" y1="110" x2="250" y2="390" stroke="rgba(245,158,11,0.12)" strokeWidth="0.8" />
                <line x1="110" y1="250" x2="390" y2="250" stroke="rgba(245,158,11,0.12)" strokeWidth="0.8" />
              </g>

              {/* ── Center Om symbol ── */}
              <g>
                <circle cx="250" cy="250" r="52" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.35)" strokeWidth="1.5" />
                <circle cx="250" cy="250" r="40" fill="rgba(10,15,46,0.8)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                <text x="250" y="258" textAnchor="middle" dominantBaseline="middle"
                  fontSize="36" fill="#F59E0B" fontFamily="serif" opacity="0.9">ॐ</text>
              </g>

              {/* ── Glowing accent dots ── */}
              {[45, 135, 225, 315].map((deg, i) => {
                const angle = (deg - 90) * (Math.PI / 180);
                const x = 250 + 235 * Math.cos(angle);
                const y = 250 + 235 * Math.sin(angle);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#F59E0B" opacity="0.8" />
                    <circle cx={x} cy={y} r="10" fill="rgba(245,158,11,0.2)" />
                  </g>
                );
              })}
            </svg>

            {/* Floating card: Today's Energy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute top-6 right-0 rounded-xl px-4 py-3 border border-white/10 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Today's Energy</p>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌙</span>
                <div>
                  <p className="text-white text-xs font-semibold">Hasta Nakshatra</p>
                  <p className="text-saffron text-[10px]">Auspicious · Siddhi Yoga</p>
                </div>
              </div>
            </motion.div>

            {/* Floating card: Live sessions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute bottom-8 left-0 rounded-xl px-4 py-3 border border-white/10 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <p className="text-white/60 text-xs">12 consultations live now</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stats bar ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="absolute bottom-0 left-0 right-0 border-t border-white/5"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '25+', label: 'Years of Expertise', icon: '🏆' },
              { value: '50K+', label: 'Clients Served', icon: '🌟' },
              { value: '100K+', label: 'Consultations', icon: '📿' },
              { value: '30+', label: 'Countries Reached', icon: '🌍' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{stat.icon}</span>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-saffron leading-none">{stat.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                </div>
                {i < 3 && <div className="hidden md:block ml-auto w-px h-8 bg-white/10" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-28 right-8 hidden lg:flex flex-col items-center gap-1"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
          <div className="text-white/20 text-[10px] tracking-[0.2em] rotate-90 mt-1">SCROLL</div>
        </motion.div>
      </section>

      {isLoading ? (
        <div className="py-20 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <SectionTitle
                title="Our Premium Services"
                subtitle="Discover our comprehensive range of Vedic astrology services designed to guide you towards success, happiness, and spiritual enlightenment."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.slice(0, 6).map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} onClick={() => setSelectedService(service)} />
                ))}
              </div>

              {services.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No services available at the moment.</p>
                </div>
              )}

              <div className="text-center mt-12">
                <Button variant="primary" onClick={() => navigate('/services')}>
                  View All Services
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </section>

          <section className="py-20 bg-gradient-to-br from-saffron/5 to-gold/5 dark:from-saffron/10 dark:to-transparent">
            <div className="max-w-7xl mx-auto px-4">
              <SectionTitle
                title="Today's Panchang"
                subtitle="Plan your day according to the ancient Vedic almanac"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-saffron/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-saffron" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Tithi</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{todayPanchang.tithi}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-saffron/10 rounded-lg">
                      <Star className="w-5 h-5 text-saffron" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Nakshatra</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{todayPanchang.nakshatra}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-saffron/10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-saffron" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Yoga</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{todayPanchang.yoga}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-saffron/10 rounded-lg">
                      <MoonIcon className="w-5 h-5 text-saffron" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Moon Phase</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{todayPanchang.moonPhase}</p>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <SectionTitle
                title="Daily Horoscope"
                subtitle="What do the stars have in store for you today?"
              />

              {zodiacSigns.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {zodiacSigns.map((sign, index) => (
                    <motion.div
                      key={sign.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer group"
                    >
                      <div className="text-center mb-3">
                        <span className="text-3xl">{sign.symbol}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-1">
                        {sign.name}
                      </h3>
                      <p className="text-xs text-gray-500 text-center mb-2">{sign.dateRange}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 group-hover:line-clamp-none transition-all">
                        {dailyHoroscopes[sign.id] || 'Horoscope not available for today.'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Horoscopes not available at the moment.</p>
                </div>
              )}
            </div>
          </section>

          <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <SectionTitle
                title="Upcoming Festivals"
                subtitle="Mark your calendars for these auspicious occasions"
              />

              {festivals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {festivals.slice(0, 4).map((festival, index) => (
                    <motion.div
                      key={festival.name}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-saffron to-gold rounded-xl flex items-center justify-center text-deep-blue font-bold">
                        <div className="text-center">
                          <div className="text-lg">{festival.festival_date.split(' ')[0]}</div>
                          <div className="text-xs">{festival.festival_date.split(' ')[1]?.slice(0, 3)}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{festival.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{festival.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No festival information available.</p>
                </div>
              )}
            </div>
          </section>

          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <SectionTitle
                title="What Our Clients Say"
                subtitle="Real stories from real people whose lives have been transformed by Vedic astrology"
              />

              {testimonials.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                      <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                    ))}
                  </div>

                  <div className="text-center mt-12">
                    <Button variant="outline" onClick={() => navigate('/testimonials')}>
                      Read More Testimonials
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No testimonials available at the moment.</p>
                </div>
              )}
            </div>
          </section>

          <section className="py-20 bg-gradient-to-br from-deep-blue to-deep-blue-dark text-white">
            <div className="max-w-7xl mx-auto px-4">
              <SectionTitle
                title="Latest from Our Blog"
                subtitle="Explore insightful articles on Vedic astrology, spirituality, and ancient wisdom"
              />

              {blogs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {blogs.slice(0, 4).map((blog, index) => (
                      <BlogCard key={blog.id} blog={blog} index={index} onClick={() => setSelectedBlog(blog)} />
                    ))}
                  </div>

                  <div className="text-center mt-12">
                    <Button variant="outline" onClick={() => navigate('/blog')}>
                      View All Articles
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No blog posts available at the moment.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <section className="py-20 bg-gradient-to-r from-saffron to-gold">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-blue mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-deep-blue/80 mb-8 text-lg">
              Book a consultation today and discover what the stars have in store for you. Your destiny awaits!
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/book')}
              className="bg-deep-blue hover:bg-deep-blue-light"
            >
              Book Your Consultation Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
    </div>
  );
}
