import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "./apiBase.js";

/* ----------------------------------------------------------------
   The Guest Wall — hero + artist-wall gallery of guestbook doodles.
------------------------------------------------------------------- */

const PAGE_SIZE = 12;

const PATTERN_CYCLE = [
  { id: "zigzag", count: 6 },
  { id: "staircase", count: 7 },
  { id: "salon", count: 7 },
  { id: "wave", count: 8 },
  { id: "scatter", count: 6 },
];

/* Fallback neon mix when a doodle has no saved brush color. */
const ACCENTS = ["#f472b6", "#e879f9", "#a78bfa", "#818cf8", "#38bdf8", "#22d3ee", "#2dd4bf", "#34d399", "#fbbf24", "#fb7185"];

function normalizeHex(c) {
  if (typeof c !== "string") return "";
  const s = c.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(s)) return s;
  if (/^#[0-9a-fA-F]{3}$/.test(s)) {
    return `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;
  }
  return "";
}

/** Prefer the visitor's brush color; otherwise a stable neon fallback. */
function resolveAccent(entry, id) {
  const fromClient = normalizeHex(entry?.color);
  if (fromClient) return fromClient;
  return ACCENTS[Math.floor(hashUnit(id, "hue") * ACCENTS.length) % ACCENTS.length];
}

function initials(n) {
  const s = (n || "?").trim();
  const p = s.split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

function timeAgo(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

/** Stable 0..1 from an id (and optional salt) so layout stays fixed on refresh. */
function hashUnit(id, salt = "") {
  const s = String(id || "") + String(salt);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function pieceMeta(entry, { forceSize } = {}) {
  const id = entry?._id;
  const u = hashUnit(id, "size");
  const size = forceSize || (u < 0.42 ? "sm" : u < 0.78 ? "md" : "lg");
  const tilt = (hashUnit(id, "tilt") * 6 - 3).toFixed(2); // -3..+3
  const ox = ((hashUnit(id, "ox") - 0.5) * 18).toFixed(1);
  const oy = ((hashUnit(id, "oy") - 0.5) * 14).toFixed(1);
  const accent = resolveAccent(entry, id);
  const fastener = hashUnit(id, "pin") > 0.5 ? "tape" : "pin";
  return { size, tilt, ox, oy, accent, fastener };
}

/** Split entries into repeating artist-wall pattern blocks (6–8 each). */
function buildBlocks(entries) {
  const blocks = [];
  let i = 0;
  let p = 0;
  while (i < entries.length) {
    const def = PATTERN_CYCLE[p % PATTERN_CYCLE.length];
    const slice = entries.slice(i, i + def.count);
    if (slice.length === 0) break;
    // Salon: force the first piece large as the centerpiece when the block is full enough.
    const salonLargeId = def.id === "salon" && slice.length >= 5 ? slice[0]._id : null;
    blocks.push({
      pattern: def.id,
      items: slice.map((entry, slot) => ({
        entry,
        slot,
        meta: pieceMeta(entry, { forceSize: entry._id === salonLargeId ? "lg" : undefined }),
        isCenter: entry._id === salonLargeId,
      })),
    });
    i += def.count;
    p += 1;
  }
  return blocks;
}

function isLocalHost() {
  try {
    const h = window.location.hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
  } catch {
    return false;
  }
}

function safeGet(store, key) {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(store, key, value) {
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function makeVisitorId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* ignore */
  }
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function WallPiece({ entry, meta, isCenter, onOpen }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { size, tilt, ox, oy, accent, fastener } = meta;
  const note = (entry.message || "").trim();

  return (
    <figure
      ref={ref}
      className={`wall-piece wall-piece-${size}${isCenter ? " wall-piece-center" : ""}${inView ? " in" : ""}`}
      style={{
        "--tilt": `${tilt}deg`,
        "--accent": accent,
        "--ox": `${ox}px`,
        "--oy": `${oy}px`,
      }}
    >
      {size === "lg" ? <span className="wall-spotlight" aria-hidden /> : null}
      <button
        type="button"
        className="wall-frame"
        onClick={() => onOpen(entry)}
        aria-label={`Open doodle by ${entry.name}`}
      >
        <span className={`wall-fastener wall-fastener-${fastener}`} aria-hidden />
        <img className="wall-frame-img" src={entry.drawing} alt={`Doodle by ${entry.name}`} loading="lazy" />
      </button>
      <figcaption className="wall-caption">
        {note ? <p className="wall-note-text">{note}</p> : null}
        <div className="wall-plaque">
          <span className="wall-plaque-dot" style={{ background: accent }} aria-hidden />
          <span className="wall-plaque-name">{entry.name}</span>
        </div>
      </figcaption>
    </figure>
  );
}

export function WallOfFamePage({ apiBase = API_BASE }) {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading");
  const [err, setErr] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [active, setActive] = useState(null);
  const [scrollP, setScrollP] = useState(0);
  const [adminToken] = useState(() => {
    try {
      const fromSearch = new URLSearchParams(window.location.search).get("admin");
      const hash = window.location.hash || "";
      const qIdx = hash.indexOf("?");
      const fromHash = qIdx >= 0 ? new URLSearchParams(hash.slice(qIdx + 1)).get("admin") : null;
      const t = fromSearch || fromHash;
      if (t) {
        localStorage.setItem("mannat_gb_admin", t);
        return t;
      }
      return localStorage.getItem("mannat_gb_admin") || "";
    } catch {
      return "";
    }
  });
  const [pending, setPending] = useState([]);
  const galleryRef = useRef(null);

  const base = useMemo(() => String(apiBase || "").replace(/\/$/, ""), [apiBase]);

  // Always land at the welcome hero (HashRouter keeps the prior page's scrollY).
  useEffect(() => {
    const prev = typeof history !== "undefined" ? history.scrollRestoration : undefined;
    try {
      if (prev) history.scrollRestoration = "manual";
    } catch {
      /* ignore */
    }
    window.scrollTo(0, 0);
    setScrollP(0);
    const t = window.setTimeout(() => {
      window.scrollTo(0, 0);
      setScrollP(0);
    }, 0);
    return () => {
      window.clearTimeout(t);
      try {
        if (prev) history.scrollRestoration = prev;
      } catch {
        /* ignore */
      }
    };
  }, []);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onScroll = () => setScrollP(Math.min(1, window.scrollY / 150));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const load = useCallback(async () => {
    setStatus("loading");
    setErr("");
    try {
      const res = await fetch(`${base}/api/guestbook?limit=200`);
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected response from server.");
      }
      if (!res.ok) throw new Error(data?.error || `Server error (${res.status})`);
      const list = (Array.isArray(data.entries) ? data.entries : []).filter((e) => e && e.drawing);
      setEntries(list);
      setStatus("ok");
    } catch (e) {
      const msg = e?.message || String(e);
      const isNet = msg === "Failed to fetch" || msg.includes("NetworkError") || msg.includes("Load failed");
      setErr(isNet ? "We couldn't reach the wall right now. Please check your connection and try again." : msg);
      setStatus("err");
    }
  }, [base]);

  useEffect(() => {
    load();
  }, [load]);

  const loadPending = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${base}/api/guestbook/pending`, {
        headers: { "x-admin-token": adminToken },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      setPending(Array.isArray(data.entries) ? data.entries : []);
    } catch {
      /* ignore */
    }
  }, [adminToken, base]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  async function approveEntry(id) {
    if (!adminToken || !id) return;
    try {
      const res = await fetch(`${base}/api/guestbook/${id}/approve`, {
        method: "POST",
        headers: { "x-admin-token": adminToken },
      });
      if (!res.ok) return;
      setPending((list) => list.filter((e) => e._id !== id));
      await load();
    } catch {
      /* ignore */
    }
  }

  async function deleteEntry(id) {
    if (!adminToken || !id) return;
    try {
      const res = await fetch(`${base}/api/guestbook/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": adminToken },
      });
      if (!res.ok) return;
      setPending((list) => list.filter((e) => e._id !== id));
      setEntries((list) => list.filter((e) => e._id !== id));
      if (active?._id === id) setActive(null);
    } catch {
      /* ignore */
    }
  }

  // Visit counter: once per browser session; skip localhost; never crash if storage is blocked.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = isLocalHost();
      let counted = false;
      try {
        counted = safeGet(sessionStorage, "mannat_visit_counted") === "1";
      } catch {
        counted = false;
      }

      let vid = "";
      try {
        vid = safeGet(localStorage, "mannat_visitor_id") || "";
        if (!vid) {
          vid = makeVisitorId();
          safeSet(localStorage, "mannat_visitor_id", vid);
        }
      } catch {
        vid = makeVisitorId();
      }

      try {
        // Localhost: only read. Production: POST once per session.
        const shouldPost = !local && !counted;
        const res = await fetch(`${base}/api/visits`, {
          method: shouldPost ? "POST" : "GET",
          headers: shouldPost ? { "Content-Type": "application/json" } : undefined,
          body: shouldPost ? JSON.stringify({ visitorId: vid }) : undefined,
        });
        if (!cancelled && res.ok && shouldPost) {
          safeSet(sessionStorage, "mannat_visit_counted", "1");
        }
      } catch {
        /* best-effort — wall still works without counts */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [base]);

  useEffect(() => {
    const prev = document.title;
    document.title = "The Guest Wall — Mannat";
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Ascending: first doodles stay on top.
  const ordered = useMemo(
    () => entries.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [entries]
  );

  const shown = ordered.slice(0, visible);
  const blocks = useMemo(() => buildBlocks(shown), [shown]);
  const hasMore = visible < ordered.length;

  function scrollToGallery() {
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const fade = 1 - Math.min(1, scrollP * 1.1);
  const heroMotion = {
    opacity: fade,
    transform: `translateY(${-scrollP * 70}px)`,
    willChange: "opacity, transform",
  };

  return (
    <div className="wall-root">
      <div className="wall-bg" aria-hidden>
        <span className="wall-blob wall-blob-a" />
        <span className="wall-blob wall-blob-b" />
        <span className="wall-blob wall-blob-c" />
        <span className="wall-blob wall-blob-d" />
      </div>

      <section className="wall-hero" aria-label="The Guest Wall intro">
        <Link to="/" className="wall-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to portfolio
        </Link>

        <div className="wall-hero-inner" style={heroMotion}>
          <div className="wall-eyebrow">Leave Your Mark</div>
          <h1 className="wall-title wall-title-oneline">
            Welcome to <span className="wall-title-grad">The Guest Wall</span>
          </h1>
          <p className="wall-subtitle">Every doodle here was left by someone who stopped by.</p>

          <div className="wall-hero-actions">
            <Link to={{ pathname: "/", search: "?section=interactive-lab" }} className="wall-cta-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 20l1-4 10-10 3 3-10 10-4 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 6l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Leave Your Mark
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="wall-scroll"
          onClick={scrollToGallery}
          aria-label="Scroll to the gallery"
          style={{ opacity: fade }}
        >
          <span className="wall-scroll-text">Explore the wall</span>
          <span className="hero-scroll-chevron" style={{ display: "flex" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </section>

      <section className="wall-gallery-wrap" ref={galleryRef} aria-label="The Guest Wall">
        <div className="wall-gallery-head">
          <h2 className="wall-gallery-title">
            <span className="wall-gallery-title-grad">The Guest Wall</span>
          </h2>
          <div className="wall-gallery-ornament" aria-hidden>
            ✦ <span className="wall-gallery-ornament-line">───</span> ✦
          </div>
        </div>

        {adminToken ? (
          <div className="wall-moderation" aria-label="Moderation">
            <div className="wall-moderation-head">
              <strong>Pending review</strong>
              <span>{pending.length}</span>
            </div>
            {pending.length === 0 ? (
              <p className="wall-moderation-empty">No pending marks.</p>
            ) : (
              <ul className="wall-moderation-list">
                {pending.map((e) => (
                  <li key={e._id} className="wall-moderation-item">
                    <img src={e.drawing} alt="" className="wall-moderation-thumb" />
                    <div className="wall-moderation-meta">
                      <span className="wall-moderation-name">{e.name}</span>
                      {e.message ? <span className="wall-moderation-msg">{e.message}</span> : null}
                    </div>
                    <div className="wall-moderation-actions">
                      <button type="button" onClick={() => approveEntry(e._id)}>
                        Approve
                      </button>
                      <button type="button" className="wall-moderation-danger" onClick={() => deleteEntry(e._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {status === "loading" && <div className="wall-note">Loading the wall…</div>}

        {status === "err" && (
          <div className="wall-state">
            <div className="wall-state-emoji" aria-hidden>
              🎨
            </div>
            <div className="wall-state-title">Something went sideways</div>
            <div className="wall-state-body">{err}</div>
            <button type="button" className="wall-retry" onClick={load}>
              Try again
            </button>
          </div>
        )}

        {status === "ok" && entries.length === 0 && (
          <div className="wall-state">
            <div className="wall-state-emoji" aria-hidden>
              ✍️
            </div>
            <div className="wall-state-title">The wall is blank… for now</div>
            <div className="wall-state-body">No doodles yet — yours could be the very first one here.</div>
            <Link to={{ pathname: "/", search: "?section=interactive-lab" }} className="wall-cta-primary" style={{ marginTop: 6 }}>
              Leave Your Mark
            </Link>
          </div>
        )}

        {status === "ok" && entries.length > 0 && (
          <>
            <div className="wall-artist">
              {blocks.map((block, bi) => (
                <div key={`${block.pattern}-${bi}`} className={`wall-pattern wall-pattern-${block.pattern}`}>
                  {block.items.map(({ entry, meta, isCenter }) => (
                    <WallPiece key={entry._id} entry={entry} meta={meta} isCenter={isCenter} onOpen={setActive} />
                  ))}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="wall-more-wrap">
                <button type="button" className="wall-more" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load more
                </button>
              </div>
            )}
          </>
        )}

        {status === "ok" && (
          <div className="wall-footer-lines">
            <p className="wall-thanks">
              {entries.length > 0
                ? "Thank you for making my little corner of the internet more colorful."
                : "Be the first to leave a mark"}
            </p>
          </div>
        )}
      </section>

      {active && (
        <div
          className="wall-modal-backdrop"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Doodle by ${active.name}`}
        >
          <div className="wall-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="wall-modal-close" onClick={() => setActive(null)} aria-label="Close">
              ✕
            </button>
            <img className="wall-modal-img" src={active.drawing} alt={`Doodle by ${active.name}`} />
            <div className="wall-modal-body">
              <div className="wall-modal-namerow">
                <span className="wall-card-avatar" style={{ background: resolveAccent(active, active._id) }}>
                  {initials(active.name)}
                </span>
                <span className="wall-modal-name">{active.name}</span>
                <span className="wall-card-time">{timeAgo(active.createdAt)}</span>
              </div>
              {active.message ? <p className="wall-modal-msg">{active.message}</p> : null}
              {adminToken ? (
                <div className="wall-moderation-actions" style={{ marginTop: 14 }}>
                  <button type="button" className="wall-moderation-danger" onClick={() => deleteEntry(active._id)}>
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
