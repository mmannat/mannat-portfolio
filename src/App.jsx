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
            <a
              style={styles.primaryBtn}
              href="https://github.com/mmannat"
              target="_blank"
              rel="noreferrer"
            >
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
              <button
                className="qaMiniCardBtn"
                data-active={active === "api"}
                onClick={() => setActive("api")}
              >
                <div style={styles.qaMiniTitle}>API Checks</div>
                <div style={styles.qaMiniBody}>Pass/Fail results + response time trend.</div>
              </button>

              <button
                className="qaMiniCardBtn"
                data-active={active === "bugs"}
                onClick={() => setActive("bugs")}
              >
                <div style={styles.qaMiniTitle}>Bug Cards</div>
                <div style={styles.qaMiniBody}>Severity, status, and reproduction steps.</div>
              </button>

              <button
                className="qaMiniCardBtn"
                data-active={active === "runs"}
                onClick={() => setActive("runs")}
              >
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
    <button
      onClick={onClick}
      style={{
        ...styles.sideBtn,
        ...(active ? styles.sideBtnActive : null),
      }}
    >
      {label}
    </button>
  );
}

function TopTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.topTab,
        ...(active ? styles.topTabActive : null),
      }}
    >
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
          I’m experienced in writing comprehensive test plans, designing clear procedures, and
          executing embedded, system, and integration tests. I’m highly accountable, detail-oriented,
          and I bring a calm, structured approach to debugging and validation.
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
              Built strong fundamentals in software engineering and problem-solving while working on
              projects across web development, mobile programming, and design. Currently expanding my
              skills in AI and Generative AI with a focus on practical, portfolio-ready applications.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   RESUME
========================= */

