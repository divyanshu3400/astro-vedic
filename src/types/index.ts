export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    image: string;
    features: string[];
    price: string;
    duration: string;
}

export interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar: string;
    service: string;
    date: string;
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export interface Booking {
    id?: string;
    name: string;
    phone: string;
    email: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    consultationType: string;
    preferredDate: string;
    message: string;
    status: string;
    createdAt?: string;
}

export interface Astrologer {
    name: string;
    title: string;
    experience: string;
    image: string;
    specializations: string[];
    achievements: string[];
    certifications: string[];
    mission: string;
    timeline: TimelineItem[];
}

export interface TimelineItem {
    year: string;
    title: string;
    description: string;
}

export interface ZodiacSign {
    id: string;
    name: string;
    symbol: string;
    dateRange: string;
    element: string;
    traits: string[];
}

export interface Panchang {
    date: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    moonPhase: string;
}
