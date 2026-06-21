import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../types';
import { formatDate } from '../utils/helpers';
import { useInView } from '../hooks/useInView';

interface BlogCardProps {
  blog: BlogPost;
  index: number;
}

export function BlogCard({ blog, index }: BlogCardProps) {
  const { ref, isInView } = useInView(0.1);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 text-xs bg-saffron/10 text-saffron rounded-full">
            {blog.category}
          </span>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            {blog.readTime}
          </div>
        </div>

        <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-saffron transition-colors">
          {blog.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(blog.date)}
          </p>
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center text-saffron text-sm font-medium"
          >
            Read More
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
