import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import profileImg from "./assets/profile.jpg";
import { InteractiveLabSection } from "./InteractiveLabSection.jsx";

/** Set VITE_API_BASE in .env for deployed sites (must be https if the site is https). */
const API_BASE = String(import.meta.env.VITE_API_BASE || "http://localhost:3001").replace(/\/$/, "");

const SOCIAL_LINKS = {
  github: "https://github.com/mmannat",
  linkedin: "https://www.linkedin.com/in/mannat-mannat-b343b3229/",
  email: "mailto:mmannat313@gmail.com",
};

function NavIconSvg({ children }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      {children}
    </svg>
  );
}

function IconNavAbout() {
  return (
    <NavIconSvg>
      <path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </NavIconSvg>
  );
}
function IconNavEducation() {
  return (
    <NavIconSvg>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </NavIconSvg>
  );
}
function IconNavExperience() {
  return (
    <NavIconSvg>
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </NavIconSvg>
  );
}
function IconNavSkills() {
  return (
    <NavIconSvg>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </NavIconSvg>
  );
}
function IconNavProjects() {
  return (
    <NavIconSvg>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </NavIconSvg>
  );
}
function IconNavResume() {
  return (
    <NavIconSvg>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </NavIconSvg>
  );
}
function IconNavLab() {
  return (
    <NavIconSvg>
      <path d="M9 3h6l-1 7a4 4 0 1 1-4 0L9 3z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14v7M8 21h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </NavIconSvg>
  );
}
function IconNavContact() {
  return (
    <NavIconSvg>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </NavIconSvg>
  );
}
function IconGitHub() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ display: "block" }}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ display: "block" }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function IconMail({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      aria-hidden
      style={{ display: "block" }}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

const NAV_ITEMS = [
  { id: "about", label: "About", Icon: IconNavAbout },
  { id: "education", label: "Education", Icon: IconNavEducation },
  { id: "experience", label: "Experience", Icon: IconNavExperience },
  { id: "skills", label: "Skills", Icon: IconNavSkills },
  { id: "projects", label: "Projects", Icon: IconNavProjects },
  { id: "resume", label: "Resume", Icon: IconNavResume },
  { id: "interactive-lab", label: "INTERACTIVE LAB", Icon: IconNavLab },
  { id: "contact", label: "Contact", Icon: IconNavContact },
];

function PortfolioHome() {
  const [active, setActive] = useState("about");
  const [navCollapsed, setNavCollapsed] = useState(false);

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 900px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile) setNavCollapsed(false);
  }, [isMobile]);

  const sectionIds = useMemo(
    () => ["about", "education", "experience", "skills", "projects", "resume", "interactive-lab", "contact"],
    []
  );

  useEffect(() => {
    const navBias = isMobile ? 96 : 120;
    const onScroll = () => {
      const offsets = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return { id, top: Infinity };
          const rect = el.getBoundingClientRect();
          return { id, top: Math.abs(rect.top - navBias) };
        })
        .sort((a, b) => a.top - b.top);

      if (offsets[0]?.id) setActive(offsets[0].id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds, isMobile]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  const collapsed = !isMobile && navCollapsed;

  const sidebarStyle = {
    ...styles.sidebar,
    ...(isMobile ? styles.sidebarMobile : {}),
    ...(collapsed ? styles.sidebarCollapsed : {}),
  };

  const shellStyle = {
    ...styles.shell,
    ...(isMobile ? styles.shellMobile : {}),
  };

  const mainStyle = {
    ...styles.main,
    ...(isMobile ? styles.mainMobile : {}),
  };

  return (
    <div style={styles.page}>
      <div style={shellStyle}>
        <aside style={sidebarStyle} aria-label="Primary">
          {!isMobile && (
            <button
              type="button"
              className="sidebar-collapse-btn"
              onClick={() => setNavCollapsed((c) => !c)}
              style={styles.sidebarCollapseBtn}
              aria-expanded={!navCollapsed}
              aria-label={navCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                {navCollapsed ? (
                  <path d="M13 17l5-5-5-5M6 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          )}

          <div style={{ ...styles.profileWrap, ...(collapsed ? styles.profileWrapCollapsed : {}) }}>
            <div style={{ ...styles.avatarOuter, ...(collapsed ? styles.avatarOuterCollapsed : {}) }}>
              <img src={profileImg} alt="Mannat" style={styles.avatar} />
            </div>
            {!collapsed && (
              <>
                <div style={styles.name}>MANNAT</div>
                <div style={styles.tagline}>Developer</div>
              </>
            )}
            {collapsed && <div style={styles.nameInitial} aria-hidden>M</div>}
          </div>

          <nav style={isMobile ? styles.navMobile : styles.nav} aria-label="Page sections">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <SideNavItem
                key={id}
                label={label}
                Icon={Icon}
                active={active === id}
                collapsed={collapsed}
                isMobile={isMobile}
                onClick={() => scrollTo(id)}
              />
            ))}
          </nav>

          <div style={{ ...styles.sidebarFooter, ...(collapsed ? styles.sidebarFooterCollapsed : {}) }}>
            {!collapsed && <div style={styles.sidebarFooterLine}>Let&apos;s build something great.</div>}
            <div style={styles.socialRow}>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="sidebar-social-a"
                style={styles.socialIconBtn}
                aria-label="GitHub profile"
              >
                <IconGitHub />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="sidebar-social-a"
                style={styles.socialIconBtn}
                aria-label="LinkedIn profile"
              >
                <IconLinkedIn />
              </a>
              <a href={SOCIAL_LINKS.email} className="sidebar-social-a" style={styles.socialIconBtn} aria-label="Email">
                <IconMail />
              </a>
            </div>
            {!collapsed && (
              <div style={styles.sidebarCopyright}>
                © {new Date().getFullYear()} Mannat. All rights reserved.
              </div>
            )}
          </div>
        </aside>

        <div style={mainStyle}>
          <Section
            id="about"
            title="About"
            hideTitle
            cardStyle={styles.eduSectionOuter}
            className="portfolio-about-flush"
            unifiedHeader={{
              title: "About",
              icon: <IconNavAbout />,
            }}
          >
            <AboutCard onJump={scrollTo} />
          </Section>

          <Section
            id="education"
            title="Education"
            hideTitle
            cardStyle={styles.eduSectionOuter}
            className="portfolio-education-flush"
            unifiedHeader={{
              title: "Education",
              icon: <IconNavEducation />,
            }}
          >
            <EducationCard />
          </Section>

          <Section
            id="experience"
            title="Experience"
            hideTitle
            cardStyle={styles.eduSectionOuter}
            className="portfolio-experience-flush"
            unifiedHeader={{
              title: "Experience",
              icon: <IconNavExperience />,
            }}
          >
            <ExperienceCard />
          </Section>

          <Section
            id="skills"
            title="Skills"
            hideTitle
            cardStyle={styles.eduSectionOuter}
            className="portfolio-skills-flush"
            unifiedHeader={{
              title: "Skills",
              icon: <IconNavSkills />,
            }}
          >
            <Skills />
          </Section>

          <Section
            id="projects"
            title="Projects"
            hideTitle
            cardStyle={styles.eduSectionOuter}
            className="portfolio-projects-flush"
            unifiedHeader={{
              title: "Projects",
              icon: <IconNavProjects />,
            }}
          >
            <Projects />
          </Section>

          <Section
            id="resume"
            title="Resume"
            hideTitle
            cardStyle={styles.eduSectionOuter}
            className="portfolio-resume-flush"
            unifiedHeader={{
              title: "Resume",
              icon: <ResumeSectionDocIcon />,
            }}
          >
            <ResumeCard />
          </Section>

          <Section
            id="interactive-lab"
            title="INTERACTIVE LAB"
            hideTitle
            cardStyle={styles.eduSectionOuter}
            className="portfolio-interactive-flush"
          >
            <InteractiveLabSection apiBase={API_BASE} />
          </Section>

          <Section id="contact" title="Contact" hideTitle cardStyle={styles.contactSectionOuter} className="portfolio-contact-flush">
            <Contact />
          </Section>
        </div>
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

function SideNavItem({ label, Icon, active, onClick, collapsed, isMobile }) {
  const showLabel = !collapsed || isMobile;
  return (
    <button
      type="button"
      className="sidebar-nav-btn"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      title={!showLabel ? label : undefined}
      style={{
        ...styles.sideNavItem,
        ...(active ? styles.sideNavItemActive : {}),
        ...(collapsed && !isMobile ? styles.sideNavItemCollapsed : {}),
        ...(isMobile ? styles.sideNavItemMobile : {}),
      }}
    >
      <span style={styles.sideNavIconWrap}>
        <Icon />
      </span>
      {showLabel && <span style={styles.sideNavLabel}>{label}</span>}
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

function PortfolioSectionHeaderSparkles() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, opacity: 0.92 }}>
      <path d="M12 2l1.2 4.2L18 8l-4.8 1.8L12 14l-1.2-4.2L6 8l4.8-1.8L12 2z" fill="rgba(244, 114, 182, 0.88)" />
      <path d="M19 15l.6 2.1 2.1.6-2.1.6-.6 2.1-.6-2.1-2.1-.6 2.1-.6.6-2.1z" fill="rgba(147, 197, 253, 0.65)" />
    </svg>
  );
}

/** Unified section chrome: gradient icon tile + title + sparkles (flush with card, no rule line) */
function PortfolioUnifiedSectionHeader({ title, icon, titleSuffix }) {
  return (
    <header style={styles.portfolioUnifiedHeader}>
      <div style={styles.portfolioUnifiedHeaderTop}>
        <div style={styles.resumeHeaderIconGrad} aria-hidden>
          <div style={styles.resumeHeaderIconInner}>{icon}</div>
        </div>
        <div style={styles.portfolioUnifiedHeaderTitles}>
          <div style={styles.resumeHeaderTitleRow}>
            <h2 style={styles.portfolioUnifiedHeaderTitle}>{title}</h2>
            {titleSuffix || null}
            <PortfolioSectionHeaderSparkles />
          </div>
        </div>
      </div>
    </header>
  );
}

function Section({ id, title, children, hideTitle, cardStyle, className, unifiedHeader }) {
  return (
    <div
      id={id}
      role="region"
      aria-label={hideTitle && title ? title : undefined}
      className={className}
      style={{ ...styles.sectionCard, ...(cardStyle || {}) }}
    >
      {unifiedHeader ? (
        <PortfolioUnifiedSectionHeader
          title={unifiedHeader.title}
          icon={unifiedHeader.icon}
          titleSuffix={unifiedHeader.titleSuffix}
        />
      ) : !hideTitle && title ? (
        <div style={styles.sectionTitle}>{title}</div>
      ) : null}
      {children}
    </div>
  );
}

/* =========================
   ABOUT
========================= */

function AboutSparkle({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path
        d="M12 2l1.2 4.2L18 8l-4.8 1.8L12 14l-1.2-4.2L6 8l4.8-1.8L12 2zM19 15l.6 2.1 2.1.6-2.1.6-.6 2.1-.6-2.1-2.1-.6 2.1-.6.6-2.1z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function AboutSkillIconCode({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="#c4b5fd" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AboutSkillIconGauge({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 14a8 8 0 0 1 16 0"
        stroke="#c4b5fd"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M8 14h8" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M12 14V9" stroke="#e9d5ff" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="14" r="1.5" fill="#c4b5fd" />
    </svg>
  );
}
function AboutSkillIconBulb({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18h6M10 22h4" stroke="#c4b5fd" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z"
        stroke="#c4b5fd"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function AboutSkillIconRocket({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 16.5c-1.5 1-1.5 2.5-1.5 2.5s1.5 0 2.5-1.5l3-3M12 15l-1-1m5-11l2.2 2.2M15 5l4 4M5 19l4-4"
        stroke="#c4b5fd"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 2l7 7-8 8H4v-7l8-8z" stroke="#c4b5fd" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AboutTimelineIconExplore() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="8" stroke="#a78bfa" strokeWidth="1.75" />
      <path d="M21 21l-4.3-4.3" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function AboutTimelineIconDesign() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 19l7-7 3 3-7 7-3-3z" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 13l-1.5-7.5L9 3l-7.5 9L11 21l7-8zM2 22l5-5" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AboutTimelineIconBuild() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AboutTimelineIconImpact() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="6" stroke="#a78bfa" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="2" fill="#a78bfa" />
    </svg>
  );
}

const ABOUT_SKILL_CARDS = [
  { title: "Full Stack Dev", line2: "", Icon: AboutSkillIconCode },
  { title: "UI / UX Enthusiast", line2: "", Icon: AboutSkillIconGauge },
  { title: "Problem Solver", line2: "", Icon: AboutSkillIconBulb },
  { title: "Always Learning", line2: "", Icon: AboutSkillIconRocket },
];

const ABOUT_TIMELINE = [
  {
    title: "Explore",
    body: "I explore ideas and understand problems deeply.",
    Icon: AboutTimelineIconExplore,
  },
  {
    title: "Design",
    body: "I design intuitive and user-friendly experiences.",
    Icon: AboutTimelineIconDesign,
  },
  {
    title: "Build",
    body: "I write clean, scalable, and efficient code.",
    Icon: AboutTimelineIconBuild,
  },
  {
    title: "Impact",
    body: "I deliver solutions that create real impact.",
    Icon: AboutTimelineIconImpact,
  },
];

function AboutCard({ onJump }) {
  const [stacked, setStacked] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 900px)").matches : false
  );
  const [narrowSkills, setNarrowSkills] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 520px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const fn = () => setStacked(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 520px)");
    const fn = () => setNarrowSkills(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <div
      className="portfolio-about-hero-root"
      style={{
        ...styles.aboutHeroShell,
        ...(stacked ? styles.aboutHeroShellStacked : null),
      }}
    >
      <div style={styles.aboutHeroGlowTR} aria-hidden />
      <div style={styles.aboutHeroGlowBL} aria-hidden />
      <div style={styles.aboutHeroInner}>
        <div
          style={{
            ...styles.aboutHeroGrid,
            ...(stacked ? styles.aboutHeroGridStacked : null),
          }}
        >
        <div style={styles.aboutHeroColLeft}>
          <h2 style={styles.aboutHeroHeadline}>
            <span style={styles.aboutHeroHeadlineLine1}>My journey in building</span>
            <span style={styles.aboutHeroHeadlineLine2}>
              <span style={styles.aboutHeroGradientWrap}>
                <span style={styles.aboutHeroGradient}>better digital experiences.</span>
              </span>
              <span style={styles.aboutHeroSparkleInline} aria-hidden>
                <AboutSparkle size={17} />
              </span>
            </span>
          </h2>

          <p style={styles.aboutHeroLead}>
            My journey in tech started with curiosity and turned into a passion for building. I love solving
            problems, designing beautiful interfaces, and writing clean code that brings ideas to life.
          </p>

          <div
            style={{
              ...styles.aboutSkillRow,
              ...(stacked && narrowSkills ? styles.aboutSkillRowPhone : null),
              ...(stacked && !narrowSkills ? styles.aboutSkillRowStacked : null),
            }}
          >
            {ABOUT_SKILL_CARDS.map(({ title, line2, Icon }) => {
              const denseTiles = stacked && !narrowSkills;
              const iconSize = denseTiles ? 25 : 28;
              return (
              <div key={title + (line2 || "")} className="about-skill-tile" style={{
                ...styles.aboutSkillCard,
                ...(denseTiles ? styles.aboutSkillCardDense : null),
              }}>
                <div style={styles.aboutSkillCardIcon}>
                  <Icon size={iconSize} />
                </div>
                <div style={{ ...styles.aboutSkillCardTitle, ...(denseTiles ? styles.aboutSkillCardTitleDense : null) }}>{title}</div>
                {line2 ? <div style={{ ...styles.aboutSkillCardSub, ...(denseTiles ? styles.aboutSkillCardSubDense : null) }}>{line2}</div> : null}
              </div>
              );
            })}
          </div>
        </div>

        <div style={styles.aboutHeroColRight}>
          <div style={styles.aboutHeroRightStack}>
            <div style={styles.aboutTimeline}>
              <div style={styles.aboutTimelineLine} aria-hidden />
              {ABOUT_TIMELINE.map(({ title, body, Icon }, i) => (
                <div
                  key={title}
                  style={{
                    ...styles.aboutTimelineRow,
                    ...(i === ABOUT_TIMELINE.length - 1 ? styles.aboutTimelineRowLast : null),
                  }}
                >
                  <div style={styles.aboutTimelineDotCol}>
                    <div style={styles.aboutTimelineDot} />
                  </div>
                  <div style={styles.aboutTimelineIconRing}>
                    <Icon />
                  </div>
                  <div style={styles.aboutTimelineTextCol}>
                    <div style={styles.aboutTimelineTitle}>{title}</div>
                    <div style={styles.aboutTimelineBody}>{body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...styles.aboutHeroCtaRowCompact, ...(stacked ? styles.aboutHeroCtaRowCompactStacked : null) }}>
              <button
                type="button"
                className="about-cta-primary"
                style={{ ...styles.aboutBtnPrimary, ...(stacked ? styles.aboutBtnCtaStacked : null) }}
                onClick={() => onJump("projects")}
              >
                <span>View My Work</span>
                <span aria-hidden>→</span>
              </button>
              <button
                type="button"
                className="about-cta-ghost"
                style={{ ...styles.aboutBtnGhost, ...(stacked ? styles.aboutBtnCtaStacked : null) }}
                onClick={() => onJump("contact")}
              >
                <span>Get In Touch</span>
                <span style={{ display: "inline-flex", alignItems: "center" }} aria-hidden>
                  <IconMail size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   EDUCATION
========================= */

function EduGradCapLarge() {
  return (
    <svg viewBox="0 0 88 88" fill="none" aria-hidden style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="portfolio-edu-cap-grad" x1="12" y1="8" x2="76" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5d0fe" />
          <stop offset="0.45" stopColor="#c084fc" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="portfolio-edu-cap-tassel" x1="44" y1="28" x2="72" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ddd6fe" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d="M44 12L8 28l36 16 36-16-36-16Z"
        fill="url(#portfolio-edu-cap-grad)"
        stroke="rgba(167,139,250,0.45)"
        strokeWidth="1.25"
      />
      <path d="M8 28v8l36 16 36-16v-8" stroke="rgba(167,139,250,0.35)" strokeWidth="1.25" strokeLinejoin="round" />
      <path
        d="M20 38v18c0 8 10.8 14.4 24 14.4S68 64 68 56V38"
        stroke="url(#portfolio-edu-cap-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 34c6 10 10 22 12 36"
        stroke="url(#portfolio-edu-cap-tassel)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="68" cy="72" r="3.2" fill="url(#portfolio-edu-cap-tassel)" />
    </svg>
  );
}

function EduFocusIconWeb() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.8 3.6 2.8 16.4 0 20" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}
function EduFocusIconAI() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="7" width="14" height="10" rx="2" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.5" />
      <path d="M9 11h2M13 11h2M9 14h6" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 4v2M17 5l-1 1.7M7 5l1 1.7" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
function EduFocusIconGenAI() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3z" fill="url(#portfolio-edu-icon-grad)" opacity="0.95" />
      <path d="M18 15l.5 1.6 1.6.5-1.6.5-.5 1.6-.5-1.6-1.6-.5 1.6-.5.5-1.6z" fill="url(#portfolio-edu-icon-grad)" opacity="0.75" />
    </svg>
  );
}
function EduFocusIconMobile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="7" y="4" width="10" height="16" rx="2.2" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.6" />
      <path d="M10 18h4" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function EduFocusIconDesign() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 16l4-4 10-10 4 4-10 10-4 4-4-4z" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.45" strokeLinejoin="round" />
      <path d="M13 7l4 4" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
function EduFocusIconSecurity() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4l7 3v6c0 5-3 9.5-7 11-4-1.5-7-6-7-11V7l7-3z" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-5" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function EduFocusIconNetwork() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="8" r="2.2" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.4" />
      <circle cx="18" cy="8" r="2.2" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.4" />
      <circle cx="12" cy="17" r="2.2" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.4" />
      <path d="M7.6 9.4l3.2 5.8M16.4 9.4l-3.2 5.8M12 10.2V15" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.25" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function EduFocusIconUiUx() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="8" height="7" rx="1.2" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.45" />
      <rect x="3.5" y="13.5" width="8" height="6" rx="1.2" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.45" opacity="0.85" />
      <rect x="13.5" y="4.5" width="7" height="15" rx="1.2" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.45" />
      <path d="M6 7h4M6 16h4M16 7v10" stroke="url(#portfolio-edu-icon-grad)" strokeWidth="1.15" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function EduIconDefs() {
  return (
    <defs>
      <linearGradient id="portfolio-edu-icon-grad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e9d5ff" />
        <stop offset="0.5" stopColor="#c084fc" />
        <stop offset="1" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  );
}

function EduCalendarTiny() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, opacity: 0.75 }}>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const EDU_FOCUS_AREAS = [
  { label: "Web Development", Icon: EduFocusIconWeb },
  { label: "AI", Icon: EduFocusIconAI },
  { label: "Generative AI", Icon: EduFocusIconGenAI },
  { label: "Mobile Programming", Icon: EduFocusIconMobile },
  { label: "Graphic Designing", Icon: EduFocusIconDesign },
  { label: "Cybersecurity", Icon: EduFocusIconSecurity },
  { label: "Computer Networks", Icon: EduFocusIconNetwork },
  { label: "UI/UX Fundamentals", Icon: EduFocusIconUiUx },
];

const EDU_HIGHLIGHTS = [
  "Built strong foundations in software engineering and problem-solving",
  "Worked on projects across web, mobile, and UI/UX design",
  "Actively participated in college hackathons and technical events",
  "Contributed to campus activities and club organization",
  "Continuously learning and applying modern technologies in real-world projects",
];

function EducationCard() {
  const [stacked, setStacked] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 960px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 960px)");
    const fn = () => setStacked(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const vSep = <div style={styles.eduBannerVsep} aria-hidden />;
  const hSep = <div style={styles.eduBannerHsep} aria-hidden />;

  const leftBlock = (
    <div style={{ ...styles.eduBannerLeftInner, ...(stacked ? styles.eduBannerLeftInnerStacked : null) }}>
      <div style={styles.eduBannerCapWrap}>
        <EduGradCapLarge />
      </div>
      {!stacked ? vSep : null}
      <div style={{ ...styles.eduBannerSchoolCol, ...(stacked ? styles.eduBannerSchoolColStacked : null) }}>
        <div style={styles.eduBannerBadge}>CSUEB</div>
        <div style={styles.eduBannerUni}>California State University, East Bay</div>
        <div style={styles.eduBannerDegree}>Bachelor of Science in Computer Science</div>
        <div style={styles.eduBannerGradRow}>
          <EduCalendarTiny />
          <span>Graduated • December 2025</span>
        </div>
      </div>
    </div>
  );

  const centerBlock = (
    <div style={{ ...styles.eduBannerColCenter, ...(stacked ? styles.eduBannerColCenterStacked : null) }}>
      <div style={styles.eduBannerSectionLabel}>Focus Areas</div>
      <div style={{ ...styles.eduBannerFocusRow, ...(stacked ? styles.eduBannerFocusRowStacked : null) }}>
        {EDU_FOCUS_AREAS.map(({ label, Icon }) => (
          <div key={label} style={styles.eduBannerFocusTile} className="edu-banner-focus-tile">
            <div style={styles.eduBannerFocusIconRing}>
              <Icon />
            </div>
            <div style={styles.eduBannerFocusLabel}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const rightBlock = (
    <div style={{ ...styles.eduBannerColRight, ...(stacked ? styles.eduBannerColRightStacked : null) }}>
      <div style={styles.eduBannerSectionLabel}>Highlights</div>
      <ul style={styles.eduBannerHighlightList}>
        {EDU_HIGHLIGHTS.map((text) => (
          <li key={text} style={styles.eduBannerHighlightLi}>
            <span style={styles.eduBannerBullet} aria-hidden>
              •
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="portfolio-edu-banner-root" style={styles.eduBannerRoot}>
      <div style={styles.eduBannerParticleLeft} aria-hidden />
      <div style={styles.eduBannerParticleRight} aria-hidden />
      <div style={styles.eduBannerShell}>
        <svg width="0" height="0" aria-hidden style={{ position: "absolute", overflow: "hidden" }}>
          <EduIconDefs />
        </svg>
        <div style={styles.eduBannerGlowTL} aria-hidden />
        <div style={styles.eduBannerGlowBR} aria-hidden />
        <div
          style={{
            ...styles.eduBannerGrid,
            ...(stacked ? styles.eduBannerGridStacked : null),
          }}
        >
          <div style={{ ...styles.eduBannerColLeft, ...(stacked ? styles.eduBannerColLeftStacked : null) }}>{leftBlock}</div>
          {!stacked ? vSep : null}
          {stacked ? hSep : null}
          {centerBlock}
          {!stacked ? vSep : null}
          {stacked ? hSep : null}
          {rightBlock}
        </div>
      </div>
    </div>
  );
}

/* =========================
   RESUME
========================= */

function ResumeSectionDocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        stroke="rgba(226, 232, 240, 0.9)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 4v4h4M9 12h6M9 15.5h6" stroke="rgba(226, 232, 240, 0.55)" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function ResumeHeroDocIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l4.5 4.5V19a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 19V6A2.5 2.5 0 0 1 7 3.5z"
        stroke="rgba(248, 250, 252, 0.95)"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M14 3.5v5h5M8.5 12h7M8.5 15.5h7" stroke="rgba(248, 250, 252, 0.5)" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function ResumeIconFocus() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.2" stroke="rgba(248, 250, 252, 0.95)" strokeWidth="1.45" />
      <circle cx="12" cy="12" r="7.5" stroke="rgba(248, 250, 252, 0.55)" strokeWidth="1.25" strokeDasharray="3 3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="rgba(248, 250, 252, 0.35)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ResumeIconExpertise() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 16l-4-4 4-4M16 8l4 4-4 4" stroke="rgba(248, 250, 252, 0.92)" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResumeIconCube() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 4v10l-7 4-7-4V7l7-4z"
        stroke="rgba(248, 250, 252, 0.88)"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M12 3v10M12 13l7-4M12 13L5 9" stroke="rgba(248, 250, 252, 0.45)" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function ResumeIconDatabase() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" stroke="rgba(248, 250, 252, 0.9)" strokeWidth="1.3" />
      <path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" stroke="rgba(248, 250, 252, 0.55)" strokeWidth="1.25" />
      <path d="M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" stroke="rgba(248, 250, 252, 0.55)" strokeWidth="1.25" />
    </svg>
  );
}

const RESUME_INFO_ROWS = [
  {
    key: "focus",
    label: "Focus",
    body: "Full-Stack Development • UI/UX Systems • Scalable Web Applications",
    Icon: ResumeIconFocus,
    ring: "linear-gradient(135deg, #a78bfa, #6366f1)",
  },
  {
    key: "expertise",
    label: "Expertise",
    body: "Building robust web applications with clean code, intuitive interfaces, and reliable performance.",
    Icon: ResumeIconExpertise,
    ring: "linear-gradient(135deg, #f472b6, #d946ef)",
  },
  {
    key: "core",
    label: "Core Strengths",
    body: "API Design • System Design • Problem Solving • Data Handling",
    Icon: ResumeIconCube,
    ring: "linear-gradient(135deg, #fb923c, #f472b6)",
  },
  {
    key: "databases",
    label: "Databases",
    body: "MySQL • MongoDB • Query Optimization • Schema Design",
    Icon: ResumeIconDatabase,
    ring: "linear-gradient(135deg, #60a5fa, #818cf8)",
  },
];

function ResumeCard() {
  const [layout, setLayout] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia("(max-width: 1024px)").matches) return "stacked";
    return "desktop";
  });

  useEffect(() => {
    const q = window.matchMedia("(max-width: 1024px)");
    const fn = () => setLayout(q.matches ? "stacked" : "desktop");
    fn();
    q.addEventListener("change", fn);
    return () => q.removeEventListener("change", fn);
  }, []);

  const stacked = layout === "stacked";

  return (
    <div className="portfolio-resume-root" style={styles.resumeRoot}>
      <div
        style={{
          ...styles.resumeGrid,
          ...(stacked ? styles.resumeGridStacked : null),
        }}
      >
        <div style={{ ...styles.resumeHeroCard, ...(stacked ? styles.resumeHeroCardStacked : null) }} className="resume-hero-card">
          <div style={styles.resumeHeroGlow} aria-hidden />
          <div style={styles.resumeHeroIconGrad} aria-hidden>
            <div style={styles.resumeHeroIconInner}>
              <ResumeHeroDocIcon />
            </div>
          </div>
          <h3 style={styles.resumeHeroHeading}>
            My professional journey{" "}
            <span style={styles.aboutHeroGradientWrap}>
              <span style={styles.aboutHeroGradient}>at a glance.</span>
            </span>
          </h3>
          <p style={styles.resumeHeroLead}>
            Explore my experience, key accomplishments, and the impact I&apos;ve created through technology.
          </p>
          <a
            href={`${import.meta.env.BASE_URL}mannat_resume.pdf`}
            target="_blank"
            rel="noreferrer"
            className="resume-pdf-cta"
            style={styles.resumePdfBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
              <path
                d="M12 4v12m0 0l-4-4m4 4l4-4M6 20h12"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View Resume PDF →
          </a>
        </div>

        <div style={styles.resumePanel} className="resume-info-panel">
          {RESUME_INFO_ROWS.map(({ key, label, body, Icon, ring }, i) => (
            <div
              key={key}
              className="resume-info-row"
              style={{
                ...styles.resumeInfoRow,
                ...(i === RESUME_INFO_ROWS.length - 1 ? styles.resumeInfoRowLast : null),
              }}
            >
              <div style={{ ...styles.resumeRowIconRing, background: ring }} aria-hidden>
                <div style={styles.resumeRowIconInner}>
                  <Icon />
                </div>
              </div>
              <div style={styles.resumeRowText}>
                <div style={styles.resumeRowLabel}>{label}</div>
                <div style={styles.resumeRowBody}>{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* =========================
   SKILLS
========================= */

function SkillsCatIconFrontend() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 16l-4-4 4-4M16 8l4 4-4 4" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SkillsCatIconBackend() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h10" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function SkillsCatIconDatabase() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.65" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.65" />
      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.65" />
    </svg>
  );
}
function SkillsCatIconTools() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.5 10.5l2 2M11 7l6.5 6.5a2 2 0 0 1-2.8 2.8L8 10l-5 5"
        stroke="rgba(147, 197, 253, 0.95)"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 3L3 7l4 4M17 17l4 4-4 4" stroke="rgba(147, 197, 253, 0.55)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Git (orange, left) + GitHub-style mark (right) — split columns so they never overlap */
function SkillsIconGitGithub() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(0.5 0)">
        <path d="M6.25 7.5L10.2 12 6.25 16.5 2.3 12 6.25 7.5z" fill="#F05032" />
        <path
          d="M6.25 9.4v5.2M4.3 12h3.9"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(14.1 3.35) scale(0.33)">
        <path
          d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.11 2.51.32 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"
          fill="#E6EDF3"
          stroke="#58A6FF"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function SkillsIconClaude() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4l2 4 4 1-4 1-2 4-2-4-4-1 4-1 2-4z" stroke="rgba(244, 114, 182, 0.9)" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="2" fill="rgba(244, 114, 182, 0.5)" />
    </svg>
  );
}

/** Link-style REST / endpoint (not Node) */
function SkillsIconRestApi() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="2.5" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.45" />
      <circle cx="18" cy="7" r="2.5" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.45" />
      <circle cx="18" cy="17" r="2.5" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.45" />
      <path d="M8.2 11.2L15.8 8.2M8.2 12.8L15.8 15.8" stroke="rgba(147, 197, 253, 0.85)" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M7 5l-1.5 2M17 19l1.5-2" stroke="rgba(125, 211, 252, 0.5)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Generic auth — shield + lock (not vendor-specific) */
function SkillsIconAuth() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 3.2V11c0 4.2-2.8 8-7 9.2C7.8 19 5 15.2 5 11V6.2L12 3z"
        stroke="rgba(147, 197, 253, 0.95)"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      <rect x="9" y="10" width="6" height="5" rx="1" stroke="rgba(147, 197, 253, 0.9)" strokeWidth="1.35" />
      <path d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10" stroke="rgba(147, 197, 253, 0.9)" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

/** Component / module layering (not a language logo) */
function SkillsIconComponentArch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="14" height="9" rx="2" stroke="rgba(147, 197, 253, 0.45)" strokeWidth="1.35" />
      <rect x="5.5" y="8" width="14" height="9" rx="2" stroke="rgba(147, 197, 253, 0.72)" strokeWidth="1.35" />
      <rect x="8" y="11" width="14" height="9" rx="2" stroke="rgba(147, 197, 253, 0.95)" strokeWidth="1.4" />
      <path d="M11 14h6M11 16.5h4" stroke="rgba(125, 211, 252, 0.35)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/** Jira-style mark (simplified Atlassian-inspired shapes, not a trademark reproduction) */
function SkillsIconJira() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12.2 3.2L17.4 8.4l-5.2 5.2-5.2-5.2 5.2-5.2z"
        fill="#2684FF"
      />
      <path
        d="M12.2 10.4l5.2 5.2-5.2 5.2-5.2-5.2 5.2-5.2z"
        fill="#0052CC"
        opacity="0.92"
      />
    </svg>
  );
}

/** Query tuning — magnifying glass + rising bars (cool blue tones) */
function SkillsIconQueryOpt() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9.5" cy="9.5" r="4.2" stroke="rgba(125, 211, 252, 0.95)" strokeWidth="1.45" />
      <path d="M12.8 12.8L18 18" stroke="rgba(125, 211, 252, 0.95)" strokeWidth="1.45" strokeLinecap="round" />
      <rect x="3.5" y="13" width="3" height="6" rx="0.75" stroke="rgba(147, 197, 253, 0.9)" strokeWidth="1.25" fill="none" />
      <rect x="8.5" y="10" width="3" height="9" rx="0.75" stroke="rgba(147, 197, 253, 0.9)" strokeWidth="1.25" fill="none" />
      <rect x="13.5" y="7" width="3" height="12" rx="0.75" stroke="rgba(147, 197, 253, 0.9)" strokeWidth="1.25" fill="none" />
    </svg>
  );
}

const SKILLS_COLUMNS = [
  {
    step: "01",
    title: "Frontend",
    subtitle: "Interfaces, performance, and accessible delivery.",
    Icon: SkillsCatIconFrontend,
    items: [
      { label: "React (Vite)", desc: "Component-driven UIs with fast Vite tooling.", icon: "devicon-react-original" },
      { label: "JavaScript", desc: "Modern ES features, modules, and async flows.", icon: "devicon-javascript-plain" },
      { label: "UI/UX Design", desc: "Layout systems, typography, and usable flows.", icon: "devicon-figma-plain" },
      { label: "Responsive Design", desc: "Fluid grids and adaptive breakpoints.", icon: "devicon-css3-plain" },
      { label: "Component Architecture", desc: "Composable, testable UI boundaries.", customIcon: "componentArch" },
    ],
  },
  {
    step: "02",
    title: "Backend",
    subtitle: "Services, APIs, and reliable system behavior.",
    Icon: SkillsCatIconBackend,
    items: [
      { label: "Node.js", desc: "Runtime APIs, streams, and ecosystem tooling.", icon: "devicon-nodejs-plain" },
      { label: "Express.js", desc: "Routing, middleware, and structured HTTP APIs.", icon: "devicon-express-original" },
      { label: "REST APIs", desc: "Resource modeling, versioning, and contracts.", customIcon: "restApi" },
      { label: "Authentication", desc: "Sessions, tokens, and access control patterns.", customIcon: "auth" },
      { label: "Error Handling", desc: "Structured failures, logging, and recovery.", icon: "devicon-mocha-plain" },
    ],
  },
  {
    step: "03",
    title: "Database",
    subtitle: "Models, queries, and data that stays consistent.",
    Icon: SkillsCatIconDatabase,
    items: [
      { label: "MongoDB", desc: "Document modeling and flexible schemas.", icon: "devicon-mongodb-plain" },
      { label: "MySQL", desc: "Relational tables, joins, and integrity.", icon: "devicon-mysql-original" },
      { label: "Schema Design", desc: "Keys, indexes, and normalization tradeoffs.", icon: "devicon-graphql-plain" },
      { label: "Query Optimization", desc: "Plans, profiling, and efficient access paths.", customIcon: "queryOpt" },
    ],
  },
  {
    step: "04",
    title: "Tools & Workflow",
    subtitle: "Shipping quality with disciplined collaboration.",
    Icon: SkillsCatIconTools,
    items: [
      { label: "Git & GitHub", desc: "Branching, reviews, and clean history.", customIcon: "gitGithub" },
      { label: "Postman", desc: "Collections, environments, and API validation.", icon: "devicon-postman-plain" },
      { label: "Jira", desc: "Backlogs, sprints, and traceable delivery.", customIcon: "jira" },
      { label: "Claude Code", desc: "Agent-assisted coding, refactors, and reviews.", customIcon: "claude", isNew: true },
    ],
  },
];

function SkillsSkillRow({ item }) {
  let inner = null;
  switch (item.customIcon) {
    case "claude":
      inner = <SkillsIconClaude />;
      break;
    case "restApi":
      inner = <SkillsIconRestApi />;
      break;
    case "auth":
      inner = <SkillsIconAuth />;
      break;
    case "componentArch":
      inner = <SkillsIconComponentArch />;
      break;
    case "jira":
      inner = <SkillsIconJira />;
      break;
    case "queryOpt":
      inner = <SkillsIconQueryOpt />;
      break;
    case "gitGithub":
      inner = <SkillsIconGitGithub />;
      break;
    default:
      inner = item.icon ? <i className={`devicon ${item.icon} colored`} style={styles.skillsDevIcon} aria-hidden /> : null;
  }

  return (
    <div className="skills-row-item" style={styles.skillsItemRow}>
      <div style={styles.skillsItemIconWrap}>{inner}</div>
      <div style={styles.skillsItemText}>
        <div style={styles.skillsItemTitle}>
          {item.label}
          {item.isNew ? (
            <span style={styles.skillsNewBadge} aria-label="New">
              NEW
            </span>
          ) : null}
        </div>
        <div style={styles.skillsItemDesc}>{item.desc}</div>
      </div>
    </div>
  );
}

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

  const [layout, setLayout] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia("(max-width: 640px)").matches) return "mobile";
    if (window.matchMedia("(max-width: 1024px)").matches) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const qM = window.matchMedia("(max-width: 640px)");
    const qT = window.matchMedia("(max-width: 1024px)");
    const fn = () => {
      if (qM.matches) setLayout("mobile");
      else if (qT.matches) setLayout("tablet");
      else setLayout("desktop");
    };
    fn();
    qM.addEventListener("change", fn);
    qT.addEventListener("change", fn);
    return () => {
      qM.removeEventListener("change", fn);
      qT.removeEventListener("change", fn);
    };
  }, []);

  const renderDesktopTimeline = () => (
    <div style={styles.skillsTimelineWrap}>
      <div style={styles.skillsTLLine} aria-hidden />
      <div style={styles.skillsTLNodes} aria-hidden>
        <span style={{ ...styles.skillsTLNode, left: "25%" }} />
        <span style={{ ...styles.skillsTLNode, left: "50%" }} />
        <span style={{ ...styles.skillsTLNode, left: "75%" }} />
      </div>
      <div style={styles.skillsTLGrid}>
        {SKILLS_COLUMNS.map((col) => (
          <div key={col.title} style={styles.skillsTLCell}>
            <div style={styles.skillsColIconRing}>
              <col.Icon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabletPair = (pair) => (
    <div key={pair[0].title} style={styles.skillsTimelineWrapTablet}>
      <div style={styles.skillsTLLineTablet} aria-hidden />
      <span style={styles.skillsTLNodeTablet} aria-hidden />
      <div style={styles.skillsTLGridTablet}>
        {pair.map((col) => (
          <div key={col.title} style={styles.skillsTLCell}>
            <div style={styles.skillsColIconRing}>
              <col.Icon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="portfolio-skills-root" style={styles.skillsRoot}>
      <div style={styles.skillsParticleL} aria-hidden />
      <div style={styles.skillsParticleR} aria-hidden />
      <div style={styles.skillsGlowTL} aria-hidden />
      <div style={styles.skillsGlowBR} aria-hidden />
      <div
        style={{
          ...styles.skillsShell,
          ...(layout === "mobile"
            ? { padding: "clamp(14px, 3vw, 20px) clamp(12px, 3.5vw, 18px) clamp(20px, 4vw, 28px)" }
            : null),
        }}
      >
        <div style={styles.skillsPillToolbar}>
          <div style={styles.skillsPill}>
            <span style={styles.skillsPillRocket} aria-hidden>
              🚀
            </span>
            <span style={styles.skillsPillText}>
              Always <span style={styles.skillsPillHi}>Learning.</span> Always <span style={styles.skillsPillHi2}>Building.</span>
            </span>
          </div>
        </div>

        {layout === "desktop" ? (
          <>
            {renderDesktopTimeline()}
            <div style={styles.skillsColumnsGrid}>
              {SKILLS_COLUMNS.map((col) => (
                <SkillsColumnBody key={col.title} col={col} omitCategoryIcon />
              ))}
            </div>
          </>
        ) : null}

        {layout === "tablet" ? (
          <div style={styles.skillsTabletChunks}>
            <div style={styles.skillsTabletChunk}>
              {renderTabletPair(SKILLS_COLUMNS.slice(0, 2))}
              <div style={styles.skillsColumnsGridTablet}>
                {SKILLS_COLUMNS.slice(0, 2).map((col) => (
                  <SkillsColumnBody key={col.title} col={col} omitCategoryIcon />
                ))}
              </div>
            </div>
            <div style={styles.skillsTabletChunk}>
              {renderTabletPair(SKILLS_COLUMNS.slice(2, 4))}
              <div style={styles.skillsColumnsGridTablet}>
                {SKILLS_COLUMNS.slice(2, 4).map((col) => (
                  <SkillsColumnBody key={col.title} col={col} omitCategoryIcon />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {layout === "mobile" ? (
            <div style={styles.skillsMobileStack}>
            {SKILLS_COLUMNS.map((col) => (
              <div key={col.title} style={styles.skillsMobileBlock}>
                <div style={styles.skillsMobileRail} aria-hidden>
                  <div style={styles.skillsMobileDot} />
                  <div style={styles.skillsMobileRailLine} />
                </div>
                <div style={styles.skillsMobileMain}>
                  <SkillsColumnBody col={col} subtitleWide />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SkillsColumnBody({ col, omitCategoryIcon, subtitleWide }) {
  return (
    <div style={styles.skillsColumn}>
      <div style={omitCategoryIcon ? { ...styles.skillsColHead, ...styles.skillsColHeadBelow } : styles.skillsColHead}>
        {!omitCategoryIcon ? (
          <div style={styles.skillsColIconRing}>
            <col.Icon />
          </div>
        ) : null}
        <div style={styles.skillsStepPill}>{col.step}</div>
        <h3 style={styles.skillsColTitle}>{col.title}</h3>
        <p style={{ ...styles.skillsColSubtitle, ...(subtitleWide ? styles.skillsColSubtitleMobile : null) }}>{col.subtitle}</p>
      </div>
      <div style={styles.skillsCard}>
        {col.items.map((item) => (
          <SkillsSkillRow key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}



/* =========================
   EXPERIENCE
========================= */

function ExpIconDefs() {
  return (
    <defs>
      <linearGradient id="portfolio-exp-icon-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e9d5ff" />
        <stop offset="0.5" stopColor="#c084fc" />
        <stop offset="1" stopColor="#818cf8" />
      </linearGradient>
    </defs>
  );
}

function ExpCartHero() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM3 4h2l1.6 8.59a1 1 0 0 0 1 .82H17a1 1 0 0 0 .95-.68l1.6-6.73H7"
        stroke="white"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpIconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.5" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
function ExpIconLayout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="7" height="9" rx="1.2" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" />
      <rect x="14" y="3" width="7" height="5" rx="1.2" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" />
      <rect x="14" y="11" width="7" height="10" rx="1.2" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" />
      <rect x="3" y="15" width="7" height="6" rx="1.2" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" />
    </svg>
  );
}
function ExpIconPackage() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" strokeLinejoin="round" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ExpIconTruck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" strokeLinejoin="round" />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.45" />
    </svg>
  );
}
function ExpIconCheckCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.5" />
      <path d="M8 12l2.5 2.5L16 9" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ExpIconTrend() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17l6-6 4 4 7-7" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8h7v7" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ExpIconPause() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.5" />
      <path d="M10 9v6M14 9v6" stroke="url(#portfolio-exp-icon-grad)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const EXP_TIMELINE_ITEMS = [
  {
    text: "Partnered with stakeholders to gather requirements and translate them into product features and system workflows",
    Icon: ExpIconPeople,
  },
  {
    text: "Defined homepage UX structure, navigation flows, and promotional modules",
    Icon: ExpIconLayout,
  },
  {
    text: "Configured product categories, metadata, inventory workflows, and campaigns",
    Icon: ExpIconPackage,
  },
  {
    text: "Implemented curbside pickup workflow + checkout metadata capture",
    Icon: ExpIconTruck,
  },
  {
    text: "Directed functional validation of cart, checkout, and content updates",
    Icon: ExpIconCheckCircle,
  },
  {
    text: "Platform ~75% complete; final integrations (DoorDash, Instacart) pending",
    Icon: ExpIconTrend,
  },
  {
    text: "Project currently on hold due to unforeseen external circumstances",
    Icon: ExpIconPause,
  },
];

function ExperienceCard() {
  const [stacked, setStacked] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 720px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const fn = () => setStacked(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <div className="portfolio-exp-root" style={styles.expRoot}>
      <div style={styles.expParticleLeft} aria-hidden />
      <div style={styles.expParticleRight} aria-hidden />
      <div style={styles.expShell}>
        <svg width="0" height="0" aria-hidden style={{ position: "absolute", overflow: "hidden" }}>
          <ExpIconDefs />
        </svg>
        <div style={styles.expGlowTL} aria-hidden />
        <div style={styles.expGlowBR} aria-hidden />

        <div style={{ ...styles.expHeader, ...(stacked ? styles.expHeaderStacked : null) }}>
          <div style={{ ...styles.expHeaderCartCol, ...(stacked ? styles.expHeaderCartColStacked : null) }}>
            <div style={styles.expCartHeroRing}>
              <ExpCartHero />
            </div>
          </div>
          <div style={{ ...styles.expHeaderMain, ...(stacked ? styles.expHeaderMainStacked : null) }}>
            <div style={{ ...styles.expCompanyBadge, ...(stacked ? styles.expCompanyBadgeStacked : null) }}>GK Business Group</div>
            <h3 style={styles.expRoleTitle}>E-Commerce Platform Product & Implementation Lead</h3>
            <div style={styles.expTechLine}>WordPress • WooCommerce • Elementor • PHP • MySQL</div>
          </div>
          <div style={{ ...styles.expDateCol, ...(stacked ? styles.expDateColStacked : null) }}>
            <div style={{ ...styles.expDateBadge, ...(stacked ? styles.expDateBadgeStacked : null) }}>Dec 2025 • Current</div>
            <div style={{ ...styles.expDateLocation, ...(stacked ? styles.expDateLocationStacked : null) }}>Hayward, CA</div>
          </div>
        </div>

        <div style={styles.expDivider} aria-hidden />

        <div style={styles.expTimelineBlock}>
          <div style={styles.expTimelineLine} aria-hidden />
          <ul style={styles.expTimelineRows}>
            {EXP_TIMELINE_ITEMS.map(({ text, Icon }) => (
              <li key={text} className="exp-bullet-row" style={styles.expRow}>
                <div style={styles.expRowGutter}>
                  <div style={styles.expTimelineDot} aria-hidden />
                </div>
                <div style={styles.expRowContent}>
                  <div style={styles.expRowIconRing}>
                    <Icon />
                  </div>
                  <span style={styles.expDiamond} aria-hidden>
                    ◆
                  </span>
                  <p style={styles.expRowText}>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}



/* =========================
   PROJECTS
========================= */

function projectBadgeAccent(badge) {
  switch (badge) {
    case "React + Vite":
      return { border: "1px solid rgba(34, 211, 238, 0.42)", color: "rgba(165, 243, 252, 0.95)", glow: "rgba(34, 211, 238, 0.35)" };
    case "WordPress":
      return { border: "1px solid rgba(96, 165, 250, 0.45)", color: "rgba(191, 219, 254, 0.95)", glow: "rgba(59, 130, 246, 0.3)" };
    case "QA / Automation":
      return { border: "1px solid rgba(244, 114, 182, 0.45)", color: "rgba(251, 207, 232, 0.95)", glow: "rgba(244, 114, 182, 0.28)" };
    case "Java":
      return { border: "1px solid rgba(251, 146, 60, 0.45)", color: "rgba(254, 215, 170, 0.95)", glow: "rgba(249, 115, 22, 0.28)" };
    case "C++":
      return { border: "1px solid rgba(129, 140, 248, 0.5)", color: "rgba(199, 210, 254, 0.95)", glow: "rgba(99, 102, 241, 0.28)" };
    case "Python":
      return { border: "1px solid rgba(250, 204, 21, 0.42)", color: "rgba(253, 224, 71, 0.95)", glow: "rgba(234, 179, 8, 0.25)" };
    default:
      return { border: "1px solid rgba(148, 163, 184, 0.35)", color: "rgba(226, 232, 240, 0.9)", glow: "rgba(148, 163, 184, 0.2)" };
  }
}

function projectDeviconClass(badge) {
  switch (badge) {
    case "React + Vite":
      return "devicon-react-original";
    case "Java":
      return "devicon-java-plain";
    case "Python":
      return "devicon-python-plain";
    case "C++":
      return "devicon-cplusplus-plain";
    case "QA / Automation":
      return "devicon-selenium-original";
    case "WordPress":
      return "devicon-wordpress-plain";
    default:
      return "devicon-github-original";
  }
}

function Projects() {
  useEffect(() => {
    const id = "devicon-css";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css";
    document.head.appendChild(link);
  }, []);

  const [layout, setLayout] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia("(max-width: 640px)").matches) return "mobile";
    if (window.matchMedia("(max-width: 1024px)").matches) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const qM = window.matchMedia("(max-width: 640px)");
    const qT = window.matchMedia("(max-width: 1024px)");
    const fn = () => {
      if (qM.matches) setLayout("mobile");
      else if (qT.matches) setLayout("tablet");
      else setLayout("desktop");
    };
    fn();
    qM.addEventListener("change", fn);
    qT.addEventListener("change", fn);
    return () => {
      qM.removeEventListener("change", fn);
      qT.removeEventListener("change", fn);
    };
  }, []);

  const items = [
    {
      name: "Mannat Portfolio (this site)",
      badge: "React + Vite",
      desc: "Personal portfolio with interactive sections, contact flow, and built-in arcade experiences.",
      tags: ["React", "JavaScript", "Vite"],
      href: "https://github.com/mmannat/mannat-portfolio",
    },
    {
      name: "Great Indian Grocery — E-Commerce Redesign + QA Case Study",
      badge: "WordPress",
      desc: "Storefront UX redesign with structured QA coverage and rollout-ready documentation.",
      tags: ["WordPress", "JavaScript", "PHP"],
      href: "https://github.com/mmannat/great-indian-grocery-ecommerce-platform",
    },
    {
      name: "QA Test Lab",
      badge: "QA / Automation",
      desc: "Case-study surface for API checks, bug tracking, and automation run history.",
      tags: ["JavaScript", "React", "Node.js"],
      href: "https://github.com/mmannat/mannat-portfolio",
    },
    {
      name: "android-zoo-directory",
      badge: "Java",
      desc: "Native Android directory app with list and detail flows for zoo exhibits.",
      tags: ["Java", "Android"],
      href: "https://github.com/mmannat/android-zoo-directory",
    },
    {
      name: "Student-Database-Management-System",
      badge: "C++",
      desc: "C++ data layer for student records, queries, and administrative workflows.",
      tags: ["C++", "CLI"],
      href: "https://github.com/mmannat/Student-Database-Management-System",
    },
    {
      name: "tic-tac-toe-game",
      badge: "Python",
      desc: "Classic game logic with a focused, readable Python implementation.",
      tags: ["Python", "Game logic"],
      href: "https://github.com/mmannat/tic-tac-toe-game",
    },
  ];

  const isCompact = layout === "mobile" || layout === "tablet";
  const gutterW = layout === "mobile" ? 36 : layout === "tablet" ? 42 : 48;

  return (
    <div className="portfolio-projects-root" style={styles.prRoot}>
      <div style={{ ...styles.prTimelineHost, ...(isCompact ? styles.prTimelineHostCompact : null) }}>
        <div
          style={{
            ...styles.prTimelineRail,
            left: gutterW / 2 - 1,
          }}
          aria-hidden
        />

        <div style={styles.prTimelineRows}>
          {items.map((p) => {
            const accent = projectBadgeAccent(p.badge);
            const iconClass = projectDeviconClass(p.badge);
            return (
              <div key={p.name} style={{ ...styles.prRow, ...(layout === "mobile" ? styles.prRowMobile : null) }}>
                <div style={{ ...styles.prGutter, width: gutterW }}>
                  <div style={styles.prNode} aria-hidden />
                </div>
                <a href={p.href} target="_blank" rel="noreferrer" style={{ ...styles.prCard, ...(layout === "mobile" ? styles.prCardMobile : null) }} className="pr-project-card">
                  <div
                    style={{
                      ...styles.prIconShell,
                      ...(layout === "mobile" ? styles.prIconShellMobile : null),
                      boxShadow: `0 0 28px ${accent.glow}, 0 12px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`,
                    }}
                  >
                    <i className={`devicon ${iconClass} colored`} style={styles.prIconDev} aria-hidden />
                  </div>
                  <div style={styles.prCardMain}>
                    <div
                      style={{
                        ...styles.prTitleRow,
                        ...(layout === "mobile" ? styles.prTitleRowMobile : null),
                      }}
                    >
                      <h3 style={{ ...styles.prCardTitle, ...(layout === "mobile" ? styles.prCardTitleMobile : null) }}>{p.name}</h3>
                      <div
                        style={{
                          ...styles.prBadge,
                          border: accent.border,
                          color: accent.color,
                          ...(layout === "mobile" ? styles.prBadgeMobile : null),
                        }}
                      >
                        {p.badge}
                      </div>
                    </div>
                    <p style={{ ...styles.prCardDesc, ...(layout === "mobile" ? styles.prCardDescMobile : null) }}>{p.desc}</p>
                    <div style={styles.prCardFooter}>
                      <div style={styles.prTags}>
                        {p.tags.map((t) => (
                          <span key={t} style={styles.prTag}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <span style={styles.prViewLink}>View Project →</span>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...styles.prCtaWrap, ...(layout === "mobile" ? styles.prCtaWrapMobile : null) }}>
        <a
          href="https://github.com/mmannat?tab=repositories"
          target="_blank"
          rel="noreferrer"
          style={styles.prCtaBtn}
          className="pr-cta-btn"
        >
          Explore More Projects →
        </a>
      </div>
    </div>
  );
}

/* =========================
   CONTACT
========================= */

function IconContactMapPin({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" aria-hidden style={{ display: "block" }}>
      <path d="M12 21s-8-4.5-8-11a8 8 0 0 1 16 0c0 6.5-8 11-8 11z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconContactClock({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden style={{ display: "block", opacity: 0.75 }}>
      <circle cx="12" cy="12" r="9" strokeLinecap="round" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const [errMsg, setErrMsg] = useState("");
  const [wide, setWide] = useState(() => (typeof window !== "undefined" ? window.matchMedia("(min-width: 900px)").matches : true));
  const [touchUi, setTouchUi] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 640px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = () => setWide(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setTouchUi(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const id = "contact-inline-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      .portfolio-contact-flush .contact-social-pill {
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .portfolio-contact-flush .contact-social-pill:hover {
        border-color: rgba(244, 114, 182, 0.5);
        box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.22), 0 10px 28px rgba(0, 0, 0, 0.35);
        background: rgba(255, 255, 255, 0.05);
      }
      .portfolio-contact-flush .contact-send-btn:hover:not(:disabled) {
        filter: brightness(1.05);
        box-shadow: 0 14px 36px rgba(236, 72, 153, 0.22);
      }
    `;
    document.head.appendChild(el);
    return () => {
      const old = document.getElementById(id);
      if (old) old.remove();
    };
  }, []);

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
      setTimeout(() => setStatus("idle"), 2800);
    } catch (e) {
      setStatus("err");
      setErrMsg(e.message || "Error");
    }
  };

  const iconOrb = {
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "1px solid rgba(244, 114, 182, 0.42)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fb7185",
    flexShrink: 0,
    background: "rgba(244, 114, 182, 0.07)",
    boxShadow: "0 0 20px rgba(236, 72, 153, 0.08)",
  };

  const rowLabel = { fontWeight: 700, fontSize: 14, color: "rgba(248, 250, 252, 0.96)", letterSpacing: "0.01em" };
  const rowMeta = { fontSize: 13.5, fontWeight: 600, color: "rgba(148, 163, 184, 0.95)", marginTop: 3 };

  const inputBase = {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 14,
    border: "1px solid rgba(255, 255, 255, 0.07)",
    padding: touchUi ? "14px 14px" : "12px 14px",
    outline: "none",
    fontWeight: 600,
    fontSize: touchUi ? 16 : 14,
    color: "rgba(248, 250, 252, 0.96)",
    background: "rgba(3, 4, 12, 0.72)",
    fontFamily: "inherit",
    minHeight: touchUi ? 48 : undefined,
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #030308 0%, #0a0814 40%, #05040a 100%), radial-gradient(72% 52% at 94% 6%, rgba(168, 85, 247, 0.07), transparent 58%), radial-gradient(62% 48% at 6% 94%, rgba(236, 72, 153, 0.045), transparent 56%)",
        border: "1px solid rgba(139, 92, 246, 0.18)",
        boxShadow:
          "0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 0 40px rgba(76, 29, 149, 0.05)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          display: wide ? "grid" : "flex",
          flexDirection: wide ? undefined : "column",
          gridTemplateColumns: wide ? "minmax(0, 1fr) auto minmax(0, 1fr)" : undefined,
          alignItems: wide ? "stretch" : undefined,
          minHeight: wide ? 380 : undefined,
        }}
      >
        {/* Left: contact info */}
        <div
          style={{
            padding: "clamp(22px, 4vw, 36px)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            order: wide ? undefined : 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(244, 114, 182, 0.95)",
              }}
            >
              CONTACT ME
            </span>
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.65rem, 3.2vw, 2.15rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "rgba(248, 250, 252, 0.98)",
              letterSpacing: "-0.02em",
            }}
          >
            Keep in{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #fb7185, #e879f9, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              touch
            </span>
          </h2>

          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "rgba(148, 163, 184, 0.92)", maxWidth: 400 }}>
            Share anything — a project, an idea, or just a hello. I&apos;d love to hear from you!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={iconOrb} aria-hidden>
                <IconMail />
              </div>
              <div>
                <div style={rowLabel}>Email</div>
                <a href="mailto:mmannat313@gmail.com" style={{ ...rowMeta, color: "rgba(196, 181, 253, 0.95)", textDecoration: "none" }}>
                  mmannat313@gmail.com
                </a>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={iconOrb} aria-hidden>
                <IconContactMapPin />
              </div>
              <div>
                <div style={rowLabel}>Location</div>
                <div style={rowMeta}>Hayward, CA</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingTop: 10, flexWrap: "wrap" }}>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="contact-social-pill"
              style={{
                flex: "1 1 calc(50% - 5px)",
                minWidth: "min(100%, 140px)",
                minHeight: 46,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "rgba(248, 250, 252, 0.92)",
                textDecoration: "none",
                fontWeight: 650,
                fontSize: 13,
                background: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <IconGitHub />
              GitHub
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="contact-social-pill"
              style={{
                flex: "1 1 calc(50% - 5px)",
                minWidth: "min(100%, 140px)",
                minHeight: 46,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "rgba(248, 250, 252, 0.92)",
                textDecoration: "none",
                fontWeight: 650,
                fontSize: 13,
                background: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <IconLinkedIn />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Divider */}
        {wide ? (
          <div
            aria-hidden
            style={{
              position: "relative",
              width: 1,
              alignSelf: "stretch",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(244, 114, 182, 0.28) 18%, rgba(167, 139, 250, 0.42) 50%, rgba(244, 114, 182, 0.28) 82%, transparent 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) rotate(45deg)",
                width: 7,
                height: 7,
                borderRadius: 2,
                background: "linear-gradient(135deg, #fb7185, #c084fc)",
                boxShadow: "0 0 16px rgba(236, 72, 153, 0.75), 0 0 26px rgba(167, 139, 250, 0.35)",
              }}
            />
          </div>
        ) : (
          <div
            aria-hidden
            style={{
              order: 2,
              height: 1,
              margin: "0 clamp(18px, 4vw, 28px)",
              background:
                "linear-gradient(90deg, transparent, rgba(244, 114, 182, 0.3), rgba(167, 139, 250, 0.45), rgba(244, 114, 182, 0.3), transparent)",
            }}
          />
        )}

        {/* Right: form */}
        <div
          style={{
            padding: "clamp(22px, 4vw, 36px)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            order: wide ? undefined : 3,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "rgba(248, 250, 252, 0.96)",
              letterSpacing: "-0.02em",
            }}
          >
            Send a message
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: wide ? "1fr 1fr" : "1fr", gap: 12 }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputBase} autoComplete="name" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={inputBase}
              type="email"
              autoComplete="email"
            />
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={5}
            style={{ ...inputBase, minHeight: 120, resize: "vertical", lineHeight: 1.5 }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              onClick={send}
              disabled={status === "sending"}
              className="contact-send-btn"
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: 14,
                border: "none",
                fontWeight: 700,
                fontSize: 15,
                cursor: status === "sending" ? "wait" : "pointer",
                color: "white",
                opacity: status === "sending" ? 0.75 : 1,
                pointerEvents: status === "sending" ? "none" : "auto",
                background: "linear-gradient(90deg, #ec4899, #d946ef, #a855f7)",
                boxShadow: "0 12px 32px rgba(168, 85, 247, 0.18)",
                transition: "filter 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              {status === "sending" ? "Sending…" : "Send Message →"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", minHeight: 28 }}>
              {status === "ok" && (
                <div style={styles.contactStatusOk}>Message sent — I&apos;ll get back to you soon.</div>
              )}
              {status === "err" && <div style={styles.contactStatusErr}>{errMsg}</div>}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 2,
              fontSize: 12.5,
              color: "rgba(148, 163, 184, 0.88)",
            }}
          >
            <span style={{ color: "rgba(244, 114, 182, 0.55)", display: "flex" }}>
              <IconContactClock />
            </span>
            I typically respond within 24–48 hours.
          </div>
        </div>
      </div>
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
   STYLES
========================= */

const styles = {
  

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #05060f 0%, #080a14 38%, #0b0f1a 100%), radial-gradient(90% 55% at 15% 20%, rgba(88, 28, 135, 0.12), transparent 52%), radial-gradient(70% 50% at 85% 75%, rgba(236, 72, 153, 0.06), transparent 48%)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Arial, sans-serif',
    color: "rgba(226, 232, 240, 0.96)",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  shell: {
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    display: "flex",
    alignItems: "stretch",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  shellMobile: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  sidebar: {
    position: "sticky",
    top: 0,
    width: 280,
    minWidth: 280,
    boxSizing: "border-box",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "22px 16px 18px",
    background:
      "linear-gradient(165deg, #07060d 0%, #0c0a14 42%, #05040a 100%), radial-gradient(120% 80% at 10% 0%, rgba(124, 58, 237, 0.22), transparent 55%), radial-gradient(90% 60% at 100% 30%, rgba(59, 130, 246, 0.12), transparent 50%)",
    borderRight: "1px solid rgba(139, 92, 246, 0.14)",
    boxShadow:
      "inset -1px 0 0 rgba(255,255,255,0.04), 0 0 60px rgba(76, 29, 149, 0.25)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    overflowY: "auto",
    overflowX: "hidden",
  },

  sidebarCollapsed: {
    width: 84,
    minWidth: 84,
    padding: "18px 10px 14px",
    alignItems: "stretch",
  },

  sidebarMobile: {
    position: "relative",
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    height: "auto",
    minHeight: 0,
    borderRight: "none",
    borderBottom: "1px solid rgba(139, 92, 246, 0.18)",
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    padding: "14px clamp(12px, 4vw, 16px) 16px",
    boxSizing: "border-box",
  },

  sidebarCollapseBtn: {
    position: "absolute",
    top: 14,
    right: 12,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(226, 232, 240, 0.75)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    fontFamily: "inherit",
    transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
  },

  profileWrap: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: "18px 14px 16px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(167,139,250,0.08)",
    marginTop: 8,
  },

  profileWrapCollapsed: {
    padding: "12px 8px",
    marginTop: 36,
  },

  avatarOuter: {
    width: 96,
    height: 96,
    borderRadius: 999,
    margin: "0 auto 12px",
    padding: 3,
    background: "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(99,102,241,0.75), rgba(168,85,247,0.55))",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.08), 0 0 28px rgba(168, 85, 247, 0.45), 0 12px 28px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },

  avatarOuterCollapsed: {
    width: 44,
    height: 44,
    margin: "0 auto 6px",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    objectFit: "cover",
    display: "block",
  },

  name: {
    color: "#fafafa",
    fontWeight: 800,
    letterSpacing: "0.06em",
    fontSize: 24,
    lineHeight: 1.15,
  },

  nameInitial: {
    color: "#fafafa",
    fontWeight: 900,
    fontSize: 15,
    marginTop: 2,
    letterSpacing: "0.04em",
  },

  tagline: {
    color: "rgba(196, 181, 253, 0.9)",
    marginTop: 8,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.02em",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
    minHeight: 0,
  },

  navMobile: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    flex: "none",
    width: "100%",
  },

  sideNavItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "11px 14px",
    borderRadius: 14,
    border: "1px solid transparent",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(226, 232, 240, 0.72)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    transition:
      "background 0.22s ease, border-color 0.22s ease, color 0.22s ease, box-shadow 0.22s ease, transform 0.18s ease",
    boxShadow: "0 1px 0 rgba(255,255,255,0.03)",
  },

  sideNavItemActive: {
    background: "linear-gradient(135deg, rgba(109,56,255,0.38), rgba(79, 70, 229, 0.3))",
    border: "1px solid rgba(167, 139, 250, 0.38)",
    color: "#ffffff",
    boxShadow: "0 0 24px rgba(139, 92, 246, 0.28), 0 8px 22px rgba(0,0,0,0.35)",
    transform: "translateY(-1px)",
  },

  sideNavItemCollapsed: {
    justifyContent: "center",
    padding: "11px 8px",
    gap: 0,
  },

  sideNavItemMobile: {
    width: "100%",
    minWidth: 0,
    minHeight: 48,
    justifyContent: "flex-start",
    fontSize: 13,
    padding: "12px 12px",
    boxSizing: "border-box",
  },

  sideNavIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "inherit",
  },

  sideNavLabel: {
    flex: 1,
    textAlign: "left",
    lineHeight: 1.2,
  },

  sidebarFooter: {
    marginTop: "auto",
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "stretch",
  },

  sidebarFooterCollapsed: {
    alignItems: "center",
    paddingTop: 12,
    gap: 10,
  },

  sidebarFooterLine: {
    color: "rgba(203, 213, 225, 0.78)",
    fontSize: 12.5,
    fontWeight: 500,
    lineHeight: 1.45,
    textAlign: "center",
  },

  socialRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  },

  socialIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(248, 250, 252, 0.92)",
    textDecoration: "none",
    transition:
      "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease, color 0.2s ease",
    boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
  },

  sidebarCopyright: {
    color: "rgba(148, 163, 184, 0.78)",
    fontSize: 11,
    textAlign: "center",
    letterSpacing: "0.02em",
  },

  aboutSectionOuter: {
    marginTop: 18,
    background: "transparent",
    boxShadow: "none",
    border: "none",
    padding: 0,
  },

  aboutHeroShell: {
    position: "relative",
    borderRadius: 0,
    overflow: "visible",
    padding: "clamp(8px, 1.5vw, 14px) clamp(16px, 3vw, 24px) clamp(22px, 3.5vw, 34px)",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },

  aboutHeroGlowTR: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    top: "-18%",
    right: "-22%",
    width: "min(72%, 420px)",
    height: "min(48%, 320px)",
    background:
      "radial-gradient(ellipse at 60% 35%, rgba(216, 180, 254, 0.2) 0%, rgba(139, 92, 246, 0.07) 42%, transparent 72%)",
    filter: "blur(3px)",
    opacity: 0.55,
  },

  aboutHeroGlowBL: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    bottom: "-22%",
    left: "-18%",
    width: "min(65%, 380px)",
    height: "min(42%, 280px)",
    background:
      "radial-gradient(ellipse at 35% 65%, rgba(99, 102, 241, 0.16) 0%, rgba(124, 58, 237, 0.06) 48%, transparent 74%)",
    filter: "blur(3px)",
    opacity: 0.5,
  },

  aboutHeroInner: {
    position: "relative",
    zIndex: 1,
  },

  aboutHeroShellStacked: {
    padding: "22px clamp(16px, 3vw, 22px) 28px",
  },

  aboutHeroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.08fr) minmax(0, 0.92fr)",
    gap: "clamp(22px, 4vw, 40px)",
    alignItems: "start",
  },

  aboutHeroGridStacked: {
    gridTemplateColumns: "1fr",
    gap: 28,
  },

  aboutHeroColLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    minWidth: 0,
  },

  aboutHeroColRight: {
    minWidth: 0,
    position: "relative",
  },

  aboutHeroRightStack: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    width: "100%",
  },

  aboutMePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    padding: "7px 14px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: "rgba(216, 180, 254, 0.95)",
    background: "rgba(88, 28, 135, 0.35)",
    border: "1px solid rgba(167, 139, 250, 0.28)",
    boxShadow: "0 0 12px rgba(124, 58, 237, 0.1)",
    marginBottom: 18,
  },

  aboutHeroHeadline: {
    margin: 0,
    marginBottom: 18,
    maxWidth: 560,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  aboutHeroHeadlineLine1: {
    fontSize: "clamp(1.45rem, 2.6vw, 2.1rem)",
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#fafafa",
    letterSpacing: "-0.025em",
  },

  aboutHeroHeadlineLine2: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    fontSize: "clamp(1.45rem, 2.6vw, 2.1rem)",
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: "-0.025em",
  },

  aboutHeroGradientWrap: {
    display: "inline-block",
    filter: "drop-shadow(0 0 12px rgba(192, 132, 252, 0.22))",
  },

  aboutHeroGradient: {
    background: "linear-gradient(92deg, #d8b4fe, #e879f9, #a78bfa, #818cf8)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  },

  aboutHeroSparkleInline: {
    display: "inline-flex",
    alignItems: "center",
    color: "#d8b4fe",
    filter: "drop-shadow(0 0 6px rgba(168, 85, 247, 0.28))",
  },

  aboutHeroLead: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.65,
    color: "rgba(203, 213, 225, 0.88)",
    maxWidth: 520,
    marginBottom: 4,
  },

  aboutSkillRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 10,
    marginTop: 22,
    width: "100%",
    alignItems: "start",
  },

  aboutSkillRowStacked: {
    gap: 8,
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },

  aboutSkillRowPhone: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },

  aboutSkillCard: {
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 8px 12px",
    borderRadius: 13,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    background: "rgba(255, 255, 255, 0.045)",
    border: "1px solid rgba(167, 139, 250, 0.22)",
    boxShadow:
      "0 6px 20px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(0,0,0,0.18)",
  },

  aboutSkillCardDense: {
    padding: "9px 5px 10px",
  },

  aboutSkillCardIcon: {
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  aboutSkillCardTitle: {
    fontSize: 13,
    fontWeight: 750,
    color: "rgba(248, 250, 252, 0.95)",
    lineHeight: 1.22,
    wordBreak: "break-word",
  },

  aboutSkillCardTitleDense: {
    fontSize: 11.75,
    lineHeight: 1.18,
  },

  aboutSkillCardSub: {
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(196, 181, 253, 0.85)",
    marginTop: 2,
  },

  aboutSkillCardSubDense: {
    fontSize: 10,
  },

  aboutHeroCtaRowCompact: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    width: "min(100%, 440px)",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 8,
    marginBottom: 2,
    alignItems: "stretch",
  },

  aboutHeroCtaRowCompactStacked: {
    marginTop: 6,
    gridTemplateColumns: "1fr",
    width: "100%",
  },

  aboutBtnCtaStacked: {
    flex: "none",
    width: "100%",
  },

  aboutBtnPrimary: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 14px",
    minHeight: 44,
    borderRadius: 11,
    border: "1px solid transparent",
    fontFamily: "inherit",
    fontWeight: 750,
    fontSize: 13,
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg, #d946ef, #9333ea, #6366f1)",
    backgroundSize: "140% 140%",
    boxShadow:
      "0 8px 22px rgba(91, 33, 182, 0.32), 0 0 14px rgba(217, 70, 239, 0.12), inset 0 1px 0 rgba(255,255,255,0.12)",
    transition: "transform 0.18s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },

  aboutBtnGhost: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 14px",
    minHeight: 44,
    borderRadius: 11,
    border: "1px solid transparent",
    fontFamily: "inherit",
    fontWeight: 750,
    fontSize: 13,
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg, #4f46e5, #6366f1, #a855f7)",
    backgroundSize: "140% 140%",
    boxShadow:
      "0 8px 22px rgba(79, 70, 229, 0.28), 0 0 14px rgba(129, 140, 248, 0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
    transition: "transform 0.18s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },

  aboutTimeline: {
    position: "relative",
    paddingTop: 4,
    paddingBottom: 8,
  },

  aboutTimelineLine: {
    position: "absolute",
    left: 19,
    top: 12,
    bottom: 12,
    width: 2,
    borderRadius: 2,
    background: "linear-gradient(180deg, rgba(167, 139, 250, 0.55), rgba(99, 102, 241, 0.22), rgba(167, 139, 250, 0.1))",
    boxShadow: "0 0 8px rgba(139, 92, 246, 0.14)",
  },

  aboutTimelineRow: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "40px 52px minmax(0, 1fr)",
    columnGap: 12,
    alignItems: "start",
    marginBottom: 20,
  },

  aboutTimelineRowLast: {
    marginBottom: 0,
  },

  aboutTimelineDotCol: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 16,
  },

  aboutTimelineDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: "linear-gradient(135deg, #fae8ff, #c084fc)",
    boxShadow:
      "0 0 0 3px rgba(10, 8, 18, 0.98), 0 0 10px 2px rgba(192, 132, 252, 0.22), 0 0 18px rgba(139, 92, 246, 0.1)",
    zIndex: 1,
  },

  aboutTimelineIconRing: {
    width: 48,
    height: 48,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.045)",
    border: "1px solid rgba(167, 139, 250, 0.32)",
    boxShadow:
      "0 0 14px rgba(99, 102, 241, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
    marginTop: 4,
  },

  aboutTimelineTextCol: {
    paddingTop: 8,
    minWidth: 0,
  },

  aboutTimelineTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#f8fafc",
    letterSpacing: "-0.01em",
  },

  aboutTimelineBody: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 1.55,
    color: "rgba(186, 198, 220, 0.88)",
  },

  main: {
    flex: 1,
    padding: 22,
    maxWidth: "none",
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    color: "rgba(226, 232, 240, 0.94)",
  },

  mainMobile: {
    padding: "clamp(10px, 3vw, 14px) clamp(12px, 4vw, 16px) clamp(18px, 5vw, 26px)",
  },
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
    marginTop: 22,
    background: "rgba(12, 14, 24, 0.55)",
    borderRadius: 20,
    padding: "clamp(16px, 2.5vw, 22px)",
    boxShadow: "0 18px 48px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
    border: "1px solid rgba(51, 65, 107, 0.28)",
    scrollMarginTop: "clamp(72px, 16vw, 112px)",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 12,
    color: "rgba(248, 250, 252, 0.98)",
    letterSpacing: "-0.02em",
  },

  eduSectionOuter: {
    marginTop: 22,
    marginBottom: 0,
    padding: 0,
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    isolation: "isolate",
    maxWidth: "100%",
    boxSizing: "border-box",
    background:
      "linear-gradient(180deg, rgba(10, 12, 22, 0.92) 0%, rgba(6, 8, 18, 0.96) 100%), linear-gradient(158deg, #030308 0%, #0a0f18 44%, #05070c 100%), radial-gradient(72% 48% at 92% 10%, rgba(124, 58, 237, 0.11), transparent 56%), radial-gradient(58% 44% at 8% 88%, rgba(236, 72, 153, 0.05), transparent 54%)",
    border: "1px solid rgba(51, 65, 107, 0.38)",
    boxShadow:
      "0 22px 56px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255,255,255,0.045), 0 0 48px rgba(76, 29, 149, 0.07)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  },

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

  /* Education — premium banner (EducationCard only; Experience uses eduCard/eduTop/...) */
  eduBannerRoot: {
    position: "relative",
    width: "100%",
    borderRadius: 0,
    overflow: "hidden",
    isolation: "isolate",
  },

  eduBannerParticleLeft: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    left: "-5%",
    top: "0",
    width: "38%",
    height: "100%",
    opacity: 0.55,
    background:
      "radial-gradient(circle at 18% 24%, rgba(192, 132, 252, 0.35) 0, transparent 1.5px), radial-gradient(circle at 32% 62%, rgba(129, 140, 248, 0.28) 0, transparent 1.2px), radial-gradient(circle at 8% 78%, rgba(167, 139, 250, 0.22) 0, transparent 1px), radial-gradient(circle at 42% 40%, rgba(99, 102, 241, 0.2) 0, transparent 1.3px)",
    backgroundSize: "120px 120px",
    filter: "blur(0.35px)",
  },

  eduBannerParticleRight: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    right: "-6%",
    top: "0",
    width: "40%",
    height: "100%",
    opacity: 0.5,
    background:
      "radial-gradient(circle at 72% 32%, rgba(192, 132, 252, 0.32) 0, transparent 1.4px), radial-gradient(circle at 88% 58%, rgba(99, 102, 241, 0.26) 0, transparent 1.1px), radial-gradient(circle at 58% 82%, rgba(167, 139, 250, 0.2) 0, transparent 1.2px), radial-gradient(circle at 94% 18%, rgba(124, 58, 237, 0.18) 0, transparent 1px)",
    backgroundSize: "110px 110px",
    filter: "blur(0.35px)",
  },

  eduBannerShell: {
    position: "relative",
    zIndex: 1,
    borderRadius: 0,
    overflow: "visible",
    padding: "clamp(18px, 3vw, 32px)",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },

  eduBannerGlowTL: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    top: "-20%",
    left: "-15%",
    width: "min(55%, 320px)",
    height: "min(50%, 240px)",
    background: "radial-gradient(ellipse at 40% 35%, rgba(216, 180, 254, 0.14) 0%, transparent 68%)",
    filter: "blur(4px)",
    opacity: 0.7,
  },

  eduBannerGlowBR: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    bottom: "-25%",
    right: "-18%",
    width: "min(58%, 340px)",
    height: "min(48%, 260px)",
    background: "radial-gradient(ellipse at 55% 60%, rgba(99, 102, 241, 0.12) 0%, transparent 70%)",
    filter: "blur(4px)",
    opacity: 0.65,
  },

  eduBannerGrid: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.02fr) 1px minmax(200px, 1.28fr) 1px minmax(0, 0.92fr)",
    gap: 0,
    columnGap: 0,
    alignItems: "stretch",
    minWidth: 0,
  },

  eduBannerGridStacked: {
    gridTemplateColumns: "1fr",
    rowGap: 0,
  },

  eduBannerColLeft: {
    minWidth: 0,
    paddingRight: "clamp(12px, 2vw, 20px)",
    display: "flex",
    alignItems: "stretch",
  },

  eduBannerColLeftStacked: {
    paddingRight: 0,
  },

  eduBannerVsep: {
    width: 1,
    alignSelf: "stretch",
    borderRadius: 1,
    background: "linear-gradient(180deg, transparent, rgba(167, 139, 250, 0.22) 12%, rgba(99, 102, 241, 0.18) 50%, rgba(167, 139, 250, 0.16) 88%, transparent)",
    boxShadow: "0 0 12px rgba(139, 92, 246, 0.08)",
  },

  eduBannerHsep: {
    width: "100%",
    height: 1,
    margin: "18px 0",
    borderRadius: 1,
    background: "linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.2) 15%, rgba(99, 102, 241, 0.16) 50%, rgba(167, 139, 250, 0.18) 85%, transparent)",
    boxShadow: "0 0 10px rgba(139, 92, 246, 0.06)",
  },

  eduBannerLeftInner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "clamp(14px, 2.2vw, 22px)",
    width: "100%",
    minWidth: 0,
  },

  eduBannerLeftInnerStacked: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 16,
  },

  eduBannerCapWrap: {
    width: "clamp(76px, 11vw, 96px)",
    height: "clamp(76px, 11vw, 96px)",
    flexShrink: 0,
    filter:
      "drop-shadow(0 0 18px rgba(167, 139, 250, 0.32)) drop-shadow(0 0 42px rgba(124, 58, 237, 0.14))",
  },

  eduBannerSchoolCol: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-start",
  },

  eduBannerSchoolColStacked: {
    alignItems: "center",
  },

  eduBannerBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 12px",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.14em",
    color: "rgba(255, 255, 255, 0.95)",
    background: "rgba(88, 28, 135, 0.42)",
    border: "1px solid rgba(167, 139, 250, 0.32)",
    boxShadow: "0 0 14px rgba(124, 58, 237, 0.12)",
  },

  eduBannerUni: {
    fontSize: "clamp(1rem, 1.65vw, 1.15rem)",
    fontWeight: 800,
    lineHeight: 1.22,
    color: "#f8fafc",
    letterSpacing: "-0.02em",
  },

  eduBannerDegree: {
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.45,
    color: "rgba(203, 213, 225, 0.9)",
  },

  eduBannerGradRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(148, 163, 184, 0.95)",
  },

  eduBannerColCenter: {
    minWidth: 0,
    padding: "0 clamp(8px, 1.5vw, 14px)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  eduBannerColCenterStacked: {
    padding: 0,
  },

  eduBannerColRight: {
    minWidth: 0,
    paddingLeft: "clamp(8px, 1.5vw, 16px)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    position: "relative",
  },

  eduBannerColRightStacked: {
    paddingLeft: 0,
    paddingTop: 4,
  },

  eduBannerSectionLabel: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(167, 139, 250, 0.72)",
    marginBottom: 2,
  },

  eduBannerFocusRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gridAutoRows: "auto",
    columnGap: "clamp(10px, 1.4vw, 14px)",
    rowGap: "clamp(10px, 1.4vw, 14px)",
    minWidth: 0,
    width: "100%",
  },

  eduBannerFocusRowStacked: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    columnGap: 12,
    rowGap: 12,
  },

  eduBannerFocusTile: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    padding: "14px 10px 16px",
    borderRadius: 16,
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(167, 139, 250, 0.16)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 22px rgba(0,0,0,0.22)",
    minHeight: 118,
    boxSizing: "border-box",
  },

  eduBannerFocusIconRing: {
    width: 48,
    height: 48,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "rgba(0, 0, 0, 0.22)",
    border: "1px solid rgba(167, 139, 250, 0.14)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
  },

  eduBannerFocusLabel: {
    fontSize: 11,
    fontWeight: 750,
    lineHeight: 1.35,
    textAlign: "center",
    color: "rgba(226, 232, 240, 0.92)",
    width: "100%",
    padding: "0 2px",
    boxSizing: "border-box",
    wordBreak: "normal",
    overflowWrap: "break-word",
  },

  eduBannerHighlightList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 11,
  },

  eduBannerHighlightLi: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    fontSize: "clamp(12.5px, 1.35vw, 14px)",
    lineHeight: 1.55,
    fontWeight: 500,
    color: "rgba(203, 213, 225, 0.9)",
  },

  eduBannerBullet: {
    flexShrink: 0,
    marginTop: 3,
    fontWeight: 800,
    color: "#c4b5fd",
    fontSize: 14,
    lineHeight: 1.3,
  },

  /* Experience — premium timeline (ExperienceCard only) */
  expRoot: {
    position: "relative",
    width: "100%",
    borderRadius: 0,
    overflow: "hidden",
    isolation: "isolate",
  },

  expParticleLeft: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    left: "-4%",
    top: 0,
    width: "36%",
    height: "100%",
    opacity: 0.45,
    background:
      "radial-gradient(circle at 20% 30%, rgba(192, 132, 252, 0.28) 0, transparent 1.4px), radial-gradient(circle at 35% 70%, rgba(99, 102, 241, 0.22) 0, transparent 1.1px)",
    backgroundSize: "100px 100px",
    filter: "blur(0.35px)",
  },

  expParticleRight: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    right: "-5%",
    top: 0,
    width: "38%",
    height: "100%",
    opacity: 0.4,
    background:
      "radial-gradient(circle at 78% 40%, rgba(192, 132, 252, 0.26) 0, transparent 1.3px), radial-gradient(circle at 60% 75%, rgba(129, 140, 248, 0.2) 0, transparent 1.1px)",
    backgroundSize: "110px 110px",
    filter: "blur(0.35px)",
  },

  expShell: {
    position: "relative",
    zIndex: 1,
    borderRadius: 0,
    overflow: "visible",
    padding: "clamp(18px, 3vw, 30px)",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },

  expGlowTL: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    top: "-18%",
    left: "-12%",
    width: "min(50%, 280px)",
    height: "min(42%, 220px)",
    background: "radial-gradient(ellipse at 45% 40%, rgba(216, 180, 254, 0.12) 0%, transparent 70%)",
    filter: "blur(4px)",
    opacity: 0.75,
  },

  expGlowBR: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    bottom: "-22%",
    right: "-10%",
    width: "min(55%, 300px)",
    height: "min(45%, 240px)",
    background: "radial-gradient(ellipse at 55% 55%, rgba(99, 102, 241, 0.1) 0%, transparent 72%)",
    filter: "blur(4px)",
    opacity: 0.65,
  },

  expHeader: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "76px minmax(0, 1fr) auto",
    gap: "clamp(14px, 2.5vw, 22px)",
    alignItems: "start",
  },

  expHeaderStacked: {
    gridTemplateColumns: "1fr",
    justifyItems: "stretch",
    rowGap: 16,
  },

  expHeaderCartCol: {
    width: 76,
    display: "flex",
    justifyContent: "center",
    flexShrink: 0,
  },

  expHeaderCartColStacked: {
    width: "100%",
    justifyContent: "center",
  },

  expCartHeroRing: {
    width: 72,
    height: 72,
    boxSizing: "border-box",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, rgba(124, 58, 237, 0.55), rgba(99, 102, 241, 0.35))",
    border: "1px solid rgba(196, 181, 253, 0.35)",
    boxShadow:
      "0 0 0 1px rgba(10, 8, 18, 0.5), 0 0 28px rgba(167, 139, 250, 0.35), 0 0 52px rgba(124, 58, 237, 0.15), inset 0 1px 0 rgba(255,255,255,0.12)",
  },

  expHeaderMain: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingTop: 2,
  },

  expHeaderMainStacked: {
    alignItems: "center",
    textAlign: "center",
  },

  expCompanyBadge: {
    display: "inline-flex",
    alignSelf: "flex-start",
    padding: "5px 12px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: "rgba(255, 255, 255, 0.95)",
    background: "rgba(88, 28, 135, 0.42)",
    border: "1px solid rgba(167, 139, 250, 0.32)",
    boxShadow: "0 0 14px rgba(124, 58, 237, 0.12)",
  },

  expCompanyBadgeStacked: {
    alignSelf: "center",
  },

  expRoleTitle: {
    margin: 0,
    fontSize: "clamp(1.1rem, 2.1vw, 1.35rem)",
    fontWeight: 800,
    lineHeight: 1.2,
    color: "#f8fafc",
    letterSpacing: "-0.02em",
  },

  expTechLine: {
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(148, 163, 184, 0.95)",
    lineHeight: 1.45,
  },

  expDateCol: {
    justifySelf: "end",
    alignSelf: "start",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 7,
    minWidth: 0,
  },

  expDateColStacked: {
    justifySelf: "stretch",
    alignItems: "center",
  },

  expDateBadge: {
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 750,
    color: "rgba(248, 250, 252, 0.95)",
    whiteSpace: "nowrap",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(167, 139, 250, 0.22)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 6px 18px rgba(0,0,0,0.25)",
  },

  expDateLocation: {
    fontSize: 11,
    fontWeight: 650,
    letterSpacing: "0.04em",
    color: "rgba(148, 163, 184, 0.92)",
    textAlign: "right",
    lineHeight: 1.3,
  },

  expDateLocationStacked: {
    width: "100%",
    textAlign: "center",
  },

  expDateBadgeStacked: {
    alignSelf: "stretch",
    textAlign: "center",
    whiteSpace: "normal",
  },

  expDivider: {
    position: "relative",
    zIndex: 2,
    height: 1,
    margin: "18px 0 6px",
    borderRadius: 1,
    background: "linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.18) 20%, rgba(99, 102, 241, 0.14) 50%, rgba(167, 139, 250, 0.18) 80%, transparent)",
  },

  expTimelineBlock: {
    position: "relative",
    zIndex: 1,
    marginTop: 8,
    paddingBottom: 4,
  },

  expTimelineLine: {
    position: "absolute",
    left: "calc(76px / 2)",
    /* Positive lead term = gap BELOW cart bottom (larger = line starts lower, never enters the ring) */
    top: "calc(32px - 27px - 72px)",
    bottom: 26,
    width: 2,
    transform: "translateX(-50%)",
    borderRadius: 2,
    background: "linear-gradient(180deg, rgba(244, 114, 182, 0.55), rgba(167, 139, 250, 0.45) 45%, rgba(99, 102, 241, 0.28) 100%)",
    boxShadow: "0 0 14px rgba(232, 121, 249, 0.2)",
    zIndex: 0,
  },

  expTimelineRows: {
    position: "relative",
    zIndex: 1,
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  expRow: {
    display: "grid",
    gridTemplateColumns: "76px minmax(0, 1fr)",
    alignItems: "start",
    columnGap: 0,
    boxSizing: "border-box",
    padding: "12px 10px 12px 0",
    margin: 0,
    borderRadius: 14,
    border: "1px solid transparent",
    transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
    listStyle: "none",
  },

  expRowGutter: {
    position: "relative",
    width: "100%",
    minWidth: 0,
    maxWidth: 76,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 14,
    boxSizing: "border-box",
  },

  expTimelineDot: {
    width: 11,
    height: 11,
    borderRadius: 999,
    flexShrink: 0,
    background: "linear-gradient(135deg, #fbcfe8, #e879f9, #a78bfa)",
    boxShadow:
      "0 0 0 2px rgba(10, 8, 18, 0.95), 0 0 14px 2px rgba(232, 121, 249, 0.45), 0 0 24px rgba(139, 92, 246, 0.2)",
    zIndex: 2,
  },

  expRowContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    minWidth: 0,
    paddingTop: 4,
  },

  expRowIconRing: {
    width: 42,
    height: 42,
    borderRadius: 999,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.22)",
    border: "1px solid rgba(167, 139, 250, 0.16)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 16px rgba(99, 102, 241, 0.08)",
  },

  expDiamond: {
    flexShrink: 0,
    marginTop: 8,
    fontSize: 7,
    lineHeight: 1,
    color: "#a78bfa",
    textShadow: "0 0 10px rgba(167, 139, 250, 0.45)",
  },

  expRowText: {
    margin: 0,
    flex: 1,
    minWidth: 0,
    fontSize: "clamp(13px, 1.35vw, 14.5px)",
    lineHeight: 1.58,
    fontWeight: 500,
    color: "rgba(203, 213, 225, 0.93)",
  },

  /* Resume — premium glass (matches skillsShell / prRoot) */
  resumeRoot: {
    marginTop: 0,
    padding: 0,
    borderRadius: 0,
    overflow: "visible",
    isolation: "auto",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },

  portfolioUnifiedHeader: {
    padding: "clamp(14px, 2.4vw, 20px) clamp(16px, 3vw, 24px) clamp(8px, 1.4vw, 12px)",
    borderBottom: "none",
  },
  portfolioUnifiedHeaderTop: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    flexWrap: "wrap",
  },
  portfolioUnifiedHeaderTitles: {
    flex: 1,
    minWidth: 0,
  },
  portfolioUnifiedHeaderTitle: {
    margin: 0,
    fontSize: "clamp(1.45rem, 2.4vw, 1.85rem)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "rgba(248, 250, 252, 0.98)",
  },

  resumeHeader: {
    padding: "0 clamp(16px, 3vw, 24px) clamp(18px, 2.5vw, 22px)",
    borderBottom: "1px solid rgba(51, 65, 107, 0.35)",
  },
  resumeHeaderStacked: {
    paddingBottom: 16,
  },
  resumeHeaderTop: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  resumeHeaderIconGrad: {
    flexShrink: 0,
    padding: 1,
    borderRadius: 12,
    background: "linear-gradient(135deg, #d946ef, #9333ea, #6366f1)",
    boxShadow: "0 0 18px rgba(147, 51, 234, 0.22)",
  },
  resumeHeaderIconInner: {
    width: 42,
    height: 42,
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #0b1224, #070b14)",
  },
  resumeHeaderTitles: {
    flex: 1,
    minWidth: 0,
  },
  resumeHeaderTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  resumeHeaderTitle: {
    margin: 0,
    fontSize: "clamp(1.45rem, 2.4vw, 1.85rem)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "rgba(248, 250, 252, 0.98)",
  },
  resumeHeaderSub: {
    margin: "8px 0 0",
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 500,
    color: "rgba(148, 163, 184, 0.92)",
    maxWidth: 520,
  },
  resumeGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
    gap: 20,
    padding: "clamp(16px, 2.5vw, 24px) clamp(16px, 3vw, 24px) 4px",
    alignItems: "stretch",
  },
  resumeGridStacked: {
    gridTemplateColumns: "1fr",
    gap: 16,
    paddingTop: 16,
  },
  resumeHeroCard: {
    position: "relative",
    borderRadius: 16,
    padding: "clamp(20px, 3vw, 28px)",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(51, 65, 107, 0.35)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 36px rgba(0, 0, 0, 0.28)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 14,
  },
  resumeHeroCardStacked: {
    minHeight: 0,
  },
  resumeHeroGlow: {
    position: "absolute",
    pointerEvents: "none",
    top: "-30%",
    left: "-15%",
    width: "70%",
    height: "70%",
    background: "radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.16) 0%, transparent 65%)",
    filter: "blur(2px)",
    opacity: 0.85,
  },
  resumeHeroIconGrad: {
    position: "relative",
    zIndex: 1,
    padding: 2,
    borderRadius: 16,
    background: "linear-gradient(135deg, #d946ef, #9333ea, #6366f1)",
    boxShadow: "0 0 28px rgba(147, 51, 234, 0.25)",
  },
  resumeHeroIconInner: {
    width: 72,
    height: 72,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #0b1224, #070b14)",
  },
  resumeHeroHeading: {
    position: "relative",
    zIndex: 1,
    margin: 0,
    fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
    fontWeight: 780,
    lineHeight: 1.35,
    letterSpacing: "-0.02em",
    color: "rgba(248, 250, 252, 0.98)",
  },
  resumeHeroLead: {
    position: "relative",
    zIndex: 1,
    margin: 0,
    fontSize: 14,
    lineHeight: 1.65,
    fontWeight: 500,
    color: "rgba(148, 163, 184, 0.92)",
    maxWidth: 400,
  },
  resumePdfBtn: {
    position: "relative",
    zIndex: 1,
    marginTop: 4,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 20px",
    borderRadius: 999,
    fontFamily: "inherit",
    fontWeight: 750,
    fontSize: 14,
    color: "#fff",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    background: "linear-gradient(135deg, #d946ef, #9333ea, #6366f1)",
    backgroundSize: "140% 140%",
    boxShadow:
      "0 10px 26px rgba(91, 33, 182, 0.35), 0 0 16px rgba(217, 70, 239, 0.14), inset 0 1px 0 rgba(255,255,255,0.12)",
    transition: "transform 0.18s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },
  resumePanel: {
    borderRadius: 16,
    padding: "4px 0",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(51, 65, 107, 0.35)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 12px 36px rgba(0, 0, 0, 0.22)",
  },
  resumeInfoRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: "16px 18px",
    borderBottom: "1px solid rgba(51, 65, 107, 0.35)",
    transition: "background 0.2s ease",
  },
  resumeInfoRowLast: {
    borderBottom: "none",
  },
  resumeRowIconRing: {
    flexShrink: 0,
    width: 46,
    height: 46,
    borderRadius: 999,
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 16px rgba(0, 0, 0, 0.35)",
  },
  resumeRowIconInner: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(7, 11, 20, 0.95))",
  },
  resumeRowText: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    paddingTop: 2,
  },
  resumeRowLabel: {
    fontSize: 14,
    fontWeight: 750,
    color: "rgba(248, 250, 252, 0.96)",
    letterSpacing: "-0.01em",
  },
  resumeRowBody: {
    fontSize: 13,
    lineHeight: 1.55,
    fontWeight: 500,
    color: "rgba(148, 163, 184, 0.92)",
  },

  /* Skills — premium horizontal timeline */
  skillsRoot: {
    position: "relative",
    width: "100%",
    borderRadius: 0,
    overflow: "hidden",
    isolation: "isolate",
  },

  skillsParticleL: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    left: "-4%",
    top: 0,
    width: "34%",
    height: "100%",
    opacity: 0.35,
    background:
      "radial-gradient(circle at 22% 28%, rgba(96, 165, 250, 0.12) 0, transparent 1.5px), radial-gradient(circle at 38% 65%, rgba(244, 114, 182, 0.08) 0, transparent 1.2px)",
    backgroundSize: "100px 100px",
  },

  skillsParticleR: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    right: "-4%",
    top: 0,
    width: "32%",
    height: "100%",
    opacity: 0.3,
    background:
      "radial-gradient(circle at 72% 35%, rgba(147, 197, 253, 0.1) 0, transparent 1.3px), radial-gradient(circle at 58% 72%, rgba(244, 114, 182, 0.06) 0, transparent 1.1px)",
    backgroundSize: "110px 110px",
  },

  skillsShell: {
    position: "relative",
    zIndex: 1,
    borderRadius: 0,
    overflow: "visible",
    padding: "clamp(12px, 2.5vw, 22px) clamp(14px, 2.5vw, 24px) clamp(18px, 3vw, 28px)",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },

  skillsPillToolbar: {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 12,
    padding: "4px 0 18px",
  },

  skillsGlowTL: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    top: "-16%",
    left: "-8%",
    width: "min(45%, 260px)",
    height: "min(38%, 200px)",
    background: "radial-gradient(ellipse at 40% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
    filter: "blur(4px)",
    opacity: 0.8,
  },

  skillsGlowBR: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    bottom: "-18%",
    right: "-8%",
    width: "min(48%, 280px)",
    height: "min(40%, 220px)",
    background: "radial-gradient(ellipse at 55% 55%, rgba(244, 114, 182, 0.06) 0%, transparent 72%)",
    filter: "blur(4px)",
    opacity: 0.75,
  },

  skillsHeader: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "clamp(14px, 3vw, 22px)",
    marginBottom: "clamp(22px, 4vw, 32px)",
  },

  skillsHeaderLeft: {
    minWidth: 0,
    flex: "1 1 220px",
  },

  skillsTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  skillsTitle: {
    margin: 0,
    fontSize: "clamp(1.65rem, 3.2vw, 2.1rem)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#f8fafc",
  },

  skillsSubtitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 500,
    color: "rgba(148, 163, 184, 0.92)",
    lineHeight: 1.5,
    maxWidth: 480,
  },

  skillsPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid rgba(244, 114, 182, 0.28)",
    background: "rgba(15, 23, 42, 0.55)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
    fontSize: 12,
    fontWeight: 650,
    color: "rgba(226, 232, 240, 0.95)",
    maxWidth: "100%",
  },

  skillsPillRocket: { fontSize: 14, lineHeight: 1 },

  skillsPillText: { lineHeight: 1.35 },

  skillsPillHi: { color: "rgba(244, 114, 182, 0.95)", fontWeight: 800 },

  skillsPillHi2: { color: "rgba(244, 114, 182, 0.78)", fontWeight: 800 },

  skillsTimelineWrap: {
    position: "relative",
    minHeight: 56,
    marginBottom: 8,
  },

  skillsTLLine: {
    position: "absolute",
    left: "12%",
    right: "12%",
    top: "50%",
    height: 2,
    transform: "translateY(-50%)",
    borderRadius: 2,
    background:
      "linear-gradient(90deg, rgba(30, 41, 59, 0.15), rgba(244, 114, 182, 0.35) 22%, rgba(167, 139, 250, 0.5) 50%, rgba(99, 102, 241, 0.38) 78%, rgba(30, 41, 59, 0.15))",
    boxShadow: "0 0 12px rgba(232, 121, 249, 0.15)",
    zIndex: 0,
  },

  skillsTLNodes: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 2,
  },

  skillsTLNode: {
    position: "absolute",
    top: "50%",
    width: 9,
    height: 9,
    borderRadius: 999,
    transform: "translate(-50%, -50%)",
    background: "linear-gradient(135deg, #fbcfe8, #e879f9, #a78bfa)",
    boxShadow: "0 0 0 2px rgba(10, 12, 20, 0.95), 0 0 14px rgba(232, 121, 249, 0.45)",
  },

  skillsTLGrid: {
    position: "relative",
    zIndex: 3,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    alignItems: "center",
    minHeight: 56,
  },

  skillsTLCell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  skillsTimelineWrapTablet: {
    position: "relative",
    minHeight: 52,
    marginBottom: 6,
  },

  skillsTLLineTablet: {
    position: "absolute",
    left: "18%",
    right: "18%",
    top: "50%",
    height: 2,
    transform: "translateY(-50%)",
    borderRadius: 2,
    background: "linear-gradient(90deg, rgba(30, 41, 59, 0.2), rgba(59, 130, 246, 0.4), rgba(30, 41, 59, 0.2))",
    zIndex: 0,
  },

  skillsTLNodeTablet: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 9,
    height: 9,
    borderRadius: 999,
    transform: "translate(-50%, -50%)",
    background: "linear-gradient(135deg, #fbcfe8, #f472b6)",
    boxShadow: "0 0 0 2px rgba(10, 12, 20, 0.95), 0 0 12px rgba(244, 114, 182, 0.45)",
    zIndex: 2,
  },

  skillsTLGridTablet: {
    position: "relative",
    zIndex: 3,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    alignItems: "center",
    minHeight: 52,
  },

  skillsColumnsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "clamp(12px, 2vw, 20px)",
    alignItems: "start",
  },

  skillsColumnsGridTablet: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    alignItems: "start",
    marginBottom: 28,
  },

  skillsTabletChunks: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  skillsTabletChunk: {
    marginBottom: 4,
  },

  skillsColumn: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  skillsColHead: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 10,
  },

  skillsColHeadBelow: {
    paddingTop: 4,
    gap: 8,
  },

  skillsColIconRing: {
    width: 54,
    height: 54,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "linear-gradient(180deg, #0b1224, #070b14)",
    border: "1px solid rgba(96, 165, 250, 0.35)",
    boxShadow:
      "0 0 0 1px rgba(0, 0, 0, 0.45), 0 0 22px rgba(59, 130, 246, 0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
  },

  skillsStepPill: {
    padding: "4px 11px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.14em",
    color: "rgba(191, 219, 254, 0.95)",
    background: "rgba(30, 58, 138, 0.45)",
    border: "1px solid rgba(59, 130, 246, 0.28)",
  },

  skillsColTitle: {
    margin: 0,
    fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
    fontWeight: 800,
    color: "#f1f5f9",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },

  skillsColSubtitle: {
    margin: 0,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.45,
    color: "rgba(148, 163, 184, 0.9)",
    maxWidth: 220,
  },

  skillsColSubtitleMobile: {
    maxWidth: "100%",
  },

  skillsCard: {
    borderRadius: 16,
    padding: "10px 10px 12px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(51, 65, 107, 0.35)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 32px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  skillsItemRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: "10px 8px",
    borderRadius: 12,
    border: "1px solid transparent",
    transition: "background 0.2s ease, border-color 0.2s ease",
  },

  skillsItemIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15, 23, 42, 0.65)",
    border: "1px solid rgba(59, 130, 246, 0.12)",
  },

  skillsDevIcon: {
    fontSize: 22,
    lineHeight: 1,
  },

  skillsItemText: {
    minWidth: 0,
    flex: 1,
  },

  skillsItemTitle: {
    fontSize: 13,
    fontWeight: 750,
    color: "rgba(248, 250, 252, 0.96)",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    lineHeight: 1.3,
  },

  skillsItemDesc: {
    marginTop: 3,
    fontSize: 11.5,
    fontWeight: 500,
    lineHeight: 1.45,
    color: "rgba(148, 163, 184, 0.88)",
  },

  skillsNewBadge: {
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.08em",
    padding: "2px 6px",
    borderRadius: 6,
    color: "rgba(254, 242, 242, 0.98)",
    background: "linear-gradient(135deg, rgba(244, 114, 182, 0.5), rgba(219, 39, 119, 0.35))",
    border: "1px solid rgba(244, 114, 182, 0.35)",
  },

  skillsMobileStack: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },

  skillsMobileBlock: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },

  skillsMobileRail: {
    width: 22,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 22,
  },

  skillsMobileDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    background: "linear-gradient(135deg, #fbcfe8, #f472b6)",
    boxShadow: "0 0 10px rgba(244, 114, 182, 0.35)",
    flexShrink: 0,
  },

  skillsMobileRailLine: {
    flex: 1,
    width: 2,
    marginTop: 6,
    minHeight: 40,
    borderRadius: 2,
    background: "linear-gradient(180deg, rgba(59, 130, 246, 0.35), rgba(59, 130, 246, 0.08))",
  },

  skillsMobileMain: {
    flex: 1,
    minWidth: 0,
  },

  /* Projects — premium timeline + cards (shell matches skillsShell for seamless section tone) */
  prRoot: {
    marginTop: 0,
    padding: "clamp(12px, 2.5vw, 20px) 0 clamp(12px, 2vw, 18px)",
    borderRadius: 0,
    overflow: "visible",
    isolation: "auto",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },
  prHeader: {
    padding: "0 22px 22px",
    borderBottom: "1px solid rgba(51, 65, 107, 0.35)",
  },
  prHeaderCompact: {
    padding: "0 16px 18px",
  },
  prHeaderTop: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  prTitle: {
    margin: 0,
    fontSize: "clamp(1.5rem, 2.4vw, 1.85rem)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "rgba(248, 250, 252, 0.98)",
  },
  prSubtitle: {
    margin: 0,
    maxWidth: 640,
    fontSize: 14,
    lineHeight: 1.65,
    fontWeight: 500,
    color: "rgba(148, 163, 184, 0.92)",
  },
  prTimelineHost: {
    position: "relative",
    padding: "20px 22px 12px",
  },
  prTimelineHostCompact: {
    padding: "16px 14px 10px",
  },
  prTimelineRail: {
    position: "absolute",
    top: 18,
    bottom: 18,
    width: 2,
    borderRadius: 2,
    background: "linear-gradient(180deg, rgba(216, 180, 254, 0.55), rgba(232, 121, 249, 0.65), rgba(129, 140, 248, 0.45))",
    boxShadow: "0 0 12px rgba(232, 121, 249, 0.25)",
    zIndex: 0,
  },
  prTimelineRows: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    position: "relative",
    zIndex: 1,
  },
  prRow: {
    display: "flex",
    alignItems: "stretch",
    gap: 0,
    minHeight: 152,
  },
  prRowMobile: {
    minHeight: 0,
  },
  prGutter: {
    flexShrink: 0,
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  prNode: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "linear-gradient(135deg, #d8b4fe, #e879f9, #818cf8)",
    boxShadow: "0 0 14px rgba(232, 121, 249, 0.55), 0 0 6px rgba(129, 140, 248, 0.45)",
    zIndex: 2,
  },
  prCard: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: 14,
    padding: "14px 16px",
    minHeight: 152,
    borderRadius: 16,
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(51, 65, 107, 0.35)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 32px rgba(0, 0, 0, 0.25)",
    transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
  },
  prCardMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
    padding: "14px 14px",
    minHeight: 0,
  },
  prIconShell: {
    width: 58,
    height: 58,
    flexShrink: 0,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15, 23, 42, 0.65)",
    border: "1px solid rgba(59, 130, 246, 0.12)",
    alignSelf: "center",
  },
  prIconShellMobile: {
    width: 52,
    height: 52,
    alignSelf: "flex-start",
  },
  prIconDev: {
    fontSize: 30,
    lineHeight: 1,
    filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.12))",
  },
  prCardMain: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  prTitleRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  prTitleRowMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
  },
  prCardTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 750,
    lineHeight: 1.35,
    color: "rgba(248, 250, 252, 0.98)",
    flex: 1,
    minWidth: 0,
  },
  prCardTitleMobile: {
    fontSize: 14,
  },
  prBadge: {
    flexShrink: 0,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.02em",
    padding: "5px 10px",
    borderRadius: 999,
    background: "rgba(15, 23, 42, 0.55)",
  },
  prBadgeMobile: {
    alignSelf: "flex-end",
  },
  prCardDesc: {
    margin: 0,
    fontSize: 12.5,
    lineHeight: 1.5,
    fontWeight: 500,
    color: "rgba(148, 163, 184, 0.9)",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  prCardDescMobile: {
    WebkitLineClamp: 3,
    fontSize: 13,
  },
  prCardFooter: {
    marginTop: "auto",
    paddingTop: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  prTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  prTag: {
    fontSize: 11,
    fontWeight: 650,
    padding: "4px 9px",
    borderRadius: 999,
    color: "rgba(226, 232, 240, 0.88)",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(51, 65, 107, 0.35)",
  },
  prViewLink: {
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(244, 114, 182, 0.95)",
    whiteSpace: "nowrap",
  },
  prCtaWrap: {
    display: "flex",
    justifyContent: "center",
    padding: "22px 16px 8px",
  },
  prCtaWrapMobile: {
    padding: "18px 12px 8px",
  },
  prCtaBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 22px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
    color: "rgba(244, 114, 182, 0.95)",
    border: "1px solid rgba(244, 114, 182, 0.45)",
    background: "rgba(15, 23, 42, 0.4)",
    boxShadow: "0 0 20px rgba(244, 114, 182, 0.08)",
    transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
  },

  /* Contact (Interactive Lab–style flush wrapper) */
  contactSectionOuter: {
    marginTop: 22,
    background: "transparent",
    border: "none",
    boxShadow: "none",
    padding: 0,
    borderRadius: 0,
    scrollMarginTop: "clamp(72px, 16vw, 112px)",
  },
  contactStatusOk: {
    padding: "8px 12px",
    borderRadius: 10,
    background: "rgba(34, 197, 94, 0.12)",
    border: "1px solid rgba(34, 197, 94, 0.28)",
    fontWeight: 650,
    fontSize: 13,
    color: "rgba(187, 247, 208, 0.95)",
  },
  contactStatusErr: {
    padding: "8px 12px",
    borderRadius: 10,
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(248, 113, 113, 0.35)",
    fontWeight: 650,
    fontSize: 13,
    color: "rgba(254, 202, 202, 0.96)",
  },

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