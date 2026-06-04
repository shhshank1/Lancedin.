// Mock data for LancedIn — decoupled from components per react-components skill rules

// ─── Landing Page ───
export const heroData = {
  badge: "Redefining Work",
  headline: "Where talent",
  headlineAccent: "flows effortlessly.",
  subtitle:
    "A curated digital ecosystem connecting high-impact creators with visionary organizations. Skip the noise, find the flow.",
} as const;

export const talentPaths = [
  {
    id: "need-talent",
    icon: "Briefcase",
    title: "I Need Talent",
    description: "Hire elite freelancers for high-impact projects.",
    cta: "Post a Role",
    href: "/client",
  },
  {
    id: "have-talent",
    icon: "Pen",
    title: "I Have Talent",
    description: "Access premium opportunities and global clients.",
    cta: "Join Network",
    href: "/freelancer",
  },
] as const;

export const socialProofData = {
  trustLine: "Trusted by the world's most innovative brands",
  brandLogos: ["TechCorp", "DesignStudio", "InnovateLabs"],
} as const;

export const testimonialData = {
  quote:
    '"LancedIn changed how we scale. We found a lead designer in 48 hours who fits our DNA perfectly."',
  author: "Marcus Chen",
  role: "CEO at Synthetix",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuADKpXzwsLxyXMVCpZJLxiu6m_m4Sz2HGJNLWQUDWvT8lVJEB6zY1vGWhl6HCe4DeRgZ0sVxUGtFbJ0XoiI3VNWDGwkhhf-1f_YjyvL5vDqUn4dlWJl-I55Tl9Zmb-y9TgfWu-a7FD3--I-FE9LuGE90imRTq7I-HJKnB-tcfIrCwO6uN-WQbr6j8_Bdg9PjRvA_1UDyvHmMJkNC9Rx1F_rFeyHbWGWse_4Sq-cQ1HQpRrrTV5JoJZIYvxrWek3yireGIE6r3QG1JGi",
  rating: 4.9,
  ratingCount: "50,000+",
} as const;

export const galleryImage = {
  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyLq-RKXtlzOmrWEBaqhkjmYLuNmhNDdm-Ix6wUK4oI-0CE34LSBCpibtuiiic1WHcUGqClM1LTTY1VjgAB8O7kD80Imc-uOL33i3xmK5hFUms_59RlFc9WgF2FcTBwM2l4OiCZwveB0EDD51Z8tZD3o84R7zj0vYzOaoGqq0KC7zYTfM123volxFxIHwwLranzaYv-eHq5FlUrr9T9MKb4AmTsGIbcPzLndUtlOHADcl7C2mAVRPTroys0Nt-rQSa1mmE19WmvNev",
  alt: "Team collaborating in a bright modern studio",
  caption: "The Curator's Choice",
  headline: "Elevating the standard of\non-demand collaboration.",
} as const;

// ─── Navigation ───
export const navLinks = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Terms", href: "/terms" },
  { label: "Help", href: "/help" },
] as const;

// ─── Auth Forms ───
export const signupFormFields = [
  { id: "fullName", label: "Full Name", type: "text" as const, placeholder: "Alex Rivera" },
  { id: "email", label: "Email Address", type: "email" as const, placeholder: "alex@flow.com" },
  { id: "password", label: "Password", type: "password" as const, placeholder: "••••••••" },
] as const;

export const oauthProviders = [
  { id: "google", label: "Google", icon: "google" as const },
  { id: "github", label: "Github", icon: "github" as const },
] as const;

// ─── Client Home Mock Data ───
export const talentCategories = [
  "All Talents",
  "UI/UX Design",
  "Video Editor",
  "Copywriter",
  "3D Artist",
  "Motion Graphics",
  "Frontend Dev",
] as const;

