import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Briefcase, TrendingUp, Users, TriangleAlert as AlertTriangle, Hash, Hand, Diamond, Hop as Home, Flame } from 'lucide-react';
import type { Service } from '../types';
import { Button } from './Button';
import { useInView } from '../hooks/useInView';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Heart, Briefcase, TrendingUp, Users, AlertTriangle, Hash, Hand, Diamond, Home, Flame
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const { ref, isInView } = useInView(0.1);
  const Icon = iconMap[service.icon] || Sparkles;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/90 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="p-2 bg-saffron/20 backdrop-blur-md rounded-xl">
            <Icon className="w-6 h-6 text-saffron" />
          </div>
          <div>
            <p className="text-white/80 text-sm">{service.duration}</p>
            <p className="text-white font-semibold">{service.price}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
          {service.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {service.features.slice(0, 3).map((feature, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-saffron/10 text-saffron rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        <Button variant="ghost" size="sm" className="group-hover:text-saffron">
          Learn More
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
