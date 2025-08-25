// src/Portfolio2.jsx
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, Github, Linkedin, Mail, Award, ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- DUMMY DATA ---
const DUMMY = {
  hero: {
    name: "Cosmic Creator",
    title: "Full-Stack Engineer • AI & Security",
    tagline: "Black & White interface, star-bright ideas.",
    location: "Abbottabad, Pakistan",
    avatar: "https://picsum.photos/seed/avatar/400/400"
  },
  contacts: {
    email: "cosmic.creator@portfolio.dev",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    leetcode: "https://leetcode.com/example"
  },
  stats: { projects: 18, certifications: 9, awards: 3 },
  featuredWorks: [
    { title: "Project Alpha", tags: ["React", "AI"], image: "https://picsum.photos/seed/mini-project-1/500/300" },
    { title: "Project Beta", tags: ["Node", "Security"], image: "https://picsum.photos/seed/mini-project-2/500/300" }
  ],
  codes: [
    { title: "Snippet A — Elegant React Hook", lang: "jsx", code: `import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};`},
    { title: "Snippet B — Secure Password Hash (Node)", lang: "js", code: `import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password hashing failed.');
  }
};

export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};` }
  ],
  education: [
    { type: "School", board: "BISE Abbottabad", institute: "Model School, Abbottabad", year: "2015–2019", grade: 95, img: "https://picsum.photos/seed/school/600/400" },
    { type: "Intermediate", board: "BISE Abbottabad", institute: "Govt College, Abbottabad", year: "2019–2021", grade: 90, img: "https://picsum.photos/seed/inter/600/400" },
    { type: "University", board: "CUI Abbottabad", institute: "COMSATS University Islamabad, Abbottabad", year: "2021–Present", gpaTimeline: [{sem:"Sem 1",gpa:3.79},{sem:"Sem 2",gpa:3.96},{sem:"Sem 3",gpa:3.85},{sem:"Sem 4",gpa:3.92}], img: "https://picsum.photos/seed/uni/600/400" },
  ],
  experience: {
    volunteering: [{ title:"Event Lead - Tech Youth Camp", org:"Fursan Foundation", year:"2023", desc:"Led web workshops; mentored 50+ students.", logo:"https://picsum.photos/seed/vol/80/80"}],
    internships: [{ title:"Frontend Intern", org:"Pixel Labs", year:"2024", desc:"Built component library; +20% Lighthouse.", logo:"https://picsum.photos/seed/intern/80/80"}],
    research: [{ title:"Adversarial Robustness (Mini)", org:"CUI Research Lab", year:"2024", desc:"Attacks on tiny CNNs.", logo:"https://picsum.photos/seed/research/80/80"}],
    participation: [{ title:"National AI Challenge", org:"AI Pakistan", result:"Top 10", link:"#", logo:"https://picsum.photos/seed/comp/80/80"}]
  },
  certifications: Array.from({length:9}, (_,i)=>({ id:i+1, title:`Certification ${i+1}`, issuer:["Coursera","edX","Google","Meta"][i%4], year:2021+(i%4), img:`https://picsum.photos/seed/cert-${i}/600/380`, link:"#"})),
  skills: {
    languages: [{name:"JavaScript",level:95},{name:"Python",level:90},{name:"Java",level:85},{name:"C++",level:80}],
    categories: [{name:"Web Dev",pct:92},{name:"AI/ML",pct:75},{name:"Cybersecurity",pct:70},{name:"DevOps",pct:64}],
    soft: ["Communication","Leadership","Problem Solving","Mentoring"]
  },
  projects: Array.from({length:8}, (_,i)=>({ id:i+1, title:`Project ${i+1}`, desc:"Impactful product with clean DX and measurable results.", image:`https://picsum.photos/seed/project-${i}/900/550`, demo:"#", code:"#", tags: i%2? ["Open Source","React","Tailwind"] : ["AI","Node","Security"] })),
  awards: [
    { title:"Hackathon Champion", org:"TechFest", month:"Nov 2023", desc:"Built accessible voting dApp with audited contracts." },
    { title:"Best Portfolio (Inter-Uni)", org:"Design League", month:"May 2024", desc:"Top UI/UX in monochrome category." },
    { title:"Volunteer Excellence", org:"Community Org", month:"Jul 2022", desc:"Organized 20+ beginner workshops." }
  ],
  hobbies: ["Cricket","Badminton","Graphic Design","Teaching","Blogging"]
};

