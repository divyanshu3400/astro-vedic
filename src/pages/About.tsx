import { motion } from 'framer-motion';
import { BookOpen, Star, Trophy, Target, Sparkles, Award } from 'lucide-react';
import { Loading } from '../components/Loading';
import { useAstrologerProfile } from '../hooks/useDynamicData';

const COSMOS = '#06040f';
const COSMOS_MID = '#0a0618';
const COSMOS_BLUE = '#0d0a1e';

const STARS = Array.from({ length: 60 }, (_, i) => ({
  cx: `${(i * 41 + 13) % 100}%`,
  cy: `${(i * 57 + 9) % 100}%`,
  r: i % 6 === 0 ? 1.6 : 0.8,
  op: 0.15 + (i % 5) * 0.1,
}));

const timeline = [
  { year: '1998', icon: '🌟', title: 'Started Astrological Journey', description: 'Began formal education in Vedic astrology under renowned guru Pandit Ramesh Chandra.' },
  { year: '2002', icon: '🏅', title: 'Gold Medal — M.A. Astrology', description: 'Achieved gold medal in Masters degree from Sampurnanand Sanskrit University, Varanasi.' },
  { year: '2005', icon: '🏛️', title: 'Established Practice', description: 'Started professional astrology practice in Delhi, serving clients from all walks of life.' },
  { year: '2010', icon: '📖', title: 'Published First Book', description: 'Released "Kundli Vigyan" — a comprehensive guide to birth chart analysis.' },
  { year: '2015', icon: '🌍', title: 'International Recognition', description: 'Expanded globally through online consultations, reaching clients in 30+ countries.' },
  { year: '2020', icon: '💻', title: 'Digital Transformation', description: 'Launched online Puja services and video consultations, making astrology accessible worldwide.' },
  { year: '2024', icon: '✨', title: '25 Years of Sacred Service', description: 'Celebrated 25 years of guiding souls, with over 50,000 successful consultations.' }
];

