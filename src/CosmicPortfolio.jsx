import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Award, Star, ExternalLink, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// CosmicPortfolio.jsx — Hybrid, competition-grade single-file portfolio
// Tech: React + Tailwind + Framer Motion + Recharts + Lucide icons
// Theme: Black & White, starry sky with subtle vibrant accents (yellow/blue)
// Notes: Uses smooth-scroll navbar, vertical project slider, cert pagination, rich skills graphs

const AVATAR = './src//Profile.png';
const PLACEHOLDER = (seed, w=700, h=300) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const COLORS = {
  yellow: 'rgb(250 204 21)', // tailwind yellow-400
  blue: 'rgb(96 165 250)',   // tailwind blue-400
  whiteDim: 'rgba(255,255,255,0.7)'
};

const DUMMY = {
  hero: {
    name: ' Shafahat Nisar',
    title: 'Full‑Stack Engineer • AI & Security',
    tagline: 'Black & White interface, star-bright ideas.',
    location: 'Abbottabad, Pakistan',
  },
  contacts: {
    email: 'cosmic.creator@portfolio.dev',
    github: 'https://github.com/example',
    linkedin: 'https://linkedin.com/in/example',
    leetcode: 'https://leetcode.com/example'
  },
  education: [
    { type: 'School', board: 'BISE Abbottabad', institute: 'Model School, Abbottabad', year: '2015–2019', grade: 95, img: PLACEHOLDER('school', 600, 400) },
    { type: 'Intermediate', board: 'BISE Abbottabad', institute: 'Govt College, Abbottabad', year: '2019–2021', grade: 90, img: PLACEHOLDER('inter', 600, 400) },
    { type: 'University', board: 'CUI Abbottabad', institute: 'COMSATS University Islamabad, Abbottabad', year: '2021–Present', grade: 3.90, img: PLACEHOLDER('uni', 600, 400) },
  ],
  codes: [
    { title: 'Snippet A — Elegant React Hook', lang: 'jsx', code: `function useInterval(cb, delay){
  const saved = React.useRef(cb);
  React.useEffect(()=>{ saved.current = cb }, [cb]);
  React.useEffect(()=>{
    if(delay==null) return;
    const id = setInterval(()=>saved.current(), delay);
    return ()=>clearInterval(id);
  }, [delay]);
}` },
    { title: 'Snippet B — Secure Password Hash (Node)', lang: 'js', code: `import bcrypt from 'bcryptjs';
export async function hashPassword(p){
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(p, salt);
}` },
  ],
  skills: {
    languages: [
      { name: 'JavaScript', level: 95 },
      { name: 'Python', level: 90 },
      { name: 'Java', level: 85 },
      { name: 'C++', level: 80 },
    ],
    frameworks: [
      { name: 'React', level: 92 },
      { name: 'Node.js', level: 86 },
      { name: 'Express', level: 82 },
      { name: 'Tailwind CSS', level: 88 },
    ],
    categories: [
      { name: 'Web Dev', pct: 92 },
      { name: 'AI/ML', pct: 75 },
      { name: 'Cybersecurity', pct: 70 },
      { name: 'UI/UX', pct: 80 },
    ]
  },
  hobbies: ['Cricket', 'Badminton', 'Graphic Design', 'Teaching', 'Blogging'],
  projects: new Array(8).fill(0).map((_,i)=>({
    id: i+1,
    title: `Project ${i+1}`,
    desc: 'Impactful product with clean DX and measurable results.',
    image: PLACEHOLDER(`proj-${i}`, 900, 550),
    link: '#',
    tags: i%2? ['Open Source','React','Tailwind'] : ['AI','Node','Security']
  })),
  awards: [
    { title: 'Hackathon Champion', month: 'Nov 2023', desc: 'Built accessible voting dApp with audited contracts.' },
    { title: 'Best Portfolio (Inter‑Uni)', month: 'May 2024', desc: 'Top UI/UX in monochrome category.' },
    { title: 'Volunteer Excellence', month: 'Jul 2022', desc: 'Organized 20+ workshops for beginners.' },
  ],
  certifications: new Array(9).fill(0).map((_,i)=>({
    id: i+1,
    title: `Certification ${i+1}`,
    issuer: ['Coursera','edX','Google','Meta'][i%4],
    img: PLACEHOLDER(`cert-${i}`, 600, 380),
    link: '#'
  })),
};

const StarBackdrop = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none">
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

