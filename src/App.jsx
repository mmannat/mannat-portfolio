import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import profileImg from "./assets/profile.jpg";

const API_BASE = "http://localhost:3001";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route path="/projects/qa-test-lab" element={<QATestLabPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/* =========================
   PAGES
========================= */

function PortfolioHome() {
  const [active, setActive] = useState("about");

  const sectionIds = useMemo(
    () => ["about", "education", "resume", "skills", "projects", "contact", "playground"],
    []
  );

  useEffect(() => {
    const onScroll = () => {
      const offsets = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return { id, top: Number.POSITIVE_INFINITY };
          const rect = el.getBoundingClientRect();
          return { id, top: Math.abs(rect.top - 120) };
        })
        .sort((a, b) => a.top - b.top);

      if (offsets[0]?.id) setActive(offsets[0].id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.profileWrap}>
          <div style={styles.avatarOuter}>
            <img
              src={profileImg}
              alt="Mannat"
              style={styles.avatar}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.style.background =
                  "radial-gradient(circle at 30% 30%, #9c7cff, #5a31ff)";
                e.currentTarget.parentElement.style.color = "white";
                e.currentTarget.parentElement.style.display = "flex";
                e.currentTarget.parentElement.style.alignItems = "center";
                e.currentTarget.parentElement.style.justifyContent = "center";
                e.currentTarget.parentElement.style.fontWeight = 800;
                e.currentTarget.parentElement.style.fontSize = "38px";
                e.currentTarget.parentElement.innerText = "M";
              }}
            />
          </div>
          <div style={styles.name}>MANNAT</div>
          <div style={styles.tagline}>Software • UI • QA</div>
        </div>

        <nav style={styles.nav}>
          <SideBtn label="About" active={active === "about"} onClick={() => scrollTo("about")} />
          <SideBtn
            label="Education"
            active={active === "education"}
            onClick={() => scrollTo("education")}
          />
          <SideBtn label="Skills" active={active === "skills"} onClick={() => scrollTo("skills")} />
          <SideBtn
            label="Projects"
            active={active === "projects"}
            onClick={() => scrollTo("projects")}
          />
          <SideBtn
            label="Contact"
            active={active === "contact"}
            onClick={() => scrollTo("contact")}
          />
        </nav>

        <div style={styles.sidebarFooter}>Built with React + Vite</div>
      </div>

      <div style={styles.main}>
        <div style={styles.topCard}>
          <div style={styles.heroTitle}>
            Software Engineer building web + mobile products with strong testing, debugging, and UI
            implementation skills.
          </div>

          <div style={styles.topTabs}>
            <TopTab label="Resume" active={active === "resume"} onClick={() => scrollTo("resume")} />
            <TopTab
              label="Projects"
              active={active === "projects"}
              onClick={() => scrollTo("projects")}
            />
            <TopTab
              label="Contact"
              active={active === "contact"}
              onClick={() => scrollTo("contact")}
            />
            <TopTab
              label="Playground"
              active={active === "playground"}
              onClick={() => scrollTo("playground")}
            />
          </div>
        </div>

        <Section id="about" title="About">
          <AboutCard onJump={(id) => scrollTo(id)} />
        </Section>

        <Section id="education" title="Education">
          <EducationCard />
        </Section>

        <Section id="resume" title="Resume">
          <ResumeCard />
        </Section>

        <Section id="skills" title="Skills">
          <Skills />
        </Section>

        <Section id="projects" title="Projects">
          <Projects />
        </Section>

        <Section id="contact" title="Contact">
          <Contact />
        </Section>

        <Section id="playground" title="Playground">
          <PlaygroundMini />
        </Section>
      </div>
    </div>
  );
}

/* =========================
   QA TEST LAB PAGE (ROUTE)
========================= */

function QATestLabPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("api"); // api | bugs | runs

  useEffect(() => {
    const id = "qa-lab-styles";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      .qaPage {
        position: relative;
        min-height: 100vh;
        width: 100%;
        overflow: hidden;
        background: radial-gradient(1200px 700px at 20% 15%, rgba(109,56,255,0.18), transparent 60%),
                    radial-gradient(900px 600px at 70% 10%, rgba(255,120,190,0.14), transparent 55%),
                    linear-gradient(180deg, #f6f7fb, #f1f2f9);
      }
      .qaHeroShell {
        position: relative;
        width: min(1100px, calc(100% - 44px));
        margin: 0 auto;
        border-radius: 22px;
        border: 1px solid rgba(109,56,255,0.18);
        background: linear-gradient(135deg,
          rgba(109,56,255,0.12),
          rgba(255,120,190,0.10),
          rgba(109,56,255,0.10)
        );
        background-size: 200% 200%;
        animation: qaGradientShift 10s ease-in-out infinite;
        box-shadow: 0 22px 55px rgba(109,56,255,0.10);
        overflow: hidden;
      }
      @keyframes qaGradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .qaParticles {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.85;
      }
      .qaParticle {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.12));
        filter: blur(0.2px);
        animation: qaFloat linear infinite;
      }
      @keyframes qaFloat {
        0% { transform: translate3d(0, 0, 0); opacity: 0.25; }
        20% { opacity: 0.8; }
        100% { transform: translate3d(0, -120vh, 0); opacity: 0.0; }
      }
      .qaMiniCardBtn {
        width: 100%;
        text-align: left;
        border: 1px solid rgba(109,56,255,0.14);
        background: rgba(255,255,255,0.78);
        border-radius: 18px;
        padding: 14px;
        cursor: pointer;
        box-shadow: 0 14px 30px rgba(0,0,0,0.06);
        transition: transform 160ms ease, box-shadow 180ms ease, border-color 180ms ease;
      }
      .qaMiniCardBtn:hover {
        transform: translateY(-2px);
        border-color: rgba(109,56,255,0.30);
        box-shadow:
          0 18px 40px rgba(0,0,0,0.08),
          0 0 0 6px rgba(109,56,255,0.08);
      }
      .qaMiniCardBtn[data-active="true"] {
        border-color: rgba(109,56,255,0.40);
        box-shadow:
          0 18px 42px rgba(109,56,255,0.10),
          0 0 0 6px rgba(255,120,190,0.08);
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  const details = {
    api: {
      title: "API Checks",
      subtitle: "Pass/fail + response time + contract validation",
      bullets: [
        "Health check: GET /health returns 200 and status = ok",
        "Schema validation: required fields exist and types match",
        "Response time trend: last 10 runs and average latency",
        "Negative tests: missing auth, invalid ID, malformed JSON",
      ],
    },
    bugs: {
      title: "Bug Cards",
      subtitle: "Severity, status, reproduction steps, and notes",
      bullets: [
        "Severity levels: Critical / High / Medium / Low",
        "Statuses: Open → In Progress → QA Verify → Done",
        "Each card has reproducible steps + expected vs actual",
        "Includes regression tag and environment details",
      ],
    },
    runs: {
      title: "Automation Runs",
      subtitle: "Suite history + duration + failures snapshot",
      bullets: [
        "Recent runs table: suite name, duration, result",
        "Failing tests show error message snippet",
        "Trend: pass rate over time and flaky test detection",
        "Artifacts: logs + screenshots links (later)",
      ],
    },
  };

  return (
    <div className="qaPage">
      <div className="qaParticles">
        {Array.from({ length: 16 }).map((_, i) => {
          const left = (i * 7) % 100;
          const size = 6 + (i % 6) * 2;
          const dur = 10 + (i % 6) * 3;
          const delay = (i % 7) * -1.2;
          const top = 60 + (i % 6) * 12;
          return (
            <div
              key={i}
              className="qaParticle"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      <div style={styles.qaPageInner}>
        <div style={styles.qaPageTop}>
          <button style={styles.secondaryBtn} onClick={() => navigate("/")}>
            ← Back to Portfolio
          </button>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a style={styles.primaryBtn} href="https://github.com/mmannat" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              style={styles.secondaryBtn}
              href="https://www.linkedin.com/in/mannat-mannat-b343b3229/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="qaHeroShell">
          <div style={styles.qaHeroInner}>
            <div style={styles.qaHeroTitle}>QA Test Lab</div>
            <div style={styles.qaHeroSub}>
              A mini case-study page to demonstrate my QA thinking through API checks, bug reporting,
              and automation run history.
            </div>

            <div style={styles.qaHeroGrid}>
              <button className="qaMiniCardBtn" data-active={active === "api"} onClick={() => setActive("api")}>
                <div style={styles.qaMiniTitle}>API Checks</div>
                <div style={styles.qaMiniBody}>Pass/Fail results + response time trend.</div>
              </button>

              <button className="qaMiniCardBtn" data-active={active === "bugs"} onClick={() => setActive("bugs")}>
                <div style={styles.qaMiniTitle}>Bug Cards</div>
                <div style={styles.qaMiniBody}>Severity, status, and reproduction steps.</div>
              </button>

              <button className="qaMiniCardBtn" data-active={active === "runs"} onClick={() => setActive("runs")}>
                <div style={styles.qaMiniTitle}>Automation Runs</div>
                <div style={styles.qaMiniBody}>Recent suites, duration, and failures.</div>
              </button>
            </div>

            <div style={styles.qaDetailsCard}>
              <div style={styles.qaDetailsTop}>
                <div style={styles.qaDetailsTitle}>{details[active].title}</div>
                <div style={styles.qaDetailsSub}>{details[active].subtitle}</div>
              </div>

              <ul style={styles.qaDetailsList}>
                {details[active].bullets.map((b) => (
                  <li key={b} style={styles.qaDetailsLi}>
                    {b}
                  </li>
                ))}
              </ul>

              <div style={styles.qaNote}>
                (Next upgrades: real data + charts + “Run details” drawer + exportable report PDF)
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 26 }} />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 30, fontFamily: "system-ui" }}>
      <h2>Page not found</h2>
      <Link to="/">Go home</Link>
    </div>
  );
}

/* =========================
   BUILDING BLOCKS
========================= */

function SideBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.sideBtn, ...(active ? styles.sideBtnActive : null) }}>
      {label}
    </button>
  );
}

function TopTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.topTab, ...(active ? styles.topTabActive : null) }}>
      {label}
    </button>
  );
}

function Section({ id, title, children }) {
  return (
    <div id={id} style={styles.sectionCard}>
      <div style={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

/* =========================
   ABOUT
========================= */

function AboutCard({ onJump }) {
  return (
    <div style={styles.aboutGrid}>
      <div style={styles.aboutLeft}>
        <div style={styles.aboutHeadline}>Hi, I’m Mannat 👋</div>

        <div style={styles.aboutText}>
          Hands-on experience across multiple types of QA testing and team collaboration, paired with
          strong problem-solving, communication, and adaptability, consistently leads to high-quality
          releases and reliable user experiences.
        </div>

        <div style={styles.aboutText}>
          I’m experienced in writing comprehensive test plans, designing clear procedures, and executing embedded,
          system, and integration tests. I’m highly accountable, detail-oriented, and I bring a calm, structured
          approach to debugging and validation.
        </div>

        <div style={styles.aboutPillsRow}>
          <Pill text="QA & Test Automation" />
          <Pill text="API Testing" />
          <Pill text="Mobile Testing" />
          <Pill text="UI Implementation" />
        </div>

        <div style={styles.aboutCtas}>
          <button style={styles.primaryBtn} onClick={() => onJump("projects")}>
            See Projects
          </button>
          <button style={styles.secondaryBtn} onClick={() => onJump("contact")}>
            Contact Me
          </button>
        </div>
      </div>

      <div style={styles.aboutRight}>
        <div style={styles.fancyCard}>
          <div style={styles.fancyTitle}>What I bring</div>
          <ul style={styles.fancyList}>
            <li>Fast, structured debugging using logs, breakpoints, and stack traces</li>
            <li>Strong test thinking with edge cases and stable regression coverage</li>
            <li>Clean documentation: test plans, checklists, and reproducible bug reports</li>
            <li>UI/UX attention to flow, clarity, and consistency</li>
          </ul>
          <div style={styles.fancyHint}>Scroll down to explore sections.</div>
        </div>
      </div>
    </div>
  );
}

function Pill({ text }) {
  return <span style={styles.pill}>{text}</span>;
}

/* =========================
   EDUCATION
========================= */

function EducationCard() {
  const focus = [
    { label: "Web Development", icon: "🌐" },
    { label: "Generative AI", icon: "✨" },
    { label: "AI", icon: "🤖" },
    { label: "Mobile Programming", icon: "📱" },
    { label: "Graphic Designing", icon: "🎨" },
  ];

  return (
    <div style={styles.eduWrap}>
      <div style={styles.eduCard}>
        <div style={styles.eduTop}>
          <div style={styles.eduLeftTop}>
            <div style={styles.eduCapRow}>
              <div style={styles.eduCapIcon}>🎓</div>
              <div style={styles.eduBadge}>CSUEB</div>
            </div>

            <div style={styles.eduSchool}>California State University, East Bay</div>
            <div style={styles.eduDegree}>Bachelor of Science in Computer Science</div>
          </div>

          <div style={styles.eduDatePill}>Graduated • December 2025</div>
        </div>

        <div style={styles.eduDivider} />

        <div style={styles.eduGrid}>
          <div style={styles.eduMini}>
            <div style={styles.eduMiniLabel}>Focus Areas</div>

            <div style={styles.eduChips}>
              {focus.map((f) => (
                <div key={f.label} style={styles.eduChip}>
                  <span style={{ fontSize: 16 }}>{f.icon}</span>
                  <span style={styles.eduChipText}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.eduMini}>
            <div style={styles.eduMiniLabel}>Highlights</div>
            <div style={styles.eduMiniText}>
              Built strong fundamentals in software engineering and problem-solving while working on projects across
              web development, mobile programming, and design. Currently expanding my skills in AI and Generative AI
              with a focus on practical, portfolio-ready applications.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   RESUME (FIXED)
========================= */

function ResumeCard() {
  return (
    <div style={styles.resumeWrap}>
      <div style={styles.resumeLeft}>
        <div style={styles.resumeTitle}>Open my resume</div>
        <div style={styles.resumeText}>
          Served from <b>/public/resume.pdf</b>.
        </div>

        <a
  href={`${import.meta.env.BASE_URL}resume.pdf`}
  target="_blank"
  rel="noopener noreferrer"
  style={{ textDecoration: "none" }}
>
  <button style={styles.resumeBtn}>
    View Resume PDF →
  </button>
</a>

        <div style={styles.noteSmall}>
          If you still see a blank PDF: right-click <b>public/resume.pdf</b> in VS Code → “Reveal in Finder” → open it.
          If it’s blank there too, the file is empty/corrupted and needs re-export.
        </div>
      </div>

      <div style={styles.resumePreview}>
        <div style={styles.previewTop}>Quick Snapshot</div>
        <div style={styles.previewRow}>
          <span style={styles.previewKey}>Focus</span>
          <span style={styles.previewVal}>QA • Automation • Mobile + Web</span>
        </div>
        <div style={styles.previewRow}>
          <span style={styles.previewKey}>Tools</span>
          <span style={styles.previewVal}>Selenium • REST Assured • Postman • Appium</span>
        </div>
        <div style={styles.previewRow}>
          <span style={styles.previewKey}>Databases</span>
          <span style={styles.previewVal}>MySQL • MongoDB</span>
        </div>
      </div>
    </div>
  );
}


/* =========================
   SKILLS
========================= */

function Skills() {
  useEffect(() => {
    const id = "devicon-css";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css";
    document.head.appendChild(link);
  }, []);

  const groups = [
    {
      title: "Languages",
      items: [
        { label: "Java", icon: "devicon-java-plain" },
        { label: "Kotlin", icon: "devicon-kotlin-plain" },
        { label: "Python", icon: "devicon-python-plain" },
        { label: "C++", icon: "devicon-cplusplus-plain" },
      ],
    },
    {
      title: "Test Automation",
      items: [
        { label: "Selenium", icon: "devicon-selenium-original" },
        { label: "REST Assured", icon: "devicon-java-plain" },
        { label: "TestNG", icon: "devicon-java-plain" },
        { label: "Appium", icon: "devicon-android-plain" },
      ],
    },
    {
      title: "API Testing",
      items: [
        { label: "REST APIs", icon: "devicon-nodejs-plain" },
        { label: "Postman", icon: "devicon-postman-plain" },
        { label: "Newman", icon: "devicon-nodejs-plain" },
        { label: "JSON validation", icon: "devicon-javascript-plain" },
      ],
    },
    {
      title: "Databases",
      items: [
        { label: "MySQL", icon: "devicon-mysql-original" },
        { label: "MongoDB", icon: "devicon-mongodb-plain" },
      ],
    },
    {
      title: "UI/UX & Design",
      items: [
        { label: "Figma", icon: "devicon-figma-plain" },
        { label: "Adobe Express", icon: "devicon-photoshop-plain" },
        { label: "Adobe XD", icon: "devicon-xd-plain" },
        { label: "Canva", icon: "devicon-canva-original" },
      ],
    },
  ];

  return (
    <div style={styles.skillsWrap}>
      {groups.map((g) => (
        <div key={g.title} style={styles.skillGroup}>
          <div style={styles.skillGroupTitle}>{g.title}</div>
          <div style={styles.skillGrid}>
            {g.items.map((it) => (
              <div key={it.label} style={styles.skillTile}>
                <div style={styles.skillIconWrap}>
                  <i className={it.icon} style={styles.skillIcon} />
                </div>
                <div style={styles.skillLabel}>{it.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}




/* =========================
   PROJECTS
========================= */

function Projects() {
  const navigate = useNavigate();

  const items = [
    {
      name: "QA Test Lab (interactive)",
      lang: "QA / Automation",
      desc: "Mini case-study page showing API checks, bug cards, and automation run history.",
      onClick: () => navigate("/projects/qa-test-lab"),
      internal: true,
    },
    {
      name: "Student-Database-Management-System",
      lang: "C++",
      desc: "Student database management system (C++).",
      href: "https://github.com/mmannat/Student-Database-Management-System",
    },
    {
      name: "tic-tac-toe-game",
      lang: "Python",
      desc: "Tic-tac-toe game (Python).",
      href: "https://github.com/mmannat/tic-tac-toe-game",
    },
    {
      name: "android-zoo-directory",
      lang: "Java",
      desc: "Android Zoo Directory app with list + detail screens (course project, cleaned for portfolio).",
      href: "https://github.com/mmannat/android-zoo-directory",
    },
  ];

  return (
    <div style={styles.projectsWrap}>
      <div style={styles.projectsHint}>
        Click a project to open it. The “QA Test Lab” card opens a mini case-study page inside this
        portfolio.
      </div>

      <div style={styles.projectsGrid}>
        {items.map((p) => {
          if (p.internal) {
            return (
              <button
                key={p.name}
                onClick={p.onClick}
                style={{ ...styles.projectCard, textAlign: "left", cursor: "pointer" }}
              >
                <div style={styles.projectTop}>
                  <div style={styles.projectName}>{p.name}</div>
                  <div style={styles.projectPill}>{p.lang}</div>
                </div>
                <div style={styles.projectDesc}>{p.desc}</div>
                <div style={styles.projectLink}>Open case study →</div>
              </button>
            );
          }

          return (
            <a key={p.name} href={p.href} target="_blank" rel="noreferrer" style={styles.projectCard}>
              <div style={styles.projectTop}>
                <div style={styles.projectName}>{p.name}</div>
                <div style={styles.projectPill}>{p.lang}</div>
              </div>
              <div style={styles.projectDesc}>{p.desc}</div>
              <div style={styles.projectLink}>Open on GitHub →</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   CONTACT
========================= */

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const [errMsg, setErrMsg] = useState("");

  const send = async () => {
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setStatus("err");
      setErrMsg(e.message || "Error");
    }
  };

  return (
    <div style={styles.contactGrid}>
      <div style={styles.reachCard}>
        <div style={styles.reachTitle}>Reach me</div>

        <div style={styles.reachRow}>
          <div style={styles.reachKey}>Email:</div>
          <a style={styles.reachLink} href="mailto:mmannat313@gmail.com">
            mmannat313@gmail.com
          </a>
        </div>

        <div style={styles.reachRow}>
          <div style={styles.reachKey}>Location:</div>
          <div style={styles.reachVal}>Hayward, CA</div>
        </div>

        <div style={styles.reachDivider} />

        <div style={styles.reachBtns}>
          <a href="https://github.com/mmannat" target="_blank" rel="noreferrer" style={{ ...styles.primaryBtn, textDecoration: "none" }}>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/mannat-mannat-b343b3229/"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.secondaryBtn, textDecoration: "none" }}
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div style={styles.formCard}>
        <div style={styles.formTitle}>Send a message</div>

        <div style={styles.formRow}>
          <div style={styles.field}>
            <div style={styles.label}>Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={styles.input} />
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Email</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={styles.input} />
          </div>
        </div>

        <div style={styles.field}>
          <div style={styles.label}>Message</div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." style={styles.textarea} />
        </div>

        <div style={styles.formBottom}>
          <button
            onClick={send}
            style={{
              ...styles.primaryBtn,
              opacity: status === "sending" ? 0.7 : 1,
              pointerEvents: status === "sending" ? "none" : "auto",
            }}
          >
            {status === "sending" ? "Sending..." : "Send"}
          </button>

          {status === "ok" && <div style={styles.okPill}>Message sent ✅</div>}
          {status === "err" && <div style={styles.errPill}>Error: {errMsg}</div>}
        </div>

        <div style={styles.noteSmall}>
          Keep your API running: backend on <b>3001</b>, frontend on your Vite port.
        </div>
      </div>
    </div>
  );
}

/* =========================
   PLAYGROUND (MINI ARCADE)
========================= */

function PlaygroundMini() {
  const [mode, setMode] = useState("reaction"); // reaction | typing

  const tab = (label, key, icon) => (
    <button
      onClick={() => setMode(key)}
      style={{
        ...styles.pgModeTab,
        ...(mode === key ? styles.pgModeTabActive : null),
      }}
    >
      <span style={{ marginRight: 8 }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div style={styles.pgWrap}>
      <div style={styles.pgTopRow}>
        <div>
          <div style={styles.pgTitle}>Mini Arcade</div>
          <div style={styles.pgSub}>
            Pick a game, enter your name, and play. Your score only shows on the leaderboard if you
            choose to share it.
          </div>
        </div>

        <div style={styles.pgModeTabs}>
          {tab("Reaction Speed", "reaction", "⚡")}
          {tab("Typing PRO", "typing", "⌨️")}
        </div>
      </div>

      {mode === "reaction" && <ReactionSpeedGame />}
      {mode === "typing" && <TypingProGame />}
    </div>
  );
}

/* =========================
   LEADERBOARD HELPERS
========================= */

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function clampName(name) {
  const n = (name || "").trim();
  if (!n) return "Player";
  return n.length > 18 ? n.slice(0, 18) : n;
}

function prettyMs(ms) {
  return `${ms} ms`;
}

function prettyWpm(wpm) {
  return `${wpm} WPM`;
}

function rankOf(list, predicate) {
  const idx = list.findIndex(predicate);
  return idx >= 0 ? idx + 1 : null;
}

function Medal({ rank }) {
  if (rank === 1) return <span title="1st">🥇</span>;
  if (rank === 2) return <span title="2nd">🥈</span>;
  if (rank === 3) return <span title="3rd">🥉</span>;
  return <span style={{ opacity: 0.7 }}>🏁</span>;
}

/* =========================
   REACTION SPEED GAME (UPGRADED)
========================= */


/* ---------- Part 1 (updated visuals): ReactionSpeedGame ---------- */
function ReactionSpeedGame() {
  const ROUNDS = 5; // number of rounds per play
  const [round, setRound] = React.useState(0);
  const [state, setState] = React.useState("idle"); // idle | waiting | go | result
  const [message, setMessage] = React.useState("Click Start to begin the multi-round reaction challenge.");
  const [startAt, setStartAt] = React.useState(null);
  const [times, setTimes] = React.useState([]); // recorded ms each round
  const [resultMs, setResultMs] = React.useState(null);
  const [bestMs, setBestMs] = React.useState(() => {
    try {
      const raw = localStorage.getItem("mannat_reaction_best");
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  });
  const [leaderboard, setLeaderboard] = React.useState(() => {
    try {
      const raw = localStorage.getItem("mannat_reaction_leaderboard");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [name, setName] = React.useState(() => localStorage.getItem("mannat_player_name") || "");

  // prepare random delay when entering waiting state
  React.useEffect(() => {
    let t = null;
    if (state === "waiting") {
      const delay = 700 + Math.floor(Math.random() * 1600);
      t = setTimeout(() => {
        setState("go");
        setMessage("GO! Click now!");
        setStartAt(performance.now());
      }, delay);
    }
    return () => clearTimeout(t);
  }, [state]);

  const start = () => {
    if (!name.trim()) {
      alert("Please enter your name so your score is saved.");
      return;
    }
    localStorage.setItem("mannat_player_name", name);
    setRound(0);
    setTimes([]);
    setResultMs(null);
    setMessage("Get ready for round 1...");
    // small pause then enter waiting to start first round
    setTimeout(() => setState("waiting"), 250);
  };

  const onClickPad = () => {
    if (state === "idle") return;
    if (state === "waiting") {
      // early click -> big penalty for the round
      setState("result");
      setMessage("Too soon — round lost. Next round starting...");
      setTimes((t) => [...t, 9999]); // penalty flag
      setTimeout(() => nextRound(), 800);
      return;
    }
    if (state === "go") {
      const ms = Math.max(1, Math.round(performance.now() - startAt));
      setTimes((t) => [...t, ms]);
      setMessage(`Round ${round + 1} recorded: ${ms} ms`);
      setState("result");
      setTimeout(() => nextRound(), 700);
      return;
    }
  };

  const nextRound = () => {
    const next = round + 1;
    if (next >= ROUNDS) {
      // finish
      const finalTimes = times.slice();
      const valid = finalTimes.filter((x) => x < 9999);
      const avg = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 9999;
      setResultMs(avg);
      setMessage(`Finished ${ROUNDS} rounds — average ${avg} ms.`);
      setState("idle");
      // update best if improved
      if (!bestMs || avg < bestMs) {
        try {
          localStorage.setItem("mannat_reaction_best", String(avg));
        } catch {}
        setBestMs(avg);
      }
      return;
    }
    // prepare next round
    setRound(next);
    setMessage(`Get ready for round ${next + 1}...`);
    setState("waiting");
  };

  const shareScore = async () => {
    if (!resultMs) return;
    const text = `${name} scored ${resultMs} ms average on the Reaction Challenge (${ROUNDS} rounds).`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        alert("Score copied to clipboard ✅");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveToLeaderboard = () => {
    if (!resultMs) {
      alert("No score to save yet.");
      return;
    }
    const item = { id: `r_${Date.now()}`, name: name || "Player", ms: resultMs, at: new Date().toISOString() };
    const next = [item, ...leaderboard].sort((a, b) => a.ms - b.ms).slice(0, 8);
    setLeaderboard(next);
    try {
      localStorage.setItem("mannat_reaction_leaderboard", JSON.stringify(next));
    } catch {}
    alert("Saved to leaderboard ✅");
  };

  // styles: adjusted for rectangular READY pad and larger Start button
  const padBase = {
    padding: "18px 28px",        // more rectangular feel
    minWidth: 220,               // wider rectangular
    minHeight: 96,               // not too tall — rectangular panel
    borderRadius: 14,
    fontSize: 26,
    fontWeight: 900,
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  };
  const padGo = { background: "#28c76f", color: "#04221b", boxShadow: "0 18px 40px rgba(40,199,111,0.12)" };
  const padWait = { background: "#f6c642", color: "#3b2f00", boxShadow: "0 14px 36px rgba(246,198,66,0.08)" };
  const padIdle = { background: "#eef1f6", color: "#0b1220", boxShadow: "0 12px 30px rgba(16,24,40,0.04)" };

  const padStyle = state === "go" ? { ...padBase, ...padGo } : state === "waiting" ? { ...padBase, ...padWait } : { ...padBase, ...padIdle };

  // Start button style: bigger + light green to be eye-catching
  const startBtnStyle = {
    padding: "12px 18px",
    borderRadius: 12,
    background: "linear-gradient(90deg,#6ee7b7,#32d583)",
    color: "#04221b",
    fontWeight: 900,
    fontSize: 16,
    border: "none",
    boxShadow: "0 10px 28px rgba(50,213,131,0.18)",
    cursor: "pointer",
  };

  return (
    <div style={{ borderRadius: 12, padding: 18, background: "white", border: "1px solid rgba(20,20,40,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ background: "#ffeaa7", padding: "6px 10px", borderRadius: 8, fontSize: 18 }}>⚡</span>
            <span>Reaction Challenge — {ROUNDS} rounds</span>
          </div>
          <div style={{ color: "#5a5f72", marginTop: 6, maxWidth: 520 }}>
            Play {ROUNDS} rounds. Final score = average reaction time (ms). Early clicks penalize the round.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ textAlign: "right", marginRight: 6 }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Personal Best</div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{bestMs ? `${bestMs} ms` : "—"}</div>
          </div>

          <input
            placeholder="Player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, fontWeight: 800, border: "1px solid #e6e6e9" }}
          />
          <button onClick={start} style={startBtnStyle}>
            Start
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div onClick={onClickPad} style={padStyle}>
            {state === "go" ? "Click!" : state === "waiting" ? "Wait..." : "Ready"}
          </div>
        </div>

        <div style={{ width: 320 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Round</div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>{Math.min(round + 1, ROUNDS)} / {ROUNDS}</div>

          <div style={{ marginTop: 8, color: "#333", fontWeight: 700 }}>{message}</div>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button onClick={shareScore} disabled={!resultMs} style={{ padding: "8px 10px", borderRadius: 8 }}>
              Share Score
            </button>
            <button onClick={saveToLeaderboard} disabled={!resultMs} style={{ padding: "8px 10px", borderRadius: 8, background: "#6d38ff", color: "white" }}>
              Save to Leaderboard
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, borderRadius: 8, padding: 10, background: "#fbfbfd", border: "1px solid rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Recent times</div>
          <div style={{ marginTop: 8 }}>
            {times.length === 0 ? (
              <div style={{ color: "#9aa0ad" }}>No rounds yet.</div>
            ) : (
              times.map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <div>Round {i + 1}</div>
                  <div style={{ fontWeight: 900 }}>{t >= 9999 ? "F (fast click)" : `${t} ms`}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ width: 260, borderRadius: 8, padding: 10, background: "#fbfbfd", border: "1px solid rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Leaderboard (local)</div>
          <div style={{ marginTop: 8 }}>
            {leaderboard.length === 0 ? (
              <div style={{ color: "#9aa0ad" }}>No scores yet — be the first!</div>
            ) : (
              leaderboard.map((it, idx) => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <div style={{ fontWeight: 900 }}>#{idx + 1} {it.name}</div>
                  <div>{it.ms} ms</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




/* =========================
   TYPING PRO GAME (UPGRADED)
========================= */



/* =========================
   TYPING PRO GAME — FINAL (REAL WPM + LOCAL + PUBLIC SHARE)
   Requires backend endpoints:
     GET  /api/typing-scores?duration=15|30|60
     POST /api/typing-scores   { name, duration, netWpm, grossWpm, accuracy }
========================= */

function TypingProGame() {
  const SENTENCES = React.useMemo(
    () => [
      "Write tests like your future self will thank you.",
      "Fast feedback saves hours of debugging later.",
      "Make small, incremental changes and test often.",
      "Readable code is maintainable code.",
      "Good tests document intent, not implementation.",
      "Quality is never an accident; it is always the result of effort.",
      "Ship small, learn fast, and iterate with confidence.",
      "A bug fixed early is a feature delivered on time.",
    ],
    []
  );

  const TIMER_OPTIONS = [15, 30, 60];

  // uses your existing API_BASE constant from the file:
  // const API_BASE = "http://localhost:3001";

  const LOCAL_KEY = "mannat_typing_local_v1";

  const [name, setName] = React.useState(() => localStorage.getItem("mannat_player_name") || "");
  const [duration, setDuration] = React.useState(30);

  const [running, setRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30);

  const [target, setTarget] = React.useState(() => SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
  const [typed, setTyped] = React.useState("");

  const [results, setResults] = React.useState(null); // { netWpm, grossWpm, accuracy, localRank, publicRank? }
  const [showBanner, setShowBanner] = React.useState(false);

  // local leaderboard per duration
  const [localBoards, setLocalBoards] = React.useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // public leaderboard per duration
  const [publicBoards, setPublicBoards] = React.useState({}); // { t30: [...] }
  const [publicStatus, setPublicStatus] = React.useState("idle"); // idle | loading | ok | err
  const [publicErr, setPublicErr] = React.useState("");

  // fun toggles
  const [soundOn, setSoundOn] = React.useState(() => {
    try {
      return localStorage.getItem("mannat_tp_sound") === "1";
    } catch {
      return false;
    }
  });
  const [confettiOn, setConfettiOn] = React.useState(() => {
    try {
      const v = localStorage.getItem("mannat_tp_confetti");
      return v === null ? true : v === "1";
    } catch {
      return true;
    }
  });

  // refs
  const startRef = React.useRef(0);
  const rafRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const stoppingRef = React.useRef(false);

  // tiny click sound
  const audioRef = React.useRef(null);
  function playClick() {
    if (!soundOn || !running) return;
    try {
      if (!audioRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioRef.current = new AudioCtx();
      }
      const ctx = audioRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 520;
      g.gain.value = 0.03;

      o.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.03, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      o.start(now);
      o.stop(now + 0.035);
    } catch {}
  }

  // cleanup on unmount
  React.useEffect(() => {
    return () => {
      try {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } catch {}
    };
  }, []);

  // keep timeLeft in sync when duration changes (only if not running)
  React.useEffect(() => {
    if (!running) setTimeLeft(duration);
  }, [duration, running]);

  function pickSentence() {
    return SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  }

  // Accuracy uses cleaned strings (punctuation ignored, spaces normalized, case-insensitive)
  const clean = (s) =>
    (s || "")
      .replace(/\r\n/g, "\n")
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'[\]\\|<>@+]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  // REAL stats:
  // grossWPM = rawTypedChars/5/minutes
  // accuracy = correct(cleaned)/typed(cleaned)
  // netWPM = grossWPM * (accuracy/100)
  function computeStats(finalTyped, elapsedSeconds) {
    const rawTyped = (finalTyped || "").replace(/\r\n/g, "\n");
    const elapsed = Math.max(0.001, elapsedSeconds || duration);
    const minutes = elapsed / 60;

    const t = clean(rawTyped);
    const tar = clean(target);

    let correct = 0;
    const n = Math.min(t.length, tar.length);
    for (let i = 0; i < n; i++) if (t[i] === tar[i]) correct++;

    const typedForSpeed = rawTyped.length;
    const typedForAccuracy = t.length;

    const accuracy = typedForAccuracy === 0 ? 0 : Math.round((correct / typedForAccuracy) * 100);
    const grossWpm = typedForSpeed === 0 ? 0 : Math.round((typedForSpeed / 5) / minutes);
    const netWpm = Math.max(0, Math.round(grossWpm * (accuracy / 100)));

    return { grossWpm, netWpm, accuracy };
  }

  // rAF timer loop (smooth + reliable)
  React.useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const left = Math.max(0, duration - elapsed);
      setTimeLeft(left);

      if (left <= 0) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        stopRound(true); // finished
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, duration]);

  function startRound() {
    if (!name.trim()) {
      alert("Please enter your name before starting.");
      return;
    }
    localStorage.setItem("mannat_player_name", name);

    stoppingRef.current = false;
    setResults(null);
    setShowBanner(false);

    setTarget(pickSentence());
    setTyped("");

    setRunning(true);
    startRef.current = performance.now();
    setTimeLeft(duration);

    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function stopRound(finished) {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    setTimeout(() => (stoppingRef.current = false), 0);

    const elapsed = Math.max(0.001, (performance.now() - startRef.current) / 1000);
    const usedElapsed = finished ? duration : Math.min(duration, elapsed);

    setRunning(false);

    const stats = computeStats(typed, usedElapsed);

    // estimate local rank if saved
    const key = `t${duration}`;
    const local = (localBoards && localBoards[key]) || [];
    const player = clampName(name);

    const hypothetical = [...local, { name: player, netWpm: stats.netWpm, accuracy: stats.accuracy }]
      .sort((a, b) => b.netWpm - a.netWpm || b.accuracy - a.accuracy);

    const localRank =
      hypothetical.findIndex((x) => x.name === player && x.netWpm === stats.netWpm && x.accuracy === stats.accuracy) + 1;

    setResults({
      netWpm: stats.netWpm,
      grossWpm: stats.grossWpm,
      accuracy: stats.accuracy,
      localRank,
    });
    setShowBanner(true);
  }

  function clampName(n) {
    const s = (n || "").trim();
    if (!s) return "Player";
    return s.length > 18 ? s.slice(0, 18) : s;
  }

  // live stats while running
  const liveStats = React.useMemo(() => {
    if (!running) return { grossWpm: 0, netWpm: 0, accuracy: 0 };
    const elapsed = Math.max(0.001, duration - timeLeft);
    return computeStats(typed, elapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, timeLeft, running, duration, target]);

  // confetti
  const [confettiBurst, setConfettiBurst] = React.useState(0);
  function popConfetti() {
    if (!confettiOn) return;
    setConfettiBurst((x) => x + 1);
  }

  // save locally (always available)
  function saveLocal() {
    if (!results) return;

    const key = `t${duration}`;
    const prev = (localBoards && localBoards[key]) || [];
    const item = {
      id: `loc_${Date.now()}`,
      name: clampName(name),
      netWpm: results.netWpm,
      grossWpm: results.grossWpm,
      accuracy: results.accuracy,
      when: new Date().toISOString(),
    };

    const merged = [...prev, item]
      .sort((a, b) => b.netWpm - a.netWpm || b.accuracy - a.accuracy)
      .slice(0, 10);

    const next = { ...(localBoards || {}), [key]: merged };
    setLocalBoards(next);
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    } catch {}

    const rank = merged.findIndex((x) => x.id === item.id) + 1;
    if (rank > 0 && rank <= 3) popConfetti();

    alert(rank > 0 && rank <= 3 ? `Saved locally ✅ NEW TOP ${rank}! 🎉` : "Saved locally ✅");
  }

  // fetch public leaderboard for selected duration
  React.useEffect(() => {
    let alive = true;
    async function loadPublic() {
      setPublicStatus("loading");
      setPublicErr("");
      try {
        const res = await fetch(`${API_BASE}/api/typing-scores?duration=${duration}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load public leaderboard");
        if (!alive) return;

        const key = `t${duration}`;
        setPublicBoards((p) => ({ ...(p || {}), [key]: data.top || [] }));
        setPublicStatus("ok");
      } catch (e) {
        if (!alive) return;
        setPublicStatus("err");
        setPublicErr(e.message || "Error");
      }
    }
    loadPublic();
    return () => {
      alive = false;
    };
  }, [duration]);

  // share publicly (posts to backend)
  async function sharePublic() {
    if (!results) return;

    const payload = {
      name: clampName(name),
      duration,
      netWpm: results.netWpm,
      grossWpm: results.grossWpm,
      accuracy: results.accuracy,
    };

    try {
      const res = await fetch(`${API_BASE}/api/typing-scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to share publicly");

      // refresh public board after saving
      const res2 = await fetch(`${API_BASE}/api/typing-scores?duration=${duration}`);
      const data2 = await res2.json().catch(() => ({}));
      const key = `t${duration}`;
      setPublicBoards((p) => ({ ...(p || {}), [key]: data2.top || [] }));

      // confetti if you made top 3 (public)
      const rank = (data2.top || []).findIndex((x) => x.name === payload.name && x.netWpm === payload.netWpm) + 1;
      if (rank > 0 && rank <= 3) popConfetti();

      alert("Shared publicly ✅");
    } catch (e) {
      alert(`Public share failed: ${e.message || "Error"}`);
    }
  }

  async function shareText() {
    if (!results) return;
    const player = clampName(name);
    const text = `${player} scored ${results.netWpm} WPM (gross ${results.grossWpm}) at ${results.accuracy}% accuracy on Typing PRO (${duration}s).`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard ✅");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard ✅");
      } catch {
        alert(text);
      }
    }
  }

  const progressPct = Math.max(0, Math.min(100, (timeLeft / duration) * 100));
  const key = `t${duration}`;
  const localTop = (localBoards && localBoards[key]) || [];
  const publicTop = (publicBoards && publicBoards[key]) || [];

  const ui = {
    container: {
      borderRadius: 12,
      padding: 18,
      background: "white",
      border: "1px solid rgba(20,20,40,0.04)",
      position: "relative",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
      flexWrap: "wrap",
    },
    timerBox: {
      width: 220,
      textAlign: "center",
      padding: 16,
      borderRadius: 12,
      background: "linear-gradient(180deg,#0b0f1a,#0f1624)",
      color: "white",
    },
    progress: {
      height: 12,
      borderRadius: 12,
      background: "rgba(255,255,255,0.08)",
      overflow: "hidden",
      marginTop: 12,
    },
    progressInner: {
      height: 12,
      width: `${progressPct}%`,
      borderRadius: 12,
      transition: "width 80ms linear",
      background: "linear-gradient(90deg,#7c3aed,#f472b6)",
    },
    target: {
      borderRadius: 12,
      padding: 16,
      background: "#0b0f14",
      color: "#e6faf0",
      minHeight: 120,
      fontFamily: "monospace",
      fontSize: 16,
      position: "relative",
      overflow: "hidden",
    },
    card: {
      borderRadius: 12,
      padding: 12,
      background: "#fbfbfd",
      border: "1px solid rgba(0,0,0,0.02)",
    },
    inputWrap: {
      marginTop: 12,
      borderRadius: 16,
      padding: 14,
      border: running ? "1px solid rgba(109,56,255,0.35)" : "1px solid rgba(20,20,40,0.10)",
      background: running
        ? "linear-gradient(180deg, rgba(109,56,255,0.08), rgba(255,120,190,0.05))"
        : "linear-gradient(180deg, rgba(20,20,40,0.02), rgba(20,20,40,0.01))",
      boxShadow: running
        ? "0 18px 40px rgba(109,56,255,0.12), 0 0 0 6px rgba(255,120,190,0.06)"
        : "0 14px 34px rgba(0,0,0,0.04)",
    },
    textarea: {
      width: "100%",
      height: 160,
      borderRadius: 14,
      padding: 14,
      fontFamily: "monospace",
      fontSize: 16,
      border: running ? "1px solid rgba(109,56,255,0.28)" : "1px solid rgba(10,10,20,0.06)",
      outline: "none",
      background: "rgba(255,255,255,0.92)",
      boxShadow: running ? "0 0 0 4px rgba(109,56,255,0.08)" : "none",
      resize: "vertical",
      opacity: running ? 1 : 0.85,
    },
    pill: {
      padding: "8px 10px",
      borderRadius: 999,
      background: "rgba(109,56,255,0.12)",
      border: "1px solid rgba(109,56,255,0.18)",
      fontWeight: 900,
      color: "#3b1ec8",
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      userSelect: "none",
    },
    banner: {
      marginTop: 18,
      borderRadius: 12,
      padding: 18,
      background: "linear-gradient(180deg,#fdeff9,#f3e8ff)",
      border: "1px solid rgba(125,42,255,0.08)",
    },
  };

  return (
    <div style={ui.container}>
      <style>
        {`
          @keyframes targetPulse { 0% { opacity: 0.06 } 50% { opacity: 0.14 } 100% { opacity: 0.06 } }
          .tp-correct { background: rgba(34,197,94,0.18); padding: 2px 6px; border-radius: 4px; color: #e9fff0; }
          .tp-incorrect { background: rgba(248,113,113,0.14); padding: 2px 6px; border-radius: 4px; color: #fff1f1; }

          @keyframes confettiFall {
            0% { transform: translate3d(var(--x), -20px, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(calc(var(--x) + var(--drift)), 620px, 0) rotate(520deg); opacity: 0; }
          }
          .confetti {
            position: absolute;
            top: -20px;
            width: 10px;
            height: 14px;
            border-radius: 3px;
            background: linear-gradient(180deg, rgba(109,56,255,0.95), rgba(255,120,190,0.9));
            animation: confettiFall 1.2s ease-in forwards;
            filter: drop-shadow(0 10px 18px rgba(109,56,255,0.15));
            pointer-events: none;
            z-index: 5;
          }
        `}
      </style>

      {/* Confetti */}
      {confettiOn && confettiBurst > 0 && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {Array.from({ length: 22 }).map((_, i) => {
            const left = (i * 17) % 100;
            const drift = ((i % 2 === 0 ? 1 : -1) * (20 + (i % 6) * 8));
            const delay = (i % 8) * 0.02;
            const size = 8 + (i % 5) * 2;
            return (
              <div
                key={`${confettiBurst}_${i}`}
                className="confetti"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size + 4,
                  animationDelay: `${delay}s`,
                  ["--x"]: `${left}vw`,
                  ["--drift"]: `${drift}px`,
                }}
              />
            );
          })}
        </div>
      )}

      <div style={ui.header}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Typing PRO</div>
          <div style={{ color: "#6b7280", marginTop: 6 }}>
            Speed works even if you don’t finish. Accuracy ignores punctuation + is case-insensitive.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player name"
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e6e6e9",
              fontWeight: 800,
            }}
          />

          <div style={{ display: "flex", gap: 8 }}>
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => !running && setDuration(t)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: duration === t ? "linear-gradient(90deg,#6d38ff,#d946ef)" : "#fbfbfd",
                  color: duration === t ? "white" : "#111827",
                  border: "none",
                  cursor: running ? "not-allowed" : "pointer",
                  fontWeight: 800,
                }}
              >
                {t}s
              </button>
            ))}
          </div>

          <button
            onClick={() => (running ? stopRound(false) : startRound())}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              background: running ? "#ef4444" : "linear-gradient(90deg,#6ee7b7,#32d583)",
              color: running ? "white" : "#04221b",
              fontWeight: 900,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            {running ? "Stop" : "Start"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 640px" }}>
          <div style={{ marginBottom: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={ui.timerBox}>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{Math.ceil(timeLeft)}s</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Time left</div>
              <div style={ui.progress}>
                <div style={ui.progressInner} />
              </div>
            </div>

            <div style={{ flex: "1 1 360px" }}>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Target</div>
              <div style={ui.target}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
                    mixBlendMode: "overlay",
                    animation: "targetPulse 2.6s infinite",
                  }}
                />
                <div style={{ position: "relative", zIndex: 2, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                  {target.split("").map((ch, i) => {
                    const typedChar = typed[i];
                    const correct =
                      typedChar !== undefined && typedChar !== ""
                        ? String(typedChar).toLowerCase() === String(ch).toLowerCase()
                        : null;

                    return (
                      <span
                        key={i}
                        className={correct === true ? "tp-correct" : correct === false ? "tp-incorrect" : ""}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={ui.inputWrap}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <div style={{ fontWeight: 950, color: "#1a1b23", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>⌨️</span>
                <span>Type here</span>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div
                  style={ui.pill}
                  onClick={() => {
                    const next = !soundOn;
                    setSoundOn(next);
                    try {
                      localStorage.setItem("mannat_tp_sound", next ? "1" : "0");
                    } catch {}
                  }}
                  title="Toggle typing sound"
                >
                  <span>{soundOn ? "🔊" : "🔇"}</span>
                  <span>{soundOn ? "Sound ON" : "Sound OFF"}</span>
                </div>

                <div
                  style={ui.pill}
                  onClick={() => {
                    const next = !confettiOn;
                    setConfettiOn(next);
                    try {
                      localStorage.setItem("mannat_tp_confetti", next ? "1" : "0");
                    } catch {}
                  }}
                  title="Toggle confetti"
                >
                  <span>🎉</span>
                  <span>{confettiOn ? "Confetti ON" : "Confetti OFF"}</span>
                </div>

                <div style={{ ...ui.pill, cursor: "default" }}>
                  <span>✨</span>
                  <span>{running ? "Go go go!" : "Press Start first"}</span>
                </div>
              </div>
            </div>

            <textarea
              ref={inputRef}
              placeholder={running ? "Type the sentence above…" : "Press Start → then your cursor jumps here."}
              value={typed}
              onChange={(e) => {
                setTyped(e.target.value);
                playClick();
              }}
              disabled={!running}
              style={ui.textarea}
            />

            <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>
              Gross WPM = raw typing speed. Net WPM = Gross × Accuracy.
            </div>
          </div>
        </div>

        {/* Right sidebar cards */}
        <div style={{ width: 300, flex: "0 0 300px" }}>
          <div style={ui.card}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Net WPM</div>
            <div style={{ fontWeight: 900, fontSize: 26, marginTop: 6 }}>
              {results ? results.netWpm : liveStats.netWpm}
            </div>
            <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>
              Gross: {results ? results.grossWpm : liveStats.grossWpm} WPM
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div style={ui.card}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Accuracy</div>
            <div style={{ fontWeight: 900, fontSize: 26, marginTop: 6 }}>
              {results ? `${results.accuracy}%` : `${liveStats.accuracy}%`}
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div style={{ borderRadius: 12, padding: 12, background: "#fff", border: "1px solid rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              Local Leaderboard (top • {duration}s)
            </div>
            {localTop.length === 0 ? (
              <div style={{ color: "#9aa0ad" }}>No local scores yet.</div>
            ) : (
              localTop.map((it, idx) => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <div style={{ fontWeight: 900 }}>#{idx + 1} {it.name}</div>
                  <div>{it.netWpm} WPM</div>
                </div>
              ))
            )}
          </div>

          <div style={{ height: 10 }} />

          <div style={{ borderRadius: 12, padding: 12, background: "#fff", border: "1px solid rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              Public Leaderboard (top • {duration}s)
            </div>

            {publicStatus === "loading" && <div style={{ color: "#9aa0ad" }}>Loading…</div>}
            {publicStatus === "err" && <div style={{ color: "#b91c1c" }}>Error: {publicErr}</div>}

            {publicStatus !== "loading" && publicTop.length === 0 ? (
              <div style={{ color: "#9aa0ad" }}>No public scores yet.</div>
            ) : (
              publicTop.map((it, idx) => (
                <div key={`${it._id || it.id || idx}`} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <div style={{ fontWeight: 900 }}>#{idx + 1} {it.name}</div>
                  <div>{it.netWpm} WPM</div>
                </div>
              ))
            )}

            <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
              Public scores are stored on your API + MongoDB.
            </div>
          </div>
        </div>
      </div>

      {/* TIME OVER Banner */}
      {showBanner && results && (
        <div style={ui.banner}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>⏰ TIME OVER</div>

          <div style={{ marginTop: 8, fontSize: 16 }}>
            Net: <strong>{results.netWpm} WPM</strong> (Gross {results.grossWpm}) • Accuracy{" "}
            <strong>{results.accuracy}%</strong>
          </div>

          <div style={{ marginTop: 8, color: "#374151" }}>
            Estimated local position: <strong>#{results.localRank}</strong>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={shareText}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              Share text
            </button>

            <button
              onClick={() => {
                const ok = confirm("Save this score locally (this browser only)?");
                if (ok) saveLocal();
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "linear-gradient(90deg,#6d38ff,#d946ef)",
                color: "white",
                fontWeight: 900,
                border: "none",
              }}
            >
              Save locally
            </button>

            <button
              onClick={() => {
                const ok = confirm("Share this score PUBLICLY to everyone (stored in MongoDB)?");
                if (ok) sharePublic();
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "linear-gradient(90deg,#0b1020,#14183a)",
                color: "white",
                fontWeight: 900,
                border: "none",
              }}
            >
              Share to public leaderboard
            </button>

            <button
              onClick={() => {
                setShowBanner(false);
                setResults(null);
              }}
              style={{ padding: "10px 12px", borderRadius: 12 }}
            >
              Close
            </button>

            <button
              onClick={() => {
                setShowBanner(false);
                setResults(null);
                startRound();
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "linear-gradient(90deg,#6ee7b7,#32d583)",
                color: "#04221b",
                fontWeight: 900,
                border: "none",
              }}
            >
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



/* =========================
   HELPERS
========================= */

function randomSentence(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function countCorrectChars(target, typed) {
  let correct = 0;
  const n = Math.min(target.length, typed.length);
  for (let i = 0; i < n; i++) {
    if (typed[i] === target[i]) correct++;
  }
  return correct;
}

function renderHighlighted(target, typed) {
  const out = [];
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    const t = typed[i];

    let style = styles.hlPending;
    if (t === undefined) style = styles.hlPending;
    else if (t === ch) style = styles.hlCorrect;
    else style = styles.hlWrong;

    if (ch === "\n") out.push(<br key={`br_${i}`} />);
    else out.push(<span key={i} style={style}>{ch}</span>);
  }
  return out;
}

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(180deg, #f6f7fb, #f1f2f9)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Arial, sans-serif',
    color: "#12131a",
  },

  sidebar: {
    width: 260,
    minWidth: 260,
    background: "linear-gradient(180deg, #6d38ff, #6a44d6)",
    padding: 18,
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  profileWrap: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 20,
    padding: 14,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },

  avatarOuter: {
    width: 96,
    height: 96,
    borderRadius: 999,
    margin: "0 auto 10px",
    background: "radial-gradient(circle at 30% 30%, #ffffff, #d7c8ff)",
    padding: 4,
    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    objectFit: "cover",
    display: "block",
  },

  name: { color: "white", fontWeight: 800, letterSpacing: 1, fontSize: 22 },
  tagline: { color: "rgba(255,255,255,0.85)", marginTop: 4, fontSize: 13 },

  nav: { display: "flex", flexDirection: "column", gap: 10 },

  sideBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.10)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
  sideBtnActive: {
    background: "rgba(255,255,255,0.20)",
    border: "1px solid rgba(255,255,255,0.35)",
    transform: "translateY(-1px)",
  },

  sidebarFooter: { marginTop: "auto", color: "rgba(255,255,255,0.8)", fontSize: 12 },

  main: { flex: 1, padding: 22, maxWidth: 1100 },

  topCard: {
    background: "white",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 20px 50px rgba(30,20,60,0.10)",
    border: "1px solid rgba(20,20,40,0.06)",
  },
  heroTitle: { fontWeight: 800, fontSize: 18, color: "#1a1b23" },

  topTabs: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  topTab: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "#f3f4f8",
    cursor: "pointer",
    fontWeight: 800,
    color: "#5a5f72",
  },
  topTabActive: {
    background: "linear-gradient(180deg, #6d38ff, #6a44d6)",
    color: "white",
    boxShadow: "0 14px 26px rgba(109,56,255,0.25)",
    border: "1px solid rgba(109,56,255,0.35)",
  },

  sectionCard: {
    marginTop: 18,
    background: "white",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 20px 50px rgba(30,20,60,0.08)",
    border: "1px solid rgba(20,20,40,0.06)",
  },
  sectionTitle: { fontSize: 22, fontWeight: 900, marginBottom: 12 },

  /* About */
  aboutGrid: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 },
  aboutLeft: {
    background: "linear-gradient(180deg, rgba(109,56,255,0.08), rgba(106,68,214,0.05))",
    border: "1px solid rgba(109,56,255,0.12)",
    borderRadius: 18,
    padding: 16,
  },
  aboutRight: {
    background: "linear-gradient(180deg, rgba(10,15,30,0.04), rgba(10,15,30,0.02))",
    border: "1px solid rgba(20,20,40,0.08)",
    borderRadius: 18,
    padding: 16,
  },
  aboutHeadline: { fontSize: 20, fontWeight: 900, marginBottom: 8 },
  aboutText: { color: "#3b4052", lineHeight: 1.5, marginBottom: 10 },
  aboutPillsRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 },
  pill: {
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(109,56,255,0.10)",
    border: "1px solid rgba(109,56,255,0.18)",
    fontWeight: 800,
    color: "#3b1ec8",
    fontSize: 12,
  },
  aboutCtas: { display: "flex", gap: 10, marginTop: 14 },

  fancyCard: {
    borderRadius: 18,
    padding: 18,
    background: "linear-gradient(135deg, rgba(109,56,255,0.12), rgba(255,120,190,0.10))",
    border: "1px solid rgba(109,56,255,0.22)",
    boxShadow: "0 18px 40px rgba(109,56,255,0.12)",
    color: "#1b1d27",
  },
  fancyTitle: { fontWeight: 900, fontSize: 16, marginBottom: 10, color: "#2a1e6e" },
  fancyList: { margin: 0, paddingLeft: 18, lineHeight: 1.65, color: "#2b2f44", fontWeight: 650 },
  fancyHint: { marginTop: 12, fontSize: 13, color: "#4a4f66", fontWeight: 650 },

  /* Buttons */
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "linear-gradient(180deg, #6d38ff, #6a44d6)",
    border: "1px solid rgba(109,56,255,0.35)",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 14px 26px rgba(109,56,255,0.25)",
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "white",
    border: "1px solid rgba(20,20,40,0.14)",
    color: "#1b1d27",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
  },

  /* Education */
  eduWrap: {},
  eduCard: {
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(109,56,255,0.14)",
    background: "linear-gradient(180deg, rgba(109,56,255,0.08), rgba(255,120,190,0.05))",
    boxShadow: "0 18px 40px rgba(109,56,255,0.08)",
  },
  eduTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
    flexWrap: "wrap",
  },
  eduLeftTop: { display: "flex", flexDirection: "column", gap: 6 },
  eduCapRow: { display: "flex", alignItems: "center", gap: 10 },
  eduCapIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.70)",
    border: "1px solid rgba(109,56,255,0.18)",
    boxShadow: "0 14px 28px rgba(109,56,255,0.10)",
    fontSize: 18,
  },
  eduBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(109,56,255,0.18)",
    border: "1px solid rgba(109,56,255,0.25)",
    color: "#2a1e6e",
    fontWeight: 950,
    letterSpacing: 1,
    fontSize: 12,
  },
  eduSchool: { fontWeight: 950, fontSize: 18, color: "#1a1b23" },
  eduDegree: { fontWeight: 750, color: "#2b2f44" },
  eduDatePill: {
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(109,56,255,0.20)",
    fontWeight: 900,
    color: "#2a1e6e",
    whiteSpace: "nowrap",
  },
  eduDivider: { height: 1, background: "rgba(20,20,40,0.10)", margin: "14px 0" },
  eduGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  eduMini: {
    borderRadius: 16,
    padding: 14,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(20,20,40,0.08)",
  },
  eduMiniLabel: { fontWeight: 950, color: "#1a1b23", marginBottom: 10 },

  eduChips: { display: "flex", gap: 10, flexWrap: "wrap" },
  eduChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(109,56,255,0.10)",
    border: "1px solid rgba(109,56,255,0.18)",
    fontWeight: 900,
    color: "#3b1ec8",
  },
  eduChipText: { fontSize: 12, letterSpacing: 0.2 },
  eduMiniText: { color: "#3b4052", fontWeight: 650, lineHeight: 1.55 },

  /* Resume */
  resumeWrap: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  resumeLeft: {
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(109,56,255,0.12)",
    background: "linear-gradient(180deg, rgba(109,56,255,0.08), rgba(106,68,214,0.05))",
  },
  resumeTitle: { fontWeight: 900, fontSize: 18, marginBottom: 6 },
  resumeText: { color: "#3b4052", lineHeight: 1.5, marginBottom: 12 },
  resumeBtn: {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: 16,
    background: "linear-gradient(180deg, #0b1020, #14183a)",
    color: "white",
    fontWeight: 900,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
  },
  resumePreview: {
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
  },
  previewTop: { fontWeight: 900, marginBottom: 10 },
  previewRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eef0f6",
  },
  previewKey: { color: "#5a5f72", fontWeight: 800 },
  previewVal: { color: "#141628", fontWeight: 900 },

  /* Skills */
  skillsWrap: { display: "flex", flexDirection: "column", gap: 14 },
  skillGroup: {
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(109,56,255,0.10)",
    background: "linear-gradient(180deg, rgba(109,56,255,0.06), rgba(255,255,255,1))",
  },
  skillGroupTitle: {
    fontWeight: 900,
    color: "#3b1ec8",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 13,
  },
  skillGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  skillTile: {
    borderRadius: 16,
    padding: 12,
    background: "linear-gradient(180deg, #ffffff, #f6f7ff)",
    border: "1px solid rgba(20,20,40,0.10)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  skillIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    background: "linear-gradient(180deg, rgba(109,56,255,0.16), rgba(106,68,214,0.10))",
    border: "1px solid rgba(109,56,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  skillIcon: { fontSize: 22, color: "#2b2f44" },
  skillLabel: { fontWeight: 900, color: "#1b1d27" },

  /* Projects */
  projectsWrap: { display: "flex", flexDirection: "column", gap: 12 },
  projectsHint: { color: "#3b4052", lineHeight: 1.5 },
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },
  projectCard: {
    borderRadius: 18,
    padding: 14,
    background: "linear-gradient(180deg, rgba(109,56,255,0.14), rgba(255,120,190,0.06))",
    color: "#1b1d27",
    textDecoration: "none",
    boxShadow: "0 20px 45px rgba(109,56,255,0.14)",
    border: "1px solid rgba(109,56,255,0.18)",
  },
  projectTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  projectName: { fontWeight: 900, fontSize: 15, color: "#12131a" },
  projectPill: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(109,56,255,0.25)",
    border: "1px solid rgba(109,56,255,0.35)",
    color: "white",
    whiteSpace: "nowrap",
  },
  projectDesc: {
    marginTop: 10,
    color: "#3b4052",
    lineHeight: 1.5,
    minHeight: 44,
    fontWeight: 700,
  },
  projectLink: { marginTop: 12, color: "#3b1ec8", fontWeight: 900 },

  /* Contact */
  contactGrid: { display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 16 },
  reachCard: {
    borderRadius: 18,
    padding: 16,
    background: "linear-gradient(180deg, rgba(109,56,255,0.10), rgba(106,68,214,0.05))",
    border: "1px solid rgba(109,56,255,0.18)",
  },
  reachTitle: { fontWeight: 900, fontSize: 18, marginBottom: 10 },
  reachRow: { display: "flex", gap: 10, alignItems: "baseline", marginBottom: 10 },
  reachKey: { fontWeight: 900, color: "#1b1d27", minWidth: 80 },
  reachVal: { color: "#3b4052", fontWeight: 700 },
  reachLink: { color: "#5a31ff", fontWeight: 900, textDecoration: "none" },
  reachDivider: { height: 1, background: "rgba(20,20,40,0.10)", margin: "14px 0" },
  reachBtns: { display: "flex", gap: 10, flexWrap: "wrap" },

  formCard: {
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
  },
  formTitle: { fontWeight: 900, fontSize: 18, marginBottom: 10 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  label: {
    fontWeight: 900,
    color: "#1b1d27",
    letterSpacing: 1,
    fontSize: 12,
    textTransform: "uppercase",
  },
  input: {
    borderRadius: 14,
    border: "1px solid rgba(20,20,40,0.12)",
    padding: "12px 12px",
    outline: "none",
    fontWeight: 800,
    color: "#111318",
    background: "#fbfbfe",
  },
  textarea: {
    borderRadius: 14,
    border: "1px solid rgba(20,20,40,0.12)",
    padding: "12px 12px",
    outline: "none",
    fontWeight: 800,
    color: "#111318",
    background: "#fbfbfe",
    minHeight: 120,
    resize: "vertical",
  },
  formBottom: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  okPill: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "#eaf7ef",
    border: "1px solid #bfe7cb",
    fontWeight: 900,
    color: "#1d6b38",
  },
  errPill: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "#ffecec",
    border: "1px solid #ffc7c7",
    fontWeight: 900,
    color: "#9b1c1c",
  },
  noteSmall: { marginTop: 10, color: "#5a5f72", fontSize: 12 },

  /* QA route layout */
  qaPageInner: { padding: 22 },
  qaPageTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    width: "min(1100px, calc(100% - 44px))",
    margin: "0 auto 14px",
  },
  qaHeroInner: { position: "relative", padding: 18 },
  qaHeroTitle: { fontSize: 26, fontWeight: 950, color: "#1a1b23" },
  qaHeroSub: { marginTop: 8, color: "#2b2f44", fontWeight: 650, lineHeight: 1.5, maxWidth: 800 },
  qaHeroGrid: {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  qaMiniTitle: { fontWeight: 900, color: "#2a1e6e", marginBottom: 6 },
  qaMiniBody: { color: "#3b4052", fontWeight: 650, lineHeight: 1.5 },

  qaDetailsCard: {
    marginTop: 14,
    borderRadius: 18,
    padding: 16,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(20,20,40,0.10)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.06)",
  },
  qaDetailsTop: { display: "flex", flexDirection: "column", gap: 4 },
  qaDetailsTitle: { fontWeight: 950, color: "#1a1b23", fontSize: 16 },
  qaDetailsSub: { color: "#3b4052", fontWeight: 650 },
  qaDetailsList: { marginTop: 10, marginBottom: 0, paddingLeft: 18, color: "#2b2f44" },
  qaDetailsLi: { marginBottom: 6, fontWeight: 650, lineHeight: 1.5 },
  qaNote: { marginTop: 10, color: "#4a4f66", fontWeight: 650 },

  /* Mini Arcade */
  pgWrap: { display: "flex", flexDirection: "column", gap: 12 },
  pgTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
  },
  pgTitle: { fontWeight: 950, fontSize: 18, color: "#1a1b23" },
  pgSub: { marginTop: 6, color: "#3b4052", fontWeight: 650, lineHeight: 1.5, maxWidth: 720 },

  pgModeTabs: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  pgModeTab: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(20,20,40,0.12)",
    background: "rgba(255,255,255,0.75)",
    fontWeight: 950,
    cursor: "pointer",
    color: "#3b4052",
    boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
  },
  pgModeTabActive: {
    background: "linear-gradient(180deg, #0b1020, #14183a)",
    color: "white",
    border: "1px solid rgba(20,20,40,0.35)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.18)",
  },

  pgSoftBtn: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(20,20,40,0.12)",
    color: "#1b1d27",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
  },
  pgSoftBtnActive: {
    background: "linear-gradient(180deg, #6d38ff, #6a44d6)",
    color: "white",
    border: "1px solid rgba(109,56,255,0.35)",
    boxShadow: "0 14px 26px rgba(109,56,255,0.18)",
  },

  /* Arcade upgraded layout */
  arcadeGrid2Col: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14 },

  arcadeCard: {
    borderRadius: 18,
    border: "1px solid rgba(109,56,255,0.14)",
    background: "linear-gradient(180deg, rgba(109,56,255,0.06), rgba(255,120,190,0.03))",
    boxShadow: "0 18px 40px rgba(109,56,255,0.08)",
    padding: 14,
  },
  arcadeHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  arcadeTitle: { fontWeight: 950, fontSize: 18, color: "#1a1b23" },
  arcadeSub: { marginTop: 6, color: "#3b4052", fontWeight: 650, lineHeight: 1.5, maxWidth: 780 },
  arcadeRight: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  arcadeStatPill: {
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(20,20,40,0.12)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 160,
  },
  arcadeMiniLabel: {
    fontWeight: 950,
    color: "#1b1d27",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  arcadeBigNumberSmall: { fontWeight: 950, fontSize: 22, color: "#0b1020" },

  arcadeHowTo: {
    marginTop: 12,
    borderRadius: 16,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "rgba(255,255,255,0.72)",
    padding: 12,
  },
  arcadeHowTitle: { fontWeight: 950, color: "#2a1e6e" },
  arcadeHowList: { margin: "8px 0 0", paddingLeft: 18, color: "#2b2f44", fontWeight: 650, lineHeight: 1.6 },

  arcadeNameRow: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "80px 1fr",
    gap: 10,
    alignItems: "center",
  },
  arcadeNameInput: {
    borderRadius: 14,
    border: "1px solid rgba(20,20,40,0.12)",
    padding: "12px 12px",
    outline: "none",
    fontWeight: 900,
    color: "#111318",
    background: "#fbfbfe",
  },
  arcadeHintTiny: { gridColumn: "2 / span 1", marginTop: -4, color: "#5a5f72", fontSize: 12, fontWeight: 650 },

  /* Reaction pad */
  reactPad: {
    marginTop: 14,
    width: "100%",
    height: 180,
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.14)",
    cursor: "pointer",
    fontWeight: 950,
    fontSize: 22,
    letterSpacing: 1,
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
    transition: "transform 120ms ease",
  },
  reactPadIdle: { background: "linear-gradient(180deg, #0b1020, #14183a)", color: "white" },
  reactPadWait: { background: "linear-gradient(180deg, #ff4d4d, #b51f1f)", color: "white" },
  reactPadGo: { background: "linear-gradient(180deg, #2cff8a, #12a64f)", color: "#07110b" },

  /* Result banner */
  resultBanner: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
  },
  resultBannerTop: { display: "flex", flexDirection: "column", gap: 4 },
  resultBannerTitle: { fontWeight: 950, fontSize: 16, color: "#1a1b23" },
  resultBannerSub: { color: "#3b4052", fontWeight: 650 },
  resultBannerGrid: { marginTop: 12, display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 12 },
  resultBannerBox: {
    borderRadius: 16,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "linear-gradient(180deg, rgba(109,56,255,0.06), rgba(255,120,190,0.03))",
    padding: 12,
  },
  resultBig: { fontWeight: 950, fontSize: 26, color: "#0b1020", marginTop: 6 },
  resultSmall: { marginTop: 6, color: "#3b4052", fontWeight: 650, lineHeight: 1.45 },

  /* Side leaderboard */
  lbSideCard: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
    height: "fit-content",
  },
  lbSideTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  lbSideTitle: { fontWeight: 950, fontSize: 16, color: "#1a1b23" },
  lbSideSub: { marginTop: 6, color: "#5a5f72", fontWeight: 650, lineHeight: 1.45 },
  lbSideHint: { marginTop: 12, color: "#5a5f72", fontSize: 12, fontWeight: 650 },

  arcadeEmpty: {
    marginTop: 10,
    borderRadius: 14,
    padding: 12,
    background: "linear-gradient(180deg, rgba(109,56,255,0.06), rgba(255,120,190,0.03))",
    border: "1px solid rgba(109,56,255,0.12)",
    color: "#3b4052",
    fontWeight: 700,
  },

  lbList: { marginTop: 10, display: "flex", flexDirection: "column", gap: 8 },
  lbRow2: {
    display: "grid",
    gridTemplateColumns: "92px 1fr 120px",
    gap: 10,
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "rgba(255,255,255,0.70)",
  },
  lbRank2: { fontWeight: 950, color: "#3b1ec8", display: "flex", alignItems: "center" },
  lbName2: { fontWeight: 900, color: "#0b1020", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  lbScore2: { textAlign: "right", fontWeight: 950, color: "#0b1020" },

  /* Typing */
  typingControlsRow: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
    alignItems: "stretch",
  },
  typingTimerPick: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
    padding: 12,
  },
  typingLiveStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  statBox: {
    borderRadius: 16,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "linear-gradient(180deg, rgba(109,56,255,0.06), rgba(255,120,190,0.03))",
    padding: 12,
  },

  bigTimerCard: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "linear-gradient(180deg, #0b1020, #14183a)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
    padding: 12,
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    transform: "translateZ(0)",
    animation: "pulse 1.6s ease-in-out infinite",
  },
  bigTimerUrgent: {
    background: "linear-gradient(180deg, #ff4d4d, #b51f1f)",
    animation: "pulseFast 0.8s ease-in-out infinite",
  },
  bigTimerLabel: { fontWeight: 950, letterSpacing: 2, opacity: 0.85, fontSize: 12 },
  bigTimerNumber: { fontWeight: 950, fontSize: 34, lineHeight: 1 },
  bigTimerBarOuter: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    background: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  bigTimerBarInner: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #6d38ff, #ff78be, #6d38ff)",
    boxShadow: "0 0 18px rgba(109,56,255,0.35)",
    transition: "width 300ms ease",
  },

  typingMain: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  typingTargetCard: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
  },

  typingTargetText: {
    marginTop: 10,
    borderRadius: 16,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "#0b1020",
    color: "white",
    padding: 14,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 14,
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    minHeight: 150,
  },

  typingInputCard: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  typingTextarea: {
    width: "100%",
    minHeight: 170,
    borderRadius: 16,
    border: "1px solid rgba(20,20,40,0.12)",
    padding: 12,
    outline: "none",
    fontWeight: 800,
    color: "#111318",
    background: "#fbfbfe",
    resize: "vertical",
  },

  typingHint: { color: "#5a5f72", fontWeight: 650, fontSize: 12 },

  timeOverBanner: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(109,56,255,0.18)",
    background:
      "linear-gradient(135deg, rgba(109,56,255,0.14), rgba(255,120,190,0.10), rgba(255,255,255,0.95))",
    boxShadow: "0 18px 40px rgba(109,56,255,0.10)",
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  timeOverLeft: { display: "flex", flexDirection: "column", gap: 6 },
  timeOverTitle: { fontWeight: 950, fontSize: 16, color: "#1a1b23" },
  timeOverSub: { color: "#2b2f44", fontWeight: 650 },
  timeOverRight: { display: "flex", gap: 10, flexWrap: "wrap" },

  hlCorrect: { background: "rgba(44,255,138,0.22)", borderBottom: "2px solid rgba(44,255,138,0.70)" },
  hlWrong: { background: "rgba(255,77,77,0.22)", borderBottom: "2px solid rgba(255,77,77,0.70)" },
  hlPending: { opacity: 0.9 },

  /* Minimal keyframe support via inline style tag (optional) */
};

(function injectArcadeKeyframes() {
  const id = "arcade-keyframes";
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.innerHTML = `
    @keyframes pulse {
      0% { transform: translateZ(0) scale(1); }
      50% { transform: translateZ(0) scale(1.02); }
      100% { transform: translateZ(0) scale(1); }
    }
    @keyframes pulseFast {
      0% { transform: translateZ(0) scale(1); }
      50% { transform: translateZ(0) scale(1.04); }
      100% { transform: translateZ(0) scale(1); }
    }
  `;
  document.head.appendChild(style);
})();