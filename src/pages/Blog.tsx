import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CircleAlert as AlertCircle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogCard } from '../components/BlogCard';
import { BlogModal } from '../components/BlogModal';
import { Loading } from '../components/Loading';
import { useBlogs } from '../hooks/useDynamicData';
import type { BlogPost } from '../types';

const COSMOS = '#06040f';
const COSMOS_MID = '#0a0618';
const COSMOS_BLUE = '#0d0a1e';

const STARS = Array.from({ length: 50 }, (_, i) => ({
  cx: `${(i * 43 + 7) % 100}%`,
  cy: `${(i * 61 + 11) % 100}%`,
  r: i % 7 === 0 ? 1.5 : 0.7,
  op: 0.12 + (i % 5) * 0.1,
}));

const scrollGlyphs = ['ॐ','𑁂','𑁃','श्री','ज्ञान','✦','❋','⊕','॥'];

export function Blog() {
  const { blogs, loading, error } = useBlogs();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const blogsPerPage = 6;

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <div style={{ background: COSMOS }} className="min-h-screen">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pt-24 pb-28 flex items-center"
        style={{ background: `linear-gradient(135deg, ${COSMOS} 0%, ${COSMOS_MID} 50%, ${COSMOS_BLUE} 100%)`, minHeight: '60vh' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {STARS.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />)}
        </svg>

        {/* Floating Sanskrit glyphs */}
        {scrollGlyphs.map((g, i) => (
          <motion.span key={i}
            className="absolute font-serif select-none pointer-events-none"
            style={{
              fontSize: `${18 + (i % 3) * 10}px`,
              left: `${(i * 29 + 8) % 90}%`,
              top: `${(i * 41 + 15) % 80}%`,
              color: i % 2 === 0 ? 'rgba(245,158,11,0.08)' : 'rgba(252,211,77,0.06)',
            }}
            animate={{ y: [0, -14, 0], opacity: [0.06, 0.12, 0.06] }}
            transition={{ duration: 6 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            {g}
          </motion.span>
        ))}

        <div className="absolute top-20 right-1/3 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-10 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center w-full">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
              <BookOpen className="w-3 h-3" /> Ancient Wisdom · Modern Insights
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mb-4"
          >
            Cosmic <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wisdom</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-white/60 mb-2">
            Explore insightful articles on Vedic astrology, spirituality, and ancient wisdom
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-sm font-serif italic" style={{ color: 'rgba(252,211,77,0.45)' }}>
            विद्या ददाति विनयम् — Knowledge grants humility
          </motion.p>

          {/* Blog count strip */}
          {!loading && blogs.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-10 inline-flex items-center gap-6 px-8 py-3 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
              <div className="text-center">
                <p className="text-saffron font-bold text-xl font-serif">{blogs.length}</p>
                <p className="text-white/40 text-xs uppercase tracking-wider">Articles</p>
              </div>
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />
              <div className="text-center">
                <p className="text-saffron font-bold text-xl font-serif">∞</p>
                <p className="text-white/40 text-xs uppercase tracking-wider">Wisdom</p>
              </div>
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />
              <div className="text-center">
                <p className="text-saffron font-bold text-xl font-serif">Free</p>
                <p className="text-white/40 text-xs uppercase tracking-wider">Always</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div style={{ background: '#08060f', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(245,158,11,0.6)' }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          {!loading && (
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </div>

      {/* ── ARTICLES GRID ── */}
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
                {paginatedBlogs.map((blog, index) => (
                  <BlogCard key={blog.id} blog={blog} index={index} onClick={() => setSelectedBlog(blog)} />
                ))}
              </div>

              {filteredBlogs.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                  <div className="text-6xl mb-4 opacity-30">📜</div>
                  <p className="text-white/40 text-lg">No articles found matching your search.</p>
                  <button onClick={() => setSearch('')}
                    className="mt-4 px-6 py-2 rounded-full text-sm transition-all"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                    Clear search
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center gap-3 mt-14">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-30"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 rounded-xl text-sm font-medium transition-all"
                      style={currentPage === page ? {
                        background: 'linear-gradient(90deg,#F59E0B,#FCD34D)',
                        color: '#06040f',
                      } : {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                      }}>
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-30"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section className="py-20" style={{ background: `linear-gradient(180deg, ${COSMOS} 0%, ${COSMOS_MID} 100%)` }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="rounded-3xl p-10"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
              <p className="text-3xl font-serif text-white mb-3">Receive Weekly Cosmic Insights</p>
              <p className="text-white/40 mb-8">Planetary transits, auspicious dates, and Vedic wisdom — delivered to your inbox every week.</p>
              <div className="flex gap-3">
                <input type="email" placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                <button className="px-6 py-3 rounded-xl font-semibold text-sm text-deep-blue whitespace-nowrap transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(90deg,#F59E0B,#FCD34D)' }}>
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
    </div>
  );
}