export default function CosmicPortfolio(){
  // Refs for smooth scroll
  const aboutRef = useRef(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const awardsRef = useRef(null);
  const contactRef = useRef(null);

  const [certPage, setCertPage] = useState(0);
  const [projIndex, setProjIndex] = useState(0);

  const scrollToSection = (ref) => {
    const offset = -80; // adjust for fixed navbar
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = ref.current.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition + offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  };

  const certPerPage = 6;
  const totalCertPages = Math.ceil(DUMMY.certifications.length / certPerPage);
  const certsToShow = DUMMY.certifications.slice(certPage * certPerPage, certPage * certPerPage + certPerPage);

  const projWindow = 2; // show two at a time (vertical slider)
  const projMaxIndex = Math.max(0, DUMMY.projects.length - projWindow);
  const projectsToShow = DUMMY.projects.slice(projIndex, projIndex + projWindow);

  return (
    <div className="min-h-screen text-white relative font-sans">
      <StarBackdrop />

    {/* NAVBAR */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/20 shadow-lg">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    
    {/* Logo / Name */}
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full border border-yellow-400/40 bg-black/50">
        <Star size={20} className="text-yellow-400"/>
      </div>
      <div className="text-lg font-bold tracking-widest text-white">
        {DUMMY.hero.name}
      </div>
    </div>

    {/* Nav Links */}
    <div className="hidden md:flex items-center gap-6">
      {["About","Education","Experience","Skills","Projects","Awards","Contact"].map((item, idx)=>(
        <button 
          key={idx}
          onClick={()=>{
            const refs = {
              About: aboutRef,
              Education: educationRef,
              Experience: experienceRef,
              Skills: skillsRef,
              Projects: projectsRef,
              Awards: awardsRef,
              Contact: contactRef
            };
            scrollToSection(refs[item]);
          }}
          className="px-3 py-1.5 text-sm font-medium rounded-xl border border-transparent 
                     hover:border-yellow-400/50 hover:text-yellow-400 
                     transition-all duration-300"
        >
          {item}
        </button>
      ))}
    </div>
  </div>
</nav>


      <main className="px-6 pt-24">
      {/* ABOUT */}
<section ref={aboutRef} className="min-h-[70vh] grid md:grid-cols-2 gap-8 items-center">
  {/* LEFT CONTENT */}
  <motion.div 
    initial={{opacity:0,y:10}} 
    animate={{opacity:1,y:0}} 
    transition={{duration:0.6}} 
    className="space-y-6"
  >
    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
      {DUMMY.hero.title}
      <span className="block text-lg font-normal mt-3 text-white/70">
        {DUMMY.hero.tagline}
      </span>
    </h1>

    {/* Quote */}
    <blockquote className="italic text-white/60 border-l-4 border-yellow-400/40 pl-4">
      "Turning complex problems into elegant solutions."
    </blockquote>

    <p className="text-white/70 max-w-prose">
      I design and build performant web apps, teach, and experiment with AI + security. 
      This portfolio uses a starry monochrome palette with gentle color pops for clarity and focus.
    </p>

    {/* Buttons */}
    <div className="flex gap-3">
      <a href={DUMMY.contacts.linkedin} target="_blank" rel="noreferrer" 
         className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-xl text-sm hover:bg-white/10 transition-all duration-300">
        <Linkedin size={16}/> LinkedIn
      </a>
      <a href={DUMMY.contacts.github} target="_blank" rel="noreferrer" 
         className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-xl text-sm hover:bg-white/10 transition-all duration-300">
        <Github size={16}/> GitHub
      </a>
      <a href={`mailto:${DUMMY.contacts.email}`} 
         className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-xl text-sm hover:bg-yellow-400/20 transition-all duration-300">
        <Mail size={16}/> Email
      </a>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-3 gap-4 text-center mt-6">
      <div className="p-3 rounded-xl bg-black/40 border border-white/20 shadow-md shadow-white/5">
        <div className="text-xl font-bold text-yellow-400">3.9</div>
        <div className="text-xs text-white/60">CGPA</div>
      </div>
      <div className="p-3 rounded-xl bg-black/40 border border-white/20 shadow-md shadow-white/5">
        <div className="text-xl font-bold text-blue-400">8+</div>
        <div className="text-xs text-white/60">Projects</div>
      </div>
      <div className="p-3 rounded-xl bg-black/40 border border-white/20 shadow-md shadow-white/5">
        <div className="text-xl font-bold text-yellow-400">3</div>
        <div className="text-xs text-white/60">Awards</div>
      </div>
    </div>
  </motion.div>

  {/* RIGHT IMAGE */}
  <motion.div 
    initial={{opacity:0,scale:0.98}} 
    animate={{opacity:1,scale:1}} 
    transition={{duration:0.6, delay:0.1}} 
    className="rounded-2xl border border-white/20 p-5 bg-black/40 shadow-xl"
  >
    <img src={AVATAR} 
         alt="avatar" 
         className="w-48 h-48 rounded-xl object-cover border-2 border-white/10 mx-auto" />
    <div className="text-center mt-4 text-sm text-white/70">
      {DUMMY.hero.location}
    </div>
    <div className="mt-4 text-xs text-white/60">
      Pro tip: Replace images/links with your own. All dummy data lives at the top.
    </div>
  </motion.div>
</section>


        {/* EDUCATION with graphs */}
        <section ref={educationRef} className="my-12 grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3 bg-white/5 p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Education Timeline</h3>
            <div className="space-y-4">
              {DUMMY.education.map((e,idx)=> (
                <div key={idx} className="grid grid-cols-5 gap-4 items-center">
                  <img src={e.img} alt={e.type} className="col-span-2 rounded-xl border border-white/10 h-28 object-cover"/>
                  <div className="col-span-3">
                    <div className="flex justify-between text-sm"><span className="font-semibold">{e.type} — {e.board}</span><span className="text-white/60">{e.year}</span></div>
                    <div className="text-sm text-white/70">{e.institute}</div>
                    <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div style={{width: `${Math.min(100, e.type==='University'? e.grade*20 : e.grade)}%`}} className="h-2 bg-yellow-400/80" />
                    </div>
                    <div className="text-xs text-white/60 mt-1">{e.type==='University'? `${e.grade} GPA` : `${e.grade}%`}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Grade Snapshot</h3>
            <div style={{height:240}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DUMMY.education.map(e=>({ name: e.type, score: e.type==='University'? Math.round(e.grade*20) : e.grade }))}>
                  <XAxis dataKey="name" stroke="#ddd" />
                  <YAxis stroke="#ddd" />
                  <Tooltip />
                  <Bar dataKey="score" barSize={22} radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* EXPERIENCE & VOLUNTEERING */}
        <section ref={experienceRef} className="my-12 grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3 bg-white/5 p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Experience & Volunteering</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 rounded-lg bg-black/40 hover:bg-white/5 transition-all duration-300">
                <div className="font-semibold">Volunteer — Tech Community</div>
                <div className="text-sm text-white/70">Organized workshops & coding competitions.</div>
              </div>
              <div className="p-4 border border-white/10 rounded-lg bg-black/40 hover:bg-white/5 transition-all duration-300">
                <div className="font-semibold">Intern — Software Company</div>
                <div className="text-sm text-white/70">Built full‑stack features, improved DX & accessibility.</div>
              </div>
              <div className="p-4 border border-white/10 rounded-lg bg-black/40 hover:bg-white/5 transition-all duration-300">
                <div className="font-semibold">Certifications</div>
                <div className="text-sm text-white/70">Courses in AI, Web Dev & Cybersecurity.</div>
              </div>
              <div className="p-4 border border-white/10 rounded-lg bg-black/40 hover:bg-white/5 transition-all duration-300">
                <div className="font-semibold">Competitions</div>
                <div className="text-sm text-white/70">Multiple hackathons with podium finishes.</div>
              </div>
            </div>
          </div>
          {/* Certifications with paging 3x2 */}
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Certifications</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {certsToShow.map(c=> (
                <div key={c.id} className="bg-black/40 rounded-md overflow-hidden border border-white/5 hover:scale-[1.05] transition-transform duration-300">
                  <img src={c.img} alt={c.title} className="w-full h-24 object-cover" />
                  <div className="p-2">
                    <div className="text-xs font-semibold truncate" title={c.title}>{c.title}</div>
                    <div className="text-[10px] text-white/60">{c.issuer}</div>
                    <a href={c.link} className="inline-flex items-center gap-1 text-[11px] mt-1 text-blue-300">View <ExternalLink size={12}/></a>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Page {certPage+1} / {totalCertPages}</span>
              <div className="flex gap-2">
                <button onClick={()=>setCertPage(p=>Math.max(0,p-1))} className="px-3 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1 hover:bg-white/10 transition-colors"><ChevronUp size={14}/>Prev</button>
                <button onClick={()=>setCertPage(p=>Math.min(totalCertPages-1,p+1))} className="px-3 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1 hover:bg-white/10 transition-colors">Next<ChevronDown size={14}/></button>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section ref={skillsRef} className="my-12 grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3 bg-white/5 p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Programming Languages</h3>
            <div className="space-y-3">
              {DUMMY.skills.languages.map(s=> (
                <div key={s.name}>
                  <div className="flex justify-between text-sm text-white/70"><div>{s.name}</div><div>{s.level}%</div></div>
                  <div className="h-3 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div style={{width:`${s.level}%`}} className="h-3 rounded-full"/>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-semibold mt-8 mb-4">Frameworks & Tools</h3>
            <div className="space-y-3">
              {DUMMY.skills.frameworks.map(s=> (
                <div key={s.name}>
                  <div className="flex justify-between text-sm text-white/70"><div>{s.name}</div><div>{s.level}%</div></div>
                  <div className="h-3 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div style={{width:`${s.level}%`}} className="h-3 rounded-full"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Pie snapshot */}
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Expertise Snapshot</h3>
            <div style={{height:260}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DUMMY.skills.categories} dataKey="pct" nameKey="name" outerRadius={90}>
                    {DUMMY.skills.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 text-xs text-white/70 space-y-1">
              {DUMMY.skills.categories.map(c=> (
                <li key={c.name} className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-white"></span>{c.name}: {c.pct}%</li>
              ))}
            </ul>
          </div>
        </section>

        {/* HOBBIES */}
        <section className="my-12">
          <h3 className="text-2xl font-semibold mb-4">Hobbies</h3>
          <div className="flex flex-wrap gap-2">
            {DUMMY.hobbies.map(h=> (
              <span key={h} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm">{h}</span>
            ))}
          </div>
        </section>

        {/* PROJECTS with vertical slider showing 2 at a time */}
        <section ref={projectsRef} className="my-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">Projects</h3>
            <div className="flex gap-2 text-sm">
              <button disabled={projIndex===0} onClick={()=>setProjIndex(i=>Math.max(0,i-1))} className="px-3 py-2 rounded border border-white/10 bg-white/5 disabled:opacity-40">Prev</button>
              <button disabled={projIndex===projMaxIndex} onClick={()=>setProjIndex(i=>Math.min(projMaxIndex,i+1))} className="px-3 py-2 rounded border border-white/10 bg-white/5 disabled:opacity-40">Next</button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {projectsToShow.map(p=> (
              <article key={p.id} className="rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:scale-[1.02] transition-transform duration-300">
                <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="text-xs text-white/60 flex gap-2 flex-wrap mb-1">{p.tags.map(t=> <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{t}</span>)}</div>
                  <h4 className="text-xl font-semibold">{p.title}</h4>
                  <p className="text-sm text-white/70 mt-1">{p.desc}</p>
                  <div className="mt-4 flex gap-2">
                    <a href={p.link} className="px-3 py-2 rounded bg-white/5 border border-white/10 inline-flex items-center gap-1 hover:bg-white/10 transition-colors">Run <ArrowRight size={14}/></a>
                    <a href={p.link} className="px-3 py-2 rounded border border-white/10 hover:bg-white/10 transition-colors">Details</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* AWARDS */}
        <section ref={awardsRef} className="my-12">
          <h3 className="text-2xl font-semibold mb-6">Awards & Honors</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.awards.map((a,i)=> (
              <div key={i} className="p-4 rounded-xl border bg-black/40 border-white/10 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-white/5"><Award/></div>
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-white/60">{a.month}</div>
                    <div className="text-sm mt-2 text-white/70">{a.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section ref={contactRef} id="contact" className="my-12 p-5 rounded-xl border border-white/10 bg-white/5">
          <h3 className="text-2xl font-semibold mb-4">Get in touch</h3>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <div className="text-sm text-white/70">Email</div>
              <a href={`mailto:${DUMMY.contacts.email}`} className="font-semibold">{DUMMY.contacts.email}</a>
              <div className="text-sm text-white/70 mt-3">Profiles</div>
              <div className="flex gap-2 mt-2">
                <a href={DUMMY.contacts.linkedin} className="inline-flex items-center gap-2 px-3 py-2 border rounded border-white/10 hover:bg-white/10 transition-colors">LinkedIn</a>
                <a href={DUMMY.contacts.github} className="inline-flex items-center gap-2 px-3 py-2 border rounded border-white/10 hover:bg-white/10 transition-colors">GitHub</a>
              </div>
            </div>
            <div className="md:col-span-2">
              <form onSubmit={(e)=>{e.preventDefault(); alert('Form submitted — plug in your endpoint.');}} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required placeholder="Your name" className="p-3 rounded bg-black/30 border border-white/10" />
                <input required type="email" placeholder="Your email" className="p-3 rounded bg-black/30 border border-white/10" />
                <input placeholder="Subject" className="p-3 rounded bg-black/30 border border-white/10 md:col-span-2" />
                <textarea placeholder="Message" className="p-3 rounded bg-black/30 border border-white/10 md:col-span-2 h-28" />
                <div className="md:col-span-2 text-right">
                  <button type="submit" className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors">Send</button>
                </div>
              </form>
            </div>
          </div>
        </section>

      </main>

      <footer className="text-center py-8 text-sm text-white/60 border-t border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-6">© {new Date().getFullYear()} {DUMMY.hero.name} — Crafted with ✨ in a starry theme.</div>
      </footer>

      {/* Minimal section accent colors via Tailwind utilities */}
      <style>{`
        .h-3 > div { background: linear-gradient(90deg, ${COLORS.yellow}, ${COLORS.blue}); }
      `}</style>
    </div>
  );
}