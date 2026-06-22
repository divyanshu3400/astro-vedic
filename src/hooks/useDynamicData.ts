import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Service, FAQ, BlogPost, ZodiacSign, Testimonial } from '../types';

export interface AstrologerProfile {
    name: string;
    title: string;
    experience: string;
    image: string;
    specializations: string[];
    achievements: string[];
    certifications: string[];
    mission: string;
}

export interface Festival {
    name: string;
    festival_date: string;
    description: string;
}

export interface DailyHoroscope {
    zodiac_sign_id: string;
    horoscope: string;
    lucky_color: string | null;
    lucky_number: number | null;
}

export function useServices() {
    const [services, setServices] = useState<(Service & { price_amount: number })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchServices() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('services')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (fetchError) throw fetchError;

                const formattedServices = (data || []).map(s => ({
                    id: s.id,
                    title: s.title,
                    description: s.description,
                    icon: s.icon,
                    image: s.image,
                    features: s.features,
                    price: `₹${s.price_amount.toLocaleString()}`,
                    price_amount: s.price_amount,
                    duration: s.duration,
                }));

                setServices(formattedServices);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch services');
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    return { services, loading, error };
}

export function useAstrologerProfile() {
    const [profile, setProfile] = useState<AstrologerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('astrologer_profile')
                    .select('*')
                    .limit(1)
                    .single();

                if (fetchError) throw fetchError;
                setProfile(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    return { profile, loading, error };
}

export function useFAQs() {
    const [faqs, setFAQs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFAQs() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('faqs')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (fetchError) throw fetchError;

                const formattedFAQs = (data || []).map(f => ({
                    id: f.id.toString(),
                    question: f.question,
                    answer: f.answer,
                    category: f.category,
                }));

                setFAQs(formattedFAQs);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
            } finally {
                setLoading(false);
            }
        }

        fetchFAQs();
    }, []);

    return { faqs, loading, error };
}

export function useBlogs() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('is_published', true)
                    .order('date', { ascending: false });

                if (fetchError) throw fetchError;

                const formattedBlogs = (data || []).map(b => ({
                    id: b.id.toString(),
                    title: b.title,
                    excerpt: b.excerpt,
                    content: b.content,
                    image: b.image,
                    category: b.category,
                    author: b.author,
                    date: b.date,
                    readTime: b.read_time,
                }));

                setBlogs(formattedBlogs);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        }

        fetchBlogs();
    }, []);

    return { blogs, loading, error };
}

export function useZodiacSigns() {
    const [signs, setSigns] = useState<ZodiacSign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSigns() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('zodiac_signs')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (fetchError) throw fetchError;

                const formattedSigns = (data || []).map(s => ({
                    id: s.id,
                    name: s.name,
                    symbol: s.symbol,
                    dateRange: s.date_range,
                    element: s.element,
                    traits: s.traits,
                }));

                setSigns(formattedSigns);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch zodiac signs');
            } finally {
                setLoading(false);
            }
        }

        fetchSigns();
    }, []);

    return { signs, loading, error };
}

export function useDailyHoroscopes() {
    const [horoscopes, setHoroscopes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHoroscopes() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('daily_horoscopes')
                    .select('*')
                    .eq('horoscope_date', new Date().toISOString().split('T')[0]);

                if (fetchError) throw fetchError;

                const horoscopeMap: Record<string, string> = {};
                (data || []).forEach(h => {
                    if (h.lucky_color && h.lucky_number) {
                        horoscopeMap[h.zodiac_sign_id] = `${h.horoscope} Lucky color: ${h.lucky_color}. Lucky number: ${h.lucky_number}.`;
                    } else {
                        horoscopeMap[h.zodiac_sign_id] = h.horoscope;
                    }
                });

                setHoroscopes(horoscopeMap);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch horoscopes');
            } finally {
                setLoading(false);
            }
        }

        fetchHoroscopes();
    }, []);

    return { horoscopes, loading, error };
}

export function useFestivals() {
    const [festivals, setFestivals] = useState<Festival[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFestivals() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('festivals')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (fetchError) throw fetchError;

                const formattedFestivals = (data || []).map(f => ({
                    name: f.name,
                    festival_date: f.festival_date,
                    description: f.description,
                }));

                setFestivals(formattedFestivals);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch festivals');
            } finally {
                setLoading(false);
            }
        }

        fetchFestivals();
    }, []);

    return { festivals, loading, error };
}

export function useTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('testimonials')
                    .select('*')
                    .eq('is_approved', true)
                    .order('created_at', { ascending: false });

                if (fetchError) throw fetchError;

                const formattedTestimonials = (data || []).map(t => ({
                    id: t.id.toString(),
                    name: t.name,
                    location: t.location,
                    rating: t.rating,
                    comment: t.comment,
                    avatar: t.avatar,
                    service: t.service,
                    date: t.date,
                }));

                setTestimonials(formattedTestimonials);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
            } finally {
                setLoading(false);
            }
        }

        fetchTestimonials();
    }, []);

    return { testimonials, loading, error };
}