// --- Framer Motion Animation Presets ---
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } }
};
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  viewport: { once: true, amount: 0.2 }
};
const hoverLift = {
  whileHover: { y: -6 }
};
const glowHover = {
  whileHover: {
    boxShadow: "0 0 10px rgba(253, 230, 138, 0.4), 0 0 20px rgba(253, 230, 138, 0.2)"
  }
};
const cardGlowHover = {
  whileHover: {
    boxShadow: "0 0 10px rgba(253, 230, 138, 0.4), 0 0 20px rgba(96, 165, 250, 0.2)",
    scale: 1.02
  }
};
const buttonGlowHover = {
  whileHover: {
    boxShadow: "0 0 15px rgba(253, 230, 138, 0.5)"
  }
};

// --- Shared Components ---
const SectionHeader = ({ title, subtitle, className = "" }) => (
  <div className={`text-center mb-12 ${className}`}>
    <motion.h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2" {...fadeInUp}>{title}</motion.h2>
    <motion.p className="text-lg text-gray-400" {...fadeInUp}>{subtitle}</motion.p>
  </div>
);

const StarBackdrop = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <motion.div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at bottom, #03040C 0%, #000000 100%)',
      }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-80"
        style={{
          backgroundSize: '1px 1px',
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundRepeat: 'repeat',
          backgroundPosition: '50% 50%',
          scale
        }}
        animate={{
          x: ['0%', '-100%'],
          y: ['0%', '-100%'],
        }}
        transition={{
          x: { repeat: Infinity, duration: 100, ease: 'linear' },
          y: { repeat: Infinity, duration: 100, ease: 'linear' },
        }}
      />
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at top right, #3b82f640, transparent 50%), radial-gradient(circle at bottom left, #f59e0b40, transparent 50%)',
        }}
      />
    </motion.div>
  );
};

const GlowButton = ({ children, className = "", ...props }) => (
  <motion.button
    {...buttonGlowHover}
    className={`px-6 py-3 rounded-full font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

const Pill = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ring-1 ring-inset ring-gray-600 bg-gray-800 text-gray-400 ${className}`}>
    {children}
  </span>
);

const GlassCard = ({ children, className = "" }) => (
  <motion.div className={`bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </motion.div>
);

const Card = ({ children, className = "" }) => (
  <motion.div className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 ${className}`}>
    {children}
  </motion.div>
);

