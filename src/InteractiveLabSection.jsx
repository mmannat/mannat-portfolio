import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

function clampLabName(name) {
  const n = (name || "").trim();
  if (!n) return "Player";
  return n.length > 18 ? n.slice(0, 18) : n;
}

function loadPB() {
  try {
    const raw = localStorage.getItem("mannat_typing_pb");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePB(obj) {
  try {
    localStorage.setItem("mannat_typing_pb", JSON.stringify(obj));
  } catch {}
}

function IlMedal({ rank }) {
  if (rank === 1) return <span title="1st">🥇</span>;
  if (rank === 2) return <span title="2nd">🥈</span>;
  if (rank === 3) return <span title="3rd">🥉</span>;
  return <span style={{ opacity: 0.85, fontWeight: 800, fontSize: 13 }}>{rank}</span>;
}

function HowTitleSparkle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="il-how-sparkle-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d8b4fe" />
          <stop offset="0.45" stopColor="#e879f9" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path d="M12 2l1.2 4.2L18 8l-4.8 1.8L12 14l-1.2-4.2L6 8l4.8-1.8L12 2z" fill="url(#il-how-sparkle-grad)" />
      <path
        d="M19 15l.6 2.1 2.1.6-2.1.6-.6 2.1-.6-2.1-2.1-.6 2.1-.6.6-2.1z"
        fill="url(#il-how-sparkle-grad)"
        opacity="0.88"
      />
    </svg>
  );
}

function HowIconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 11.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5zM4.5 21a7.5 7.5 0 0 1 15 0"
        stroke="rgba(248,250,252,0.92)"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HowIconBolt() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 2L4 14h7l-1 8 10-12h-7l0-8z"
        stroke="rgba(248,250,252,0.92)"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HowIconChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19V5M4 19h16" stroke="rgba(148,163,184,0.5)" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d="M7 15l4-5 3 3 5-7"
        stroke="rgba(248,250,252,0.9)"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HowIconTrophy() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 21h8M12 17v4M6 4h12v3a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V4zM6 7H4a2 2 0 0 0 2 2m12-2h2a2 2 0 0 1-2 2"
        stroke="rgba(248,250,252,0.9)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DURATION = 30;
const LB_CACHE_KEY = "mannat_il_lb_v1";

