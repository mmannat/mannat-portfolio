import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "./apiBase.js";

/* ----------------------------------------------------------------
   "Leave Your Mark" — an interactive digital guestbook.
   Visitors doodle on a canvas (brush, neon glow, eraser, fill, shapes,
   text), add a name + short message, and submit. Saved to the portfolio
   API (Node/Express/MongoDB) and shown on The Guest Wall.
------------------------------------------------------------------- */

const CANVAS_W = 680;
const CANVAS_H = 420;
const CANVAS_BG = "#0b1020";
const HISTORY_CAP = 20;

const PALETTE = [
  "#f472b6",
  "#e879f9",
  "#a78bfa",
  "#818cf8",
  "#38bdf8",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#f8fafc",
];

const BRUSHES = [
  { label: "S", size: 3, name: "Small" },
  { label: "M", size: 6, name: "Medium" },
  { label: "L", size: 11, name: "Large" },
];

const SHAPE_TOOLS = ["line", "curve", "rect", "circle", "triangle", "star", "heart"];

const FONTS = [
  { name: "Caveat", css: '"Caveat", cursive' },
  { name: "Pacifico", css: '"Pacifico", cursive' },
  { name: "Permanent Marker", css: '"Permanent Marker", cursive' },
  { name: "Bangers", css: '"Bangers", cursive' },
  { name: "Poppins", css: '"Poppins", sans-serif' },
];

const NAME_MAX = 24;
const MSG_MAX = 140;
const TEXT_MAX = 40;

function textFontPx(size) {
  return Math.round(size * 4 + 12); // S=24, M=36, L=56
}

/* ---------------- drawing geometry + rendering (pure) ---------------- */

function hexToRgb(hex) {
  let h = String(hex || "#ffffff").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function paintBackground(ctx) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = CANVAS_BG;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = "rgba(148,163,184,0.10)";
  for (let y = 24; y < CANVAS_H; y += 28) {
    for (let x = 24; x < CANVAS_W; x += 28) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function lineSeg(ctx, a, b) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function strokeDotAt(ctx, op, p) {
  ctx.save();
  if (op.mode === "glow") {
    ctx.shadowColor = op.color;
    ctx.shadowBlur = Math.max(8, op.size * 2.2);
  }
  ctx.fillStyle = op.mode === "eraser" ? CANVAS_BG : op.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(0.5, op.size / 2), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function strokeSegAt(ctx, op, a, b) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (op.mode === "glow") {
    ctx.shadowColor = op.color;
    ctx.shadowBlur = Math.max(8, op.size * 2.2);
    ctx.strokeStyle = op.color;
    ctx.lineWidth = op.size;
    lineSeg(ctx, a, b);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = Math.max(1, op.size * 0.4);
    lineSeg(ctx, a, b);
  } else {
    ctx.strokeStyle = op.mode === "eraser" ? CANVAS_BG : op.color;
    ctx.lineWidth = op.size;
    lineSeg(ctx, a, b);
  }
  ctx.restore();
}

function renderStroke(ctx, op) {
  const draw = (pts) => {
    if (pts.length === 1) {
      strokeDotAt(ctx, op, pts[0]);
      return;
    }
    strokeDotAt(ctx, op, pts[0]);
    for (let i = 1; i < pts.length; i++) strokeSegAt(ctx, op, pts[i - 1], pts[i]);
  };
  draw(op.points);
  if (op.mirror) draw(op.points.map((p) => ({ x: CANVAS_W - p.x, y: p.y })));
}

function starPath(ctx, cx, cy, outer) {
  const inner = outer * 0.48;
  const spikes = 5;
  let rot = -Math.PI / 2;
  const step = Math.PI / spikes;
  ctx.moveTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
  for (let i = 0; i < spikes; i++) {
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
  }
  ctx.closePath();
}

function heartPath(ctx, x, y, w, h) {
  const cx = x + w / 2;
  const topY = y + h * 0.3;
  ctx.moveTo(cx, y + h);
  ctx.bezierCurveTo(x + w * 1.0, y + h * 0.62, x + w * 0.78, topY - h * 0.28, cx, topY);
  ctx.bezierCurveTo(x + w * 0.22, topY - h * 0.28, x + w * 0.0, y + h * 0.62, cx, y + h);
  ctx.closePath();
}

function buildShapePath(ctx, shape, s, e) {
  const minX = Math.min(s.x, e.x);
  const minY = Math.min(s.y, e.y);
  const w = Math.abs(e.x - s.x);
  const h = Math.abs(e.y - s.y);
  const cx = (s.x + e.x) / 2;
  const cy = (s.y + e.y) / 2;
  ctx.beginPath();
  switch (shape) {
    case "line":
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(e.x, e.y);
      break;
    case "curve": {
      // Quadratic arc: bulge perpendicular to the chord for a smooth curve.
      const mx = (s.x + e.x) / 2;
      const my = (s.y + e.y) / 2;
      const dx = e.x - s.x;
      const dy = e.y - s.y;
      ctx.moveTo(s.x, s.y);
      ctx.quadraticCurveTo(mx - dy * 0.45, my + dx * 0.45, e.x, e.y);
      break;
    }
    case "rect":
      ctx.rect(minX, minY, w, h);
      break;
    case "circle":
      ctx.ellipse(cx, cy, Math.max(1, w / 2), Math.max(1, h / 2), 0, 0, Math.PI * 2);
      break;
    case "triangle":
      ctx.moveTo(cx, minY);
      ctx.lineTo(minX, minY + h);
      ctx.lineTo(minX + w, minY + h);
      ctx.closePath();
      break;
    case "star":
      starPath(ctx, cx, cy, Math.max(2, Math.min(w, h) / 2));
      break;
    case "heart":
      heartPath(ctx, minX, minY, w, h);
      break;
    default:
      break;
  }
}

function renderShape(ctx, op) {
  const drawOnce = (s, e) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = op.color;
    ctx.fillStyle = op.color;
    ctx.lineWidth = op.size;
    buildShapePath(ctx, op.shape, s, e);
    if (op.shape === "line" || op.shape === "curve" || !op.fill) ctx.stroke();
    else ctx.fill();
    ctx.restore();
  };
  drawOnce(op.start, op.end);
  if (op.mirror) {
    drawOnce({ x: CANVAS_W - op.start.x, y: op.start.y }, { x: CANVAS_W - op.end.x, y: op.end.y });
  }
}

function fontShorthand(op) {
  return `${op.size}px "${op.font}", sans-serif`;
}

function renderText(ctx, op) {
  ctx.save();
  ctx.fillStyle = op.color;
  ctx.textBaseline = "top";
  ctx.font = fontShorthand(op);
  ctx.fillText(op.text, op.x, op.y);
  ctx.restore();
}

function floodFill(ctx, x, y, hex) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= CANVAS_W || y >= CANVAS_H) return;
  const img = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const d = img.data;
  const idx = (y * CANVAS_W + x) * 4;
  const tr = d[idx];
  const tg = d[idx + 1];
  const tb = d[idx + 2];
  const [fr, fg, fb] = hexToRgb(hex);
  if (Math.abs(tr - fr) <= 2 && Math.abs(tg - fg) <= 2 && Math.abs(tb - fb) <= 2) return;
  const tol = 48;
  const visited = new Uint8Array(CANVAS_W * CANVAS_H);
  const stack = [x, y];
  while (stack.length) {
    const cy = stack.pop();
    const cx = stack.pop();
    if (cx < 0 || cy < 0 || cx >= CANVAS_W || cy >= CANVAS_H) continue;
    const pi = cy * CANVAS_W + cx;
    if (visited[pi]) continue;
    const i = pi * 4;
    if (Math.abs(d[i] - tr) > tol || Math.abs(d[i + 1] - tg) > tol || Math.abs(d[i + 2] - tb) > tol) continue;
    visited[pi] = 1;
    d[i] = fr;
    d[i + 1] = fg;
    d[i + 2] = fb;
    d[i + 3] = 255;
    stack.push(cx + 1, cy, cx - 1, cy, cx, cy + 1, cx, cy - 1);
  }
  ctx.putImageData(img, 0, 0);
}

