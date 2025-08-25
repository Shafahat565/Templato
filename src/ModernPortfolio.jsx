import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight, Award, Code, Briefcase, GraduationCap, Star } from "lucide-react";

/**
 * Modern Dark Portfolio
 * A sleek, dark-themed portfolio component with a charcoal/slate color palette
 * and a vibrant emerald green accent. It features custom animated charts
 * and a longer, more complete layout.
 * Dependencies: framer-motion, lucide-react, tailwindcss configured.
 */

/* ---------------------------
  DUMMY data (edit as needed)
  --------------------------- */
const DUMMY = {
  hero: {
    name: "Avery Chen",
    title: "Product Designer & Frontend Engineer",
    tagline: "Crafting beautiful and functional digital experiences.",
    location: "Abbottabad, Pakistan",
    avatar: "https://picsum.photos/seed/avatar2/400/400",
  },
  contacts: {
    email: "avery.c@design.dev",
    github: "https://github.com/averyc",
    linkedin: "https://linkedin.com/in/averyc",
  },
  stats: { projects: 24, certifications: 12, awards: 5 },
  experience: [
    { id: 1, title: "UI/UX Intern", company: "Innovate Solutions", years: "2024 - Present", description: "Designed user interfaces and contributed to a mobile app launch. Improved user satisfaction by 15% through design iterations." },
    { id: 2, title: "Frontend Developer", company: "CodeLabs", years: "2023 - 2024", description: "Developed and maintained web applications using React. Optimized page load times by 20% by implementing code splitting." },
    { id: 3, title: "Freelance Designer", company: "Self-Employed", years: "2022 - 2023", description: "Created branding and web designs for various clients. Managed projects from initial concept to final delivery." },
  ],
  education: [
    { institute: "University of Tech", degree: "B.S. Computer Science", years: "2021 - 2025", gpa: 3.8 },
    { institute: "Design Academy", degree: "Certification in UI/UX Design", years: "2020", grade: 95 },
  ],
  skills: {
    tech: [
      { name: "React", level: 95 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Figma", level: 85 },
      { name: "Node.js", level: 80 },
    ],
    design: [
      { name: "UI/UX Design", level: 92 },
      { name: "Prototyping", level: 88 },
      { name: "Visual Design", level: 85 },
    ],
  },
  projects: [
    { id: 1, title: "Carbon-Tracker App", desc: "A mobile application for tracking carbon footprints.", image: "https://picsum.photos/seed/project-carbon/900/550", tags: ["Mobile", "React Native", "UI/UX"] },
    { id: 2, title: "Crypto-Portfolio Dashboard", desc: "A clean, real-time dashboard for managing cryptocurrencies.", image: "https://picsum.photos/seed/project-crypto/900/550", tags: ["Web", "React", "API"] },
    { id: 3, title: "Personal Website V2", desc: "The second iteration of my personal portfolio.", image: "https://picsum.photos/seed/project-v2/900/550", tags: ["Web", "Next.js", "Animation"] },
  ],
  awardsAndCerts: [
    { type: "Award", title: "Best Design Award", issuer: "Design Showcase", year: 2024 },
    { type: "Cert", title: "Certified React Developer", issuer: "Meta", year: 2023 },
    { type: "Award", title: "Top 10 Innovators", issuer: "TechFest", year: 2023 },
    { type: "Cert", title: "UI/UX Certification", issuer: "Google", year: 2022 },
    { type: "Cert", title: "Frontend Master", issuer: "Coursera", year: 2022 },
  ]
};

/* ---------------------------
  Custom Components & Animations
  --------------------------- */

/**
 * Renders a stylized section title and subtitle.
 * Uses Framer Motion for a subtle fade-in animation on scroll.
 */
const SectionTitle = ({ title, subtitle, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} className={`text-center md:text-left mb-12 ${className}`}>
    <h2 className="text-3xl font-bold text-emerald-400">{title}</h2>
    <p className="text-xl text-slate-300 mt-2">{subtitle}</p>
  </motion.div>
);

/**
 * Renders a small, styled pill component for tags.
 */
const Pill = ({ children, className = "" }) => (
  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300 ${className}`}>
    {children}
  </span>
);

/**
 * Displays a single statistic in a styled card with hover effects.
 * Uses Framer Motion for a gentle scale-up animation on view.
 */
const StatCard = ({ label, value }) => (
  <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700 hover:border-emerald-400 transition-colors">
    <div className="text-4xl font-bold text-emerald-400">{value}</div>
    <div className="text-sm text-slate-400 mt-2">{label}</div>
  </motion.div>
);

/**
 * Renders an animated progress bar for skills and grades.
 * Uses Framer Motion to animate the bar's width on view.
 */
const AnimatedProgressBar = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <motion.div
        className="h-full bg-emerald-400 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        viewport={{ once: true }}
      />
    </div>
  </div>
);

/* ---------------------------
  Main Portfolio Component
  --------------------------- */
export default function ModernPortfolio() {
  // Use useRef to create references to each section for smooth scrolling
  const sections = {
    about: useRef(null),
    experience: useRef(null),
    education: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    awards: useRef(null),
    contact: useRef(null),
  };

  /**
   * Smoothly scrolls to a given section.
   * Calculates offset to account for the fixed navbar.
   */
  const scrollToSection = (ref) => {
    if (ref.current) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const offset = ref.current.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans relative">
      {/* Navbar - Fixed at the top for easy navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button onClick={() => scrollToSection(sections.about)} className="flex items-center gap-2 font-bold text-lg text-emerald-400 transition-colors hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
            <Star size={20} />
            {DUMMY.hero.name}
          </button>
          <div className="hidden md:flex gap-6">
            {Object.keys(sections).map((key) => (
              <button key={key} onClick={() => scrollToSection(sections[key])} className="capitalize text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                {key}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* Hero Section */}
        <section ref={sections.about} className="grid lg:grid-cols-2 items-center gap-12 py-12 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">{DUMMY.hero.title}</h1>
            <p className="text-lg text-slate-400 max-w-lg">{DUMMY.hero.tagline}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.a href={DUMMY.contacts.linkedin} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} className="px-5 py-2 rounded-full font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors">
                <Linkedin size={16} className="inline mr-2" /> LinkedIn
              </motion.a>
              <motion.a href={DUMMY.contacts.github} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} className="px-5 py-2 rounded-full font-semibold text-slate-300 border border-slate-700 hover:border-emerald-400 transition-colors">
                <Github size={16} className="inline mr-2" /> GitHub
              </motion.a>
              <motion.a href={`mailto:${DUMMY.contacts.email}`} whileHover={{ scale: 1.05 }} className="px-5 py-2 rounded-full font-semibold text-slate-300 border border-slate-700 hover:border-emerald-400 transition-colors">
                <Mail size={16} className="inline mr-2" /> Email
              </motion.a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative p-8 rounded-3xl bg-slate-800 shadow-xl border border-slate-700">
            <img src={DUMMY.hero.avatar} alt="Profile avatar" className="w-full rounded-2xl aspect-square object-cover" width={400} height={400} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-900/70 text-slate-200 text-xs backdrop-blur-sm">{DUMMY.hero.location}</div>
          </motion.div>
        </section>
        
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {DUMMY.stats.projects && <StatCard label="Projects" value={DUMMY.stats.projects} />}
          {DUMMY.stats.certifications && <StatCard label="Certifications" value={DUMMY.stats.certifications} />}
          {DUMMY.stats.awards && <StatCard label="Awards" value={DUMMY.stats.awards} />}
        </section>
        
        {/* Experience Section */}
        <section ref={sections.experience} className="mb-24">
          <SectionTitle title="Experience" subtitle="Where I've applied my skills in the real world." />
          <div className="space-y-8">
            {DUMMY.experience.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-start gap-6"
              >
                <Briefcase size={28} className="text-emerald-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title} at {item.company}</h3>
                  <p className="text-sm text-slate-400 mt-1">{item.years}</p>
                  <p className="text-slate-300 mt-4">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Education Section */}
        <section ref={sections.education} className="mb-24">
          <SectionTitle title="Education" subtitle="My academic journey and formal training." />
          <div className="grid md:grid-cols-2 gap-6">
            {DUMMY.education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <GraduationCap size={28} className="text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{edu.institute}</h3>
                    <p className="text-sm text-slate-400">{edu.degree} - {edu.years}</p>
                  </div>
                </div>
                {edu.gpa && <p className="text-white text-sm">GPA: <span className="text-emerald-400 font-bold">{edu.gpa}</span></p>}
                {edu.grade && <AnimatedProgressBar label="Grade" value={edu.grade} />}
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Skills Section */}
        <section ref={sections.skills} className="mb-24">
          <SectionTitle title="Skills" subtitle="The tools and technologies I'm proficient in." />
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Technical Skills</h3>
              {DUMMY.skills.tech.map((skill, i) => (
                <AnimatedProgressBar key={i} label={skill.name} value={skill.level} />
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Design Skills</h3>
              {DUMMY.skills.design.map((skill, i) => (
                <AnimatedProgressBar key={i} label={skill.name} value={skill.level} />
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Projects Section */}
        <section ref={sections.projects} className="mb-24">
          <SectionTitle title="Projects" subtitle="Showcasing my work and technical capabilities." />
          <div className="grid md:grid-cols-3 gap-6">
            {DUMMY.projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-emerald-400 transition-colors"
              >
                <img src={p.image} alt={`${p.title} screenshot`} className="w-full h-48 object-cover" width={900} height={192} />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-1">{p.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tags.map(tag => <Pill key={tag}>{tag}</Pill>)}
                  </div>
                  <div className="flex gap-3">
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-400 text-slate-900 hover:bg-emerald-300 transition-colors">Demo</a>
                    <a href={p.code} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-xs font-semibold rounded-full border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-colors">Code</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Awards & Certifications Section */}
        <section ref={sections.awards} className="mb-24">
          <SectionTitle title="Awards & Certifications" subtitle="Recognized achievements and credentials." />
          <div className="grid md:grid-cols-2 gap-6">
            {DUMMY.awardsAndCerts.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-start gap-4 hover:border-emerald-400 transition-colors"
              >
                <div className="flex-shrink-0 p-3 rounded-full bg-slate-700 text-emerald-400">
                  {item.type === "Award" ? <Award size={20} /> : <Code size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{item.issuer} ({item.year})</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section ref={sections.contact} className="mb-24">
          <SectionTitle title="Contact Me" subtitle="Let's connect and build something incredible." />
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-2xl mx-auto">
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" required className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-emerald-400" />
                <input type="email" placeholder="Your Email" required className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-emerald-400" />
              </div>
              <textarea placeholder="Your Message" rows="5" required className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-emerald-400" />
              <div className="flex justify-end">
                <motion.button type="submit" whileHover={{ scale: 1.05 }} className="px-6 py-3 rounded-full font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors">Send Message</motion.button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 py-6 border-t border-slate-700">
        <p>&copy; {new Date().getFullYear()} {DUMMY.hero.name}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