const ils = {
  root: {
    marginTop: 0,
    padding: "0 0 clamp(14px, 2vw, 20px)",
    borderRadius: 0,
    overflow: "visible",
    isolation: "auto",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    padding: "clamp(14px, 2.4vw, 20px) clamp(16px, 3vw, 24px) clamp(10px, 1.8vw, 14px)",
    flexWrap: "wrap",
  },
  headerRowStacked: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  titleBlock: { flex: "1 1 280px", minWidth: 0 },
  titleLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  beakerWrap: {
    padding: 1,
    borderRadius: 12,
    background: "linear-gradient(135deg, #d946ef, #9333ea, #6366f1)",
    flexShrink: 0,
  },
  beakerInner: {
    width: 40,
    height: 40,
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #0b1224, #070b14)",
  },
  h1: {
    margin: 0,
    fontSize: "clamp(1.05rem, 2vw, 1.35rem)",
    fontWeight: 850,
    letterSpacing: "0.12em",
    color: "rgba(248, 250, 252, 0.98)",
  },
  h1Grad: {
    background: "linear-gradient(92deg, #d8b4fe, #e879f9, #a78bfa, #818cf8)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  },
  sub: {
    margin: "8px 0 0",
    fontSize: 13,
    lineHeight: 1.55,
    fontWeight: 500,
    color: "rgba(148, 163, 184, 0.9)",
    maxWidth: 520,
  },
  aboutBtn: {
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(167, 139, 250, 0.35)",
    background: "rgba(15, 23, 42, 0.45)",
    color: "rgba(226, 232, 240, 0.92)",
    fontSize: 12,
    fontWeight: 650,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  aboutBtnMobile: {
    width: "100%",
    justifyContent: "center",
    minHeight: 44,
    boxSizing: "border-box",
  },
  aboutPanel: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(51, 65, 107, 0.35)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(148, 163, 184, 0.95)",
    fontSize: 12.5,
    lineHeight: 1.55,
    maxWidth: 420,
  },
  labShellGrid: {
    display: "grid",
    gap: 18,
    padding: "clamp(14px, 2.5vw, 22px) clamp(16px, 3vw, 24px) 8px",
    alignItems: "start",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  labShellWide: {
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(260px, 0.85fr)",
    gridTemplateAreas: '"game lb" "how lb" "tip lb"',
  },
  labShellStacked: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateAreas: '"game" "lb" "how" "tip"',
  },
  gameCard: {
    position: "relative",
    borderRadius: 16,
    padding: "clamp(18px, 2.5vw, 24px)",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(51, 65, 107, 0.35)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 36px rgba(0, 0, 0, 0.28)",
  },
  arcGlow: {
    position: "absolute",
    pointerEvents: "none",
    bottom: "-40%",
    left: "-20%",
    width: "120%",
    height: "80%",
    background: "radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.12), transparent 60%)",
    opacity: 0.9,
  },
  tabPill: {
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 11px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 750,
    letterSpacing: "0.06em",
    color: "rgba(226, 232, 240, 0.9)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    background: "rgba(15, 23, 42, 0.55)",
    marginBottom: 14,
  },
  heroTitle: {
    position: "relative",
    zIndex: 1,
    margin: 0,
    fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "rgba(248, 250, 252, 0.98)",
    lineHeight: 1.2,
  },
  heroSub: {
    position: "relative",
    zIndex: 1,
    margin: "10px 0 0",
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(148, 163, 184, 0.92)",
    maxWidth: 460,
  },
  strongHi: { color: "rgba(251, 207, 232, 0.95)", fontWeight: 700 },
  nameRow: {
    position: "relative",
    zIndex: 1,
    marginTop: 18,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "4px 4px 4px 12px",
    borderRadius: 14,
    border: "1px solid rgba(51, 65, 107, 0.45)",
    background: "rgba(15, 23, 42, 0.5)",
  },
  nameRowStacked: {
    padding: "10px 12px",
    flexWrap: "wrap",
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "rgba(248, 250, 252, 0.96)",
    fontSize: 16,
    fontWeight: 600,
    padding: "10px 4px",
    fontFamily: "inherit",
  },
  startBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 18,
    padding: "14px 22px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 780,
    fontSize: 15,
    color: "#fff",
    background: "linear-gradient(135deg, #d946ef, #9333ea, #6366f1)",
    backgroundSize: "140% 140%",
    boxShadow:
      "0 10px 28px rgba(91, 33, 182, 0.38), 0 0 18px rgba(217, 70, 239, 0.14), inset 0 1px 0 rgba(255,255,255,0.12)",
  },
  startBtnFull: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 48,
    marginTop: 14,
  },
  infoRow: {
    position: "relative",
    zIndex: 1,
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
  },
  infoRowMob: { gridTemplateColumns: "1fr" },
  infoCard: {
    borderRadius: 14,
    padding: "12px 10px",
    border: "1px solid rgba(51, 65, 107, 0.35)",
    background: "rgba(255,255,255,0.02)",
    textAlign: "center",
  },
  infoCardLabel: { fontSize: 13, fontWeight: 800, color: "rgba(248, 250, 252, 0.95)" },
  infoCardSub: { marginTop: 4, fontSize: 11, color: "rgba(148, 163, 184, 0.85)", fontWeight: 600 },
  playArea: { position: "relative", zIndex: 1, marginTop: 8 },
  timerCard: {
    borderRadius: 14,
    padding: 14,
    border: "1px solid rgba(51, 65, 107, 0.35)",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(7, 11, 20, 0.92))",
    marginBottom: 12,
  },
  timerTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 },
  timerNum: { fontSize: 28, fontWeight: 900, color: "rgba(248, 250, 252, 0.98)" },
  timerLbl: { fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(148, 163, 184, 0.85)" },
  barOuter: { marginTop: 10, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" },
  barInner: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #7c3aed, #f472b6)",
    transition: "width 80ms linear",
  },
  targetBox: {
    borderRadius: 14,
    padding: 14,
    minHeight: 100,
    border: "1px solid rgba(51, 65, 107, 0.35)",
    background: "rgba(3, 6, 14, 0.92)",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: "clamp(13px, 3.8vw, 15px)",
    lineHeight: 1.55,
    color: "rgba(226, 232, 240, 0.95)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  typeArea: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    border: "1px solid rgba(167, 139, 250, 0.22)",
    background: "rgba(255,255,255,0.02)",
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    maxWidth: "100%",
    boxSizing: "border-box",
    borderRadius: 12,
    border: "1px solid rgba(51, 65, 107, 0.4)",
    padding: 12,
    outline: "none",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: 16,
    fontWeight: 600,
    color: "rgba(248, 250, 252, 0.96)",
    background: "rgba(15, 23, 42, 0.55)",
    resize: "vertical",
  },
  resultsCard: {
    borderRadius: 16,
    padding: 18,
    border: "1px solid rgba(51, 65, 107, 0.35)",
    background: "rgba(255,255,255,0.03)",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  resultsGridStacked: {
    gridTemplateColumns: "1fr",
  },
  statCell: {
    borderRadius: 12,
    padding: 12,
    border: "1px solid rgba(51, 65, 107, 0.3)",
    background: "rgba(15, 23, 42, 0.35)",
  },
  statLabel: { fontSize: 11, fontWeight: 700, color: "rgba(148, 163, 184, 0.9)", letterSpacing: "0.06em" },
  statVal: { marginTop: 6, fontSize: 22, fontWeight: 900, color: "rgba(248, 250, 252, 0.98)" },
  msgLine: { marginTop: 14, fontSize: 14, fontWeight: 700, color: "rgba(251, 207, 232, 0.95)" },
  secondaryBtn: {
    marginTop: 14,
    padding: "12px 18px",
    borderRadius: 999,
    border: "1px solid rgba(167, 139, 250, 0.35)",
    background: "rgba(15, 23, 42, 0.5)",
    color: "rgba(248, 250, 252, 0.95)",
    fontWeight: 750,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  howCard: {
    borderRadius: 16,
    padding: "18px 16px 20px",
    border: "1px solid rgba(51, 65, 107, 0.35)",
    background: "rgba(255,255,255,0.02)",
    overflow: "hidden",
  },
  howTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 800,
    fontSize: 14,
    color: "rgba(248, 250, 252, 0.96)",
    marginBottom: 18,
  },
  howSteps: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 2,
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    paddingBottom: 4,
    scrollbarWidth: "thin",
  },
  howStepsStacked: {
    flexDirection: "column",
    flexWrap: "nowrap",
    overflowX: "visible",
    gap: 14,
    paddingBottom: 0,
    alignItems: "stretch",
  },
  howStep: {
    flex: "1 1 0",
    minWidth: 108,
    maxWidth: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 10,
    padding: "4px 4px 0",
  },
  howStepStacked: {
    flex: "none",
    minWidth: 0,
    maxWidth: "none",
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    gap: 8,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(51, 65, 107, 0.28)",
    background: "rgba(15, 23, 42, 0.35)",
    boxSizing: "border-box",
  },
  howIconRing: {
    width: 52,
    height: 52,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "rgba(15, 23, 42, 0.75)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
  },
  howStepTitle: {
    fontSize: 12.5,
    fontWeight: 800,
    color: "rgba(248, 250, 252, 0.96)",
    letterSpacing: "-0.01em",
    lineHeight: 1.25,
  },
  howStepBody: {
    fontSize: 10.5,
    lineHeight: 1.45,
    color: "rgba(148, 163, 184, 0.88)",
    maxWidth: 168,
    margin: "0 auto",
  },
  howStepBodyStacked: {
    maxWidth: "none",
    margin: 0,
    fontSize: 12,
    flex: 1,
    minWidth: 0,
  },
  howChev: {
    flexShrink: 0,
    alignSelf: "center",
    color: "rgba(100, 116, 139, 0.5)",
    fontSize: 20,
    fontWeight: 200,
    lineHeight: 1,
    padding: "0 4px",
    marginTop: 10,
    userSelect: "none",
  },
  howChevStacked: {
    display: "none",
  },
  tipBar: {
    borderRadius: 12,
    padding: "10px 14px",
    border: "1px solid rgba(51, 65, 107, 0.3)",
    background: "rgba(15, 23, 42, 0.35)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 12,
    color: "rgba(148, 163, 184, 0.95)",
    lineHeight: 1.45,
  },
  lbCard: {
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(51, 65, 107, 0.35)",
    background: "rgba(255, 255, 255, 0.03)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
    position: "sticky",
    top: 12,
    minWidth: 0,
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  lbHead: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" },
  lbTitle: { fontWeight: 900, fontSize: 13, letterSpacing: "0.14em", color: "rgba(248, 250, 252, 0.95)" },
  lbSelect: {
    fontSize: 11,
    fontWeight: 700,
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid rgba(51, 65, 107, 0.45)",
    background: "rgba(15, 23, 42, 0.55)",
    color: "rgba(226, 232, 240, 0.9)",
    fontFamily: "inherit",
  },
  lbWarn: {
    marginTop: 10,
    padding: "8px 10px",
    borderRadius: 10,
    fontSize: 12,
    lineHeight: 1.45,
    color: "rgba(253, 224, 71, 0.95)",
    background: "rgba(113, 63, 18, 0.25)",
    border: "1px solid rgba(250, 204, 21, 0.22)",
  },
  lbRetryRow: { marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  lbRetryBtn: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid rgba(167, 139, 250, 0.4)",
    background: "rgba(15, 23, 42, 0.55)",
    color: "rgba(248, 250, 252, 0.95)",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  lbRow: {
    display: "grid",
    gridTemplateColumns: "44px 40px 1fr auto",
    gap: 8,
    alignItems: "center",
    padding: "10px 8px",
    borderRadius: 12,
    border: "1px solid rgba(51, 65, 107, 0.22)",
    marginTop: 8,
    background: "rgba(15, 23, 42, 0.25)",
    minWidth: 0,
  },
  lbRowMobile: {
    gridTemplateColumns: "36px 32px minmax(0, 1fr) auto",
    gap: 6,
    padding: "10px 6px",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 900,
    background: "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(217,70,239,0.25))",
    color: "rgba(248, 250, 252, 0.95)",
    border: "1px solid rgba(167, 139, 250, 0.25)",
  },
  lbName: { fontWeight: 800, fontSize: 13, color: "rgba(248, 250, 252, 0.95)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  lbWpm: { fontWeight: 900, fontSize: 14, color: "rgba(248, 250, 252, 0.98)", textAlign: "right" },
  lbAcc: { fontSize: 11, color: "rgba(148, 163, 184, 0.88)", textAlign: "right" },
  yourBest: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(217, 70, 239, 0.25)",
    background: "rgba(15, 23, 42, 0.45)",
  },
  yourBestTitle: { fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(251, 207, 232, 0.9)" },
  yourBestBody: { marginTop: 6, fontSize: 13, fontWeight: 750, color: "rgba(248, 250, 252, 0.95)" },
};

function cleanTyping(s) {
  return (s || "")
    .replace(/\r\n/g, "\n")
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'[\]\\|<>@+]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function computeTypingStats(finalTyped, targetText, elapsedSeconds) {
  const rawTyped = (finalTyped || "").replace(/\r\n/g, "\n");
  const elapsed = Math.max(0.001, elapsedSeconds || DURATION);
  const minutes = elapsed / 60;
  const typedChars = rawTyped.length;
  const t = cleanTyping(rawTyped);
  const tar = cleanTyping(targetText);
  let correct = 0;
  const n = Math.min(t.length, tar.length);
  for (let i = 0; i < n; i++) if (t[i] === tar[i]) correct++;
  const typedForAcc = t.length;
  const accuracy = typedForAcc === 0 ? 0 : Math.round((correct / typedForAcc) * 100);
  const grossWpm = typedChars === 0 ? 0 : Math.round((typedChars / 5) / minutes);
  const netWpm = Math.max(0, Math.round(grossWpm * (accuracy / 100)));
  return { grossWpm, netWpm, accuracy };
}

export function InteractiveLabSection({ apiBase }) {
  const sentences = useMemo(
    () => [
      "Write tests like your future self will thank you.",
      "Fast feedback saves hours of debugging later.",
      "Make small incremental changes and validate often.",
      "Readable code is maintainable code.",
      "Ship small learn fast and iterate with confidence.",
      "Quality is the result of deliberate attention to detail.",
      "A bug fixed early is a feature delivered on time.",
      "Good interfaces feel obvious once they exist.",
    ],
    []
  );

  const [layout, setLayout] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches ? "stacked" : "wide"
  );

  useEffect(() => {
    const q = window.matchMedia("(max-width: 1024px)");
    const fn = () => setLayout(q.matches ? "stacked" : "wide");
    fn();
    q.addEventListener("change", fn);
    return () => q.removeEventListener("change", fn);
  }, []);

  const [phase, setPhase] = useState("intro");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem("mannat_player_name") || "";
    } catch {
      return "";
    }
  });

  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [results, setResults] = useState(null);
  const [madeLeaderboard, setMadeLeaderboard] = useState(null);

  const [lbRows, setLbRows] = useState([]);
  const [lbStatus, setLbStatus] = useState("idle");
  const [lbErr, setLbErr] = useState("");
  const [lbWarn, setLbWarn] = useState("");
  const [pbMap, setPbMap] = useState(() => loadPB());

  const typedRef = useRef("");
  const targetRef = useRef("");
  const startRef = useRef(0);
  const rafRef = useRef(null);
  const stoppingRef = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  const fetchLeaderboard = useCallback(async () => {
    setLbStatus("loading");
    setLbErr("");
    setLbWarn("");
    const url = `${apiBase}/api/typing-scores?duration=${DURATION}`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected response from server (not JSON).");
      }
      if (!res.ok) throw new Error(data?.error || `Server error (${res.status})`);
      const top = Array.isArray(data.top) ? data.top : [];
      setLbRows(top);
      setLbStatus("ok");
      try {
        sessionStorage.setItem(LB_CACHE_KEY, JSON.stringify({ at: Date.now(), top }));
      } catch {
        /* ignore */
      }
    } catch (e) {
      const rawMsg = e?.message || String(e);
      const isNetwork =
        rawMsg === "Failed to fetch" ||
        rawMsg.includes("NetworkError") ||
        rawMsg.includes("Load failed") ||
        (typeof TypeError !== "undefined" && e instanceof TypeError);

      let usedCache = false;
      try {
        const cached = sessionStorage.getItem(LB_CACHE_KEY);
        if (cached) {
          const { top } = JSON.parse(cached);
          if (Array.isArray(top) && top.length > 0) {
            setLbRows(top);
            setLbStatus("ok");
            setLbWarn(
              isNetwork
                ? "Showing saved rankings — could not reach the API (is it running on port 3001?)."
                : "Showing saved rankings — could not refresh from the server."
            );
            usedCache = true;
          }
        }
      } catch {
        /* ignore */
      }

      if (!usedCache) {
        setLbStatus("err");
        setLbErr(
          isNetwork
            ? `Cannot reach ${apiBase}. Run mannat-portfolio-api with MongoDB, or set VITE_API_BASE in .env to your live API URL (https if your site is https).`
            : rawMsg
        );
      }
    }
  }, [apiBase]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const endGame = useCallback(() => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    setTimeout(() => {
      stoppingRef.current = false;
    }, 0);

    const finalTyped = typedRef.current;
    const targetText = targetRef.current;
    setRunning(false);
    const stats = computeTypingStats(finalTyped, targetText, DURATION);
    setResults({ ...stats, duration: DURATION });
    setPhase("results");

    const canSave = stats.netWpm > 0 && stats.grossWpm > 0 && stats.accuracy > 0 && finalTyped.trim().length > 0;

    (async () => {
      if (!canSave) {
        setMadeLeaderboard(null);
        return;
      }
      try {
        const res = await fetch(`${apiBase}/api/typing-scores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: clampLabName(name),
            duration: DURATION,
            netWpm: stats.netWpm,
            grossWpm: stats.grossWpm,
            accuracy: stats.accuracy,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Save failed");
        setMadeLeaderboard(!!data.inTop5);
      } catch {
        setMadeLeaderboard(false);
      } finally {
        await fetchLeaderboard();
        const key = clampLabName(name);
        setPbMap((prev) => {
          const next = { ...(prev || {}) };
          const cur = next[key];
          if (!cur || stats.netWpm > (cur.netWpm || 0)) {
            next[key] = { netWpm: stats.netWpm, accuracy: stats.accuracy, at: new Date().toISOString() };
            savePB(next);
          }
          return next;
        });
      }
    })();
  }, [apiBase, fetchLeaderboard, name]);

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const left = Math.max(0, DURATION - elapsed);
      setTimeLeft(left);
      if (left <= 0) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        endGame();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [running, endGame]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function pickSentence() {
    return sentences[Math.floor(Math.random() * sentences.length)];
  }

  function startTest() {
    if (!name.trim()) {
      alert("Please enter your name to start.");
      return;
    }
    try {
      localStorage.setItem("mannat_player_name", name.trim());
    } catch {}
    stoppingRef.current = false;
    setResults(null);
    setMadeLeaderboard(null);
    const s = pickSentence();
    setTarget(s);
    targetRef.current = s;
    setTyped("");
    typedRef.current = "";
    setTimeLeft(DURATION);
    setRunning(true);
    setPhase("playing");
    startRef.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 40);
  }

  function playAgain() {
    setPhase("intro");
    setResults(null);
    setTyped("");
    typedRef.current = "";
    setTarget("");
    targetRef.current = "";
    setMadeLeaderboard(null);
    setTimeLeft(DURATION);
    setRunning(false);
  }

  function initials(n) {
    const s = clampLabName(n || "Player");
    const p = s.split(/\s+/).filter(Boolean);
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase().slice(0, 2);
    return s.slice(0, 2).toUpperCase();
  }

  const stacked = layout === "stacked";
  const progressPct = Math.max(0, Math.min(100, (timeLeft / DURATION) * 100));
  const me = clampLabName(name);
  const myPb = pbMap && pbMap[me];

  return (
    <div className="portfolio-interactive-root" style={ils.root}>
      <div style={{ ...ils.headerRow, ...(stacked ? ils.headerRowStacked : null) }}>
        <div style={ils.titleBlock}>
          <div style={ils.titleLine}>
            <div style={ils.beakerWrap} aria-hidden>
              <div style={ils.beakerInner}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 3h6v3l4 7v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-6l4-7V3z"
                    stroke="rgba(226,232,240,0.9)"
                    strokeWidth="1.35"
                    strokeLinejoin="round"
                  />
                  <path d="M8 14h8" stroke="rgba(147,197,253,0.5)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <h2 style={ils.h1}>
              INTERACTIVE <span style={ils.h1Grad}>LAB</span>
            </h2>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.9 }}>
              <path d="M12 2l1.2 4.2L18 8l-4.8 1.8L12 14l-1.2-4.2L6 8l4.8-1.8L12 2z" fill="rgba(244, 114, 182, 0.85)" />
            </svg>
          </div>
          {aboutOpen ? (
            <div style={ils.aboutPanel}>
              Typing PRO runs for {DURATION} seconds. Scores use standard WPM math and are saved to the portfolio API
              (MongoDB). Only the top five Net WPM scores appear publicly.
            </div>
          ) : null}
        </div>
        <button type="button" style={{ ...ils.aboutBtn, ...(stacked ? ils.aboutBtnMobile : null) }} onClick={() => setAboutOpen((v) => !v)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
            <path d="M12 16v-1M12 8h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          About this Lab
        </button>
      </div>

      <div
        style={{
          ...ils.labShellGrid,
          ...(stacked ? ils.labShellStacked : ils.labShellWide),
        }}
      >
        <div style={{ gridArea: "game", minWidth: 0 }}>
          <div style={ils.gameCard} className="il-game-card">
            <div style={ils.arcGlow} aria-hidden />
            <div style={ils.tabPill}>
              <span aria-hidden>⌨️</span> Typing PRO
            </div>

            {phase === "intro" && (
              <>
                <h3 style={ils.heroTitle}>
                  Type. Score.{" "}
                  <span
                    style={{
                      background: "linear-gradient(92deg, #d8b4fe, #e879f9, #a78bfa)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Compete.
                  </span>
                </h3>
                <p style={ils.heroSub}>
                  Get in the <span style={ils.strongHi}>top 5</span> and your name is on the leaderboard.
                </p>
                <div style={{ ...ils.nameRow, ...(stacked ? ils.nameRowStacked : null) }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.7 }}>
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM4 20a8 8 0 0 1 16 0"
                      stroke="rgba(148,163,184,0.9)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    style={ils.nameInput}
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="nickname"
                  />
                </div>
                <button type="button" style={{ ...ils.startBtn, ...(stacked ? ils.startBtnFull : null) }} className="il-start-btn" onClick={startTest}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M13 2L4 14h7l-1 8 10-12h-7l0-8z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Start Test
                </button>
                <div style={{ ...ils.infoRow, ...(stacked ? ils.infoRowMob : null) }}>
                  <div style={ils.infoCard}>
                    <div style={ils.infoCardLabel}>30 Seconds</div>
                    <div style={ils.infoCardSub}>Test Duration</div>
                  </div>
                  <div style={ils.infoCard}>
                    <div style={ils.infoCardLabel}>WPM &amp; Accuracy</div>
                    <div style={ils.infoCardSub}>Results</div>
                  </div>
                  <div style={ils.infoCard}>
                    <div style={ils.infoCardLabel}>Top 5 Only</div>
                    <div style={ils.infoCardSub}>On Leaderboard</div>
                  </div>
                </div>
              </>
            )}

            {phase === "playing" && (
              <div style={ils.playArea}>
                <div style={ils.timerCard}>
                  <div style={ils.timerTop}>
                    <span style={ils.timerLbl}>TIME LEFT</span>
                    <span style={ils.timerNum}>{Math.ceil(timeLeft)}s</span>
                  </div>
                  <div style={ils.barOuter}>
                    <div style={{ ...ils.barInner, width: `${progressPct}%` }} />
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(148,163,184,0.85)", marginBottom: 6 }}>TARGET</div>
                <div style={ils.targetBox} aria-live="polite">
                  {target.split("").map((ch, i) => {
                    const typedChar = typed[i];
                    const ok =
                      typedChar !== undefined && typedChar !== ""
                        ? String(typedChar).toLowerCase() === String(ch).toLowerCase()
                        : null;
                    return (
                      <span
                        key={i}
                        style={{
                          padding: ok === true ? "1px 2px" : ok === false ? "1px 2px" : undefined,
                          borderRadius: 3,
                          background:
                            ok === true ? "rgba(34,197,94,0.2)" : ok === false ? "rgba(248,113,113,0.18)" : "transparent",
                        }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </div>
                <div style={ils.typeArea}>
                  <textarea
                    ref={inputRef}
                    style={ils.textarea}
                    placeholder="Type the text above…"
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {phase === "results" && results && (
              <div style={ils.resultsCard}>
                <h3 style={{ ...ils.heroTitle, fontSize: "1.25rem" }}>Your results</h3>
                <div style={{ ...ils.resultsGrid, ...(stacked ? ils.resultsGridStacked : null) }}>
                  <div style={ils.statCell}>
                    <div style={ils.statLabel}>NET WPM</div>
                    <div style={ils.statVal}>{results.netWpm}</div>
                  </div>
                  <div style={ils.statCell}>
                    <div style={ils.statLabel}>GROSS WPM</div>
                    <div style={ils.statVal}>{results.grossWpm}</div>
                  </div>
                  <div style={ils.statCell}>
                    <div style={ils.statLabel}>ACCURACY</div>
                    <div style={ils.statVal}>{results.accuracy}%</div>
                  </div>
                  <div style={ils.statCell}>
                    <div style={ils.statLabel}>DURATION</div>
                    <div style={ils.statVal}>{results.duration}s</div>
                  </div>
                </div>
                {madeLeaderboard === true && <div style={ils.msgLine}>You made the leaderboard!</div>}
                {madeLeaderboard === false && <div style={ils.msgLine}>Not in top 5 yet — try again!</div>}
                <button type="button" style={ils.secondaryBtn} className="il-play-again" onClick={playAgain}>
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>

        <aside
          style={{
            gridArea: "lb",
            ...ils.lbCard,
            ...(stacked ? { position: "relative", top: "auto" } : null),
          }}
          aria-label="Typing leaderboard"
        >
          <div style={ils.lbHead}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden>👑</span>
              <span style={ils.lbTitle}>LEADERBOARD</span>
            </div>
            <select style={ils.lbSelect} value="top5" aria-label="Leaderboard scope" disabled>
              <option value="top5">Top 5 (All Time)</option>
            </select>
          </div>

          {lbStatus === "loading" && <div style={{ marginTop: 12, color: "rgba(148,163,184,0.85)", fontSize: 13 }}>Loading…</div>}
          {lbWarn ? <div style={ils.lbWarn}>{lbWarn}</div> : null}
          {lbStatus === "err" && (
            <div style={{ marginTop: 12 }}>
              <div style={{ color: "rgba(251, 113, 133, 0.95)", fontSize: 13, lineHeight: 1.5 }}>{lbErr}</div>
              <div style={ils.lbRetryRow}>
                <button type="button" style={ils.lbRetryBtn} onClick={() => fetchLeaderboard()}>
                  Retry
                </button>
              </div>
            </div>
          )}
          {lbStatus === "ok" && lbRows.length === 0 && (
            <div style={{ marginTop: 12, color: "rgba(148,163,184,0.85)", fontSize: 13 }}>No scores yet — be the first.</div>
          )}
          {lbStatus === "ok" &&
            lbRows.map((row) => (
              <div key={row._id || row.rank} style={{ ...ils.lbRow, ...(stacked ? ils.lbRowMobile : null) }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <IlMedal rank={row.rank} />
                </div>
                <div style={ils.avatar}>{initials(row.name)}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={ils.lbName}>{row.name}</div>
                  <div style={ils.lbAcc}>{row.accuracy}% accuracy</div>
                </div>
                <div>
                  <div style={ils.lbWpm}>{row.netWpm}</div>
                  <div style={ils.lbAcc}>WPM</div>
                </div>
              </div>
            ))}

          {myPb ? (
            <div style={ils.yourBest}>
              <div style={ils.yourBestTitle}>YOUR BEST</div>
              <div style={ils.yourBestBody}>
                {myPb.netWpm} WPM, {myPb.accuracy}% accuracy
              </div>
            </div>
          ) : null}
        </aside>

        <div style={{ gridArea: "how", minWidth: 0 }}>
          <div style={ils.howCard}>
            <div style={ils.howTitle}>
              <HowTitleSparkle />
              How it works
            </div>
            <div style={{ ...ils.howSteps, ...(stacked ? ils.howStepsStacked : null) }} className="il-how-steps">
              <div style={{ ...ils.howStep, ...(stacked ? ils.howStepStacked : null) }}>
                <div style={ils.howIconRing}>
                  <HowIconUser />
                </div>
                <div style={ils.howStepTitle}>Enter your name</div>
                <div style={{ ...ils.howStepBody, ...(stacked ? ils.howStepBodyStacked : null) }}>Pick a name to get started</div>
              </div>
              <span style={{ ...ils.howChev, ...(stacked ? ils.howChevStacked : null) }} aria-hidden>
                ›
              </span>
              <div style={{ ...ils.howStep, ...(stacked ? ils.howStepStacked : null) }}>
                <div style={ils.howIconRing}>
                  <HowIconBolt />
                </div>
                <div style={ils.howStepTitle}>30-sec test</div>
                <div style={{ ...ils.howStepBody, ...(stacked ? ils.howStepBodyStacked : null) }}>Type the given text as fast and accurately as you can</div>
              </div>
              <span style={{ ...ils.howChev, ...(stacked ? ils.howChevStacked : null) }} aria-hidden>
                ›
              </span>
              <div style={{ ...ils.howStep, ...(stacked ? ils.howStepStacked : null) }}>
                <div style={ils.howIconRing}>
                  <HowIconChart />
                </div>
                <div style={ils.howStepTitle}>Get your results</div>
                <div style={{ ...ils.howStepBody, ...(stacked ? ils.howStepBodyStacked : null) }}>See your WPM, accuracy, and rank</div>
              </div>
              <span style={{ ...ils.howChev, ...(stacked ? ils.howChevStacked : null) }} aria-hidden>
                ›
              </span>
              <div style={{ ...ils.howStep, ...(stacked ? ils.howStepStacked : null) }}>
                <div style={ils.howIconRing}>
                  <HowIconTrophy />
                </div>
                <div style={ils.howStepTitle}>Top 5 only</div>
                <div style={{ ...ils.howStepBody, ...(stacked ? ils.howStepBodyStacked : null) }}>Only the best five scores are shown</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ gridArea: "tip", minWidth: 0 }}>
          <div style={ils.tipBar}>
            <span aria-hidden>💡</span>
            <span>Tip: Accuracy above 90% gives you the best Net WPM.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
