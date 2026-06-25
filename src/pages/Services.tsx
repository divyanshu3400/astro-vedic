import { motion } from 'framer-motion';
import { Search, CircleAlert as AlertCircle, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceModal } from '../components/ServiceModal';
import { Loading } from '../components/Loading';
import { useServices } from '../hooks/useDynamicData';
import type { Service } from '../types';

const COSMOS = '#06040f';
const COSMOS_MID = '#0a0618';
const COSMOS_BLUE = '#0d0a1e';

const floatingGlyphs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','☿','♀','♂','♃','♄','⛎'];

const categories = ['All', 'Kundli', 'Relationship', 'Career', 'Remedies', 'Puja'];

const STARS = Array.from({ length: 55 }, (_, i) => ({
  cx: `${(i * 37 + 11) % 100}%`,
  cy: `${(i * 53 + 7) % 100}%`,
  r: i % 5 === 0 ? 1.5 : 0.8,
  op: 0.2 + (i % 4) * 0.15,
}));

export function Services() {
  const { services, loading, error } = useServices();
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = useMemo(() => services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' ||
      service.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
      service.description.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  }), [services, search, activeCategory]);

  return (
    <div style={{ background: COSMOS }} className="min-h-screen">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pt-24 pb-28 flex items-center"
        style={{ background: `linear-gradient(135deg, ${COSMOS} 0%, ${COSMOS_MID} 45%, ${COSMOS_BLUE} 100%)`, minHeight: '60vh' }}
      >
        {/* Star field */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />
          ))}
        </svg>

        {/* Floating glyphs */}
        {floatingGlyphs.map((g, i) => (
          <motion.span
            key={i}
            className="absolute text-saffron font-serif select-none pointer-events-none"
            style={{
              fontSize: `${14 + (i % 3) * 8}px`,
              left: `${(i * 31 + 5) % 92}%`,
              top: `${(i * 47 + 10) % 85}%`,
              opacity: 0.06 + (i % 4) * 0.04,
            }}
            animate={{ y: [0, -12, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            {g}
          </motion.span>
        ))}

        {/* Glow orbs */}
        <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
              <Sparkles className="w-3 h-3" /> Ancient Wisdom · Modern Guidance
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mb-4"
          >
            Sacred <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Offerings</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-white/60 mb-2">
            Comprehensive Vedic astrology services tailored to guide you through every aspect of life
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-sm font-serif italic" style={{ color: 'rgba(252,211,77,0.5)' }}>
            ज्ञानं परमं ध्येयम् — Knowledge is the ultimate goal
          </motion.p>

          {/* Stats strip */}
          {!loading && services.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-10 inline-flex items-center gap-6 px-8 py-3 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
              <div className="text-center">
                <p className="text-saffron font-bold text-xl font-serif">{services.length}</p>
                <p className="text-white/50 text-xs uppercase tracking-wider">Services</p>
              </div>
              <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.1)' }} />
              <div className="text-center">
                <p className="text-saffron font-bold text-xl font-serif">25+</p>
                <p className="text-white/50 text-xs uppercase tracking-wider">Years</p>
              </div>
              <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.1)' }} />
              <div className="text-center">
                <p className="text-saffron font-bold text-xl font-serif">50K+</p>
                <p className="text-white/50 text-xs uppercase tracking-wider">Clients</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── SEARCH + FILTER BAR ── */}
      <div style={{ background: '#08060f', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="sticky top-16 z-20 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(245,158,11,0.6)' }} />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                style={activeCategory === cat ? {
                  background: 'linear-gradient(90deg,#F59E0B,#FCD34D)',
                  color: '#06040f',
                } : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* ── SERVICES GRID ── */}
      <section className="py-16" style={{ background: COSMOS }}>
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-28">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#EF4444' }} />
              <p className="text-white/40 text-lg">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    onClick={() => setSelectedService(service)}
                  />
                ))}
              </div>

              {filteredServices.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                  <div className="text-6xl mb-4 opacity-30">🔭</div>
                  <p className="text-white/40 text-lg">No services found matching your search.</p>
                  <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
                    className="mt-4 px-6 py-2 rounded-full text-sm transition-all"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                    Clear filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20" style={{ background: `linear-gradient(180deg, ${COSMOS} 0%, ${COSMOS_MID} 100%)` }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-3xl font-serif text-white mb-3">Not sure which service suits you?</p>
            <p className="text-white/50 mb-8">Our experts will guide you to the perfect consultation for your life questions.</p>
            <a href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-deep-blue transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}>
              <Sparkles className="w-4 h-4" />
              Get a Free Guidance Call
            </a>
          </motion.div>
        </div>
      </section>

      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
}