export function About() {
  const { profile, loading, error } = useAstrologerProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COSMOS }}>
        <Loading />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COSMOS }}>
        <div className="text-center">
          <p className="text-4xl mb-4">🔭</p>
          <p className="text-white/40">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: COSMOS }} className="min-h-screen">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pt-24 pb-24 flex items-center"
        style={{ background: `linear-gradient(135deg, ${COSMOS} 0%, ${COSMOS_MID} 50%, ${COSMOS_BLUE} 100%)`, minHeight: '65vh' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {STARS.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />)}
        </svg>

        {/* Glow orbs */}
        <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: portrait */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />

              {/* Rotating sacred geometry ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-6 rounded-full border border-dashed pointer-events-none"
                style={{ borderColor: 'rgba(245,158,11,0.15)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-10 rounded-full border pointer-events-none"
                style={{ borderColor: 'rgba(252,211,77,0.08)' }}
              />

              <div className="relative rounded-3xl overflow-hidden"
                style={{ boxShadow: '0 0 60px rgba(245,158,11,0.2), 0 40px 80px rgba(0,0,0,0.5)' }}>
                <img src={profile.image} alt={profile.name}
                  className="w-full object-cover aspect-[4/5]" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(6,4,15,0.8) 0%, transparent 50%)' }} />
              </div>

              {/* Experience badge */}
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -bottom-6 -right-6 rounded-2xl p-5"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 10px 40px rgba(245,158,11,0.4)' }}>
                <p className="text-2xl font-bold font-serif text-deep-blue">{profile.experience}</p>
                <p className="text-xs font-medium text-deep-blue/70 uppercase tracking-wider">Experience</p>
              </motion.div>
            </motion.div>

            {/* Right: info */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <div className="mb-3">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
                  style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
                  <Star className="w-3 h-3" /> Master Jyotishi
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{profile.name}</h1>
              <p className="text-lg mb-6" style={{ color: '#F59E0B' }}>{profile.title}</p>
              <p className="text-white/60 text-lg leading-relaxed mb-8">{profile.mission}</p>

              {/* Specializations */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map(spec => (
                    <span key={spec} className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Consultations', value: '50,000+', icon: '🌟' },
                  { label: 'Countries', value: '30+', icon: '🌍' },
                  { label: 'Books Written', value: '3', icon: '📖' },
                  { label: 'TV Appearances', value: '20+', icon: '📺' }
                ].map(stat => (
                  <motion.div key={stat.label} whileHover={{ scale: 1.03 }} className="rounded-xl p-4"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-2xl mb-1">{stat.icon}</p>
                    <p className="text-2xl font-bold font-serif" style={{ color: '#F59E0B' }}>{stat.value}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── ACHIEVEMENTS ── */}
      <section className="py-20" style={{ background: '#08060f' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(245,158,11,0.7)' }}>Honours & Recognition</p>
              <h2 className="text-4xl font-serif text-white mb-3">Achievements <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>& Awards</span></h2>
              <p className="text-white/40">Decades of dedicated service recognized across the world</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile.achievements.map((achievement, index) => (
              <motion.div key={achievement}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ y: -4, borderColor: 'rgba(245,158,11,0.3)' }}
                className="flex items-start gap-4 rounded-2xl p-5 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(252,211,77,0.1))' }}>
                  <Trophy className="w-5 h-5 text-saffron" />
                </div>
                <p className="text-white/70 text-sm leading-relaxed pt-1">{achievement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-20" style={{ background: COSMOS }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(245,158,11,0.7)' }}>Academic Credentials</p>
              <h2 className="text-4xl font-serif text-white mb-3">Certifications & <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Qualifications</span></h2>
              <p className="text-white/40">Academic excellence ensuring the highest quality guidance</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.certifications.map((cert, index) => (
              <motion.div key={cert}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 rounded-2xl p-5 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(30,58,138,0.5)', border: '1px solid rgba(100,150,255,0.2)' }}>
                  <BookOpen className="w-5 h-5 text-saffron" />
                </div>
                <p className="text-white/70 text-sm">{cert}</p>
                <Award className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: 'rgba(245,158,11,0.4)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-24" style={{ background: '#08060f' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(245,158,11,0.7)' }}>25 Years of Sacred Service</p>
              <h2 className="text-4xl font-serif text-white">Journey Through <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>the Stars</span></h2>
            </motion.div>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.4), rgba(252,211,77,0.4), transparent)' }} />

            {timeline.map((item, index) => (
              <motion.div key={item.year}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-10 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Card */}
                <div className="flex-1">
                  <motion.div whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl p-5 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    <span className="text-sm font-bold" style={{ color: '#F59E0B' }}>{item.year}</span>
                    <h3 className="font-serif font-semibold text-white mt-1 mb-2 text-base">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                </div>

                {/* Node */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(252,211,77,0.1))',
                    border: '2px solid rgba(245,158,11,0.5)',
                    boxShadow: '0 0 20px rgba(245,158,11,0.3)'
                  }}>
                  {item.icon}
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24" style={{ background: `linear-gradient(180deg, ${COSMOS} 0%, ${COSMOS_MID} 100%)` }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {/* Yantra watermark */}
            <div className="relative inline-block mb-6">
              <Target className="w-16 h-16 text-saffron" style={{ filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.5))' }} />
            </div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(245,158,11,0.7)' }}>Our Sacred Mission</p>
            <h2 className="text-4xl font-serif text-white mb-8">
              Lighting the Path of <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every Soul</span>
            </h2>
            <div className="rounded-2xl p-8 mb-8"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-white/70 text-lg leading-relaxed italic font-serif">
                "{profile.mission}"
              </p>
            </div>
            <a href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-deep-blue transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}>
              <Sparkles className="w-4 h-4" />
              Begin Your Journey
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
