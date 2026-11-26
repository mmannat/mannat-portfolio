import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "./apiBase.js";

const SESSION_KEY = "gw_admin_session";

function adminHeaders() {
  // Bearer-only auth (no cookies) — Authorization cannot be set by cross-site forms.
  const headers = { "Content-Type": "application/json" };
  try {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) headers.Authorization = `Bearer ${session}`;
  } catch {
    /* ignore */
  }
  return headers;
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
  return `${Math.floor(d / 30)}mo ago`;
}

export function WallAdminPage({ apiBase = API_BASE }) {
  const base = useMemo(() => String(apiBase || "").replace(/\/$/, ""), [apiBase]);
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tokenInput, setTokenInput] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState("pending"); // pending | approved
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loadErr, setLoadErr] = useState("");
  const [busyId, setBusyId] = useState(null);

  const checkSession = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch(`${base}/api/admin/session`, {
        headers: adminHeaders(),
      });
      setAuthed(res.ok);
      if (!res.ok) {
        try {
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          /* ignore */
        }
      }
    } catch {
      setAuthed(false);
    } finally {
      setChecking(false);
    }
  }, [base]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    document.title = "Guest Wall Admin — Mannat";
    return () => {
      document.title = "mannat-portfolio";
    };
  }, []);

  const loadLists = useCallback(async () => {
    if (!authed) return;
    setLoadErr("");
    try {
      const [pRes, aRes] = await Promise.all([
        fetch(`${base}/api/guestbook/pending`, { headers: adminHeaders() }),
        fetch(`${base}/api/guestbook/approved`, { headers: adminHeaders() }),
      ]);
      if (pRes.status === 401 || aRes.status === 401) {
        setAuthed(false);
        return;
      }
      const pData = await pRes.json().catch(() => ({}));
      const aData = await aRes.json().catch(() => ({}));
      if (!pRes.ok || !aRes.ok) throw new Error("Could not load entries.");
      setPending(Array.isArray(pData.entries) ? pData.entries : []);
      setApproved(Array.isArray(aData.entries) ? aData.entries : []);
    } catch (e) {
      setLoadErr(e?.message || "Could not load entries.");
    }
  }, [authed, base]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginErr("");
    setLoggingIn(true);
    try {
      const res = await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unauthorized");
      if (typeof data.session === "string" && data.session) {
        try {
          sessionStorage.setItem(SESSION_KEY, data.session);
        } catch {
          /* ignore */
        }
      }
      setTokenInput("");
      setAuthed(true);
    } catch (err) {
      setLoginErr(err?.message === "Unauthorized" ? "Invalid access key." : "Could not sign in.");
      setAuthed(false);
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch(`${base}/api/admin/logout`, {
        method: "POST",
        headers: adminHeaders(),
      });
    } catch {
      /* ignore */
    }
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
    setPending([]);
    setApproved([]);
  }

  async function approveEntry(id) {
    if (!id || busyId) return;
    setBusyId(id);
    try {
      const res = await fetch(`${base}/api/guestbook/${id}/approve`, {
        method: "POST",
        headers: adminHeaders(),
      });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) return;
      const moved = pending.find((e) => e._id === id);
      setPending((list) => list.filter((e) => e._id !== id));
      if (moved) setApproved((list) => [{ ...moved, status: "approved" }, ...list]);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteEntry(id) {
    if (!id || busyId) return;
    setBusyId(id);
    try {
      const res = await fetch(`${base}/api/guestbook/${id}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) return;
      setPending((list) => list.filter((e) => e._id !== id));
      setApproved((list) => list.filter((e) => e._id !== id));
    } finally {
      setBusyId(null);
    }
  }

  const list = tab === "pending" ? pending : approved;

  return (
    <div className="wall-admin-root">
      <div className="wall-admin-bg" aria-hidden>
        <span className="wall-blob wall-blob-a" />
        <span className="wall-blob wall-blob-b" />
      </div>

      <header className="wall-admin-top">
        <div className="wall-admin-brand">
          <h1 className="wall-admin-title">
            Guest Wall <span>Admin</span>
          </h1>
          <p className="wall-admin-sub">Private moderation — not linked from the public site.</p>
        </div>
        <div className="wall-admin-top-actions">
          <Link to="/wall" className="wall-admin-link">
            View wall
          </Link>
          {authed ? (
            <button type="button" className="wall-admin-btn ghost" onClick={handleLogout}>
              Sign out
            </button>
          ) : null}
        </div>
      </header>

      <main className="wall-admin-main">
        {checking ? <div className="wall-admin-note">Checking session…</div> : null}

        {!checking && !authed ? (
          <form className="wall-admin-login" onSubmit={handleLogin}>
            <h2>Sign in</h2>
            <p>Enter your admin access key. It is checked on the server and never stored in the page URL.</p>
            <label className="wall-admin-label" htmlFor="admin-key">
              Access key
            </label>
            <input
              id="admin-key"
              type="password"
              autoComplete="current-password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="wall-admin-input"
              placeholder="••••••••••••"
              required
            />
            {loginErr ? <div className="wall-admin-err">{loginErr}</div> : null}
            <button type="submit" className="wall-admin-btn primary" disabled={loggingIn || !tokenInput.trim()}>
              {loggingIn ? "Signing in…" : "Unlock dashboard"}
            </button>
          </form>
        ) : null}

        {!checking && authed ? (
          <>
            <div className="wall-admin-tabs" role="tablist" aria-label="Moderation tabs">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "pending"}
                className={`wall-admin-tab${tab === "pending" ? " active" : ""}`}
                onClick={() => setTab("pending")}
              >
                Pending <span>{pending.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "approved"}
                className={`wall-admin-tab${tab === "approved" ? " active" : ""}`}
                onClick={() => setTab("approved")}
              >
                Approved <span>{approved.length}</span>
              </button>
              <button type="button" className="wall-admin-btn ghost wall-admin-refresh" onClick={loadLists}>
                Refresh
              </button>
            </div>

            {loadErr ? <div className="wall-admin-err">{loadErr}</div> : null}

            {list.length === 0 ? (
              <div className="wall-admin-empty">{tab === "pending" ? "No pending marks." : "No approved marks yet."}</div>
            ) : (
              <ul className="wall-admin-grid">
                {list.map((e) => (
                  <li key={e._id} className="wall-admin-card">
                    <div className="wall-admin-preview">
                      <img src={e.drawing} alt={`Drawing by ${e.name}`} />
                    </div>
                    <div className="wall-admin-meta">
                      <div className="wall-admin-name">{e.name}</div>
                      {e.message ? <p className="wall-admin-msg">{e.message}</p> : <p className="wall-admin-msg muted">No message</p>}
                      <div className="wall-admin-time">{timeAgo(e.createdAt)}</div>
                    </div>
                    <div className="wall-admin-actions">
                      {tab === "pending" ? (
                        <button
                          type="button"
                          className="wall-admin-btn primary"
                          disabled={busyId === e._id}
                          onClick={() => approveEntry(e._id)}
                        >
                          Approve
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="wall-admin-btn danger"
                        disabled={busyId === e._id}
                        onClick={() => deleteEntry(e._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
