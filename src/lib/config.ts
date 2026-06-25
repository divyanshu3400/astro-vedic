export const CONTACT = {
  phone: import.meta.env.VITE_CONTACT_PHONE ?? '+919876543210',
  phoneDisplay: import.meta.env.VITE_CONTACT_PHONE_DISPLAY ?? '+91 98765 43210',
  phoneSecondary: import.meta.env.VITE_CONTACT_PHONE_SECONDARY ?? '',
  phoneSecondaryDisplay: import.meta.env.VITE_CONTACT_PHONE_SECONDARY_DISPLAY ?? '',
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP ?? '919876543210',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'info@jyotify.in',
  address: import.meta.env.VITE_CONTACT_ADDRESS ?? '123 Astrology Lane, Varanasi, Uttar Pradesh - 221002',
  addressShort: import.meta.env.VITE_CONTACT_ADDRESS_SHORT ?? 'Varanasi, Uttar Pradesh',
  hoursWeekday: import.meta.env.VITE_CONTACT_HOURS_WEEKDAY ?? '9:00 AM - 8:00 PM',
  hoursSunday: import.meta.env.VITE_CONTACT_HOURS_SUNDAY ?? '10:00 AM - 6:00 PM',
  businessName: import.meta.env.VITE_BUSINESS_NAME ?? 'AstroVedic Consultation',
  mapEmbed: import.meta.env.VITE_CONTACT_MAP_EMBED ?? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.5065841707535!2d77.2130!3d28.6328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzU4LjAiTiA3N8KwMTInNDYuOCJF!5e0!3m2!1sen!2sin!4v1234567890',
} as const;
