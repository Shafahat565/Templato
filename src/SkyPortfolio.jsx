// src/CrispyPortfolio.jsx - Final Version
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { Star, Github, Linkedin, Mail, ArrowUpRight, Award, Code, Briefcase, GraduationCap } from "lucide-react";

/**
 * CrispyPortfolio.jsx - FINAL REVISED
 * A clean, full-width React component with a white, blue, and dark blue color scheme.
 * Dependencies: framer-motion, recharts, lucide-react, tailwindcss configured.
 */

/* ---------------------------
  DUMMY data (edit as needed)
  --------------------------- */
const DUMMY = {
  hero: {
    name: "Cosmic Creator",
    title: "Full-Stack Engineer",
    tagline: "Building clean code with a crisp UI.",
    location: "Abbottabad, Pakistan",
    avatar: "https://picsum.photos/seed/avatar/400/400",
  },
  contacts: {
    email: "cosmic.creator@portfolio.dev",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    leetcode: "https://leetcode.com/example",
  },
  stats: { projects: 18, certifications: 9, awards: 3 },
  codes: [
    {
      title: "Snippet A — Elegant React Hook",
      lang: "jsx",
      code: `function useInterval(cb, delay) {
  const saved = React.useRef(cb);
  React.useEffect(() => { saved.current = cb }, [cb]);
  React.useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}`,
    },
    {
      title: "Snippet B — Secure Password Hash (Node)",
      lang: "js",
      code: `import bcrypt from 'bcryptjs';
export async function hashPassword(p){
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(p, salt);
}`,
    },
  ],
  education: [
    { type: "School", institute: "Model School", year: "2015–2019", grade: 95, img: "https://picsum.photos/seed/school/600/400" },
    { type: "Intermediate", institute: "Govt College", year: "2019–2021", grade: 90, img: "https://picsum.photos/seed/inter/600/400" },
    { type: "University", institute: "COMSATS", year: "2021–Present", gpaTimeline: [{ sem: "Sem 1", gpa: 3.79 }, { sem: "Sem 2", gpa: 3.96 }, { sem: "Sem 3", gpa: 3.85 }, { sem: "Sem 4", gpa: 3.92 }], img: "https://picsum.photos/seed/uni/600/400" },
  ],
  experience: {
    internships: [{ title: "Frontend Intern", org: "Pixel Labs", year: "2024", desc: "Built component library; +20% Lighthouse.", logo: "https://picsum.photos/seed/intern/80/80" }],
    volunteering: [{ title: "Event Lead - Tech Camp", org: "Fursan Foundation", year: "2023", desc: "Led web workshops; mentored 50+ students.", logo: "https://picsum.photos/seed/vol/80/80" }],
    research: [{ title: "Adversarial Robustness", org: "CUI Research Lab", year: "2024", desc: "Attacks on tiny CNNs.", logo: "https://picsum.photos/seed/research/80/80" }],
  },
  certifications: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Cert ${i + 1}`, issuer: ["Coursera", "edX", "Google", "Meta"][i % 4], year: 2021 + (i % 4), img: `https://picsum.photos/seed/cert-${i}/600/380`, link: "#" })),
  skills: {
    languages: [{ name: "JavaScript", level: 95 }, { name: "Python", level: 90 }, { name: "Java", level: 85 }, { name: "C++", level: 80 }],
    categories: [{ name: "Web Dev", pct: 92 }, { name: "AI/ML", pct: 75 }, { name: "Cybersecurity", pct: 70 }, { name: "DevOps", pct: 64 }],
    soft: ["Communication", "Leadership", "Problem Solving", "Mentoring"],
  },
  projects: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, title: `Project ${i + 1}`, desc: "An impactful product with clean DX and measurable results.", image: `https://picsum.photos/seed/project-${i}/900/550`, demo: "#", code: "#", tags: i % 2 ? ["Open Source", "React"] : ["AI", "Node"] })),
  awards: [{ title: "Hackathon Champion", org: "TechFest", month: "Nov 2023", desc: "Built an accessible voting dApp." }, { title: "Best Portfolio", org: "Design League", month: "May 2024", desc: "Top UI/UX in competition." }],
  hobbies: ["Cricket", "Badminton", "Graphic Design", "Teaching", "Blogging"],
};

