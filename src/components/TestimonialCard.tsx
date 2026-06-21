import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '../types';
import { formatDate } from '../utils/helpers';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="absolute top-4 right-4 text-saffron/20">
        <Quote className="w-10 h-10" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-saffron"
        />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.location}
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? 'text-saffron fill-saffron'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
        "{testimonial.comment}"
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span className="px-2 py-1 bg-saffron/10 text-saffron rounded-full text-xs">
          {testimonial.service}
        </span>
        <span>{formatDate(testimonial.date)}</span>
      </div>
    </motion.div>
  );
}
