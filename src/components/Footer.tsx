import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Globe } from 'lucide-react';
import { useState } from 'react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' }
];

const services = [
  { name: 'Kundli Analysis', path: '/services#kundli' },
  { name: 'Marriage Matching', path: '/services#marriage' },
  { name: 'Career Guidance', path: '/services#career' },
  { name: 'Vastu Consultation', path: '/services#vastu' },
  { name: 'Gemstone Recommendation', path: '/services#gemstone' },
  { name: 'Online Puja', path: '/services#puja' }
];

const socialLinks = [
  { icon: Globe, href: '#', label: 'Social' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-deep-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-r from-saffron to-gold rounded-full flex items-center justify-center"
              >
                <span className="text-deep-blue font-bold text-xl">J</span>
              </motion.div>
              <span className="font-serif text-xl font-bold">
                Jyotify
              </span>
            </div>
            <p className="text-white/70 mb-6">
              Your trusted destination for Vedic astrology services. Discover your destiny with expert Kundli analysis, matchmaking, and spiritual guidance.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/10 rounded-lg hover:bg-saffron hover:text-deep-blue transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-saffron transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map(service => (
                <li key={service.path}>
                  <Link
                    to={service.path}
                    className="text-white/70 hover:text-saffron transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <span>123 Astrology Lane, Varanasi, Uttar Pradesh - 221002</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-saffron shrink-0" />
                <a href="tel:+918858271765" className="hover:text-saffron transition-colors">
                  +91 88582 71765
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-saffron shrink-0" />
                <a href="mailto:info@jyotify.in" className="hover:text-saffron transition-colors">
                  info@jyotify.in
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-medium mb-3">Newsletter</h4>
              {isSubscribed ? (
                <p className="text-saffron text-sm">Thank you for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-saffron"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-saffron text-deep-blue rounded-lg hover:bg-gold transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Jyotify. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-saffron transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-saffron transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