export const featuredFreelancers = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "UI/UX Designer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABfFMuXGwi27BBpouX2GbUd5X4sYwP-r1I523LwaAYCV2op5drvt_pjGekR0ThzurC4alnyihr-rRN-rabcxkkNhSh1UvnxQUZzKNZ3jRLyxzAz1ssalWEm064KgdQTKkOnWhOK2JezjYZ_hMSIBwePFbMnAbxcHtxKWOvtCE4xwt-Os8-WYWjfQIE_ZAHwznACaCkXk1jG5KSI3IaHGiV8S7-6DbPf7PJvYsBbKYTYW91WnZS4BD6jlKzugFYXFDeT-EJ8cNaeh8y",
    rating: 4.9,
    hourlyRate: 65,
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Motion Graphics",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkkevPINSgeqDhW4bfWjEuYIZyjn1oTRqu_0yMLkRMMTxOYW4SWaXb-uFmCTzsDKLFDgE1-Z1yg7GEwLjCf_EukT5MkGmcqq4rD7EyWx3ylCKQ9hzq-RvRh09FiMhQOzeuT0RBCOVs8nr1HoDEiRX1GQXm6RLckBe0VBM1Pd_CwrN7upY72UoGBXvZj9a9WNS1BUJmHYjHTdQilWsdo_ff6mOQ-gXFumgnu3dtcsLy5p5DVuh5rQ-liRt-GZbzYEKD5OtjMWDwecYY",
    rating: 5.0,
    hourlyRate: 85,
  },
  {
    id: "3",
    name: "Marcus Thorne",
    role: "Copywriter",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJJbgGYzK1J-RNI2NEssgxuh3rf59Ud3ikSBEJLHBip_urTvZnsFl2HNGLO0V9emYAHXZdUHFyHlWSyN1vLuchGcnoJsuJPPiW4jK3YrTNwRBFvi90_zXhuUwdh4Hw0hHn3YkYZlHNo8gb85GI98qBAE9KqRvfmytaW51orU802VsLp395OOAD2Kisyo_PwHUCEVd66rSEpDFSn6WJ2aEJ4q-0Ob73-yY7T5H1ZeXETA_rlK9YMqr4C_AidMfbZJ2wryZWBkl1fdmH",
    rating: 4.8,
    hourlyRate: 50,
  },
  {
    id: "4",
    name: "Elena Vance",
    role: "3D Artist",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC98-_R9mSSfqu4pNG2GEXSinjV2Qszc5KndWS3JA2rdu0DDhzAztEw__wY6e4d3zAoxZZ55Hu6zcVWydYsznWuL9wGGHWKgxap6C3AOcgfMq62z42JGn2h-xktHxVe_QM2tap9WkqbU7jsM30MwpevO2q35ccvVCPS8fK0rUPytsQOrytMHW7G4g6D01WtWzmM3BnqEde6N4n781TcRNXcqqL0jx_Ias9uOmWU3N1VfWH5Ab4Myz8BL3MJnzyQnYsq1gZlPOmPPaYK",
    rating: 4.7,
    hourlyRate: 95,
  },
] as const;

export const curatedNetworkData = {
  label: "Curated Network",
  headline: "Can't find what you're looking for? Let us curate a list for you.",
  description:
    "Our concierge team helps top-tier clients match with pre-vetted specialists in under 24 hours.",
  cta: "Request Concierge",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Bh0Vrfq-Xl_FV7dRmNKXa0ia27ptaOtRMa-Cwrfal6nsz3Sb-XB-08P2ygyNlNWDGk7fUlzy347DdFdFR_S_mSFQBulX10WkoxRjvx1FFJF_yrx9gvtexc9Oaf7_DxqyK4oFOVdI3Nrp30uI1HJx4nmF-uKyRh9pkY0hb69foC4yZ7Ka2zOWNsCTZkjPqJmwjXpgPbnH3VsFb9v8bEnJeBqqxExtK1nHMOUqll6O2q_9luxHr-Z8f_PpetUQL2HOlh4QPTI3fqlC",
  imageAlt: "Diverse group of creative professionals collaborating in a bright, modern studio",
} as const;

