// Placeholder for the total from your backend (e.g. API response count).
export const TOTAL_OPEN_ROLES = 142;

// Rough rate, only used to compare USD and PKR salaries.
const USD_TO_PKR = 280;

// A job counts as "High Salary" at or above this monthly PKR amount.
export const HIGH_SALARY_MONTHLY_PKR = 150000;

export const TYPE_LABELS = {
  'full-time': 'Full time',
  'part-time': 'Part time',
  internship: 'Internship',
};

// Logos: set logoUrl to a local file (e.g. '/logos/designworks.png' placed in
// the public/logos folder) to show a real logo. With logoUrl null and
// companyWebsite null, initials are shown.
export const jobsData = [
  {
    id: 1,
    title: 'UI/UX Designer',
    company: 'DesignWorks',
    companyWebsite: null,
    logoUrl: null,
    location: 'Lahore, Pakistan',
    type: 'full-time',
    workMode: 'On-site',
    experience: 'Mid Level',
    skills: ['Figma', 'Prototyping', 'User Research'],
    about:
      'Design clean, user-centred interfaces for web and mobile products, working closely with developers and product managers.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Strong portfolio of web or mobile projects',
      'Proficiency in Figma and interactive prototyping',
      'Experience running user research and usability tests',
    ],
    salary: { min: 150000, max: 200000, currency: 'PKR', period: 'mo' },
    postedDaysAgo: 2,
    featured: true,
    relevance: 90,
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Creative Lab',
    companyWebsite: null,
    logoUrl: null,
    location: 'Remote · Pakistan',
    type: 'full-time',
    workMode: 'Remote',
    experience: 'Mid-Senior',
    skills: ['React', 'Tailwind CSS', 'JavaScript'],
    about:
      'Build fast, accessible and responsive user interfaces for our client products as part of a distributed engineering team.',
    requirements: [
      '4+ years of professional frontend experience',
      'Strong knowledge of React and modern JavaScript',
      'Experience with Tailwind CSS and responsive design',
      'Comfortable with Git and code reviews',
    ],
    salary: { min: 80000, max: 100000, currency: 'USD', period: 'yr' },
    postedDaysAgo: 1,
    urgent: true,
    relevance: 85,
  },
  {
    id: 3,
    title: 'PHP Developer',
    company: 'Core Tech',
    companyWebsite: null,
    logoUrl: null,
    location: 'Islamabad, Pakistan',
    type: 'part-time',
    workMode: 'Hybrid',
    experience: 'Mid Level',
    skills: ['PHP', 'Laravel', 'MySQL'],
    about:
      'Maintain and extend backend services and internal tools for growing business clients, on a flexible part-time schedule.',
    requirements: [
      '2+ years of PHP development experience',
      'Hands-on experience with Laravel',
      'Solid understanding of MySQL and database design',
      'Ability to work 20 hours per week, 2 days on-site',
    ],
    salary: { min: 90000, max: 130000, currency: 'PKR', period: 'mo' },
    postedDaysAgo: 5,
    relevance: 60,
  },
  {
    id: 4,
    title: 'Digital Marketing Intern',
    company: 'Growth Studio',
    companyWebsite: null,
    logoUrl: null,
    location: 'Karachi, Pakistan',
    type: 'internship',
    workMode: 'On-site',
    experience: 'Entry Level',
    skills: ['SEO', 'Social Media', 'Copywriting'],
    about:
      'Support our marketing team with campaigns, content and reporting, and learn how digital growth works day to day.',
    requirements: [
      'Currently studying or recently graduated in a related field',
      'Basic understanding of SEO and social media',
      'Good written English',
      'Eager to learn and take feedback',
    ],
    salary: { min: 25000, max: 40000, currency: 'PKR', period: 'mo' },
    postedDaysAgo: 1,
    urgent: true,
    relevance: 70,
  },
  {
    id: 5,
    title: 'Data Analyst',
    company: 'Insight Labs',
    companyWebsite: null,
    logoUrl: null,
    location: 'Remote · Worldwide',
    type: 'full-time',
    workMode: 'Remote',
    experience: 'Entry Level',
    skills: ['SQL', 'Python', 'Power BI'],
    about:
      'Turn raw data into clear dashboards and insights that help teams make better decisions.',
    requirements: [
      "Bachelor's degree in a quantitative field",
      'Working knowledge of SQL and Python',
      'Experience building dashboards in Power BI or similar',
      'Clear communication of findings to non-technical teams',
    ],
    salary: { min: 120000, max: 170000, currency: 'PKR', period: 'mo' },
    postedDaysAgo: 3,
    relevance: 75,
  },
  {
    id: 6,
    title: 'Graphic Designer',
    company: 'Studio Nine',
    companyWebsite: null,
    logoUrl: null,
    location: 'Lahore, Pakistan',
    type: 'part-time',
    workMode: 'Hybrid',
    experience: 'Entry Level',
    skills: ['Photoshop', 'Illustrator', 'Branding'],
    about:
      'Create brand visuals, social media graphics and print material for a range of creative clients.',
    requirements: [
      '1+ year of graphic design experience',
      'Proficiency in Photoshop and Illustrator',
      'A portfolio showing branding or social media work',
      'Attention to detail and ability to meet deadlines',
    ],
    salary: { min: 50000, max: 80000, currency: 'PKR', period: 'mo' },
    postedDaysAgo: 8,
    relevance: 50,
  },
  {
    id: 7,
    title: 'Web Development Intern',
    company: 'FrontDev',
    companyWebsite: null,
    logoUrl: null,
    location: 'Remote · Pakistan',
    type: 'internship',
    workMode: 'Remote',
    experience: 'Entry Level',
    skills: ['HTML', 'CSS', 'JavaScript'],
    about:
      'Learn by building real features alongside our developers, with regular mentoring and code reviews.',
    requirements: [
      'Knowledge of HTML, CSS and basic JavaScript',
      'A few personal or academic projects to show',
      'Willingness to learn React',
      'Able to commit 25+ hours per week',
    ],
    salary: { min: 30000, max: 45000, currency: 'PKR', period: 'mo' },
    postedDaysAgo: 2,
    relevance: 55,
  },
  {
    id: 8,
    title: 'Software Engineer',
    company: 'Enterprise Apps',
    companyWebsite: null,
    logoUrl: null,
    location: 'Islamabad, Pakistan',
    type: 'full-time',
    workMode: 'On-site',
    experience: 'Senior',
    skills: ['Node.js', 'System Design', 'AWS'],
    about:
      'Lead the design and delivery of scalable backend systems for enterprise customers and mentor junior engineers.',
    requirements: [
      '6+ years of backend engineering experience',
      'Strong Node.js and system design skills',
      'Hands-on experience with AWS',
      'Experience mentoring and leading small teams',
    ],
    salary: { min: 300000, max: 450000, currency: 'PKR', period: 'mo' },
    postedDaysAgo: 12,
    featured: true,
    relevance: 65,
  },
];

