import { motion, AnimatePresence } from 'framer-motion';
import { X, CircleCheck as CheckCircle, Clock, Sparkles, Heart, Briefcase, TrendingUp, Users, TriangleAlert as AlertTriangle, Hash, Hand, Diamond, Hop as Home, Flame, ArrowRight } from 'lucide-react';
import type { Service } from '../types';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Heart, Briefcase, TrendingUp, Users, AlertTriangle, Hash, Hand, Diamond, Home, Flame
};

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const navigate = useNavigate();

  if (!service) return null;

  const Icon = iconMap[service.icon] || Sparkles;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="relative h-48 md:h-64">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-saffron/20 backdrop-blur-md rounded-xl">
                  <Icon className="w-6 h-6 text-saffron" />
                </div>
                <div>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </p>
                  <p className="text-white font-bold text-xl">{service.price}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              {service.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {service.description}
            </p>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                What's Included
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-saffron/10 to-gold/10 dark:from-saffron/20 dark:to-gold/20 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Session Duration</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Price</p>
                  <p className="text-2xl font-bold text-saffron">{service.price}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  onClose();
                  navigate('/book');
                }}
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