// ─── Freelancer Home Mock Data ───
export const needsFeed = [
  {
    id: "n1",
    title: "E-commerce Redesign for Fashion Brand",
    company: "Atelier Studio",
    budget: "$5,000 - $8,000",
    deadline: "2 weeks",
    skills: ["UI/UX", "Shopify", "Responsive Design"],
    postedAgo: "2h ago",
    proposals: 12,
  },
  {
    id: "n2",
    title: "Mobile App Development — Fitness Tracker",
    company: "PulseHealth Inc.",
    budget: "$12,000 - $18,000",
    deadline: "6 weeks",
    skills: ["React Native", "TypeScript", "API Integration"],
    postedAgo: "5h ago",
    proposals: 8,
  },
  {
    id: "n3",
    title: "Brand Identity & Guidelines Package",
    company: "GreenLeaf Co.",
    budget: "$3,000 - $5,000",
    deadline: "3 weeks",
    skills: ["Branding", "Illustrator", "Typography"],
    postedAgo: "1d ago",
    proposals: 23,
  },
  {
    id: "n4",
    title: "Marketing Website for SaaS Startup",
    company: "DataFlow AI",
    budget: "$7,000 - $10,000",
    deadline: "4 weeks",
    skills: ["Next.js", "Tailwind CSS", "Animation"],
    postedAgo: "3h ago",
    proposals: 6,
  },
] as const;

// ─── Needs Board Filters ───
export const boardCategories = [
  "All",
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Strategy",
] as const;

export const boardBudgetRanges = [
  "Any Budget",
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
] as const;

// ─── Profile Mock Data ───
export const profileData = {
  name: "Alex Rivera",
  title: "Senior Full-Stack Developer",
  location: "San Francisco, CA",
  bio: "Passionate developer with 8+ years building scalable web applications. Specialized in React ecosystems and cloud architecture. Previously led engineering at TechStartup and contributed to open-source projects with 10K+ stars.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL", "Docker", "Figma", "PostgreSQL"],
  stats: {
    projectsCompleted: 47,
    ratingAvg: 4.9,
    onTimeDelivery: "98%",
    repeatClients: "72%",
  },
  portfolio: [
    {
      id: "p1",
      title: "E-Commerce Platform Redesign",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop",
      category: "Web Development",
    },
    {
      id: "p2",
      title: "Health & Fitness Dashboard",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      category: "UI/UX Design",
    },
    {
      id: "p3",
      title: "AI-Powered Analytics Tool",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      category: "Full Stack",
    },
  ],
} as const;