function renderFill(ctx, op) {
  floodFill(ctx, op.x, op.y, op.color);
  if (op.mirror) floodFill(ctx, CANVAS_W - op.x, op.y, op.color);
}

function renderOp(ctx, op) {
  if (op.type === "stroke") renderStroke(ctx, op);
  else if (op.type === "shape") renderShape(ctx, op);
  else if (op.type === "fill") renderFill(ctx, op);
  else if (op.type === "text") renderText(ctx, op);
}

/* ---------------- select / transform helpers ---------------- */

function isSelectable(op) {
  if (!op) return false;
  if (op.type === "fill") return false;
  if (op.type === "stroke" && op.mode === "eraser") return false;
  return op.type === "stroke" || op.type === "shape" || op.type === "text";
}

function cloneOp(op) {
  return JSON.parse(JSON.stringify(op));
}

function expandBBox(box, pad) {
  return { x: box.x - pad, y: box.y - pad, w: box.w + pad * 2, h: box.h + pad * 2 };
}

function unionBBox(a, b) {
  if (!a) return b;
  if (!b) return a;
  const x1 = Math.min(a.x, b.x);
  const y1 = Math.min(a.y, b.y);
  const x2 = Math.max(a.x + a.w, b.x + b.w);
  const y2 = Math.max(a.y + a.h, b.y + b.h);
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

function pointsBBox(pts, pad = 0) {
  if (!pts || pts.length === 0) return { x: 0, y: 0, w: 0, h: 0 };
  let minX = pts[0].x;
  let minY = pts[0].y;
  let maxX = pts[0].x;
  let maxY = pts[0].y;
  for (let i = 1; i < pts.length; i++) {
    minX = Math.min(minX, pts[i].x);
    minY = Math.min(minY, pts[i].y);
    maxX = Math.max(maxX, pts[i].x);
    maxY = Math.max(maxY, pts[i].y);
  }
  return expandBBox({ x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) }, pad);
}

function opBBox(op, measureCtx) {
  if (!op) return null;
  if (op.type === "stroke") {
    const pad = Math.max(4, (op.size || 6) / 2 + 3);
    let box = pointsBBox(op.points, pad);
    if (op.mirror) {
      box = unionBBox(
        box,
        pointsBBox(
          op.points.map((p) => ({ x: CANVAS_W - p.x, y: p.y })),
          pad
        )
      );
    }
    return box;
  }
  if (op.type === "shape") {
    const pad = Math.max(4, (op.size || 6) / 2 + 3);
    let box = pointsBBox([op.start, op.end], pad);
    if (op.mirror) {
      box = unionBBox(
        box,
        pointsBBox(
          [
            { x: CANVAS_W - op.start.x, y: op.start.y },
            { x: CANVAS_W - op.end.x, y: op.end.y },
          ],
          pad
        )
      );
    }
    return box;
  }
  if (op.type === "text") {
    let w = Math.max(20, (op.text || "").length * (op.size || 24) * 0.55);
    if (measureCtx) {
      try {
        measureCtx.save();
        measureCtx.font = `${op.size}px "${op.font}", sans-serif`;
        w = Math.max(12, measureCtx.measureText(op.text || "").width);
        measureCtx.restore();
      } catch {
        /* ignore */
      }
    }
    const h = op.size || 24;
    return { x: op.x, y: op.y, w, h };
  }
  return null;
}

function pointInBBox(p, box, slop = 0) {
  if (!box) return false;
  return p.x >= box.x - slop && p.x <= box.x + box.w + slop && p.y >= box.y - slop && p.y <= box.y + box.h + slop;
}

function handlePositions(box) {
  if (!box) return {};
  const { x, y, w, h } = box;
  return {
    nw: { x, y },
    ne: { x: x + w, y },
    sw: { x, y: y + h },
    se: { x: x + w, y: y + h },
  };
}

function hitHandle(p, box, radius = 14) {
  const hs = handlePositions(box);
  for (const name of ["nw", "ne", "sw", "se"]) {
    const h = hs[name];
    if (Math.hypot(p.x - h.x, p.y - h.y) <= radius) return name;
  }
  return null;
}

function translateOp(op, dx, dy) {
  const next = cloneOp(op);
  if (next.type === "stroke") {
    next.points = next.points.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }));
  } else if (next.type === "shape") {
    next.start = { x: next.start.x + dx, y: next.start.y + dy };
    next.end = { x: next.end.x + dx, y: next.end.y + dy };
  } else if (next.type === "text") {
    next.x += dx;
    next.y += dy;
  }
  return next;
}

function scaleOp(op, origBox, newBox) {
  if (!origBox || origBox.w < 1 || origBox.h < 1 || !newBox) return cloneOp(op);
  const sx = newBox.w / origBox.w;
  const sy = newBox.h / origBox.h;
  const map = (pt) => ({
    x: newBox.x + (pt.x - origBox.x) * sx,
    y: newBox.y + (pt.y - origBox.y) * sy,
  });
  const next = cloneOp(op);
  if (next.type === "stroke") {
    next.points = next.points.map(map);
    next.size = Math.max(1, (next.size || 6) * ((Math.abs(sx) + Math.abs(sy)) / 2));
  } else if (next.type === "shape") {
    next.start = map(next.start);
    next.end = map(next.end);
    next.size = Math.max(1, (next.size || 6) * ((Math.abs(sx) + Math.abs(sy)) / 2));
  } else if (next.type === "text") {
    next.x = newBox.x;
    next.y = newBox.y;
    next.size = Math.max(10, (next.size || 24) * Math.abs(sy));
  }
  return next;
}

function resizeBoxFromHandle(origBox, handle, p) {
  let { x, y, w, h } = origBox;
  const x2 = x + w;
  const y2 = y + h;
  let nx1 = x;
  let ny1 = y;
  let nx2 = x2;
  let ny2 = y2;
  if (handle.includes("w")) nx1 = p.x;
  if (handle.includes("e")) nx2 = p.x;
  if (handle.includes("n")) ny1 = p.y;
  if (handle.includes("s")) ny2 = p.y;
  const minSize = 8;
  if (Math.abs(nx2 - nx1) < minSize) {
    if (handle.includes("w")) nx1 = nx2 - minSize;
    else nx2 = nx1 + minSize;
  }
  if (Math.abs(ny2 - ny1) < minSize) {
    if (handle.includes("n")) ny1 = ny2 - minSize;
    else ny2 = ny1 + minSize;
  }
  return {
    x: Math.min(nx1, nx2),
    y: Math.min(ny1, ny2),
    w: Math.abs(nx2 - nx1),
    h: Math.abs(ny2 - ny1),
  };
}

function drawSelectionOverlay(ctx, box) {
  if (!box) return;
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "rgba(232, 121, 249, 0.95)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  ctx.setLineDash([]);
  const hs = handlePositions(box);
  for (const h of Object.values(hs)) {
    ctx.fillStyle = "#0b1020";
    ctx.strokeStyle = "rgba(232, 121, 249, 0.95)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(h.x - 5, h.y - 5, 10, 10);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------------- WebP export (under 100 KB) ---------------- */

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function exportCompressedWebp(src) {
  const LIMIT = 100 * 1024;
  let best = null;
  for (const q of [0.92, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35]) {
    const blob = await canvasToBlob(src, "image/webp", q);
    if (blob && blob.type === "image/webp") {
      best = blob;
      if (blob.size <= LIMIT) return blob;
    }
  }
  let scale = 0.85;
  for (let i = 0; i < 4; i++) {
    const w = Math.max(64, Math.round(CANVAS_W * scale));
    const h = Math.max(40, Math.round(CANVAS_H * scale));
    const tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    tmp.getContext("2d").drawImage(src, 0, 0, w, h);
    const blob = await canvasToBlob(tmp, "image/webp", 0.6);
    if (blob) {
      best = blob;
      if (blob.size <= LIMIT) return blob;
    }
    scale *= 0.8;
  }
  return best;
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(blob);
  });
}

