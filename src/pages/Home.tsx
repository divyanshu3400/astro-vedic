import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Calendar, Moon as MoonIcon, CircleAlert as AlertCircle } from 'lucide-react';
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

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-deep-blue via-deep-blue-dark to-gray-900">
        <StarField />
        <motion.div
          className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-saffron/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <motion.div
          className="absolute top-1/3 right-1/4 text-saffron/20 floating"
          animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-saffron/10 rounded-full text-saffron text-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Trusted by 50,000+ clients worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight"
            >
              Discover Your Destiny with{' '}
              <span className="gradient-text">Expert Vedic Astrology</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-white/80 mb-10 max-w-3xl mx-auto"
            >
              Personalized horoscope, Kundli analysis, matchmaking, numerology, gemstone consultation, and online puja services.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button variant="primary" size="lg" onClick={() => navigate('/book')}>
                Book Consultation
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/services')}>
                Explore Services
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white/80"
          >
            {[
              { value: '25+', label: 'Years Experience' },
              { value: '50K+', label: 'Happy Clients' },
              { value: '100K+', label: 'Consultations' },
              { value: '30+', label: 'Countries' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-saffron mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
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
