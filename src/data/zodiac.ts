import type { ZodiacSign } from '../types';

export const zodiacSigns: ZodiacSign[] = [
    {
        id: 'aries',
        name: 'Aries',
        symbol: '♈',
        dateRange: 'Mar 21 - Apr 19',
        element: 'Fire',
        traits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic']
    },
    {
        id: 'taurus',
        name: 'Taurus',
        symbol: '♉',
        dateRange: 'Apr 20 - May 20',
        element: 'Earth',
        traits: ['Reliable', 'Patient', 'Practical', 'Devoted']
    },
    {
        id: 'gemini',
        name: 'Gemini',
        symbol: '♊',
        dateRange: 'May 21 - Jun 20',
        element: 'Air',
        traits: ['Gentle', 'Adaptable', 'Curious', 'Affectionate']
    },
    {
        id: 'cancer',
        name: 'Cancer',
        symbol: '♋',
        dateRange: 'Jun 21 - Jul 22',
        element: 'Water',
        traits: ['Loyal', 'Sympathetic', 'Persuasive', 'Intuitive']
    },
    {
        id: 'leo',
        name: 'Leo',
        symbol: '♌',
        dateRange: 'Jul 23 - Aug 22',
        element: 'Fire',
        traits: ['Creative', 'Generous', 'Warm-hearted', 'Cheerful']
    },
    {
        id: 'virgo',
        name: 'Virgo',
        symbol: '♍',
        dateRange: 'Aug 23 - Sep 22',
        element: 'Earth',
        traits: ['Analytical', 'Kind', 'Hardworking', 'Practical']
    },
    {
        id: 'libra',
        name: 'Libra',
        symbol: '♎',
        dateRange: 'Sep 23 - Oct 22',
        element: 'Air',
        traits: ['Cooperative', 'Diplomatic', 'Fair-minded', 'Social']
    },
    {
        id: 'scorpio',
        name: 'Scorpio',
        symbol: '♏',
        dateRange: 'Oct 23 - Nov 21',
        element: 'Water',
        traits: ['Resourceful', 'Brave', 'Passionate', 'Loyal']
    },
    {
        id: 'sagittarius',
        name: 'Sagittarius',
        symbol: '♐',
        dateRange: 'Nov 22 - Dec 21',
        element: 'Fire',
        traits: ['Generous', 'Idealistic', 'Great humor', 'Adventurous']
    },
    {
        id: 'capricorn',
        name: 'Capricorn',
        symbol: '♑',
        dateRange: 'Dec 22 - Jan 19',
        element: 'Earth',
        traits: ['Responsible', 'Disciplined', 'Self-control', 'Good managers']
    },
    {
        id: 'aquarius',
        name: 'Aquarius',
        symbol: '♒',
        dateRange: 'Jan 20 - Feb 18',
        element: 'Air',
        traits: ['Progressive', 'Original', 'Independent', 'Humanitarian']
    },
    {
        id: 'pisces',
        name: 'Pisces',
        symbol: '♓',
        dateRange: 'Feb 19 - Mar 20',
        element: 'Water',
        traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle']
    }
];

export const dailyHoroscopes: Record<string, string> = {
    aries: 'Today brings new opportunities for career growth. Trust your instincts and take bold steps. Lucky color: Red. Lucky number: 9.',
    taurus: 'Financial matters look promising. A family matter may need your attention. Stay patient. Lucky color: Green. Lucky number: 6.',
    gemini: 'Communication is your strength today. Express your ideas confidently. A surprise awaits in the evening. Lucky color: Yellow. Lucky number: 5.',
    cancer: 'Emotional connections strengthen today. Trust your intuition in relationships. Home brings comfort. Lucky color: Silver. Lucky number: 2.',
    leo: 'Your creativity shines bright. Recognition may come from unexpected quarters. Stay humble. Lucky color: Orange. Lucky number: 1.',
    virgo: 'Details matter today. Your analytical skills will solve a complex problem. Health needs attention. Lucky color: Navy. Lucky number: 5.',
    libra: 'Balance is key today. Partnerships flourish. A new friendship may blossom. Lucky color: Pink. Lucky number: 6.',
    scorpio: 'Transformation is in the air. Let go of what no longer serves you. New beginnings await. Lucky color: Maroon. Lucky number: 8.',
    sagittarius: 'Adventure calls! Travel or higher learning opportunities appear. Stay optimistic. Lucky color: Purple. Lucky number: 3.',
    capricorn: 'Career achievements are highlighted. Your hard work pays off. Family supports your dreams. Lucky color: Black. Lucky number: 8.',
    aquarius: 'Innovative ideas flow today. Your unique perspective is valued. Technology brings good news. Lucky color: Blue. Lucky number: 4.',
    pisces: 'Spiritual insights come naturally. Dreams may carry important messages. Trust your inner voice. Lucky color: Sea green. Lucky number: 7.'
};