// --- Main App Component ---
function Portfolio2() {
  const sections = {
    about: useRef(null),
    education: useRef(null),
    experience: useRef(null),
    certifications: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    awards: useRef(null),
    contact: useRef(null),
  };
  const [activeSection, setActiveSection] = useState('about');
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [
    { name: "About", ref: sections.about },
    { name: "Education", ref: sections.education },
    { name: "Experience", ref: sections.experience },
    { name: "Certifications", ref: sections.certifications },
    { name: "Skills", ref: sections.skills },
    { name: "Projects", ref: sections.projects },
    { name: "Awards", ref: sections.awards },
    { name: "Contact", ref: sections.contact },
  ];

  const scrollToSection = (ref) => {
    if (ref.current) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const navHeight = document.querySelector('nav').offsetHeight;

      // Update active section
      for (const key in sections) {
        if (sections[key].current) {
          const rect = sections[key].current.getBoundingClientRect();
          if (rect.top <= navHeight + 20 && rect.bottom >= navHeight + 20) {
            setActiveSection(key);
            break;
          }
        }
      }

      // Hide/Show Navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > navHeight * 2) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, sections]);

  // Certifications Pagination State
  const certsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(DUMMY.certifications.length / certsPerPage);
  const startIndex = (currentPage - 1) * certsPerPage;
  const currentCerts = DUMMY.certifications.slice(startIndex, startIndex + certsPerPage);

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Projects Slider State
  const [projectIndex, setProjectIndex] = useState(0);
  const projectVisibleCount = 2;
  const totalProjects = DUMMY.projects.length;

  const handleProjectNext = () => {
    setProjectIndex((prev) => Math.min(prev + projectVisibleCount, totalProjects - projectVisibleCount));
  };
  const handleProjectPrev = () => {
    setProjectIndex((prev) => Math.max(prev - projectVisibleCount, 0));
  };

  // Contact Form State
  const [contactStatus, setContactStatus] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setContactStatus('success');
    setTimeout(() => setContactStatus(null), 5000);
  };

  return (
    <div className="bg-black text-white antialiased font-sans relative overflow-x-hidden min-h-screen">
      <StarBackdrop />

      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#" className="flex items-center space-x-2 text-white font-bold text-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-lg p-2 transition-all">
            <Star className="text-yellow-400 group-hover:scale-110 transition-transform" size={24} />
            <span>{DUMMY.hero.name}</span>
          </a>
          <ul className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => scrollToSection(link.ref)}
                  className={`text-sm font-medium transition-colors hover:text-yellow-400 focus:outline-none focus-visible:text-yellow-400 ${activeSection === link.name.toLowerCase() ? 'text-yellow-400' : 'text-gray-400'}`}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.nav>

      <main className="container mx-auto px-4 pt-28">
        
        {/* --- Hero / About Section --- */}
        <motion.section ref={sections.about} id="about" className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24" {...fadeIn}>
          <div className="space-y-6">
            <motion.p className="text-yellow-400 text-lg font-medium tracking-wide" {...fadeInUp}>👋 I am a:</motion.p>
            <motion.h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-2" {...fadeInUp}>{DUMMY.hero.title}</motion.h1>
            <motion.p className="text-gray-300 text-xl max-w-xl leading-relaxed" {...fadeInUp}>{DUMMY.hero.tagline}</motion.p>
            <motion.p className="text-gray-400 max-w-xl" {...fadeInUp}>I design and build performant web apps, teach, and experiment with AI + security.</motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" {...fadeInUp}>
              <GlowButton as="a" href={DUMMY.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Linkedin size={20} className="inline mr-2" /> LinkedIn
              </GlowButton>
              <GlowButton as="a" href={DUMMY.contacts.github} target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-gray-200">
                <Github size={20} className="inline mr-2" /> GitHub
              </GlowButton>
              <GlowButton as="a" href={`mailto:${DUMMY.contacts.email}`} className="bg-blue-400 text-black hover:bg-blue-500">
                <Mail size={20} className="inline mr-2" /> Email
              </GlowButton>
            </motion.div>
          </div>
          <motion.div className="flex flex-col items-center justify-center p-6 md:p-12 relative" {...fadeInUp}>
            <GlassCard className="w-full max-w-md p-2 relative">
              <img src={DUMMY.hero.avatar} alt="Cosmic Creator avatar" width={400} height={400} className="w-full rounded-2xl aspect-square object-cover" />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs px-3 py-1 bg-black/50 rounded-full backdrop-blur-sm ring-1 ring-white/10">{DUMMY.hero.location}</p>
            </GlassCard>
            <div className="absolute top-0 right-0 text-xs text-gray-500 mt-2 mr-2 z-10">
              <p>Quick Tips: Replace this data!</p>
            </div>
          </motion.div>
        </motion.section>

        {/* --- Quick Stats & Featured Work --- */}
        <section className="mb-24 space-y-12">
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6" {...fadeInUp}>
            {Object.entries(DUMMY.stats).map(([key, value]) => (
              <GlassCard key={key} className="flex flex-col items-center text-center p-6 hover:scale-105 transition-transform duration-300">
                <motion.span className="text-5xl font-bold text-yellow-400" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 300 }}>
                  {value}
                </motion.span>
                <h3 className="text-gray-300 mt-2 capitalize">{key}</h3>
              </GlassCard>
            ))}
          </motion.div>

          <motion.div {...fadeInUp}>
            <h3 className="text-xl font-bold mb-4 text-center sm:text-left">Featured Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {DUMMY.featuredWorks.map((project, index) => (
                <GlassCard key={index} className="p-4 flex flex-col items-start hover:scale-[1.02] transition-transform duration-300">
                  <img src={project.image} alt={`Featured work: ${project.title}`} width={500} height={300} className="rounded-xl w-full h-auto object-cover mb-4" />
                  <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                  <div className="flex gap-2 mt-2">
                    {project.tags.map(tag => <Pill key={tag}>{tag}</Pill>)}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </section>

        <hr className="my-12 border-white/10" />

        {/* --- Taste of Code --- */}
        <motion.section id="code" className="mb-24" {...fadeInUp}>
          <SectionHeader title="Taste of Code" subtitle="Readable patterns that scale." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DUMMY.codes.map((snippet, index) => (
              <GlassCard key={index} className="flex flex-col p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-3 text-white">{snippet.title}</h3>
                <pre className="overflow-auto bg-black border border-white/10 rounded-xl p-4 text-sm text-gray-300 font-mono max-h-96">
                  <code className={`language-${snippet.lang}`}>{snippet.code}</code>
                </pre>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        <hr className="my-12 border-white/10" />

        {/* --- Education Section --- */}
        <section ref={sections.education} id="education" className="mb-24">
          <SectionHeader title="Education" subtitle="Academic progress & grades." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DUMMY.education.map((edu, index) => (
              <GlassCard key={index} className="flex flex-col">
                <div className="h-48 w-full rounded-xl bg-gray-800 mb-4 overflow-hidden">
                  <img src={edu.img} alt={`Image of ${edu.institute}`} className="w-full h-full object-cover" width={600} height={400} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white mb-1">{edu.institute}</h3>
                  <p className="text-gray-400 text-sm mb-3">{edu.year} • {edu.board}</p>
                  {edu.type !== "University" ? (
                    <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${edu.type === 'School' ? 'bg-yellow-400' : 'bg-blue-400'}`}
                        style={{ width: `${edu.grade}%` }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.8 }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={edu.gpaTimeline}>
                          <Line type="monotone" dataKey="gpa" stroke="#60a5fa" strokeWidth={2} dot={{ stroke: '#60a5fa', strokeWidth: 2, r: 4 }} />
                          <XAxis dataKey="sem" axisLine={false} tickLine={false} className="text-xs" stroke="#6b7280" />
                          <YAxis domain={[3, 4]} allowDecimals={false} axisLine={false} tickLine={false} className="text-xs" stroke="#6b7280" />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#9ca3af' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <hr className="my-12 border-white/10" />

        {/* --- Experience Section --- */}
        <section ref={sections.experience} id="experience" className="mb-24">
          <SectionHeader title="Experience" subtitle="Internships, volunteering & research." />
          <ExperienceTabs />
        </section>

        <hr className="my-12 border-white/10" />

        {/* --- Certifications Section --- */}
        <section ref={sections.certifications} id="certifications" className="mb-24">
          <SectionHeader title="Certifications" subtitle="Verified learning & pathways." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {currentCerts.map((cert) => (
                <motion.div key={cert.id} {...fadeInUp}>
                  <GlassCard className="flex flex-col items-center text-center p-4 h-full">
                    <img src={cert.img} alt={`Certificate for ${cert.title}`} width={600} height={380} className="rounded-xl w-full h-40 object-cover mb-4" />
                    <h3 className="text-lg font-bold text-white mb-1">{cert.title}</h3>
                    <p className="text-gray-400 text-sm">{cert.issuer} • {cert.year}</p>
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="mt-4 text-blue-400 hover:text-blue-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md">
                      View Certificate <ArrowUpRight size={14} className="inline ml-1" />
                    </a>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="Previous Page"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-gray-400 text-sm self-center">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="Next Page"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        <hr className="my-12 border-white/10" />

        {/* --- Skills Section --- */}
        <section ref={sections.skills} id="skills" className="mb-24">
          <SectionHeader title="Skills" subtitle="Languages, technologies & soft skills." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Languages</h3>
              <div className="space-y-6">
                {DUMMY.skills.languages.map((lang, index) => (
                  <motion.div key={lang.name} className="space-y-2" {...fadeInUp}>
                    <div className="flex justify-between items-center text-gray-300">
                      <span>{lang.name}</span>
                      <span>{lang.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${lang.level}%` }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Technology Proficiency</h3>
              <div className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DUMMY.skills.categories} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <Bar dataKey="pct" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af' }} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#9ca3af' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">Soft Skills</h3>
            <div className="flex flex-wrap gap-3">
              {DUMMY.skills.soft.map((skill, index) => (
                <motion.div key={skill} {...fadeInUp} transition={{ delay: index * 0.1 }}>
                  <Pill>{skill}</Pill>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <hr className="my-12 border-white/10" />

        {/* --- Projects Section --- */}
        <section ref={sections.projects} id="projects" className="mb-24">
          <SectionHeader title="Projects" subtitle="Selected works with demos & source." />
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={projectIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 gap-8 md:col-span-2"
                >
                  {DUMMY.projects.slice(projectIndex, projectIndex + projectVisibleCount).map((project) => (
                    <motion.div key={project.id} {...cardGlowHover} className="flex flex-col md:flex-row bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                      <div className="md:w-1/2 overflow-hidden">
                        <img src={project.image} alt={`Project: ${project.title}`} width={900} height={550} className="w-full h-auto md:h-full object-cover transform transition-transform duration-300" />
                      </div>
                      <div className="p-6 md:p-8 flex-grow space-y-4">
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                        <p className="text-gray-400">{project.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map(tag => <Pill key={tag}>{tag}</Pill>)}
                        </div>
                        <div className="flex gap-4 pt-2">
                          <GlowButton as="a" href={project.demo} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black hover:bg-yellow-500">
                            Demo
                          </GlowButton>
                          <GlowButton as="a" href={project.code} target="_blank" rel="noopener noreferrer" className="border border-white/20 text-white hover:bg-white/10">
                            Code
                          </GlowButton>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={handleProjectPrev}
                disabled={projectIndex === 0}
                className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-label="Previous Projects"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={handleProjectNext}
                disabled={projectIndex >= totalProjects - projectVisibleCount}
                className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-label="Next Projects"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        <hr className="my-12 border-white/10" />

        {/* --- Awards Section --- */}
        <section ref={sections.awards} id="awards" className="mb-24">
          <SectionHeader title="Awards" subtitle="Honors & recognition." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DUMMY.awards.map((award, index) => (
              <motion.div key={index} {...hoverLift} {...glowHover} {...fadeInUp} className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
                <div className="flex items-start">
                  <span className="text-4xl mr-4">🏅</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{award.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{award.org} • {award.month}</p>
                    <p className="text-gray-300">{award.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <hr className="my-12 border-white/10" />

        {/* --- Hobbies Section --- */}
        <section id="hobbies" className="mb-24">
          <SectionHeader title="Hobbies" subtitle="Personal interests that spark creativity." />
          <div className="flex overflow-x-auto gap-4 py-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {DUMMY.hobbies.map((hobby, index) => (
              <motion.div key={index} {...hoverLift} className="flex-shrink-0 w-64 p-6 bg-gray-900 border border-gray-800 rounded-2xl text-center">
                <span className="text-4xl mb-2 block">{index % 2 === 0 ? '🎨' : '🎵'}</span>
                <h3 className="font-semibold text-white">{hobby}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        <hr className="my-12 border-white/10" />

        {/* --- Contact Section --- */}
        <section ref={sections.contact} id="contact" className="mb-24">
          <SectionHeader title="Contact" subtitle="Let’s collaborate." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <GlassCard className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Get in touch</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input type="text" id="name" name="name" placeholder="Name" required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input type="email" id="email" name="email" placeholder="Email" required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea id="message" name="message" rows="5" placeholder="Message" required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
                </div>
                <GlowButton type="submit" className="w-full bg-blue-400 text-black hover:bg-blue-500">
                  Send
                </GlowButton>
              </form>
              {contactStatus === 'success' && (
                <p className="mt-4 text-center text-green-400">Message sent successfully! (Mocked)</p>
              )}
            </GlassCard>
            <GlassCard className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Find me online</h3>
              <div className="flex flex-wrap gap-4">
                <GlowButton as="a" href={DUMMY.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black hover:bg-yellow-500">
                  <Linkedin size={20} className="inline mr-2" /> LinkedIn
                </GlowButton>
                <GlowButton as="a" href={DUMMY.contacts.github} target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-gray-200">
                  <Github size={20} className="inline mr-2" /> GitHub
                </GlowButton>
                <GlowButton as="a" href={`mailto:${DUMMY.contacts.email}`} className="bg-blue-400 text-black hover:bg-blue-500">
                  <Mail size={20} className="inline mr-2" /> Email
                </GlowButton>
                <GlowButton as="a" href={DUMMY.contacts.leetcode} target="_blank" rel="noopener noreferrer" className="bg-gray-700 text-white hover:bg-gray-600">
                  LeetCode
                </GlowButton>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-white/10">
        <p>&copy; {new Date().getFullYear()} {DUMMY.hero.name}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// Experience Tabs Component
const ExperienceTabs = () => {
  const [activeTab, setActiveTab] = useState('internships');
  const tabs = ['Internships', 'Volunteering', 'Research'];
  const participation = DUMMY.experience.participation[0];

  return (
    <div>
      <div className="flex justify-center md:justify-start space-x-2 sm:space-x-4 mb-8 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 text-sm sm:text-base font-medium rounded-t-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
              activeTab === tab.toLowerCase()
                ? 'text-white border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DUMMY.experience[activeTab].map((item, index) => (
                <GlassCard key={index} className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.logo} alt={`${item.org} logo`} width={80} height={80} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.org} • {item.year}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Participation Sub-section */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Participation</h3>
        <GlassCard>
          <div className="flex items-center space-x-4">
            <img src={participation.logo} alt={`${participation.org} logo`} width={80} height={80} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-grow">
              <h4 className="text-lg font-bold text-white">{participation.title}</h4>
              <p className="text-gray-400 text-sm">{participation.org} • <span className="text-yellow-400">{participation.result}</span></p>
            </div>
            <a href={participation.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md">
              Official Link <ArrowUpRight size={14} className="inline ml-1" />
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Portfolio2;