import type { Panchang } from '../types';

export const todayPanchang: Panchang = {
  date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  tithi: 'Shukla Paksha, Dashami',
  nakshatra: 'Hasta',
  yoga: 'Siddhi',
  karana: 'Vanija',
  moonPhase: 'Waxing Gibbous'
};

export const festivals = [
  { name: 'Maha Shivaratri', date: 'March 8, 2024', description: 'The great night of Lord Shiva' },
  { name: 'Holi', date: 'March 25, 2024', description: 'Festival of colors' },
  { name: 'Ram Navami', date: 'April 17, 2024', description: 'Birth of Lord Rama' },
  { name: 'Hanuman Jayanti', date: 'April 23, 2024', description: 'Birth of Lord Hanuman' },
  { name: 'Buddha Purnima', date: 'May 23, 2024', description: 'Birth of Lord Buddha' },
  { name: 'Janmashtami', date: 'August 26, 2024', description: 'Birth of Lord Krishna' },
  { name: 'Ganesh Chaturthi', date: 'September 7, 2024', description: 'Birth of Lord Ganesha' },
  { name: 'Navratri', date: 'October 3, 2024', description: 'Nine nights of Goddess Durga' },
  { name: 'Diwali', date: 'October 31, 2024', description: 'Festival of lights' }
];
