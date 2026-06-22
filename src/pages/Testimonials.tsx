import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { TestimonialCard } from '../components/TestimonialCard';
import { Loading } from '../components/Loading';
import { useTestimonials } from '../hooks/useDynamicData';

export function Testimonials() {
  const { testimonials, loading, error } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const featuredTestimonials = testimonials.slice(0, Math.min(5, testimonials.length));

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(prev => {
      let next = prev + newDirection;
      if (next < 0) next = featuredTestimonials.length - 1;
      if (next >= featuredTestimonials.length) next = 0;
      return next;
    });
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative py-20 bg-gradient-to-b from-deep-blue to-deep-blue-dark text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Client <span className="gradient-text">Testimonials</span>
          </h1>
          <p className="text-lg text-white/80">
            Real stories from real people whose lives have been transformed
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">{error}</p>
        </div>
      ) : (
        <>
          {featuredTestimonials.length > 0 && (
            <section className="py-20">
              <div className="max-w-4xl mx-auto px-4 mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                  <div className="relative h-96 md:h-80 flex items-center justify-center p-8">
                    <AnimatePresence initial={false} custom={direction}>
                      <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: 'spring', stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                      >
                        <img
                          src={featuredTestimonials[currentIndex].avatar}
                          alt={featuredTestimonials[currentIndex].name}
                          className="w-20 h-20 rounded-full border-4 border-saffron mb-6 object-cover"
                        />
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < featuredTestimonials[currentIndex].rating
                                  ? 'text-saffron fill-saffron'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic mb-6 max-w-2xl">
                          "{featuredTestimonials[currentIndex].comment}"
                        </p>
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {featuredTestimonials[currentIndex].name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {featuredTestimonials[currentIndex].location}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 bg-saffron/10 text-saffron rounded-full text-sm">
                            {featuredTestimonials[currentIndex].service}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <button
                      onClick={() => paginate(-1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-saffron hover:text-deep-blue transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => paginate(1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-saffron hover:text-deep-blue transition-colors"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex justify-center gap-2 pb-6">
                    {featuredTestimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? 'w-6 bg-saffron'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-saffron/50'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4">
              <SectionTitle
                title="All Client Reviews"
                subtitle="Read what our valued clients have to say about their experience"
              />

              {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No testimonials available yet.</p>
                </div>
              )}
            </div>
          </section>

          <section className="py-20 bg-gradient-to-r from-saffron to-gold">
            <div className="max-w-2xl mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-serif font-bold text-deep-blue mb-6">
                  Your Story Matters
                </h2>
                <p className="text-deep-blue/80 mb-8">
                  Have you consulted with us? We'd love to hear your experience. Share your testimonial and inspire others.
                </p>
                <button className="px-8 py-4 bg-deep-blue text-white rounded-full font-semibold hover:bg-deep-blue-light transition-colors">
                  Share Your Experience
                </button>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