/* ---------------- small helpers ---------------- */

function makeVisitorId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* ignore */
  }
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/* ---------------- icons ---------------- */

const ic = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true };
const icStroke = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

const IconBrush = () => (
  <svg {...ic}>
    <path d="M14 4l6 6-8 8H6v-6l8-8z" {...icStroke} />
    <path d="M12 6l6 6" {...icStroke} />
  </svg>
);
const IconGlow = () => (
  <svg {...ic}>
    <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" {...icStroke} />
    <path d="M19 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" {...icStroke} />
  </svg>
);
const IconEraser = () => (
  <svg {...ic}>
    <path d="M7 17l-3-3a2 2 0 0 1 0-2.8l7-7a2 2 0 0 1 2.8 0l4 4a2 2 0 0 1 0 2.8L13 18H9l-2-1z" {...icStroke} />
    <path d="M20 20H9" {...icStroke} />
  </svg>
);
const IconBucket = () => (
  <svg {...ic}>
    <path d="M5 11l6-6 7 7-6 6a2 2 0 0 1-2.8 0L5 13.8A2 2 0 0 1 5 11z" {...icStroke} />
    <path d="M9 5l-2-2" {...icStroke} />
    <path d="M20 14c0 1.5-1.5 3-1.5 3s-1.5-1.5-1.5-3a1.5 1.5 0 0 1 3 0z" {...icStroke} />
  </svg>
);
const IconText = () => (
  <svg {...ic}>
    <path d="M5 6h14M12 6v13M9 19h6" {...icStroke} />
  </svg>
);
const IconLine = () => (
  <svg {...ic}>
    <path d="M5 19L19 5" {...icStroke} />
  </svg>
);
const IconCurve = () => (
  <svg {...ic}>
    <path d="M4 18C8 6 16 18 20 6" {...icStroke} />
  </svg>
);
const IconRect = () => (
  <svg {...ic}>
    <rect x="4" y="6" width="16" height="12" rx="1.5" {...icStroke} />
  </svg>
);
const IconCircle = () => (
  <svg {...ic}>
    <circle cx="12" cy="12" r="8" {...icStroke} />
  </svg>
);
const IconTriangle = () => (
  <svg {...ic}>
    <path d="M12 4l8 15H4l8-15z" {...icStroke} />
  </svg>
);
const IconStar = () => (
  <svg {...ic}>
    <path d="M12 3l2.5 6.3L21 9.8l-5 4.3 1.6 6.4L12 17l-5.6 3.5L8 14.1l-5-4.3 6.5-.5L12 3z" {...icStroke} />
  </svg>
);
const IconHeart = () => (
  <svg {...ic}>
    <path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7-1.3C19 11.6 12 20 12 20z" {...icStroke} />
  </svg>
);
const IconUndo = () => (
  <svg {...ic}>
    <path d="M9 7L4 12l5 5" {...icStroke} />
    <path d="M4 12h11a5 5 0 0 1 0 10h-1" {...icStroke} />
  </svg>
);
const IconRedo = () => (
  <svg {...ic}>
    <path d="M15 7l5 5-5 5" {...icStroke} />
    <path d="M20 12H9a5 5 0 0 0 0 10h1" {...icStroke} />
  </svg>
);
const IconTrash = () => (
  <svg {...ic}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" {...icStroke} />
  </svg>
);
const IconDownload = () => (
  <svg {...ic}>
    <path d="M12 4v10m0 0l-4-4m4 4l4-4" {...icStroke} />
    <path d="M4 18h16" {...icStroke} />
  </svg>
);
const IconMirror = () => (
  <svg {...ic}>
    <path d="M12 3v18" {...icStroke} strokeDasharray="2 3" />
    <path d="M9 7L4 12l5 5V7z" {...icStroke} />
    <path d="M15 7l5 5-5 5V7z" {...icStroke} />
  </svg>
);
const IconDroplet = () => (
  <svg {...ic}>
    <path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z" {...icStroke} />
  </svg>
);
const IconHelp = () => (
  <svg {...ic}>
    <circle cx="12" cy="12" r="9" {...icStroke} />
    <path d="M9.5 9.2a2.5 2.5 0 0 1 4.6 1.3c0 1.7-2.1 2-2.1 3.5M12 17h.01" {...icStroke} />
  </svg>
);
const IconSelect = () => (
  <svg {...ic}>
    <path d="M5 3l6 16 2-6 6-2L5 3z" {...icStroke} />
  </svg>
);
const IconBringFront = () => (
  <svg {...ic}>
    <rect x="5" y="9" width="10" height="10" rx="1.5" {...icStroke} opacity="0.55" />
    <rect x="9" y="5" width="10" height="10" rx="1.5" {...icStroke} />
  </svg>
);
const IconSendBack = () => (
  <svg {...ic}>
    <rect x="9" y="5" width="10" height="10" rx="1.5" {...icStroke} opacity="0.55" />
    <rect x="5" y="9" width="10" height="10" rx="1.5" {...icStroke} />
  </svg>
);
const IconDeleteSel = () => (
  <svg {...ic}>
    <path d="M6 7h12M10 7V5h4v2M8 7l1 12h6l1-12" {...icStroke} />
  </svg>
);

const TOOL_DEFS = [
  { id: "select", label: "Select", Icon: IconSelect },
  { id: "brush", label: "Brush", Icon: IconBrush },
  { id: "glow", label: "Glow brush", Icon: IconGlow },
  { id: "eraser", label: "Eraser", Icon: IconEraser },
  { id: "fill", label: "Fill", Icon: IconBucket },
  { id: "text", label: "Text", Icon: IconText },
];
const SHAPE_DEFS = [
  { id: "line", label: "Line", Icon: IconLine },
  { id: "curve", label: "Curve", Icon: IconCurve },
  { id: "rect", label: "Rectangle", Icon: IconRect },
  { id: "circle", label: "Circle", Icon: IconCircle },
  { id: "triangle", label: "Triangle", Icon: IconTriangle },
  { id: "star", label: "Star", Icon: IconStar },
  { id: "heart", label: "Heart", Icon: IconHeart },
];

const HELP_ITEMS = [
  { label: "Select", Icon: IconSelect },
  { label: "Brush", Icon: IconBrush },
  { label: "Glow brush", Icon: IconGlow },
  { label: "Eraser", Icon: IconEraser },
  { label: "Fill", Icon: IconBucket },
  { label: "Text", Icon: IconText },
  { label: "Line", Icon: IconLine },
  { label: "Curve", Icon: IconCurve },
  { label: "Rectangle", Icon: IconRect },
  { label: "Circle", Icon: IconCircle },
  { label: "Triangle", Icon: IconTriangle },
  { label: "Star", Icon: IconStar },
  { label: "Heart", Icon: IconHeart },
  { label: "Small", text: "S" },
  { label: "Medium", text: "M" },
  { label: "Large", text: "L" },
  { label: "Outline or Filled", Icon: IconDroplet },
  { label: "Mirror", Icon: IconMirror },
  { label: "Bring to front", Icon: IconBringFront },
  { label: "Send to back", Icon: IconSendBack },
  { label: "Delete selected", Icon: IconDeleteSel },
  { label: "Undo", Icon: IconUndo },
  { label: "Redo", Icon: IconRedo },
  { label: "Clear", Icon: IconTrash },
  { label: "Download WebP", Icon: IconDownload },
];

/* ---------------- reusable tool button with tooltip + long-press ---------------- */

