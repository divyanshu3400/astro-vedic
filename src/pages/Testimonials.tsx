import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { TestimonialCard } from "../components/TestimonialCard";
import { Loading } from "../components/Loading";
import { useTestimonials } from "../hooks/useDynamicData";

const COSMOS = "#06040f";
const COSMOS_MID = "#0a0618";
const COSMOS_BLUE = "#0d0a1e";

const STARS = Array.from({ length: 65 }, (_, i) => ({
  cx: `${(i * 37 + 9) % 100}%`,
  cy: `${(i * 53 + 13) % 100}%`,
  r: i % 6 === 0 ? 1.8 : 0.9,
  op: 0.12 + (i % 5) * 0.1,
}));

export function Testimonials() {
  const { testimonials, loading, error } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const featured = testimonials.slice(0, Math.min(5, testimonials.length));

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 600 : -600, opacity: 0 }),
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (d: number) => ({ x: d < 0 ? 600 : -600, opacity: 0, zIndex: 0 }),
  };

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrentIndex((prev) => {
      let n = prev + dir;
      if (n < 0) n = featured.length - 1;
      if (n >= featured.length) n = 0;
      return n;
    });
  };

  return (
    <div style={{ background: COSMOS }} className="min-h-screen">
      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pt-24 pb-24 flex items-center"
        style={{
          background: `linear-gradient(135deg, ${COSMOS} 0%, ${COSMOS_MID} 50%, ${COSMOS_BLUE} 100%)`,
          minHeight: "60vh",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="white"
              opacity={s.op}
            />
          ))}
        </svg>

        {/* Glowing quote marks */}
        <motion.div
          className="absolute top-24 left-12 text-9xl font-serif select-none pointer-events-none"
          style={{ color: "rgba(245,158,11,0.05)" }}
          animate={{ opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          "
        </motion.div>
        <motion.div
          className="absolute bottom-8 right-16 text-9xl font-serif select-none pointer-events-none"
          style={{ color: "rgba(252,211,77,0.04)" }}
          animate={{ opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        >
          "
        </motion.div>

        <div
          className="absolute top-10 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.3)",
                color: "#F59E0B",
              }}
            >
              <Star className="w-3 h-3 fill-current" /> Verified Client Stories
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mb-4"
          >
            Voices of{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#F59E0B,#FCD34D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              the Stars
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 mb-2"
          >
            Real stories from real people whose lives have been transformed by
            Vedic wisdom
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-serif italic"
            style={{ color: "rgba(252,211,77,0.45)" }}
          >
            सत्यं वद — Speak the truth
          </motion.p>

          {/* Rating strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 inline-flex items-center gap-1 px-6 py-3 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-current"
                style={{ color: "#F59E0B" }}
              />
            ))}
            <span className="ml-3 text-white/70 text-sm">
              4.9 / 5 from 50,000+ clients
            </span>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <div
          className="py-24 flex items-center justify-center"
          style={{ background: COSMOS }}
        >
          <Loading />
        </div>
      ) : error ? (
        <div className="py-24 text-center" style={{ background: COSMOS }}>
          <AlertCircle
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "#EF4444" }}
          />
          <p className="text-white/40 text-lg">{error}</p>
        </div>
      ) : (
        <>
          {/* ── FEATURED SLIDER ── */}
          {featured.length > 0 && (
            <section className="py-20" style={{ background: "#08060f" }}>
              <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                  <p
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: "rgba(245,158,11,0.7)" }}
                  >
                    Featured Stories
                  </p>
                  <h2 className="text-3xl font-serif text-white">
                    What Our Clients Say
                  </h2>
                </div>

                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Decorative corner glow */}
                  <div
                    className="absolute top-0 left-0 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
                      transform: "translate(-30%, -30%)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
                      transform: "translate(30%, 30%)",
                    }}
                  />

                  <div
                    className="relative overflow-hidden"
                    style={{ minHeight: 340 }}
                  >
                    <AnimatePresence initial={false} custom={direction}>
                      <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 32,
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-10"
                      >
                        {/* Big quote mark */}
                        <Quote
                          className="w-8 h-8 mb-4"
                          style={{ color: "rgba(245,158,11,0.3)" }}
                        />

                        <p className="text-lg md:text-xl text-white/80 italic mb-8 max-w-2xl leading-relaxed font-serif">
                          "{featured[currentIndex].comment}"
                        </p>

                        <img
                          src={featured[currentIndex].avatar}
                          alt={featured[currentIndex].name}
                          className="w-16 h-16 rounded-full object-cover mb-3"
                          style={{
                            border: "2px solid rgba(245,158,11,0.5)",
                            boxShadow: "0 0 20px rgba(245,158,11,0.2)",
                          }}
                        />

                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < featured[currentIndex].rating ? "fill-current" : ""}`}
                              style={{
                                color:
                                  i < featured[currentIndex].rating
                                    ? "#F59E0B"
                                    : "rgba(255,255,255,0.2)",
                              }}
                            />
                          ))}
                        </div>
                        <h3 className="font-semibold text-white">
                          {featured[currentIndex].name}
                        </h3>
                        <p className="text-sm text-white/40 mb-2">
                          {featured[currentIndex].location}
                        </p>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: "rgba(245,158,11,0.12)",
                            border: "1px solid rgba(245,158,11,0.25)",
                            color: "#F59E0B",
                          }}
                        >
                          {featured[currentIndex].service}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Nav arrows */}
                  <button
                    onClick={() => paginate(-1)}
                    aria-label="Previous"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(245,158,11,0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)")
                    }
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    aria-label="Next"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(245,158,11,0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)")
                    }
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>

                  {/* Dot indicators */}
                  <div className="flex justify-center gap-2 py-5">
                    {featured.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDirection(i > currentIndex ? 1 : -1);
                          setCurrentIndex(i);
                        }}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: i === currentIndex ? 24 : 8,
                          height: 8,
                          background:
                            i === currentIndex
                              ? "#F59E0B"
                              : "rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── ALL REVIEWS GRID ── */}
          <section className="py-20" style={{ background: COSMOS }}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-14">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-3"
                    style={{ color: "rgba(245,158,11,0.7)" }}
                  >
                    50,000+ Satisfied Clients
                  </p>
                  <h2 className="text-4xl font-serif text-white mb-3">
                    All Client{" "}
                    <span
                      style={{
                        background: "linear-gradient(90deg,#F59E0B,#FCD34D)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Reviews
                    </span>
                  </h2>
                  <p className="text-white/40">
                    Every story is a journey transformed by the light of Jyotish
                  </p>
                </motion.div>
              </div>

              {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((t, i) => (
                    <TestimonialCard key={t.id} testimonial={t} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-white/30 text-lg">
                    No testimonials available yet.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ── CTA ── */}
          <section
            className="py-24"
            style={{
              background: `linear-gradient(180deg, ${COSMOS} 0%, ${COSMOS_MID} 100%)`,
            }}
          >
            <div className="max-w-2xl mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div
                  className="rounded-3xl p-12"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <MessageSquare
                    className="w-12 h-12 text-saffron mx-auto mb-4"
                    style={{
                      filter: "drop-shadow(0 0 16px rgba(245,158,11,0.5))",
                    }}
                  />
                  <h2 className="text-3xl font-serif text-white mb-4">
                    Your Story Matters
                  </h2>
                  <p className="text-white/50 mb-8">
                    Have you consulted with us? We'd love to hear how Vedic
                    wisdom transformed your life. Share your experience and
                    inspire others.
                  </p>
                  <a
                    href={`https://wa.me/919876543210`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(90deg,#22c55e,#16a34a)",
                      color: "white",
                      boxShadow: "0 0 30px rgba(34,197,94,0.3)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Share Your Experience on WhatsApp
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
