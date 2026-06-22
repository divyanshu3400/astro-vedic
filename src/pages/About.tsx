import { motion } from 'framer-motion';
import { BookOpen, Calendar, Star, Target, Trophy, AlertCircle } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { useAstrologerProfile } from '../hooks/useDynamicData';

export function About() {
  const { profile, loading, error } = useAstrologerProfile();

  const timeline = [
    { year: '1998', title: 'Started Astrological Journey', description: 'Began formal education in Vedic astrology under renowned guru Pandit Ramesh Chandra.' },
    { year: '2002', title: 'Gold Medal in M.A. Astrology', description: 'Achieved gold medal in Masters degree from Sampurnanand Sanskrit University, Varanasi.' },
    { year: '2005', title: 'Established Practice', description: 'Started professional astrology practice in Delhi, serving clients from all walks of life.' },
    { year: '2010', title: 'Published First Book', description: 'Released "Kundli Vigyan" - a comprehensive guide to birth chart analysis.' },
    { year: '2015', title: 'International Recognition', description: 'Expanded services globally through online consultations, reaching clients in 30+ countries.' },
    { year: '2020', title: 'Digital Transformation', description: 'Launched online Puja services and video consultations, making astrology accessible worldwide.' },
    { year: '2024', title: '25 Years of Service', description: 'Celebrated 25 years of guiding souls, with over 50,000 successful consultations.' }
  ];

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative py-20 bg-gradient-to-b from-deep-blue to-deep-blue-dark text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            About <span className="gradient-text">Us</span>
          </h1>
          <p className="text-lg text-white/80">
            Meet the expert behind AstroVedic - 25 years of guiding souls through Vedic wisdom
          </p>
        </motion.div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-saffron to-gold rounded-3xl blur-2xl opacity-20" />
              <img
                src={profile.image}
                alt={profile.name}
                className="relative w-full rounded-3xl shadow-2xl object-cover aspect-[4/5]"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-saffron to-gold rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-deep-blue" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-saffron">{profile.experience}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                {profile.name}
              </h2>
              <p className="text-saffron font-medium mb-6">{profile.title}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                {profile.mission}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map(spec => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-saffron/10 text-saffron rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Consultations', value: '50,000+' },
                  { label: 'Countries', value: '30+' },
                  { label: 'Books Written', value: '3' },
                  { label: 'TV Appearances', value: '20+' }
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-2xl font-bold text-saffron">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Achievements & Awards"
            subtitle="Recognition for decades of dedicated service in Vedic astrology"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="p-3 bg-gradient-to-r from-saffron to-gold rounded-lg shrink-0">
                  <Trophy className="w-6 h-6 text-deep-blue" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{achievement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Certifications & Qualifications"
            subtitle="Academic credentials that ensure expert guidance"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
              >
                <div className="p-3 bg-deep-blue rounded-lg">
                  <BookOpen className="w-6 h-6 text-saffron" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{cert}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle
            title="Journey Through the Years"
            subtitle="A timeline of dedication and expertise"
          />

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-saffron to-gold" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <Card hover={false} className="inline-block text-left">
                    <span className="text-saffron font-bold text-lg">{item.year}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mt-2 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </Card>
                </div>

                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-saffron to-gold rounded-full flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-deep-blue" />
                  </div>
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Target className="w-16 h-16 text-saffron mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {profile.mission}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
