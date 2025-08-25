import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { Star, Github, Linkedin, Mail, Award } from "lucide-react";

/**
 * Cosmic Portfolio — Competition Build (Single File)
 * - React + Tailwind + Framer Motion + Recharts + lucide-react
 * - Pure client, dummy data only. Swap DUMMY to personalize.
 * - Meets the acceptance checklist in the user spec.
 */

// ----------------------\n// 0) Dummy Data Schema\n// ----------------------
const DUMMY = {
  hero: {
    name: "Cosmic Creator",
    title: "Full-Stack Engineer • AI & Security",
    tagline: "Black & White interface, star-bright ideas.",
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
      code: `function useInterval(cb, delay){\n  const saved = React.useRef(cb);\n  React.useEffect(()=>{ saved.current = cb }, [cb]);\n  React.useEffect(()=>{\n    if(delay==null) return;\n    const id = setInterval(()=>saved.current(), delay);\n    return ()=>clearInterval(id);\n  }, [delay]);\n}`,
    },
    {
      title: "Snippet B — Secure Password Hash (Node)",
      lang: "js",
      code: `import bcrypt from 'bcryptjs';\nexport async function hashPassword(p){\n  const salt = await bcrypt.genSalt(12);\n  return bcrypt.hash(p, salt);\n}`,
    },
  ],
  education: [
    {
      type: "School",
      board: "BISE Abbottabad",
      institute: "Model School, Abbottabad",
      year: "2015–2019",
      grade: 95,
      img: "https://picsum.photos/seed/school/600/400",
    },
    {
      type: "Intermediate",
      board: "BISE Abbottabad",
      institute: "Govt College, Abbottabad",
      year: "2019–2021",
      grade: 90,
      img: "https://picsum.photos/seed/inter/600/400",
    },
    {
      type: "University",
      board: "CUI Abbottabad",
      institute: "COMSATS University Islamabad, Abbottabad",
      year: "2021–Present",
      gpaTimeline: [
        { sem: "Sem 1", gpa: 3.79 },
        { sem: "Sem 2", gpa: 3.96 },
        { sem: "Sem 3", gpa: 3.85 },
        { sem: "Sem 4", gpa: 3.92 },
      ],
      img: "https://picsum.photos/seed/uni/600/400",
    },
  ],
  experience: {
    volunteering: [
      {
        title: "Event Lead - Tech Youth Camp",
        org: "Fursan Foundation",
        year: "2023",
        desc: "Led web workshops; mentored 50+ students.",
        logo: "https://picsum.photos/seed/vol/80/80",
      },
    ],
    internships: [
      {
        title: "Frontend Intern",
        org: "Pixel Labs",
        year: "2024",
        desc: "Built component library; +20% Lighthouse.",
        logo: "https://picsum.photos/seed/intern/80/80",
      },
    ],
    research: [
      {
        title: "Adversarial Robustness (Mini)",
        org: "CUI Research Lab",
        year: "2024",
        desc: "Attacks on tiny CNNs.",
        logo: "https://picsum.photos/seed/research/80/80",
      },
    ],
    participation: [
      {
        title: "National AI Challenge",
        org: "AI Pakistan",
        result: "Top 10",
        link: "#",
        logo: "https://picsum.photos/seed/comp/80/80",
      },
    ],
  },
  certifications: Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Certification ${i + 1}`,
    issuer: ["Coursera", "edX", "Google", "Meta"][i % 4],
    year: 2021 + (i % 4),
    img: `https://picsum.photos/seed/cert-${i}/600/380`,
    link: "#",
  })),
  skills: {
    languages: [
      { name: "JavaScript", level: 95 },
      { name: "Python", level: 90 },
      { name: "Java", level: 85 },
      { name: "C++", level: 80 },
    ],
    categories: [
      { name: "Web Dev", pct: 92 },
      { name: "AI/ML", pct: 75 },
      { name: "Cybersecurity", pct: 70 },
      { name: "DevOps", pct: 64 },
    ],
    soft: ["Communication", "Leadership", "Problem Solving", "Mentoring"],
  },
  projects: Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Project ${i + 1}`,
    desc: "Impactful product with clean DX and measurable results.",
    image: `https://picsum.photos/seed/project-${i}/900/550`,
    demo: "#",
    code: "#",
    tags: i % 2 ? ["Open Source", "React", "Tailwind"] : ["AI", "Node", "Security"],
  })),
  awards: [
    {
      title: "Hackathon Champion",
      org: "TechFest",
      month: "Nov 2023",
      desc: "Built accessible voting dApp with audited contracts.",
    },
    {
      title: "Best Portfolio (Inter-Uni)",
      org: "Design League",
      month: "May 2024",
      desc: "Top UI/UX in monochrome category.",
    },
    {
      title: "Volunteer Excellence",
      org: "Community Org",
      month: "Jul 2022",
      desc: "Organized 20+ beginner workshops.",
    },
  ],
  hobbies: ["Cricket", "Badminton", "Graphic Design", "Teaching", "Blogging"],
};