// ─── Messaging Mock Data ───
export const conversations = [
  {
    id: "c1",
    name: "Elena Vance",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkDoXsPGcSbnuZKXkx8xKJ_FuSoggZspn6_8uoVSAK1cM8fir5kb8eKNjZKTt1J0nLwxR-B-KZWb0_39YM8UgkJ6enUU_XxTs8vOjuBBLIEAN74hy4fTJquQScc5M0Cmrni6SNTvyVmh6CiSbObek9Fk9XUA59TPx8y_YzCLWEwXdaIah7GeAodka8Tkk9C9ljN9uxkK3mnV4WvfES8qrdOFLemyEBKf7xBgAsekm5uJkTxhbRqTMUJbFM5bsuGxk7agJeCYVOkTv3",
    lastMessage: "Looking forward to seeing the new portfolio designs!",
    timestamp: "Now",
    unread: 1,
    online: true,
  },
  {
    id: "c2",
    name: "Marcus Chen",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9PEvPd0Ii70v89n2-Kgzap31xRMzMJFJCCYVuRjnwD_N4Rt2dlaTPDSKVnJ9NoxXbfs9OxudYOaEOX-kEz2HlsHZBFkhMWqpTuGsoWo-UWKi5zSK4dWQm_2RpvmpY-XgjAOl-5uY665fsmzDvwTDj3ArNGM8dxiTW-5_LGIuJvk9jF9eqOX55W3q7U_hrHUDgIXmCU3AKAuyZH443PZFNOoQAXi9ticPXuOw1cn81GtdoGj7axtE921jxkysjExD5fBcLqy2VzmFD",
    lastMessage: "The contract has been signed and sent.",
    timestamp: "14:20",
    unread: 0,
    online: false,
  },
  {
    id: "c3",
    name: "Sarah Jenkins",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAa5Ac3VLA5H2Mcqrq7Jxhldg5u-rvj7rtakq2K9Z6V3dm5iJjpa8icng20z3C6lUA9Vuzjp7dF2RUOHNMCz4RUAlIjIdZj4hffPc5vwNH1EABCvkrH_fxiS5PzAVcXGHcm06gTYjYp_qtMK5nw35HffISvfafbPH4z7L11yOlO2_0yDnuIqs21SC0eHbPA1Cd5cjajSbc22OcqCro1vZro2F3JlGZYeZAHKmG6WNrdCh8KGKQz1tgRdVv0ft2Vu3htg6GtlVIdSnJY",
    lastMessage: "Can we reschedule our sync to tomorrow at 1...",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "c4",
    name: "David Miller",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqaItJv7fanP_XCjWAzUYRp6AaOiHPTbhxwNic2A8PQzHW55HAQLvqrAzcRz91Y479Nd8bEogmkceJUS3pLOfb0eUR-4G296WqLTIZptS-EL-8oFpFHXtWjSzmfARB03RXk1kNvLzX0pTMshuxSSPvIgT054gbZble50AeaqsWGP6NmBKVO6NIxnWb6jUkD7-b1O3bQbaRtmjROnZhydXWztqYN1BaP0QSv9p_2Hz_rCWq1O1OenNtyxJSVDTjkXGHzuzPPNAxgolH",
    lastMessage: "I've uploaded the mockups to the shared drive.",
    timestamp: "Nov 12",
    unread: 0,
    online: true,
  },
] as const;

export const activeChat = {
  contactId: "c1",
  contactName: "Elena Vance",
  contactAvatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCdZNw3AqXQSVJfEQ5-1mrfLwwcRI2ErZSj-uW9J1TGEAECdn604VT7e5IVURWqGDnvVeC19UNKkeySwITHN44N6iKWsVhu7aghPtDnvxzQ_7pl4K6UcMyL5yhRM4CPaa-ELUtR0ImczXyAG7d5QM-Hvgp9b8QRCuqPpb8NydZilzcYs0r7hj-Lktx2ERkNQdKSGFEB7Guc4qJZBac2Py_XaGSa_-m6QETs2TlhoC0DLWQS3VoNVcEYcoWU9_GcGjXpQ_23wyzflaGU",
  isOnline: true,
  messages: [
    {
      id: "m1",
      sender: "them" as const,
      text: "Hi there! I just went through the latest updates on the LancedIn platform.",
      timestamp: "11:05 AM",
    },
    {
      id: "m2",
      sender: "them" as const,
      text: "The new typography system really makes the editorial feel pop.",
      timestamp: "11:05 AM",
    },
    {
      id: "m3",
      sender: "me" as const,
      text: "Thanks Elena! We worked hard on that \"Curator\" persona. Glad it's resonating with you.",
      timestamp: "11:08 AM",
      read: true,
    },
    {
      id: "m4",
      sender: "them" as const,
      text: "It definitely does. I'm currently finishing up my new case study. Looking forward to seeing the new portfolio designs!",
      timestamp: "11:10 AM",
    },
  ],
  sharedImage: {
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCr2NZJOaNE4XK6JotZLzEY7ifQizn0tRLU_G99vFVJgfF73ppogWhhNVeYAVihYrv0PzLGhv5Mz41raPyj3jCbpeewOUVGHQ50m_RGoGLKbO67ZVwF3zS9PmzLeCoTdqer28xqzqtUsCvq0dbFTWyA92yaN1zJNWwyqhkx-Rlq6hvQqRXrK_Rk8UnnRF9_I0Y4VSHMN7vnGE03OKyOC_5k07jGQ7SS8AINJtUFMZ6slFRgbrAksBgokCopLQ2iLfsBW797kGW-KVV",
    alt: "Dashboard Preview",
  },
} as const;