function ToolButton({ label, onActivate, active, disabled, children, style, extraStyle, className = "lym-tool-btn" }) {
  const ref = useRef(null);
  const [tip, setTip] = useState(null);
  const hoverTimer = useRef(null);
  const pressTimer = useRef(null);
  const hideTimer = useRef(null);
  const longPressed = useRef(false);
  const blockScroll = useRef(null);

  const show = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const tipW = 140;
    const tipH = 36;
    const preferBelow = r.top < tipH + 12 && window.innerHeight - r.bottom > r.top;
    const left = Math.min(Math.max(r.left + r.width / 2, tipW / 2 + 8), window.innerWidth - tipW / 2 - 8);
    setTip({
      left,
      top: preferBelow ? r.bottom + 8 : r.top - 8,
      placement: preferBelow ? "below" : "above",
    });
  }, []);
  const hide = useCallback(() => setTip(null), []);

  const clearScrollBlock = useCallback(() => {
    if (blockScroll.current) {
      window.removeEventListener("touchmove", blockScroll.current, { capture: true });
      blockScroll.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(pressTimer.current);
      clearTimeout(hideTimer.current);
      clearScrollBlock();
    },
    [clearScrollBlock]
  );

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-pressed={active ? true : undefined}
        disabled={disabled}
        className={className}
        style={{ ...style, ...(active ? extraStyle : null), touchAction: "manipulation", userSelect: "none", WebkitUserSelect: "none" }}
        onClick={() => {
          if (disabled) return;
          if (longPressed.current) {
            longPressed.current = false;
            return;
          }
          onActivate && onActivate();
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = setTimeout(show, 300);
          }
        }}
        onPointerLeave={() => {
          clearTimeout(hoverTimer.current);
          clearTimeout(pressTimer.current);
          clearScrollBlock();
          hide();
        }}
        onFocus={show}
        onBlur={hide}
        onPointerDown={(e) => {
          longPressed.current = false;
          if (e.pointerType === "touch") {
            // Block page scroll while the finger is held (long-press must not scroll).
            clearScrollBlock();
            blockScroll.current = (ev) => {
              ev.preventDefault();
            };
            window.addEventListener("touchmove", blockScroll.current, { passive: false, capture: true });
            clearTimeout(pressTimer.current);
            pressTimer.current = setTimeout(() => {
              longPressed.current = true;
              show();
              clearTimeout(hideTimer.current);
              hideTimer.current = setTimeout(hide, 1500);
            }, 400);
          }
        }}
        onPointerUp={() => {
          clearTimeout(pressTimer.current);
          clearScrollBlock();
        }}
        onPointerCancel={() => {
          clearTimeout(pressTimer.current);
          clearScrollBlock();
          longPressed.current = false;
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {children}
      </button>
      {tip ? (
        <div
          className="lym-tooltip"
          role="tooltip"
          data-placement={tip.placement}
          style={{ left: tip.left, top: tip.top, transform: `translate(-50%, ${tip.placement === "above" ? "-100%" : "0"})` }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
}

const gs = {
  root: { marginTop: 0, padding: "0 0 clamp(14px, 2vw, 20px)", background: "transparent", border: "none" },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    padding: "clamp(14px, 2.4vw, 20px) clamp(16px, 3vw, 24px) clamp(10px, 1.8vw, 14px)",
    flexWrap: "wrap",
  },
  titleBlock: { flex: "1 1 280px", minWidth: 0 },
  titleLine: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  markWrap: { padding: 1, borderRadius: 12, background: "linear-gradient(135deg, #d946ef, #9333ea, #6366f1)", flexShrink: 0 },
  markInner: { width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #0b1224, #070b14)" },
  h1: { margin: 0, fontSize: "clamp(1.05rem, 2vw, 1.35rem)", fontWeight: 850, letterSpacing: "0.12em", color: "rgba(248, 250, 252, 0.98)" },
  h1Grad: { background: "linear-gradient(92deg, #d8b4fe, #e879f9, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" },
  sub: { margin: "8px 0 0", fontSize: 13, lineHeight: 1.55, fontWeight: 500, color: "rgba(148, 163, 184, 0.9)", maxWidth: 520 },
  shellGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, padding: "clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px) 8px", alignItems: "start", width: "100%", boxSizing: "border-box" },
  card: { position: "relative", borderRadius: 16, padding: "clamp(16px, 2.4vw, 22px)", overflow: "hidden", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(51, 65, 107, 0.35)", boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 36px rgba(0, 0, 0, 0.28)", minWidth: 0 },
  arcGlow: { position: "absolute", pointerEvents: "none", top: "-40%", right: "-20%", width: "90%", height: "70%", background: "radial-gradient(ellipse at 50% 0%, rgba(217, 70, 239, 0.12), transparent 60%)" },
  tabPill: { position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 11px", borderRadius: 999, fontSize: 11, fontWeight: 750, letterSpacing: "0.06em", color: "rgba(226, 232, 240, 0.9)", border: "1px solid rgba(217, 70, 239, 0.25)", background: "rgba(15, 23, 42, 0.55)", marginBottom: 14 },
  canvasFrame: { position: "relative", zIndex: 1, borderRadius: 14, padding: 6, background: "linear-gradient(135deg, rgba(217,70,239,0.25), rgba(99,102,241,0.18))", border: "1px solid rgba(167, 139, 250, 0.22)" },
  canvas: { display: "block", width: "100%", height: "auto", aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, borderRadius: 10, background: CANVAS_BG, touchAction: "none", cursor: "crosshair" },
  toolbar: { position: "relative", zIndex: 1, marginTop: 14, display: "flex", flexDirection: "column", gap: 10 },
  toolRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  toolBtn: { width: 36, height: 32, borderRadius: 9, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(203, 213, 225, 0.85)", border: "1px solid rgba(51, 65, 107, 0.5)", background: "rgba(15, 23, 42, 0.55)", fontFamily: "inherit", padding: 0 },
  toolBtnActive: { borderColor: "rgba(217, 70, 239, 0.65)", background: "rgba(217, 70, 239, 0.16)", color: "#fff", boxShadow: "0 0 14px rgba(217,70,239,0.25)" },
  sep: { width: 1, height: 24, background: "rgba(51, 65, 107, 0.55)", flexShrink: 0, margin: "0 2px" },
  swatchRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  swatch: { width: 26, height: 26, borderRadius: 999, cursor: "pointer", border: "2px solid transparent", padding: 0, outline: "none", transition: "transform 120ms ease, box-shadow 120ms ease" },
  swatchActive: { transform: "scale(1.18)", boxShadow: "0 0 0 2px rgba(255,255,255,0.9)" },
  brushBtn: { width: 34, height: 30, borderRadius: 9, cursor: "pointer", fontFamily: "inherit", fontWeight: 800, fontSize: 12, color: "rgba(226, 232, 240, 0.9)", border: "1px solid rgba(51, 65, 107, 0.5)", background: "rgba(15, 23, 42, 0.55)" },
  brushBtnActive: { borderColor: "rgba(217, 70, 239, 0.6)", background: "rgba(217, 70, 239, 0.14)", color: "#fff" },
  toggle: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 12, color: "rgba(203, 213, 225, 0.85)", border: "1px solid rgba(51, 65, 107, 0.5)", background: "rgba(15, 23, 42, 0.55)" },
  toggleActive: { borderColor: "rgba(217, 70, 239, 0.65)", background: "rgba(217, 70, 239, 0.16)", color: "#fff" },
  iconBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 12, color: "rgba(226, 232, 240, 0.9)", border: "1px solid rgba(51, 65, 107, 0.5)", background: "rgba(15, 23, 42, 0.55)" },
  fieldRow: { position: "relative", zIndex: 1, marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" },
  field: { flex: "1 1 200px", minWidth: 0 },
  fieldLabel: { display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", color: "rgba(148, 163, 184, 0.85)", marginBottom: 6 },
  input: { width: "100%", boxSizing: "border-box", borderRadius: 12, border: "1px solid rgba(51, 65, 107, 0.45)", padding: "12px 12px", outline: "none", fontFamily: "inherit", fontSize: 15, fontWeight: 600, color: "rgba(248, 250, 252, 0.96)", background: "rgba(15, 23, 42, 0.55)" },
  honeypot: { position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" },
  submitRow: { position: "relative", zIndex: 1, marginTop: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  submitBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "13px 22px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 780, fontSize: 15, color: "#fff", background: "linear-gradient(135deg, #d946ef, #9333ea, #6366f1)", boxShadow: "0 10px 28px rgba(91, 33, 182, 0.38), 0 0 18px rgba(217, 70, 239, 0.14), inset 0 1px 0 rgba(255,255,255,0.12)", width: "100%", boxSizing: "border-box", minHeight: 48 },
  submitBtnDisabled: { opacity: 0.6, cursor: "not-allowed", filter: "grayscale(0.2)" },
  msgErr: { fontSize: 13, fontWeight: 650, color: "rgba(251, 113, 133, 0.95)" },
  msgOk: { fontSize: 13, fontWeight: 700, color: "rgba(134, 239, 172, 0.95)" },
};

function TitleSparkle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.9 }}>
      <path d="M12 2l1.2 4.2L18 8l-4.8 1.8L12 14l-1.2-4.2L6 8l4.8-1.8L12 2z" fill="rgba(244, 114, 182, 0.85)" />
    </svg>
  );
}
function PenMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20l1-4 10-10 3 3-10 10-4 1z" stroke="rgba(226,232,240,0.9)" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M14 6l3 3" stroke="rgba(147,197,253,0.6)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
export function InteractiveLabSection({ apiBase = API_BASE }) {
  // ---- form state ----
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem("mannat_player_name") || "";
    } catch {
      return "";
    }
  });
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [formOk, setFormOk] = useState("");

  // ---- tool state ----
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState(PALETTE[0]);
  const [brush, setBrush] = useState(BRUSHES[1].size);
  const [fillShapes, setFillShapes] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [textFont, setTextFont] = useState(FONTS[0].name);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [announce, setAnnounce] = useState("Brush");
  const [helpOpen, setHelpOpen] = useState(false);
  const [textEdit, setTextEdit] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);

  // ---- canvas engine refs ----
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const textInputRef = useRef(null);
  const ctxRef = useRef(null);
  const baselineRef = useRef(null);
  const bakedRef = useRef(false);
  const opsRef = useRef([]);
  const redoRef = useRef([]);
  const drawingRef = useRef(false);
  const curOpRef = useRef(null);
  // Full-canvas snapshot taken right before Clear, so Undo can restore it.
  const preClearSnapRef = useRef(null);
  // After undoing a Clear, Redo should clear again.
  const pendingClearRedoRef = useRef(false);
  // Select-tool edits (move / resize / delete / z-order).
  const editUndoRef = useRef([]);
  const editRedoRef = useRef([]);
  const selectDragRef = useRef(null);
  const selectedIdxRef = useRef(null);

  useEffect(() => {
    selectedIdxRef.current = selectedIdx;
  }, [selectedIdx]);

  const syncState = useCallback(() => {
    setCanUndo(opsRef.current.length > 0 || !!preClearSnapRef.current || editUndoRef.current.length > 0);
    setCanRedo(redoRef.current.length > 0 || !!pendingClearRedoRef.current || editRedoRef.current.length > 0);
    setHasContent(opsRef.current.length > 0 || bakedRef.current);
  }, []);

  const redrawAll = useCallback((opts = {}) => {
    const showSelection = opts.showSelection !== false;
    const ctx = ctxRef.current;
    if (!ctx || !baselineRef.current) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.drawImage(baselineRef.current, 0, 0);
    for (const op of opsRef.current) renderOp(ctx, op);
    if (showSelection && selectedIdxRef.current != null) {
      const op = opsRef.current[selectedIdxRef.current];
      if (op && isSelectable(op)) {
        const box = opBBox(op, ctx);
        drawSelectionOverlay(ctx, box);
      }
    }
  }, []);

  const cloneBaseline = useCallback(() => {
    const src = baselineRef.current;
    const c = document.createElement("canvas");
    c.width = CANVAS_W;
    c.height = CANVAS_H;
    c.getContext("2d").drawImage(src, 0, 0);
    return c;
  }, []);

  const resetBaselineEmpty = useCallback(() => {
    const bctx = baselineRef.current.getContext("2d", { willReadFrequently: true });
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    paintBackground(bctx);
  }, []);

  const bakeOldest = useCallback(() => {
    const bctx = baselineRef.current.getContext("2d", { willReadFrequently: true });
    const op = opsRef.current.shift();
    if (op) {
      renderOp(bctx, op);
      bakedRef.current = true;
    }
  }, []);

  const pushEdit = useCallback(
    (entry) => {
      editUndoRef.current.push(entry);
      if (editUndoRef.current.length > HISTORY_CAP) editUndoRef.current.shift();
      editRedoRef.current = [];
      pendingClearRedoRef.current = false;
      preClearSnapRef.current = null;
      redoRef.current = [];
      syncState();
    },
    [syncState]
  );

  const applyEdit = useCallback(
    (entry, direction) => {
      if (!entry) return;
      let nextSel = selectedIdxRef.current;
      if (entry.kind === "patch") {
        const op = direction === "undo" ? entry.before : entry.after;
        opsRef.current[entry.index] = cloneOp(op);
        nextSel = entry.index;
      } else if (entry.kind === "delete") {
        if (direction === "undo") {
          opsRef.current.splice(entry.index, 0, cloneOp(entry.op));
          nextSel = entry.index;
        } else {
          opsRef.current.splice(entry.index, 1);
          nextSel = null;
        }
      } else if (entry.kind === "reorder") {
        const order = direction === "undo" ? entry.before : entry.after;
        opsRef.current = order.map(cloneOp);
        nextSel = direction === "undo" ? entry.selectBefore : entry.selectAfter;
      }
      selectedIdxRef.current = nextSel;
      setSelectedIdx(nextSel);
      redrawAll();
      syncState();
    },
    [redrawAll, syncState]
  );

  const commit = useCallback(
    (op) => {
      // New strokes replace a pending "redo clear" / select edits.
      pendingClearRedoRef.current = false;
      preClearSnapRef.current = null;
      editUndoRef.current = [];
      editRedoRef.current = [];
      selectedIdxRef.current = null;
      setSelectedIdx(null);
      selectDragRef.current = null;
      opsRef.current.push(op);
      redoRef.current = [];
      while (opsRef.current.length > HISTORY_CAP) bakeOldest();
      redrawAll();
      syncState();
    },
    [bakeOldest, redrawAll, syncState]
  );

  const undo = useCallback(() => {
    if (editUndoRef.current.length > 0) {
      const entry = editUndoRef.current.pop();
      editRedoRef.current.push(entry);
      applyEdit(entry, "undo");
      return;
    }
    // Undo an accidental Clear first (restores full canvas including text).
    if (opsRef.current.length === 0 && preClearSnapRef.current) {
      const snap = preClearSnapRef.current;
      preClearSnapRef.current = null;
      pendingClearRedoRef.current = true;
      opsRef.current = snap.ops;
      const bctx = baselineRef.current.getContext("2d", { willReadFrequently: true });
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      bctx.drawImage(snap.baseline, 0, 0);
      bakedRef.current = snap.baked;
      redoRef.current = [];
      setSelectedIdx(null);
      redrawAll();
      syncState();
      return;
    }
    if (opsRef.current.length === 0) return;
    pendingClearRedoRef.current = false;
    setSelectedIdx(null);
    redoRef.current.push(opsRef.current.pop());
    if (redoRef.current.length > HISTORY_CAP) redoRef.current.shift();
    redrawAll();
    syncState();
  }, [applyEdit, redrawAll, syncState]);

  const clearCanvas = useCallback(() => {
    // Dismiss any in-progress text box (Clear was leaving it on screen).
    setTextEdit(null);
    setSelectedIdx(null);
    selectDragRef.current = null;
    const hasAnything = opsRef.current.length > 0 || bakedRef.current;
    if (!hasAnything) {
      redrawAll();
      syncState();
      return;
    }
    preClearSnapRef.current = {
      ops: opsRef.current.slice(),
      baseline: cloneBaseline(),
      baked: bakedRef.current,
    };
    pendingClearRedoRef.current = false;
    editUndoRef.current = [];
    editRedoRef.current = [];
    opsRef.current = [];
    redoRef.current = [];
    resetBaselineEmpty();
    bakedRef.current = false;
    redrawAll();
    syncState();
  }, [cloneBaseline, redrawAll, resetBaselineEmpty, syncState]);

  const redo = useCallback(() => {
    if (editRedoRef.current.length > 0) {
      const entry = editRedoRef.current.pop();
      editUndoRef.current.push(entry);
      applyEdit(entry, "redo");
      return;
    }
    // Redo a Clear that was just undone.
    if (pendingClearRedoRef.current) {
      pendingClearRedoRef.current = false;
      clearCanvas();
      return;
    }
    if (redoRef.current.length === 0) return;
    setSelectedIdx(null);
    opsRef.current.push(redoRef.current.pop());
    while (opsRef.current.length > HISTORY_CAP) bakeOldest();
    redrawAll();
    syncState();
  }, [applyEdit, bakeOldest, clearCanvas, redrawAll, syncState]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = CANVAS_W;
    c.height = CANVAS_H;
    ctxRef.current = c.getContext("2d", { willReadFrequently: true });
    const off = document.createElement("canvas");
    off.width = CANVAS_W;
    off.height = CANVAS_H;
    const bctx = off.getContext("2d", { willReadFrequently: true });
    paintBackground(bctx);
    baselineRef.current = off;
    bakedRef.current = false;
    opsRef.current = [];
    redoRef.current = [];
    preClearSnapRef.current = null;
    pendingClearRedoRef.current = false;
    editUndoRef.current = [];
    editRedoRef.current = [];
    selectDragRef.current = null;
    setSelectedIdx(null);
    redrawAll();
    syncState();
  }, [redrawAll, syncState]);

  function posFromEvent(e) {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(CANVAS_W, (e.clientX - rect.left) * (c.width / rect.width))),
      y: Math.max(0, Math.min(CANVAS_H, (e.clientY - rect.top) * (c.height / rect.height))),
    };
  }

  function hitTestSelectable(p) {
    for (let i = opsRef.current.length - 1; i >= 0; i--) {
      const op = opsRef.current[i];
      if (!isSelectable(op)) continue;
      const box = opBBox(op, ctxRef.current);
      if (pointInBBox(p, box, 8)) return i;
    }
    return null;
  }

  const deleteSelected = useCallback(() => {
    const idx = selectedIdxRef.current;
    if (idx == null) return;
    const op = opsRef.current[idx];
    if (!op || !isSelectable(op)) return;
    pushEdit({ kind: "delete", index: idx, op: cloneOp(op) });
    opsRef.current.splice(idx, 1);
    setSelectedIdx(null);
    selectedIdxRef.current = null;
    selectDragRef.current = null;
    redrawAll();
    syncState();
    setAnnounce("Delete selected");
  }, [pushEdit, redrawAll, syncState]);

  const bringToFront = useCallback(() => {
    const idx = selectedIdxRef.current;
    if (idx == null || idx >= opsRef.current.length - 1) return;
    const before = opsRef.current.map(cloneOp);
    const [op] = opsRef.current.splice(idx, 1);
    opsRef.current.push(op);
    const after = opsRef.current.map(cloneOp);
    const selectAfter = opsRef.current.length - 1;
    pushEdit({ kind: "reorder", before, after, selectBefore: idx, selectAfter });
    setSelectedIdx(selectAfter);
    selectedIdxRef.current = selectAfter;
    redrawAll();
    setAnnounce("Bring to front");
  }, [pushEdit, redrawAll]);

  const sendToBack = useCallback(() => {
    const idx = selectedIdxRef.current;
    if (idx == null || idx <= 0) return;
    const before = opsRef.current.map(cloneOp);
    const [op] = opsRef.current.splice(idx, 1);
    opsRef.current.unshift(op);
    const after = opsRef.current.map(cloneOp);
    pushEdit({ kind: "reorder", before, after, selectBefore: idx, selectAfter: 0 });
    setSelectedIdx(0);
    selectedIdxRef.current = 0;
    redrawAll();
    setAnnounce("Send to back");
  }, [pushEdit, redrawAll]);

  function openTextEditor(e) {
    const p = posFromEvent(e);
    const frameRect = frameRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const fontPx = textFontPx(brush);
    const dispFontPx = fontPx * (canvasRect.width / CANVAS_W);
    setTextEdit({
      cx: p.x,
      cy: p.y,
      dispX: e.clientX - frameRect.left,
      dispY: e.clientY - frameRect.top,
      value: "",
      fontPx,
      dispFontPx,
    });
    setTimeout(() => {
      const el = textInputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      // Keep the text box above the on-screen keyboard on mobile.
      el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      // Extra nudge after the keyboard opens.
      setTimeout(() => el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" }), 350);
    }, 60);
  }

  async function placeText() {
    const t = textEdit;
    if (!t) return;
    const val = (t.value || "").slice(0, TEXT_MAX);
    if (!val.trim()) {
      setTextEdit(null);
      return;
    }
    try {
      if (document.fonts && document.fonts.load) {
        await document.fonts.load(`${t.fontPx}px "${textFont}"`);
      }
    } catch {
      /* fall back to whatever is available */
    }
    const op = { type: "text", text: val, x: t.cx, y: t.cy, color, font: textFont, size: t.fontPx };
    setTextEdit(null);
    commit(op);
  }

  function handleTextKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      placeText();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setTextEdit(null);
    }
  }

  function handlePointerDown(e) {
    if (textEdit) return; // finish text first
    if (tool === "text") {
      e.preventDefault();
      openTextEditor(e);
      return;
    }
    e.preventDefault();
    const c = canvasRef.current;
    try {
      c.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const p = posFromEvent(e);

    if (tool === "select") {
      const idx = selectedIdxRef.current;
      if (idx != null) {
        const op = opsRef.current[idx];
        const box = op && isSelectable(op) ? opBBox(op, ctxRef.current) : null;
        const handle = box ? hitHandle(p, box, 16) : null;
        if (handle) {
          selectDragRef.current = {
            mode: "resize",
            handle,
            startP: p,
            origOp: cloneOp(op),
            origBox: { ...box },
            index: idx,
          };
          drawingRef.current = true;
          return;
        }
        if (box && pointInBBox(p, box, 6)) {
          selectDragRef.current = {
            mode: "move",
            startP: p,
            origOp: cloneOp(op),
            index: idx,
          };
          drawingRef.current = true;
          return;
        }
      }
      const hit = hitTestSelectable(p);
      setSelectedIdx(hit);
      selectedIdxRef.current = hit;
      selectDragRef.current = null;
      redrawAll();
      if (hit != null) {
        // Start move immediately if pressing on the newly selected object.
        const op = opsRef.current[hit];
        selectDragRef.current = {
          mode: "move",
          startP: p,
          origOp: cloneOp(op),
          index: hit,
        };
        drawingRef.current = true;
      }
      return;
    }

    if (tool === "fill") {
      const ctx = ctxRef.current;
      floodFill(ctx, p.x, p.y, color);
      if (mirror) floodFill(ctx, CANVAS_W - p.x, p.y, color);
      commit({ type: "fill", color, x: p.x, y: p.y, mirror });
      return;
    }

    if (SHAPE_TOOLS.includes(tool)) {
      setSelectedIdx(null);
      curOpRef.current = {
        type: "shape",
        shape: tool,
        color,
        size: brush,
        fill: tool === "line" || tool === "curve" ? false : fillShapes,
        start: p,
        end: p,
        mirror,
      };
      drawingRef.current = true;
      return;
    }

    if (tool === "brush" || tool === "glow" || tool === "eraser") {
      setSelectedIdx(null);
      const op = { type: "stroke", mode: tool, color, size: brush, points: [p], mirror };
      curOpRef.current = op;
      drawingRef.current = true;
      const ctx = ctxRef.current;
      strokeDotAt(ctx, op, p);
      if (mirror) strokeDotAt(ctx, op, { x: CANVAS_W - p.x, y: p.y });
    }
  }

  function handlePointerMove(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const p = posFromEvent(e);

    // Select tool drag (move / resize)
    const drag = selectDragRef.current;
    if (tool === "select" && drag) {
      if (drag.mode === "move") {
        const dx = p.x - drag.startP.x;
        const dy = p.y - drag.startP.y;
        opsRef.current[drag.index] = translateOp(drag.origOp, dx, dy);
        redrawAll();
      } else if (drag.mode === "resize") {
        const newBox = resizeBoxFromHandle(drag.origBox, drag.handle, p);
        opsRef.current[drag.index] = scaleOp(drag.origOp, drag.origBox, newBox);
        redrawAll();
      }
      return;
    }

    const op = curOpRef.current;
    if (!op) return;
    const ctx = ctxRef.current;
    if (op.type === "shape") {
      op.end = p;
      redrawAll();
      renderOp(ctx, op);
      return;
    }
    const prev = op.points[op.points.length - 1];
    op.points.push(p);
    strokeSegAt(ctx, op, prev, p);
    if (op.mirror) strokeSegAt(ctx, op, { x: CANVAS_W - prev.x, y: prev.y }, { x: CANVAS_W - p.x, y: p.y });
  }

  function handlePointerUp(e) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    try {
      canvasRef.current.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    // Finish select move / resize
    const drag = selectDragRef.current;
    if (tool === "select" && drag) {
      selectDragRef.current = null;
      const current = opsRef.current[drag.index];
      if (current && JSON.stringify(current) !== JSON.stringify(drag.origOp)) {
        pushEdit({ kind: "patch", index: drag.index, before: drag.origOp, after: cloneOp(current) });
      }
      redrawAll();
      syncState();
      return;
    }

    const op = curOpRef.current;
    curOpRef.current = null;
    if (!op) return;
    if (op.type === "shape") {
      const moved = Math.abs(op.end.x - op.start.x) > 2 || Math.abs(op.end.y - op.start.y) > 2;
      if (!moved) {
        redrawAll();
        return;
      }
    }
    commit(op);
  }

  // ---- tool selection + announcements ----
  function selectTool(id, label) {
    setTool(id);
    setAnnounce(label);
    setHelpOpen(false);
    if (id !== "select") {
      selectedIdxRef.current = null;
      setSelectedIdx(null);
      selectDragRef.current = null;
      redrawAll();
    }
  }
  function toggleFill() {
    setFillShapes((v) => {
      const nv = !v;
      setAnnounce(nv ? "Filled" : "Outline");
      return nv;
    });
  }
  function toggleMirror() {
    setMirror((v) => {
      const nv = !v;
      setAnnounce(nv ? "Mirror on" : "Mirror off");
      return nv;
    });
  }
  function pickSize(size, nm) {
    setBrush(size);
    setAnnounce(nm);
  }

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setAnnounce("Download WebP");
    try {
      // Export without the selection overlay.
      redrawAll({ showSelection: false });
      const blob = await exportCompressedWebp(canvas);
      redrawAll({ showSelection: true });
      if (!blob) return;
      const ext = blob.type === "image/webp" ? "webp" : "png";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leave-your-mark.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      redrawAll({ showSelection: true });
    }
  }

  // Delete key removes the selected object (Select tool).
  useEffect(() => {
    const onKey = (e) => {
      if (tool !== "select") return;
      if (textEdit) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        const tag = (e.target && e.target.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        deleteSelected();
      } else if (e.key === "Escape") {
        setSelectedIdx(null);
        selectedIdxRef.current = null;
        selectDragRef.current = null;
        redrawAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tool, textEdit, redrawAll, deleteSelected]);

  // ---- Newest thumbs for the Enter The Guest Wall CTA ----
  const [entries, setEntries] = useState([]);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/guestbook`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch {
      /* thumbs are optional */
    }
  }, [apiBase]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Count visits once per session (display lives in The Guest Wall footer only).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let local = false;
      try {
        const h = window.location.hostname;
        local = h === "localhost" || h === "127.0.0.1" || h === "[::1]";
      } catch {
        local = false;
      }

      let vid = "";
      try {
        vid = localStorage.getItem("mannat_visitor_id") || "";
        if (!vid) {
          vid = makeVisitorId();
          localStorage.setItem("mannat_visitor_id", vid);
        }
      } catch {
        vid = makeVisitorId();
      }

      let counted = false;
      try {
        counted = sessionStorage.getItem("mannat_visit_counted") === "1";
      } catch {
        counted = false;
      }

      if (local || counted || cancelled) return;

      try {
        const res = await fetch(`${apiBase}/api/visits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: vid }),
        });
        if (res.ok) {
          try {
            sessionStorage.setItem("mannat_visit_counted", "1");
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* best-effort */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  async function submit() {
    if (submitting) return;
    setFormErr("");
    setFormOk("");
    const nm = name.trim();
    if (!nm) {
      setFormErr("Please add your name.");
      return;
    }
    if (!hasContent) {
      setFormErr("Draw something first — leave your mark!");
      return;
    }
    let drawing;
    try {
      redrawAll({ showSelection: false });
      const blob = await exportCompressedWebp(canvasRef.current);
      redrawAll({ showSelection: true });
      if (!blob || blob.size > 100 * 1024) {
        setFormErr("Could not compress the drawing. Try a simpler doodle.");
        return;
      }
      drawing = await blobToDataURL(blob);
    } catch {
      redrawAll({ showSelection: true });
      setFormErr("Could not read the drawing.");
      return;
    }
    setSubmitting(true);
    try {
      localStorage.setItem("mannat_player_name", nm);
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch(`${apiBase}/api/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nm, message: message.trim(), drawing, color, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not submit. Please try again.");
      // Entries start pending — refresh thumbs from approved-only list.
      await fetchEntries();
      clearCanvas();
      setMessage("");
      setFormOk("Thanks! Your mark was submitted for review. 🎉");
      setTimeout(() => setFormOk(""), 4500);
    } catch (e) {
      setFormErr(e?.message || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const visible = entries.filter((e) => e && e.drawing);
  const newestThumbs = visible.slice(0, 3);

  return (
    <div className="portfolio-interactive-root" style={gs.root}>
      <div style={gs.headerRow}>
        <div style={gs.titleBlock}>
          <div style={gs.titleLine}>
            <div style={gs.markWrap} aria-hidden>
              <div style={gs.markInner}>
                <PenMark />
              </div>
            </div>
            <h2 style={gs.h1}>
              LEAVE YOUR <span style={gs.h1Grad}>MARK</span>
            </h2>
            <TitleSparkle />
          </div>
          <p style={gs.sub}>Doodle something, sign your name, and leave a message. Every visitor&apos;s art lives forever on The Guest Wall.</p>
        </div>
      </div>

      <div style={gs.shellGrid}>
        {/* ---- Draw card ---- */}
        <div style={gs.card} className="lym-card">
          <div style={gs.arcGlow} aria-hidden />
          <div style={gs.tabPill}>
            <span aria-hidden>🎨</span> Your Canvas
          </div>

          <div style={gs.canvasFrame} ref={frameRef}>
            <canvas
              ref={canvasRef}
              style={{ ...gs.canvas, cursor: tool === "select" ? "default" : "crosshair" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
              aria-label="Drawing canvas"
            />
            {textEdit ? (
              <input
                ref={textInputRef}
                className="lym-text-editor"
                value={textEdit.value}
                maxLength={TEXT_MAX}
                placeholder="Type, Enter to place"
                onChange={(e) => setTextEdit((t) => ({ ...t, value: e.target.value }))}
                onKeyDown={handleTextKey}
                style={{ left: textEdit.dispX, top: textEdit.dispY, fontFamily: FONTS.find((f) => f.name === textFont)?.css, fontSize: Math.max(14, textEdit.dispFontPx), color }}
              />
            ) : null}
          </div>

          {/* tool-name bar (helpful on touch) + help button */}
          <div className="lym-toolname-bar">
            <span className="lym-toolname">{announce}</span>
            <button
              type="button"
              className="lym-help-btn"
              aria-label="Help: icon guide"
              aria-expanded={helpOpen}
              onClick={() => setHelpOpen((v) => !v)}
            >
              <IconHelp />
            </button>
          </div>

          {helpOpen ? (
            <div className="lym-help-panel" role="region" aria-label="Toolbar icon guide">
              {HELP_ITEMS.map((it) => (
                <div className="lym-help-row" key={it.label}>
                  <span className="lym-help-icon" aria-hidden>
                    {it.Icon ? <it.Icon /> : <span style={{ fontWeight: 800, fontSize: 12 }}>{it.text}</span>}
                  </span>
                  <span>{it.label}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div style={gs.toolbar}>
            {/* tools + shapes */}
            <div style={gs.toolRow}>
              {TOOL_DEFS.map((t) => (
                <ToolButton key={t.id} label={t.label} active={tool === t.id} onActivate={() => selectTool(t.id, t.label)} style={gs.toolBtn} extraStyle={gs.toolBtnActive}>
                  <t.Icon />
                </ToolButton>
              ))}
              <span style={gs.sep} aria-hidden />
              {SHAPE_DEFS.map((t) => (
                <ToolButton key={t.id} label={t.label} active={tool === t.id} onActivate={() => selectTool(t.id, t.label)} style={gs.toolBtn} extraStyle={gs.toolBtnActive}>
                  <t.Icon />
                </ToolButton>
              ))}
            </div>

            {/* font picker (text tool only) */}
            {tool === "text" ? (
              <div style={gs.toolRow} className="lym-font-row">
                {FONTS.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    className="lym-font-btn"
                    aria-pressed={textFont === f.name}
                    onClick={() => setTextFont(f.name)}
                    style={{ fontFamily: f.css, ...(textFont === f.name ? { borderColor: "rgba(217,70,239,0.65)", background: "rgba(217,70,239,0.16)", color: "#fff" } : null) }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            ) : null}

            {/* size + toggles */}
            <div style={gs.toolRow}>
              {BRUSHES.map((b) => (
                <ToolButton key={b.size} label={b.name} active={brush === b.size} onActivate={() => pickSize(b.size, b.name)} style={gs.brushBtn} extraStyle={gs.brushBtnActive}>
                  {b.label}
                </ToolButton>
              ))}
              <span style={gs.sep} aria-hidden />
              <ToolButton label="Outline or Filled" active={fillShapes} onActivate={toggleFill} style={gs.toggle} extraStyle={gs.toggleActive}>
                <IconDroplet />
                {fillShapes ? "Filled" : "Outline"}
              </ToolButton>
              <ToolButton label="Mirror" active={mirror} onActivate={toggleMirror} style={gs.toggle} extraStyle={gs.toggleActive}>
                <IconMirror />
                Mirror
              </ToolButton>
            </div>

            {/* colors */}
            <div style={gs.swatchRow}>
              {PALETTE.map((c) => (
                <button key={c} type="button" aria-label={`Color ${c}`} onClick={() => setColor(c)} style={{ ...gs.swatch, background: c, ...(color === c ? gs.swatchActive : null) }} />
              ))}
              <label className="lym-color-custom" style={{ ...gs.swatch, background: color, position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center" }} title="Custom color">
                <span style={{ fontSize: 13, color: "#fff", mixBlendMode: "difference" }} aria-hidden>
                  +
                </span>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} aria-label="Pick a custom color" />
              </label>
            </div>

            {/* select actions */}
            {tool === "select" ? (
              <div style={gs.toolRow}>
                <ToolButton label="Bring to front" disabled={selectedIdx == null} onActivate={bringToFront} style={gs.iconBtn}>
                  <IconBringFront /> Front
                </ToolButton>
                <ToolButton label="Send to back" disabled={selectedIdx == null} onActivate={sendToBack} style={gs.iconBtn}>
                  <IconSendBack /> Back
                </ToolButton>
                <ToolButton label="Delete selected" disabled={selectedIdx == null} onActivate={deleteSelected} style={gs.iconBtn}>
                  <IconDeleteSel /> Delete
                </ToolButton>
              </div>
            ) : null}

            {/* actions */}
            <div style={gs.toolRow}>
              <ToolButton label="Undo" disabled={!canUndo} onActivate={undo} style={gs.iconBtn}>
                <IconUndo /> Undo
              </ToolButton>
              <ToolButton label="Redo" disabled={!canRedo} onActivate={redo} style={gs.iconBtn}>
                <IconRedo /> Redo
              </ToolButton>
              <ToolButton label="Clear" disabled={!hasContent && !textEdit} onActivate={clearCanvas} style={gs.iconBtn}>
                <IconTrash /> Clear
              </ToolButton>
              <ToolButton label="Download WebP" disabled={!hasContent} onActivate={handleDownload} style={gs.iconBtn}>
                <IconDownload /> WebP
              </ToolButton>
            </div>
          </div>

          <div style={gs.fieldRow}>
            <div style={gs.field}>
              <div style={gs.fieldLabel}>
                <span>YOUR NAME</span>
                <span>
                  {name.length}/{NAME_MAX}
                </span>
              </div>
              <input style={gs.input} value={name} maxLength={NAME_MAX} placeholder="e.g. Alex" onChange={(e) => setName(e.target.value)} autoComplete="nickname" />
            </div>
            <div style={gs.field}>
              <div style={gs.fieldLabel}>
                <span>MESSAGE (OPTIONAL)</span>
                <span>
                  {message.length}/{MSG_MAX}
                </span>
              </div>
              <input style={gs.input} value={message} maxLength={MSG_MAX} placeholder="Say hi or drop a compliment!" onChange={(e) => setMessage(e.target.value)} />
            </div>
          </div>

          <input style={gs.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} placeholder="Leave this empty" />

          <div style={gs.submitRow}>
            <button type="button" onClick={submit} disabled={submitting} className="lym-submit-btn" style={{ ...gs.submitBtn, ...(submitting ? gs.submitBtnDisabled : null) }}>
              <PenMark />
              {submitting ? "Saving…" : "Leave Your Mark"}
            </button>
            {formErr ? <span style={gs.msgErr}>{formErr}</span> : null}
            {formOk ? <span style={gs.msgOk}>{formOk}</span> : null}
          </div>
        </div>

        {/* ---- Enter The Guest Wall (directly under submit) ---- */}
        <Link to="/wall" className="lym-enter-wall" aria-label="Enter The Guest Wall">
          <span className="lym-enter-copy">
            <span className="lym-enter-kicker">See every mark</span>
            <span className="lym-enter-title">
              Enter <span className="lym-enter-title-grad">The Guest Wall</span>
            </span>
          </span>
          <span className="lym-enter-side" aria-hidden>
            <span className="lym-enter-thumbs">
              {newestThumbs.length > 0
                ? newestThumbs.slice(0, 3).map((e, i) => <img key={e._id} src={e.drawing} alt="" className="lym-enter-thumb" style={{ "--i": i }} loading="lazy" />)
                : [0, 1, 2].map((i) => <span key={i} className="lym-enter-thumb lym-enter-thumb-ph" style={{ "--i": i }} />)}
            </span>
            <span className="lym-enter-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