/* ---------------------------
  Animation presets & helpers
  --------------------------- */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  viewport: { once: true, amount: 0.2 }
};
const buttonHover = { whileHover: { scale: 1.05, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" } };
const cardHover = { whileHover: { y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.08)" } };
const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const iconHover = { whileHover: { rotate: 15, scale: 1.1 } };

/* ---------------------------
  Utility components
  --------------------------- */
const SectionHeader = ({ title, subtitle, className = "" }) => (
  <motion.div {...fadeInUp} className={`mb-12 text-center md:text-left ${className}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">{title}</h2>
    <p className="text-md text-slate-500 mt-2">{subtitle}</p>
  </motion.div>
);

const Card = ({ children, className = "" }) => (
  <motion.div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm ${className}`} {...cardHover}>
    {children}
  </motion.div>
);

const Pill = ({ children, className = "" }) => (
  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-blue-800 bg-blue-100 ${className}`}>
    {children}
  </span>
);

const AccentButton = ({ children, className = "", ...props }) => (
  <motion.a {...props} {...buttonHover} className={`px-5 py-2 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors ${focusRing} ${className}`}>
    {children}
  </motion.a>
);

const OutlineButton = ({ children, className = "", ...props }) => (
  <motion.a {...props} {...buttonHover} className={`px-5 py-2 rounded-full font-semibold text-indigo-900 border border-slate-300 hover:bg-slate-100 transition-colors ${focusRing} ${className}`}>
    {children}
  </motion.a>
);

const StatCard = ({ label, value }) => (
  <motion.div {...fadeInUp} className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
    <div className="text-3xl font-bold text-indigo-900">{value}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </motion.div>
);

const EmojiCard = ({ emoji, title }) => (
  <motion.div {...cardHover} className="flex-shrink-0 w-40 h-40 p-4 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-slate-200">
    <span className="text-4xl">{emoji}</span>
    <h4 className="mt-2 text-sm font-semibold text-indigo-900">{title}</h4>
  </motion.div>
);

/* ---------------------------
  Main Component
  --------------------------- */
export default function SkyPortfolio() {
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
  const [activeTab, setActiveTab] = useState("internships");
  const [currentPage, setCurrentPage] = useState(0);

  const scrollToSection = (ref) => {
    if (ref.current) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const offset = ref.current.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

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

  const totalCertPages = Math.ceil(DUMMY.certifications.length / 3);
  const visibleCerts = useMemo(() => DUMMY.certifications.slice(currentPage * 3, currentPage * 3 + 3), [currentPage]);

  const projectsPerPage = 2;
  const [projectIndex, setProjectIndex] = useState(0);
  const projectsToShow = DUMMY.projects.slice(projectIndex, projectIndex + projectsPerPage);
  const totalProjectPages = Math.ceil(DUMMY.projects.length / projectsPerPage);

  return (
    <div className="bg-white text-indigo-900 antialiased font-sans relative">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="w-full mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => scrollToSection(sections.about)} className={`font-bold text-indigo-900 text-lg flex items-center gap-2 ${focusRing}`}><Star size={20} className="text-blue-600" />{DUMMY.hero.name}</button>
          <div className="hidden md:flex gap-6">
            {navLinks.map(link => (
              <button key={link.name} onClick={() => scrollToSection(link.ref)} className={`text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors ${focusRing}`}>{link.name}</button>
            ))}
          </div>
        </div>
      </nav>

      <main className="px-6 pt-24 pb-12">
        {/* Hero Section */}
        <section ref={sections.about} className="grid md:grid-cols-2 items-center gap-12 py-12 md:py-24 max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 leading-tight">{DUMMY.hero.title}</h1>
            <p className="text-lg text-slate-500 max-w-lg">{DUMMY.hero.tagline}</p>
            <p className="text-slate-600">I design and build performant web apps, teach, and experiment with AI + security. My portfolio showcases a minimalist, clean, and modern aesthetic.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AccentButton href={DUMMY.contacts.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} className="inline mr-2" /> LinkedIn
              </AccentButton>
              <OutlineButton href={DUMMY.contacts.github} target="_blank" rel="noopener noreferrer">
                <Github size={16} className="inline mr-2" /> GitHub
              </OutlineButton>
              <OutlineButton href={`mailto:${DUMMY.contacts.email}`}>
                <Mail size={16} className="inline mr-2" /> Email
              </OutlineButton>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="relative p-8 rounded-2xl bg-white shadow-lg border border-slate-200">
            <img src={DUMMY.hero.avatar} alt="Profile avatar" className="w-full rounded-2xl aspect-square object-cover" width={400} height={400} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-900/70 text-white text-xs backdrop-blur-sm">{DUMMY.hero.location}</div>
          </motion.div>
        </section>

        {/* Stats & Featured Projects */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-7xl mx-auto">
          <StatCard label="Projects" value={DUMMY.stats.projects} />
          <StatCard label="Certifications" value={DUMMY.stats.certifications} />
          <StatCard label="Awards" value={DUMMY.stats.awards} />
        </section>

        {/* Taste of Code */}
        <section className="mb-24 bg-blue-900 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Taste of Code" subtitle="Readable patterns and elegant abstractions." className="text-white" />
            <div className="grid md:grid-cols-2 gap-6">
              {DUMMY.codes.map((c, i) => (
                <motion.div key={i} {...fadeInUp} className="bg-blue-800 text-slate-200 p-6 rounded-xl shadow-lg border border-blue-700">
                  <h3 className="font-semibold text-sm text-white mb-3">{c.title}</h3>
                  <pre className="text-xs font-mono overflow-auto max-h-64 whitespace-pre-wrap leading-relaxed">
                    <code>{c.code}</code>
                  </pre>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section ref={sections.education} className="mb-24 max-w-7xl mx-auto">
          <SectionHeader title="Education" subtitle="Academic journey and progress." />
          <div className="grid md:grid-cols-3 gap-6">
            {DUMMY.education.map((edu, i) => (
              <Card key={i} className="flex flex-col items-center text-center">
                <img src={edu.img} alt={`${edu.institute} campus`} className="w-full h-40 object-cover rounded-md mb-4" width={600} height={160} />
                <h3 className="font-semibold text-indigo-900">{edu.institute}</h3>
                <p className="text-sm text-slate-500">{edu.type} • {edu.year}</p>
                {edu.gpaTimeline ? (
                  <div className="w-full h-40 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={edu.gpaTimeline}>
                        <Line type="monotone" dataKey="gpa" stroke="#42a5f5" strokeWidth={2} dot={{ stroke: '#42a5f5', strokeWidth: 2, r: 4 }} />
                        <XAxis dataKey="sem" axisLine={false} tickLine={false} className="text-xs" />
                        <YAxis domain={[3, 4]} allowDecimals={false} axisLine={false} tickLine={false} className="text-xs" />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="w-full mt-4">
                    <div className="text-xs text-slate-500 mb-1">Grade: {edu.grade}%</div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${edu.grade}%` }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.8, delay: i * 0.2 }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section ref={sections.experience} className="mb-24 max-w-7xl mx-auto">
          <SectionHeader title="Experience" subtitle="Internships, volunteering, and research." />
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(DUMMY.experience).map(tab => (
              <motion.button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm rounded-full font-semibold transition-colors ${tab === activeTab ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'} ${focusRing}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DUMMY.experience[activeTab]?.map((item, i) => (
                  <Card key={i} className="flex items-start space-x-4">
                    <img src={item.logo} alt={`${item.org} logo`} className="w-12 h-12 rounded-full object-cover shadow" width={48} height={48} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-indigo-900">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.org} • {item.year}</p>
                      <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Certifications */}
        <section ref={sections.certifications} className="mb-24 max-w-7xl mx-auto">
          <SectionHeader title="Certifications" subtitle="Verified learning and skills." />
          <div className="grid md:grid-cols-3 gap-6">
            <AnimatePresence>
              {visibleCerts.map((cert) => (
                <motion.div key={cert.id} {...fadeInUp} className="relative">
                  <Card className="flex flex-col h-full">
                    <img src={cert.img} alt={cert.title} className="w-full h-40 object-cover rounded-md mb-4" width={600} height={160} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-indigo-900">{cert.title}</h3>
                      <p className="text-sm text-slate-500">{cert.issuer} • {cert.year}</p>
                    </div>
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className={`mt-4 text-sm text-blue-600 hover:underline inline-flex items-center gap-1 ${focusRing}`}>
                      View Certificate <ArrowUpRight size={14} />
                    </a>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-center mt-8 gap-4">
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className={`px-4 py-2 rounded-full bg-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition ${focusRing}`}>Prev</motion.button>
            <span className="self-center text-sm text-slate-500">Page {currentPage + 1} of {totalCertPages}</span>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setCurrentPage(p => Math.min(totalCertPages - 1, p + 1))} disabled={currentPage === totalCertPages - 1} className={`px-4 py-2 rounded-full bg-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition ${focusRing}`}>Next</motion.button>
          </div>
        </section>

        {/* Skills */}
        <section ref={sections.skills} className="mb-24 max-w-7xl mx-auto">
          <SectionHeader title="Skills" subtitle="Languages, technologies, and soft skills." />
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">Technology Proficiency</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DUMMY.skills.categories}>
                    <Bar dataKey="pct" fill="#42a5f5" radius={[4, 4, 0, 0]} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">Languages</h3>
              <div className="space-y-4">
                {DUMMY.skills.languages.map(lang => (
                  <div key={lang.name}>
                    <div className="flex justify-between items-center text-sm text-slate-700">
                      <span>{lang.name}</span>
                      <span>{lang.level}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${lang.level}%` }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 text-indigo-900">Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {DUMMY.skills.soft.map(skill => (
                <Pill key={skill}>{skill}</Pill>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section ref={sections.projects} className="mb-24 max-w-7xl mx-auto">
          <SectionHeader title="Projects" subtitle="Selected works with demos and code." />
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {projectsToShow.map(p => (
                <motion.div key={p.id} {...fadeInUp} className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <img src={p.image} alt={`${p.title} screenshot`} className="w-full h-48 object-cover" width={900} height={192} />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-1 text-indigo-900">{p.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.map(tag => <Pill key={tag}>{tag}</Pill>)}
                    </div>
                    <div className="flex gap-3">
                      <AccentButton href={p.demo} target="_blank" rel="noopener noreferrer">Demo</AccentButton>
                      <OutlineButton href={p.code} target="_blank" rel="noopener noreferrer">Code</OutlineButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-8">
            <motion.button onClick={() => setProjectIndex(i => Math.max(0, i - projectsPerPage))} disabled={projectIndex === 0} className={`px-4 py-2 rounded-full bg-slate-200 text-slate-600 disabled:opacity-50 transition ${focusRing}`}>Prev</motion.button>
            <motion.button onClick={() => setProjectIndex(i => Math.min(DUMMY.projects.length - projectsPerPage, i + projectsPerPage))} disabled={projectIndex >= DUMMY.projects.length - projectsPerPage} className={`px-4 py-2 rounded-full bg-slate-200 text-slate-600 disabled:opacity-50 transition ${focusRing}`}>Next</motion.button>
          </div>
        </section>

        {/* Awards */}
        <section ref={sections.awards} className="mb-24 max-w-7xl mx-auto">
          <SectionHeader title="Awards" subtitle="Honors and recognition." />
          <div className="grid md:grid-cols-2 gap-6">
            {DUMMY.awards.map((award, i) => (
              <Card key={i} className="flex items-start gap-4">
                <motion.div {...iconHover} className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <Award size={24} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-indigo-900">{award.title}</h3>
                  <p className="text-sm text-slate-500">{award.org} • {award.month}</p>
                  <p className="text-sm text-slate-600 mt-2">{award.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Hobbies */}
        <section className="mb-24 max-w-7xl mx-auto">
          <SectionHeader title="Hobbies" subtitle="Interests that spark creativity." />
          <div className="flex overflow-x-auto gap-4 py-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {DUMMY.hobbies.map((h, i) => (
              <EmojiCard key={i} emoji={h === "Cricket" ? "🏏" : h === "Badminton" ? "🏸" : h === "Graphic Design" ? "🎨" : h === "Teaching" ? "🧑‍🏫" : "✍️"} title={h} />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section ref={sections.contact} className="mb-24 max-w-7xl mx-auto">
          <SectionHeader title="Contact" subtitle="Let's build something great together." />
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="flex flex-col">
              <h3 className="font-semibold text-indigo-900 mb-4">Get in touch</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Name" required className={`w-full p-3 rounded border border-slate-300 bg-slate-100 text-slate-800 ${focusRing}`} />
                <input type="email" placeholder="Email" required className={`w-full p-3 rounded border border-slate-300 bg-slate-100 text-slate-800 ${focusRing}`} />
                <textarea placeholder="Message" rows="4" required className={`w-full p-3 rounded border border-slate-300 bg-slate-100 text-slate-800 ${focusRing}`} />
                <AccentButton as="button" type="submit">Send Message</AccentButton>
              </form>
            </Card>
            <Card className="flex flex-col">
              <h3 className="font-semibold text-indigo-900 mb-4">Find me online</h3>
              <div className="grid grid-cols-2 gap-4">
                <AccentButton href={DUMMY.contacts.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} className="inline mr-2" /> LinkedIn</AccentButton>
                <OutlineButton href={DUMMY.contacts.github} target="_blank" rel="noopener noreferrer"><Github size={16} className="inline mr-2" /> GitHub</OutlineButton>
                <OutlineButton href={`mailto:${DUMMY.contacts.email}`}><Mail size={16} className="inline mr-2" /> Email</OutlineButton>
                <OutlineButton href={DUMMY.contacts.leetcode} target="_blank" rel="noopener noreferrer">LeetCode</OutlineButton>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="text-center text-sm text-slate-400 py-6 border-t border-slate-200">
        <p>
          &copy; {new Date().getFullYear()} {DUMMY.hero.name}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}