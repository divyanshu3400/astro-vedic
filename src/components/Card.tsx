import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : undefined}
      transition={{ duration: 0.5 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg',
        'border border-gray-100 dark:border-gray-700',
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