function ResumeCard() {
  return (
    <div style={styles.resumeWrap}>
      <div style={styles.resumeLeft}>
        <div style={styles.resumeTitle}>Open my resume</div>
        <div style={styles.resumeText}>
          Served from <b>/public/resume.pdf</b>.
        </div>

        <button
          style={styles.resumeBtn}
          onClick={() => window.open("/resume.pdf", "_blank", "noopener,noreferrer")}
        >
          View Resume PDF →
        </button>

        <div style={styles.noteSmall}>
          If you still see a blank PDF: right-click <b>public/resume.pdf</b> in VS Code → “Reveal in
          Finder” → open it. If it’s blank there too, the file is empty/corrupted and needs re-export.
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
    link.href = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css";
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
          <a
            href="https://github.com/mmannat"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.primaryBtn, textDecoration: "none" }}
          >
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
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.field}>
          <div style={styles.label}>Message</div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            style={styles.textarea}
          />
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
  const [mode, setMode] = useState("arcade"); // arcade | lab | reaction | typing

  const tab = (label, key) => (
    <button
      onClick={() => setMode(key)}
      style={{
        ...styles.pgModeTab,
        ...(mode === key ? styles.pgModeTabActive : null),
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={styles.pgWrap}>
      <div style={styles.pgTopRow}>
        <div>
          <div style={styles.pgTitle}>Mini Arcade</div>
          <div style={styles.pgSub}>
            Pick a mode: Creative Lab, Reaction Speed, or Typing PRO. Everything saves locally (no publish yet).
          </div>
        </div>

        <div style={styles.pgModeTabs}>
          {tab("Creative Lab", "lab")}
          {tab("Reaction Speed", "reaction")}
          {tab("Typing PRO", "typing")}
        </div>
      </div>

      {mode === "lab" && <CreativeLab />}
      {mode === "reaction" && <ReactionSpeedGame />}
      {mode === "typing" && <TypingProGame />}
    </div>
  );
}

/* =========================
   CREATIVE LAB (CANVAS)
========================= */

function CreativeLab() {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const [tool, setTool] = useState("pen"); // pen | highlighter | eraser | shape | text
  const [shapeType, setShapeType] = useState("circle"); // circle | square | triangle | star
  const [color, setColor] = useState("#6d38ff");
  const [bg, setBg] = useState("#0b1020");
  const [size, setSize] = useState(6);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [strokes, setStrokes] = useState([]);
  const [objects, setObjects] = useState([]);

  const [gallery, setGallery] = useState(() => {
    try {
      const raw = localStorage.getItem("mannat_playground_gallery");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const drawingRef = React.useRef(false);
  const currentStrokeRef = React.useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = containerRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bg, strokes, objects]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    drawGrid(ctx);

    for (const obj of objects) drawObject(ctx, obj);
    for (const s of strokes) drawStroke(ctx, s);
  };

  const drawGrid = (ctx) => {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;

    const step = 28;
    const w = ctx.canvas.width / (window.devicePixelRatio || 1);
    const h = ctx.canvas.height / (window.devicePixelRatio || 1);

    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawStroke = (ctx, s) => {
    if (!s.points || s.points.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (s.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = Math.max(10, s.size * 2);
      ctx.globalAlpha = 1;
    } else if (s.tool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size + 10;
      ctx.globalAlpha = 0.22;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.globalAlpha = 1;
    }

    ctx.beginPath();
    ctx.moveTo(s.points[0].x, s.points[0].y);
    for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
    ctx.stroke();
    ctx.restore();
  };

  const drawObject = (ctx, obj) => {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    if (obj.type === "text") {
      ctx.fillStyle = obj.color;
      ctx.font = `800 ${Math.max(14, obj.h)}px system-ui`;
      ctx.fillText(obj.text || "Text", obj.x, obj.y);
      ctx.restore();
      return;
    }

    ctx.fillStyle = obj.color;
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;

    if (obj.type === "circle") {
      const r = Math.min(obj.w, obj.h) / 2;
      ctx.beginPath();
      ctx.arc(obj.x + r, obj.y + r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    if (obj.type === "square") {
      ctx.beginPath();
      ctx.roundRect(obj.x, obj.y, obj.w, obj.h, 14);
      ctx.fill();
      ctx.stroke();
    }

    if (obj.type === "triangle") {
      ctx.beginPath();
      ctx.moveTo(obj.x + obj.w / 2, obj.y);
      ctx.lineTo(obj.x + obj.w, obj.y + obj.h);
      ctx.lineTo(obj.x, obj.y + obj.h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    if (obj.type === "star") {
      drawStar(ctx, obj.x + obj.w / 2, obj.y + obj.h / 2, 5, obj.w / 2, obj.w / 4);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    return { x, y };
  };

  const pushHistory = (nextStrokes, nextObjects) => {
    setHistory((h) => [...h, { strokes: nextStrokes, objects: nextObjects }]);
    setRedoStack([]);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    const p = getPoint(e);

    if (tool === "shape") {
      const w = 120;
      const h = 120;
      const obj = { type: shapeType, x: p.x - w / 2, y: p.y - h / 2, w, h, color };
      const nextObjects = [...objects, obj];
      setObjects(nextObjects);
      pushHistory(strokes, nextObjects);
      return;
    }

    if (tool === "text") {
      const text = prompt("Type your text:");
      if (!text) return;
      const obj = { type: "text", x: p.x, y: p.y, w: 0, h: 22, color, text };
      const nextObjects = [...objects, obj];
      setObjects(nextObjects);
      pushHistory(strokes, nextObjects);
      return;
    }

    drawingRef.current = true;
    const s = { tool, color, size, points: [p] };
    currentStrokeRef.current = s;
    setStrokes((prev) => [...prev, s]);
  };

  const onPointerMove = (e) => {
    if (!drawingRef.current) return;
    const p = getPoint(e);
    const s = currentStrokeRef.current;
    if (!s) return;

    s.points.push(p);
    setStrokes((prev) => [...prev.slice(0, -1), s]);
  };

  const onPointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;

    const finalStroke = currentStrokeRef.current;
    currentStrokeRef.current = null;
    if (!finalStroke) return;

    pushHistory([...strokes], [...objects]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [{ strokes, objects }, ...r]);
    setStrokes(prev.strokes);
    setObjects(prev.objects);
    setHistory((h) => h.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((h) => [...h, { strokes, objects }]);
    setStrokes(next.strokes);
    setObjects(next.objects);
    setRedoStack((r) => r.slice(1));
  };

  const clearAll = () => {
    pushHistory(strokes, objects);
    setStrokes([]);
    setObjects([]);
  };

  const saveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const item = {
      id: `art_${Date.now()}`,
      createdAt: new Date().toISOString(),
      dataUrl,
      title: `Creation ${gallery.length + 1}`,
    };

    const next = [item, ...gallery].slice(0, 12);
    setGallery(next);
    localStorage.setItem("mannat_playground_gallery", JSON.stringify(next));
    alert("Saved to gallery ✅");
  };

  const pill = (label, active, onClick) => (
    <button
      onClick={onClick}
      style={{
        ...styles.pgToolPill,
        ...(active ? styles.pgToolPillActive : null),
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={styles.pgGrid}>
      {/* Left: Canvas + tools */}
      <div style={styles.pgStudioCard}>
        <div style={styles.pgToolbar}>
          <div style={styles.pgToolbarRow}>
            {pill("Pen", tool === "pen", () => setTool("pen"))}
            {pill("Highlighter", tool === "highlighter", () => setTool("highlighter"))}
            {pill("Eraser", tool === "eraser", () => setTool("eraser"))}
            {pill("Shapes", tool === "shape", () => setTool("shape"))}
            {pill("Text", tool === "text", () => setTool("text"))}
          </div>

          <div style={styles.pgToolbarRow}>
            <div style={styles.pgControl}>
              <div style={styles.pgControlLabel}>Brush</div>
              <input
                type="range"
                min="2"
                max="18"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </div>

            <div style={styles.pgControl}>
              <div style={styles.pgControlLabel}>Color</div>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>

            <div style={styles.pgControl}>
              <div style={styles.pgControlLabel}>Background</div>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
            </div>

            {tool === "shape" && (
              <div style={styles.pgControl}>
                <div style={styles.pgControlLabel}>Shape</div>
                <select
                  value={shapeType}
                  onChange={(e) => setShapeType(e.target.value)}
                  style={styles.pgSelect}
                >
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                  <option value="triangle">Triangle</option>
                  <option value="star">Star</option>
                </select>
              </div>
            )}
          </div>

          <div style={styles.pgHintRow}>
            <span style={styles.pgHintPill}>Tip: choose Shapes then click on canvas to drop one.</span>
            <span style={styles.pgHintPill}>Tip: choose Text then click canvas.</span>
          </div>

          <div style={styles.pgActionsRow}>
            <button style={styles.pgSoftBtn} onClick={undo} disabled={history.length === 0}>
              Undo
            </button>
            <button style={styles.pgSoftBtn} onClick={redo} disabled={redoStack.length === 0}>
              Redo
            </button>
            <button style={styles.pgSoftBtn} onClick={clearAll}>
              Clear
            </button>
            <button style={styles.primaryBtn} onClick={saveToGallery}>
              Save
            </button>
          </div>
        </div>

        <div style={styles.pgCanvasShell}>
          <div ref={containerRef} style={styles.pgCanvasWrap}>
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              style={styles.pgCanvas}
            />
          </div>
        </div>
      </div>

      {/* Right: Gallery */}
      <div style={styles.pgGalleryCard}>
        <div style={styles.pgGalleryTitle}>Community Wall</div>
        <div style={styles.pgGallerySub}>Saved creations show up here (local only).</div>

        {gallery.length === 0 ? (
          <div style={styles.pgEmpty}>
            No creations yet — draw something and hit <b>Save</b>.
          </div>
        ) : (
          <div style={styles.pgGalleryGrid}>
            {gallery.map((g) => (
              <button
                key={g.id}
                style={styles.pgThumbBtn}
                onClick={() => window.open(g.dataUrl, "_blank", "noopener,noreferrer")}
                title="Open full size"
              >
                <img src={g.dataUrl} alt={g.title} style={styles.pgThumbImg} />
                <div style={styles.pgThumbMeta}>
                  <div style={styles.pgThumbTitle}>{g.title}</div>
                  <div style={styles.pgThumbDate}>{new Date(g.createdAt).toLocaleDateString()}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div style={styles.pgFooterNote}>
          (Publish/approval can be added later with a backend route + admin page.)
        </div>
      </div>
    </div>
  );
}
/* =========================
   REACTION SPEED GAME
========================= */

function ReactionSpeedGame() {
  const [state, setState] = useState("idle"); // idle | waiting | go | result
  const [message, setMessage] = useState("Click Start, then click as fast as you can when it turns GREEN.");
  const [startAt, setStartAt] = useState(null);
  const [resultMs, setResultMs] = useState(null);
  const [bestMs, setBestMs] = useState(() => {
    const raw = localStorage.getItem("mannat_reaction_best");
    return raw ? Number(raw) : null;
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const raw = localStorage.getItem("mannat_reaction_leaderboard");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (state !== "waiting") return;
    const delay = 900 + Math.floor(Math.random() * 2200);
    const t = setTimeout(() => {
      setState("go");
      setMessage("GO! Click now!");
      setStartAt(performance.now());
    }, delay);
    return () => clearTimeout(t);
  }, [state]);

  const computeBadges = (ms) => {
    const b = [];
    if (ms <= 230) b.push("Lightning Fingers ⚡");
    if (ms <= 300) b.push("Focus Master 🎯");
    if (ms <= 180) b.push("Ultra Instinct 🌀");
    return b;
  };

  const addToLeaderboard = (ms) => {
    const item = { id: `r_${Date.now()}`, ms, at: new Date().toISOString() };
    const next = [item, ...leaderboard]
      .sort((a, b) => a.ms - b.ms)
      .slice(0, 8);
    setLeaderboard(next);
    localStorage.setItem("mannat_reaction_leaderboard", JSON.stringify(next));
  };

  const start = () => {
    setState("waiting");
    setResultMs(null);
    setBadges([]);
    setMessage("Wait for GREEN...");
  };

  const onClickPad = () => {
    if (state === "idle") return;
    if (state === "waiting") {
      // clicked too early
      setState("result");
      setMessage("Too soon 😅 Click Start and try again.");
      setResultMs(null);
      setBadges([]);
      return;
    }
    if (state === "go") {
      const ms = Math.max(1, Math.round(performance.now() - startAt));
      setState("result");
      setResultMs(ms);

      const b = computeBadges(ms);
      setBadges(b);

      addToLeaderboard(ms);

      if (!bestMs || ms < bestMs) {
        setBestMs(ms);
        localStorage.setItem("mannat_reaction_best", String(ms));
      }

      setMessage("Nice! Want to beat your best?");
    }
  };

  const shareScore = async () => {
    const text = resultMs
      ? `I got ${resultMs}ms on Mannat's Reaction Speed game! ⚡`
      : `Try Mannat's Reaction Speed game! ⚡`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard ✅");
      }
    } catch {
      // ignore
    }
  };

  const padStyle =
    state === "go"
      ? styles.reactPadGo
      : state === "waiting"
      ? styles.reactPadWait
      : styles.reactPadIdle;

  return (
    <div style={styles.arcadeCard}>
      <div style={styles.arcadeHeader}>
        <div>
          <div style={styles.arcadeTitle}>Reaction Speed</div>
          <div style={styles.arcadeSub}>{message}</div>
        </div>

        <div style={styles.arcadeRight}>
          <div style={styles.arcadeStatPill}>
            <span style={{ opacity: 0.7 }}>Personal Best</span>
            <span style={{ fontWeight: 950 }}>
              {bestMs ? `${bestMs} ms` : "—"}
            </span>
          </div>

          <button style={styles.primaryBtn} onClick={start}>
            Start
          </button>
        </div>
      </div>

      <button style={{ ...styles.reactPad, ...padStyle }} onClick={onClickPad}>
        {state === "go" ? "CLICK!" : state === "waiting" ? "WAIT..." : "READY"}
      </button>

      <div style={styles.arcadeBottomRow}>
        <div style={styles.arcadeResultCard}>
          <div style={styles.arcadeMiniLabel}>Your Time</div>
          <div style={styles.arcadeBigNumber}>{resultMs ? `${resultMs} ms` : "—"}</div>
          {badges.length > 0 && (
            <div style={styles.badgeRow}>
              {badges.map((b) => (
                <span key={b} style={styles.badgePill}>
                  {b}
                </span>
              ))}
            </div>
          )}

          <button style={styles.secondaryBtn} onClick={shareScore} disabled={!resultMs}>
            Share Score
          </button>
        </div>

        <div style={styles.arcadeLeaderboardCard}>
          <div style={styles.arcadeMiniLabel}>Leaderboard (local)</div>

          {leaderboard.length === 0 ? (
            <div style={styles.arcadeEmpty}>No scores yet — hit Start and play.</div>
          ) : (
            <div style={styles.lbList}>
              {leaderboard.map((it, idx) => (
                <div key={it.id} style={styles.lbRow}>
                  <div style={styles.lbRank}>#{idx + 1}</div>
                  <div style={styles.lbScore}>{it.ms} ms</div>
                  <div style={styles.lbDate}>
                    {new Date(it.at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   TYPING PRO GAME
========================= */

function TypingProGame() {
  const SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Debugging is like being the detective in a crime movie.",
    "Quality is never an accident; it is always the result of effort.",
    "Ship small, learn fast, and iterate with confidence.",
    "Write tests like your future self will thank you.",
    "Smooth UI and reliable logic make users trust the product.",
  ];

  const DEV_SNIPPETS = [
    {
      label: "JavaScript",
      text: `function sum(a, b) {\n  return a + b;\n}\n\nconsole.log(sum(2, 5));`,
    },
    {
      label: "Python",
      text: `def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(42))`,
    },
    {
      label: "React",
      text: `export default function App() {\n  return <h1>Hello</h1>;\n}`,
    },
  ];

  const [mode, setMode] = useState("sentences"); // sentences | dev
  const [devPick, setDevPick] = useState(0);

  const [duration, setDuration] = useState(30); // seconds
  const [status, setStatus] = useState("idle"); // idle | running | done
  const [timeLeft, setTimeLeft] = useState(duration);

  const [target, setTarget] = useState(() => randomSentence(SENTENCES));
  const [typed, setTyped] = useState("");

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const [pb, setPb] = useState(() => {
    try {
      const raw = localStorage.getItem("mannat_typing_pb");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const raw = localStorage.getItem("mannat_typing_leaderboard");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [badges, setBadges] = useState([]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (status !== "running") return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    // live metrics
    if (status !== "running") return;

    const elapsed = duration - timeLeft;
    const minutes = Math.max(1 / 60, elapsed / 60);

    const correct = countCorrectChars(target, typed);
    const incorrect = Math.max(0, typed.length - correct);

    const acc = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100);
    setAccuracy(acc);

    const words = correct / 5; // standard approximation
    const curWpm = Math.round(words / minutes);
    setWpm(curWpm);
  }, [typed, timeLeft, status, duration, target]);

  const start = () => {
    const t = mode === "dev" ? DEV_SNIPPETS[devPick].text : randomSentence(SENTENCES);
    setTarget(t);
    setTyped("");
    setWpm(0);
    setAccuracy(100);
    setBadges([]);
    setStatus("running");
    setTimeLeft(duration);
  };

  const finish = () => {
    setStatus("done");

    // compute final
    const elapsed = duration;
    const minutes = elapsed / 60;
    const correct = countCorrectChars(target, typed);
    const words = correct / 5;
    const finalWpm = Math.round(words / minutes);

    const acc = typed.length === 0 ? 0 : Math.round((correct / typed.length) * 100);

    const b = [];
    if (finalWpm >= 60) b.push("Lightning Fingers ⚡");
    if (acc >= 95) b.push("Focus Master 🎯");
    if (finalWpm >= 80 && acc >= 95) b.push("Pro Mode 🔥");
    setBadges(b);

    const score = {
      id: `t_${Date.now()}`,
      wpm: finalWpm,
      acc,
      mode,
      at: new Date().toISOString(),
    };

    // PB
    if (!pb || finalWpm > pb.wpm || (finalWpm === pb.wpm && acc > pb.acc)) {
      setPb({ wpm: finalWpm, acc, mode });
      localStorage.setItem("mannat_typing_pb", JSON.stringify({ wpm: finalWpm, acc, mode }));
    }

    // leaderboard (top 8)
    const next = [score, ...leaderboard]
      .sort((a, b) => (b.wpm - a.wpm) || (b.acc - a.acc))
      .slice(0, 8);
    setLeaderboard(next);
    localStorage.setItem("mannat_typing_leaderboard", JSON.stringify(next));
  };

  const onChange = (e) => {
    if (status !== "running") return;
    const val = e.target.value;
    // keep typed length bounded so it doesn't explode on paste
    if (val.length > target.length + 50) return;
    setTyped(val);
  };

  const shareScore = async () => {
    const bestText = pb
      ? `Typing PRO: ${pb.wpm} WPM @ ${pb.acc}% accuracy (${pb.mode}) 🔥`
      : `Try Mannat's Typing PRO game 🔥`;
    try {
      if (navigator.share) {
        await navigator.share({ text: bestText });
      } else {
        await navigator.clipboard.writeText(bestText);
        alert("Copied to clipboard ✅");
      }
    } catch {
      // ignore
    }
  };

  const progress = Math.round(((duration - timeLeft) / duration) * 100);

  return (
    <div style={styles.arcadeCard}>
      <div style={styles.arcadeHeader}>
        <div>
          <div style={styles.arcadeTitle}>Typing PRO</div>
          <div style={styles.arcadeSub}>
            Random sentences, live WPM + accuracy, 30s mode, live highlights, PB + leaderboard saved locally.
          </div>
        </div>

        <div style={styles.arcadeRight}>
          <div style={styles.arcadeStatPill}>
            <span style={{ opacity: 0.7 }}>Personal Best</span>
            <span style={{ fontWeight: 950 }}>
              {pb ? `${pb.wpm} WPM • ${pb.acc}%` : "—"}
            </span>
          </div>

          <button style={styles.primaryBtn} onClick={start}>
            {status === "running" ? "Restart" : "Start"}
          </button>
        </div>
      </div>

      <div style={styles.typingTopRow}>
        <div style={styles.typingControls}>
          <div style={styles.typingControl}>
            <div style={styles.arcadeMiniLabel}>Mode</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                style={{ ...styles.pgSoftBtn, ...(mode === "sentences" ? styles.pgSoftBtnActive : null) }}
                onClick={() => setMode("sentences")}
                disabled={status === "running"}
              >
                Sentences
              </button>
              <button
                style={{ ...styles.pgSoftBtn, ...(mode === "dev" ? styles.pgSoftBtnActive : null) }}
                onClick={() => setMode("dev")}
                disabled={status === "running"}
              >
                Developer Mode
              </button>
            </div>

            {mode === "dev" && (
              <div style={{ marginTop: 10 }}>
                <div style={styles.arcadeMiniLabel}>Snippet</div>
                <select
                  value={devPick}
                  onChange={(e) => setDevPick(Number(e.target.value))}
                  style={styles.pgSelect}
                  disabled={status === "running"}
                >
                  {DEV_SNIPPETS.map((s, idx) => (
                    <option key={s.label} value={idx}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={styles.typingControl}>
            <div style={styles.arcadeMiniLabel}>Timer</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[15, 30, 60].map((s) => (
                <button
                  key={s}
                  style={{ ...styles.pgSoftBtn, ...(duration === s ? styles.pgSoftBtnActive : null) }}
                  onClick={() => setDuration(s)}
                  disabled={status === "running"}
                >
                  {s}s
                </button>
              ))}
            </div>
          </div>

          <div style={styles.typingStats}>
            <div style={styles.statBox}>
              <div style={styles.arcadeMiniLabel}>WPM</div>
              <div style={styles.arcadeBigNumberSmall}>{wpm}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.arcadeMiniLabel}>Accuracy</div>
              <div style={styles.arcadeBigNumberSmall}>{accuracy}%</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.arcadeMiniLabel}>Time</div>
              <div style={styles.arcadeBigNumberSmall}>{timeLeft}s</div>
            </div>
          </div>
        </div>

        <div style={styles.progressCard}>
          <div style={styles.arcadeMiniLabel}>Neon Progress</div>
          <div style={styles.progressOuter}>
            <div style={{ ...styles.progressInner, width: `${progress}%` }} />
          </div>

          {badges.length > 0 && (
            <div style={styles.badgeRow}>
              {badges.map((b) => (
                <span key={b} style={styles.badgePill}>
                  {b}
                </span>
              ))}
            </div>
          )}

          <button style={styles.secondaryBtn} onClick={shareScore}>
            Share Score
          </button>
        </div>
      </div>

      <div style={styles.typingMain}>
        <div style={styles.typingTargetCard}>
          <div style={styles.arcadeMiniLabel}>Target</div>
          <div style={styles.typingTargetText}>
            {renderHighlighted(target, typed)}
          </div>
        </div>

        <div style={styles.typingInputCard}>
          <div style={styles.arcadeMiniLabel}>Type here</div>
          <textarea
            value={typed}
            onChange={onChange}
            placeholder={status === "running" ? "" : "Hit Start to begin..."}
            style={styles.typingTextarea}
            disabled={status !== "running"}
          />
          <div style={styles.typingHint}>
            Live highlight shows correct/incorrect characters as you type.
          </div>
        </div>
      </div>

      <div style={styles.arcadeBottomRow}>
        <div style={styles.arcadeLeaderboardCard}>
          <div style={styles.arcadeMiniLabel}>Leaderboard (local)</div>
          {leaderboard.length === 0 ? (
            <div style={styles.arcadeEmpty}>No scores yet — hit Start and play.</div>
          ) : (
            <div style={styles.lbList}>
              {leaderboard.map((it, idx) => (
                <div key={it.id} style={styles.lbRow}>
                  <div style={styles.lbRank}>#{idx + 1}</div>
                  <div style={styles.lbScore}>
                    {it.wpm} WPM • {it.acc}%
                  </div>
                  <div style={styles.lbDate}>
                    {it.mode === "dev" ? "Dev" : "Sentence"} •{" "}
                    {new Date(it.at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.arcadeResultCard}>
          <div style={styles.arcadeMiniLabel}>How scoring works</div>
          <div style={styles.arcadeSmallText}>
            WPM uses correct characters ÷ 5 ÷ minutes. Accuracy is correct ÷ typed.
            PB and leaderboard are saved in your browser (localStorage).
          </div>

          <button
            style={styles.pgSoftBtn}
            onClick={() => {
              localStorage.removeItem("mannat_typing_pb");
              localStorage.removeItem("mannat_typing_leaderboard");
              setPb(null);
              setLeaderboard([]);
              alert("Typing PRO stats cleared ✅");
            }}
          >
            Reset Typing Stats
          </button>
        </div>
      </div>
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

    // preserve newlines
    if (ch === "\n") {
      out.push(<br key={`br_${i}`} />);
    } else {
      out.push(
        <span key={i} style={style}>
          {ch}
        </span>
      );
    }
  }
  return out;
}

/* =========================
   STYLES (FULL)
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

  /* Creative Lab layout */
  pgGrid: { display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 14 },

  pgStudioCard: {
    borderRadius: 18,
    border: "1px solid rgba(109,56,255,0.14)",
    background: "linear-gradient(180deg, rgba(109,56,255,0.06), rgba(255,120,190,0.03))",
    boxShadow: "0 18px 40px rgba(109,56,255,0.08)",
    overflow: "hidden",
  },
  pgToolbar: {
    padding: 14,
    borderBottom: "1px solid rgba(20,20,40,0.10)",
    background: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(6px)",
  },
  pgToolbarRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
  },

  pgToolPill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(20,20,40,0.12)",
    background: "rgba(255,255,255,0.72)",
    fontWeight: 900,
    color: "#3b4052",
    cursor: "pointer",
  },
  pgToolPillActive: {
    background: "linear-gradient(180deg, #6d38ff, #6a44d6)",
    color: "white",
    border: "1px solid rgba(109,56,255,0.35)",
    boxShadow: "0 14px 26px rgba(109,56,255,0.18)",
  },

  pgControl: { display: "flex", alignItems: "center", gap: 10 },
  pgControlLabel: {
    fontWeight: 900,
    color: "#1b1d27",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  pgSelect: {
    borderRadius: 12,
    border: "1px solid rgba(20,20,40,0.12)",
    padding: "10px 10px",
    fontWeight: 900,
    background: "white",
    color: "#1b1d27",
    outline: "none",
  },

  pgHintRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 },
  pgHintPill: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(109,56,255,0.10)",
    border: "1px solid rgba(109,56,255,0.18)",
    color: "#3b1ec8",
    fontWeight: 900,
    fontSize: 12,
  },

  pgActionsRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 },

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

  pgCanvasShell: { padding: 14 },

  pgCanvasWrap: {
    width: "100%",
    height: 420,
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.12)",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
    background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.00))",
  },

  pgCanvas: {
    width: "100%",
    height: "100%",
    display: "block",
    touchAction: "none",
    cursor: "crosshair",
  },

  pgGalleryCard: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
  },
  pgGalleryTitle: { fontWeight: 950, color: "#1a1b23", fontSize: 16 },
  pgGallerySub: { marginTop: 6, color: "#5a5f72", fontWeight: 650, lineHeight: 1.45 },
  pgEmpty: {
    marginTop: 14,
    borderRadius: 16,
    padding: 14,
    background: "linear-gradient(180deg, rgba(109,56,255,0.06), rgba(255,120,190,0.03))",
    border: "1px solid rgba(109,56,255,0.12)",
    color: "#3b4052",
    fontWeight: 700,
    lineHeight: 1.5,
  },
  pgGalleryGrid: { marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 },
  pgThumbBtn: {
    textAlign: "left",
    borderRadius: 16,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(0,0,0,0.05)",
    padding: 0,
  },
  pgThumbImg: {
    width: "100%",
    height: 130,
    objectFit: "cover",
    display: "block",
    background: "#0b1020",
  },
  pgThumbMeta: { padding: 10 },
  pgThumbTitle: { fontWeight: 950, color: "#1a1b23", fontSize: 13 },
  pgThumbDate: { marginTop: 3, color: "#5a5f72", fontWeight: 650, fontSize: 12 },
  pgFooterNote: { marginTop: 12, color: "#5a5f72", fontSize: 12, lineHeight: 1.45 },

  /* Arcade shared UI */
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

  arcadeBottomRow: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  arcadeResultCard: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  arcadeLeaderboardCard: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
  },
  arcadeMiniLabel: {
    fontWeight: 950,
    color: "#1b1d27",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  arcadeBigNumber: { fontWeight: 950, fontSize: 28, color: "#0b1020" },
  arcadeBigNumberSmall: { fontWeight: 950, fontSize: 22, color: "#0b1020" },
  arcadeSmallText: { color: "#3b4052", fontWeight: 650, lineHeight: 1.5 },
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
  lbRow: {
    display: "grid",
    gridTemplateColumns: "70px 1fr 120px",
    gap: 10,
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "rgba(255,255,255,0.70)",
  },
  lbRank: { fontWeight: 950, color: "#3b1ec8" },
  lbScore: { fontWeight: 950, color: "#0b1020" },
  lbDate: { color: "#5a5f72", fontWeight: 700, textAlign: "right", fontSize: 12 },

  badgeRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  badgePill: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(109,56,255,0.12)",
    border: "1px solid rgba(109,56,255,0.22)",
    color: "#3b1ec8",
    fontWeight: 950,
    fontSize: 12,
  },

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
  },
  reactPadIdle: { background: "linear-gradient(180deg, #0b1020, #14183a)", color: "white" },
  reactPadWait: { background: "linear-gradient(180deg, #ff4d4d, #b51f1f)", color: "white" },
  reactPadGo: { background: "linear-gradient(180deg, #2cff8a, #12a64f)", color: "#07110b" },

  /* Typing */
  typingTopRow: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 14,
  },

  typingControls: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  typingControl: { display: "flex", flexDirection: "column", gap: 8 },

  typingStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },

  statBox: {
    borderRadius: 16,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "linear-gradient(180deg, rgba(109,56,255,0.06), rgba(255,120,190,0.03))",
    padding: 12,
  },

  progressCard: {
    borderRadius: 18,
    border: "1px solid rgba(20,20,40,0.10)",
    background: "white",
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  progressOuter: {
    width: "100%",
    height: 14,
    borderRadius: 999,
    background: "rgba(20,20,40,0.08)",
    overflow: "hidden",
    border: "1px solid rgba(20,20,40,0.10)",
  },
  progressInner: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #6d38ff, #ff78be, #6d38ff)",
    boxShadow: "0 0 18px rgba(109,56,255,0.35)",
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
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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

  hlCorrect: {
    background: "rgba(44,255,138,0.22)",
    borderBottom: "2px solid rgba(44,255,138,0.70)",
  },
  hlWrong: {
    background: "rgba(255,77,77,0.22)",
    borderBottom: "2px solid rgba(255,77,77,0.70)",
  },
  hlPending: { opacity: 0.9 },

  /* Responsive */
  "@media (max-width: 980px)": {},
};