export const categories = [
  { value: 'engineering', label: 'Software Engineering' },
  { value: 'design', label: 'UI/UX & Graphic Design' },
  { value: 'data', label: 'Data & Artificial Intelligence' },
  { value: 'marketing', label: 'Digital Marketing' },
  { value: 'business', label: 'Business & Administration' },
  { value: 'internship', label: 'Internships' },
];

export const categoryKeywords = {
  engineering: ['developer', 'engineer', 'software', 'php', 'frontend', 'web'],
  design: ['designer', 'design', 'ui/ux', 'graphic'],
  data: ['data', 'analyst', 'artificial intelligence', 'ai'],
  marketing: ['marketing', 'growth'],
  business: ['business', 'administration'],
  internship: ['intern'],
};

/* ---------- Helpers ---------- */

// "PKR 150k - 200k/mo" or "$80k - $100k/yr"
export const formatSalary = ({ min, max, currency, period }) => {
  const short = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);
  const minPrefix = currency === 'USD' ? '$' : 'PKR ';
  const maxPrefix = currency === 'USD' ? '$' : '';
  return `${minPrefix}${short(min)} - ${maxPrefix}${short(max)}/${period}`;
};

// Top of the salary range converted to monthly PKR, for sorting and filtering.
export const maxMonthlyPKR = ({ salary }) => {
  const pkr = salary.currency === 'USD' ? salary.max * USD_TO_PKR : salary.max;
  return salary.period === 'yr' ? pkr / 12 : pkr;
};

// "Today", "2d ago", "1w ago", "2mo ago"
export const formatPosted = (days) => {
  if (days <= 0) return 'Today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

export const isNewJob = (job) => job.postedDaysAgo <= 3;

// Priority 1 badge: Urgent > Featured > New. Returns null if none apply.
export const getStatusBadge = (job) => {
  if (job.urgent) return 'Urgent';
  if (job.featured) return 'Featured';
  if (isNewJob(job)) return 'New';
  return null;
};

export const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();