// --------------------------------\n// 1) Shared helpers & animations\n// --------------------------------
const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6 },
};

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 focus-visible:offset-2";

function useKeyNav(refMap) {
  // Optional shortcuts: g a/p/c
  useEffect(() => {
    function onKey(e) {
      if (e.key.toLowerCase() === "g") {
        const next = (ev) => {
          const k = ev.key.toLowerCase();
          if (k === "a") scrollToSection(refMap.aboutRef);
          if (k === "p") scrollToSection(refMap.projectsRef);
          if (k === "c") scrollToSection(refMap.contactRef);
          window.removeEventListener("keydown", next, true);
        };
        window.addEventListener("keydown", next, true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [refMap]);
}

function scrollToSection(ref, offset = -80) {
  if (!ref?.current) return;
  const bodyTop = document.body.getBoundingClientRect().top;
  const elTop = ref.current.getBoundingClientRect().top;
  const target = elTop - bodyTop + offset;
  window.scrollTo({ top: target, behavior: "smooth" });
}

// Star backdrop with CSS-only starfield (perf-friendly)
function StarBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
      <div className="w-full h-full bg-gradient-to-b from-black to-zinc-900 opacity-95" />
      <div className="stars" />
      <style>{`
        .stars{position:absolute;inset:0;background-image:
          radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px),
          radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
          radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px);
        background-size: 200px 200px, 120px 120px, 60px 60px;
        background-position: 10px 20px, 50px 80px, 120px 10px;opacity:0.9;mix-blend-mode:screen;}
        code{font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
      `}</style>
    </div>
  );
}

// Small reusable pieces
function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-lg bg-black/40 border border-white/10 shadow-sm">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  );
}

function MiniProjectCard({ project }) {
  return (
    <div className="flex gap-3 items-center p-2 rounded-md bg-black/40 border border-white/10">
      <img
        src={project.image}
        alt={`${project.title} preview`}
        className="w-20 h-14 object-cover rounded-md"
        width={80}
        height={56}
      />
      <div>
        <div className="font-semibold text-sm">{project.title}</div>
        <div className="text-xs text-white/70">{project.tags.join(" • ")}</div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h3 className="text-2xl font-extrabold">{title}</h3>
      <p className="text-sm text-white/70 mt-1">{subtitle}</p>
    </div>
  );
}

// ----------------------\n// Main App Component\n// ----------------------
export default function CosmicPortfolio1() {
  // Refs for smooth scrolling
  const aboutRef = useRef(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const certificationsRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const awardsRef = useRef(null);
  const contactRef = useRef(null);

  useKeyNav({ aboutRef, projectsRef, contactRef });

  // Local UI states
  const [expTab, setExpTab] = useState("volunteering");
  const [certPage, setCertPage] = useState(0);
  const certPerPage = 6;
  const certs = DUMMY.certifications;
  const totalCertPages = Math.ceil(certs.length / certPerPage);
  const visibleCerts = useMemo(
    () => certs.slice(certPage * certPerPage, certPage * certPerPage + certPerPage),
    [certPage]
  );

  const [projectIndex, setProjectIndex] = useState(0);
  const projWindow = 2;
  const projects = DUMMY.projects;
  const projMaxIndex = Math.max(0, projects.length - projWindow);
  const projectsToShow = projects.slice(projectIndex, projectIndex + projWindow);

  return (
    <div className="min-h-screen text-white relative font-sans">
      <StarBackdrop />

      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10"
        role="navigation"
        aria-label="Primary"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-1 rounded-full border border-white/20" aria-hidden>
              <Star size={18} />
            </span>
            <span className="text-sm font-semibold tracking-wide">{DUMMY.hero.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-sm">
            {[
              ["About", aboutRef],
              ["Education", educationRef],
              ["Experience", experienceRef],
              ["Certifications", certificationsRef],
              ["Skills", skillsRef],
              ["Projects", projectsRef],
              ["Awards", awardsRef],
              ["Contact", contactRef],
            ].map(([label, ref]) => (
              <button
                key={label}
                className={`hover:text-yellow-400 transition ${focusRing}`}
                onClick={() => scrollToSection(ref)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24" role="main">
        {/* HERO / ABOUT */}
        <section ref={aboutRef} className="min-h-[70vh] grid md:grid-cols-3 gap-8 items-center">
          <motion.div {...fadeInUp} className="col-span-1 flex flex-col items-center md:items-start gap-4">
            <div className="text-4xl md:text-5xl font-extrabold leading-tight text-center md:text-left">
              {DUMMY.hero.title}
              <span className="block text-lg font-normal mt-3 text-white/70">
                {DUMMY.hero.tagline}
              </span>
            </div>
            <p className="text-white/70 max-w-prose">
              I design and build performant web apps, teach, and experiment with AI + security. This portfolio uses a starry monochrome palette with gentle color pops for clarity and focus.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={DUMMY.contacts.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-2xl text-sm hover:bg-white/5 transition ${focusRing}`}
                aria-label="Open LinkedIn in new tab"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
              <a
                href={DUMMY.contacts.github}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-2xl text-sm hover:bg-white/5 transition ${focusRing}`}
                aria-label="Open GitHub in new tab"
              >
                <Github size={16} /> GitHub
              </a>
              <a
                href={`mailto:${DUMMY.contacts.email}`}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl text-sm hover:bg-yellow-400/20 transition ${focusRing}`}
                aria-label="Compose email"
              >
                <Mail size={16} /> Email
              </a>
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="col-span-2 md:col-span-2"
            transition={{ ...fadeInUp.transition, delay: 0.05 }}
          >
            <div className="grid md:grid-cols-3 gap-4">
              {/* Avatar card */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center">
                <img
                  src={DUMMY.hero.avatar}
                  alt="Profile avatar"
                  className="w-44 h-44 rounded-2xl object-cover border-2 border-white/10"
                  width={176}
                  height={176}
                />
                <div className="text-center mt-4 text-sm text-white/70">{DUMMY.hero.location}</div>
                <div className="mt-2 text-xs text-white/60">Quick tip: replace all dummy data above the component.</div>
              </div>

              {/* Quick Stats */}
              <div className="md:col-span-2 grid grid-cols-3 gap-4 p-6 rounded-2xl bg-black/40 border border-white/10">
                <Stat label="Projects" value={DUMMY.stats.projects} />
                <Stat label="Certifications" value={DUMMY.stats.certifications} />
                <Stat label="Awards" value={DUMMY.stats.awards} />
                <div className="col-span-3">
                  <h4 className="text-sm font-semibold mb-2">Featured Work</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniProjectCard project={DUMMY.projects[0]} />
                    <MiniProjectCard project={DUMMY.projects[1]} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CODE SHOWCASE */}
        <section className="my-14">
          <SectionHeader title="Taste of Code" subtitle="Readable patterns that scale." />
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {DUMMY.codes.map((c, i) => (
              <motion.div key={i} {...fadeInUp} className="p-4 rounded-2xl border border-white/10 bg-black/50">
                <div className="text-sm font-semibold mb-2">{c.title}</div>
                <pre className="text-xs whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded-md border border-white/10 overflow-auto max-h-64" aria-label={`${c.title} code`}>
                  <code>{c.code}</code>
                </pre>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section ref={educationRef} className="py-10">
          <SectionHeader title="Education" subtitle="Academic progress & grades." />
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* School */}
            <EduCardPercent item={DUMMY.education[0]} colorClass="bg-yellow-400" />
            {/* Intermediate */}
            <EduCardPercent item={DUMMY.education[1]} colorClass="bg-blue-400" />
            {/* University */}
            <div className="p-5 rounded-xl border border-white/10 bg-black/40">
              <h4 className="font-semibold">University</h4>
              <p className="text-sm text-white/70">
                {DUMMY.education[2].institute} • {DUMMY.education[2].year}
              </p>
              <div className="mt-4 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DUMMY.education[2].gpaTimeline} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                    <XAxis dataKey="sem" tick={{ fontSize: 12 }} />
                    <YAxis domain={[3, 4]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="gpa" stroke="#facc15" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section ref={experienceRef} className="py-10">
          <SectionHeader title="Experience" subtitle="Internships, volunteering & research." />
          <div className="mt-6">
            <div role="tablist" aria-label="Experience tabs" className="flex gap-3">
              {Object.keys(DUMMY.experience).filter(k => k !== 'participation').map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={expTab === k}
                  className={`px-3 py-1 rounded-md text-sm ${expTab === k ? "bg-yellow-400 text-black" : "bg-black/60 text-white/80 border border-white/10"} ${focusRing}`}
                  onClick={() => setExpTab(k)}
                >
                  {k[0].toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
            <motion.div key={expTab} {...fadeInUp} className="mt-4 grid md:grid-cols-3 gap-4">
              {(DUMMY.experience[expTab] || []).map((e, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="p-4 border rounded-lg border-white/10 bg-black/40"
                >
                  <div className="flex items-center gap-3">
                    <img src={e.logo} alt="org logo" className="w-12 h-12 rounded-md object-cover" width={48} height={48} />
                    <div>
                      <div className="font-semibold">{e.title}</div>
                      <div className="text-xs text-white/70">
                        {e.org} • {e.year}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 mt-3">{e.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Participation (optional) */}
            {DUMMY.experience.participation?.length ? (
              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-2">Participation</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {DUMMY.experience.participation.map((p, i) => (
                    <a
                      key={i}
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-4 border rounded-lg border-white/10 bg-black/40 flex items-center gap-3 hover:shadow-[0_0_0_2px_rgba(250,204,21,0.3)] transition ${focusRing}`}
                      aria-label={`${p.title} external link`}
                    >
                      <img src={p.logo} alt="competition logo" className="w-12 h-12 rounded-md" width={48} height={48} />
                      <div>
                        <div className="font-semibold">{p.title}</div>
                        <div className="text-xs text-white/70">{p.org} • {p.result}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section ref={certificationsRef} className="py-10">
          <SectionHeader title="Certifications" subtitle="Verified learning & pathways." />
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {visibleCerts.map((c) => (
              <div key={c.id} className="p-4 border rounded-lg border-white/10 bg-black/40">
                <img src={c.img} alt={c.title} className="w-full h-36 object-cover rounded-md" width={600} height={144} />
                <div className="mt-3">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-xs text-white/70">{c.issuer} • {c.year}</div>
                  <a href={c.link} target="_blank" rel="noreferrer" className={`mt-2 inline-block text-sm text-yellow-300 ${focusRing}`}>View Certificate</a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={() => setCertPage((p) => Math.max(0, p - 1))} className={`px-3 py-1 rounded-md bg-black/60 border border-white/10 ${focusRing}`} aria-label="Previous page">
              Prev
            </button>
            <span className="text-xs self-center text-white/70">Page {certPage + 1} / {totalCertPages}</span>
            <button onClick={() => setCertPage((p) => Math.min(totalCertPages - 1, p + 1))} className={`px-3 py-1 rounded-md bg-black/60 border border-white/10 ${focusRing}`} aria-label="Next page">
              Next
            </button>
          </div>
        </section>

        {/* SKILLS */}
        <section ref={skillsRef} className="py-10">
          <SectionHeader title="Skills" subtitle="Languages, technologies & soft skills." />
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {/* Language bars */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/40">
              <h4 className="font-semibold mb-3">Languages</h4>
              <div className="space-y-3">
                {DUMMY.skills.languages.map((l) => (
                  <div key={l.name}>
                    <div className="flex justify-between text-xs text-white/70"><span>{l.name}</span><span>{l.level}%</span></div>
                    <div className="w-full bg-black/60 rounded-full h-3 mt-1 border border-white/10">
                      <div style={{ width: `${l.level}%` }} className="h-3 rounded-full bg-yellow-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories BarChart */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/40">
              <h4 className="font-semibold mb-3">Technology Proficiency</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DUMMY.skills.categories} margin={{ top: 5, left: -10, right: -10, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="pct" radius={[6, 6, 0, 0]} fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Soft skills */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/40">
              <h4 className="font-semibold mb-3">Soft Skills</h4>
              <div className="flex flex-wrap gap-2">
                {DUMMY.skills.soft.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section ref={projectsRef} className="py-10">
          <SectionHeader title="Projects" subtitle="Selected works with demos & source." />
          <div className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {projectsToShow.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:shadow-[0_0_0_2px_rgba(96,165,250,0.25)] transition"
                >
                  <img src={p.image} alt={`${p.title} screenshot`} className="w-full h-48 object-cover" width={900} height={192} />
                  <div className="p-4">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-white/80">{p.desc}</div>
                    <div className="mt-2 text-xs text-white/60">{p.tags.join(" · ")}</div>
                    <div className="mt-3 flex gap-2">
                      <a href={p.demo} className={`px-3 py-1 rounded bg-yellow-400 text-black text-sm ${focusRing}`}>Demo</a>
                      <a href={p.code} className={`px-3 py-1 rounded border border-white/20 text-sm ${focusRing}`}>Code</a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button onClick={() => setProjectIndex((i) => Math.max(0, i - 2))} className={`px-3 py-1 rounded bg-black/60 border border-white/10 ${focusRing}`} aria-label="Previous projects">
                Prev
              </button>
              <button onClick={() => setProjectIndex((i) => Math.min(projMaxIndex, i + 2))} className={`px-3 py-1 rounded bg-black/60 border border-white/10 ${focusRing}`} aria-label="Next projects">
                Next
              </button>
            </div>
          </div>
        </section>

        {/* AWARDS */}
        <section ref={awardsRef} className="py-10">
          <SectionHeader title="Awards" subtitle="Honors & recognition." />
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {DUMMY.awards.map((a, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="p-4 border rounded-lg border-white/10 bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-white/70">{a.org} • {a.month}</div>
                  </div>
                  <Award className="opacity-80" />
                </div>
                <p className="text-sm text-white/80 mt-3">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOBBIES */}
        <section className="py-10">
          <SectionHeader title="Hobbies" subtitle="Personal interests that spark creativity." />
          <div className="mt-6 flex gap-4 overflow-x-auto pr-1">
            {DUMMY.hobbies.map((h) => (
              <motion.div key={h} whileHover={{ y: -6 }} className="min-w-[12rem] p-4 border rounded-lg border-white/10 bg-black/40">
                <div className="text-3xl">{emojiFor(h)}</div>
                <div className="mt-2 font-semibold">{h}</div>
                <div className="text-sm text-white/70 mt-1">A tiny blurb about how this hobby fuels creativity.</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section ref={contactRef} className="py-10">
          <SectionHeader title="Contact" subtitle="Let’s collaborate." />
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-xl border-white/10 bg-black/40">
              <h4 className="font-semibold">Get in touch</h4>
              <p className="text-sm text-white/70 mt-2">Drop a message for collaborations, internships or friendly chats.</p>
              <ContactForm />
            </div>

            <div className="p-6 border rounded-xl border-white/10 bg-black/40">
              <h4 className="font-semibold">Find me online</h4>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a href={`mailto:${DUMMY.contacts.email}`} className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 hover:bg-yellow-400/20 transition ${focusRing}`}><Mail size={16}/> Email</a>
                <a href={DUMMY.contacts.linkedin} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border hover:bg-white/5 transition ${focusRing}`}><Linkedin size={16}/> LinkedIn</a>
                <a href={DUMMY.contacts.github} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border hover:bg-white/5 transition ${focusRing}`}><Github size={16}/> GitHub</a>
                <a href={DUMMY.contacts.leetcode} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border hover:bg-white/5 transition ${focusRing}`}>LeetCode</a>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-white/60">
          Built with ❤️ — Cosmic Portfolio · Demo template
        </footer>
      </main>
    </div>
  );
}

// ----------------------\n// Sub-components\n// ----------------------
function EduCardPercent({ item, colorClass }) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-black/40">
      <h4 className="font-semibold">{item.type}</h4>
      <p className="text-sm text-white/70">{item.institute} • {item.year}</p>
      <img src={item.img} alt={`${item.type} campus`} className="w-full h-28 object-cover rounded-md mt-3" width={600} height={112} />
      <div className="mt-4">
        <small className="text-xs text-white/60">Grade</small>
        <div className="w-full bg-black/60 rounded-full h-3 mt-2 border border-white/10">
          <div style={{ width: `${item.grade}%` }} className={`h-3 rounded-full ${colorClass}`} />
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2200);
  };
  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <input required placeholder="Your name" className={`w-full p-2 rounded bg-black/60 border border-white/10 ${focusRing}`} />
      <input required placeholder="Email" type="email" className={`w-full p-2 rounded bg-black/60 border border-white/10 ${focusRing}`} />
      <textarea placeholder="Message" required className={`w-full p-2 rounded bg-black/60 border border-white/10 h-28 ${focusRing}`} />
      <button className={`px-4 py-2 bg-yellow-400 text-black rounded ${focusRing}`}>Send</button>
      {sent && <div className="text-sm text-blue-400">Message sent (mock)</div>}
    </form>
  );
}

function emojiFor(name) {
  const map = {
    Cricket: "🏏",
    Badminton: "🏸",
    "Graphic Design": "🎨",
    Teaching: "🧑‍🏫",
    Blogging: "✍️",
  };
  return map[name] || "✨";
}
