// Deskmate characters — the one canonical place the three companions live.
//
// Portable + dependency-free: drop this file next to a page, add
//   <script type="module" src="characters.js"></script>
// and these placeholders get the character painted in:
//   <svg class="dusty-real" viewBox="0 0 100 100"></svg>
//   <svg class="hexa-real"  viewBox="0 0 100 100"></svg>
//   <div class="bloom-real"></div>            (Bloom is divs, not SVG — see below)
// Color follows the page's --accent (Hexa/Dusty follow --w-text). Bloom's
// petals also tick a few degrees once a second so it feels alive.
//
// Change a character HERE and it changes everywhere it's used.

// ---- Dusty — paper-ish body, accent flecks, proper eyes. ----
export const DUSTY_SVG = `
  <ellipse cx="50" cy="86" rx="24" ry="4" fill="rgba(0,0,0,0.18)" />
  <path d="M 18 60 C 16 40, 28 24, 44 22 C 58 20, 76 26, 82 42 C 88 56, 86 72, 74 80 C 60 88, 40 88, 26 80 C 18 74, 16 68, 18 60 Z"
        fill="#d9d4c4" stroke="#8a8371" stroke-width="1" stroke-opacity="0.35" />
  <path d="M 38 27 C 36 22, 40 18, 45 19 L 48 26 Z" fill="#c8bfa6" stroke="#8a8371" stroke-width="0.6" stroke-opacity="0.4" />
  <path d="M 80 50 L 88 52 L 85 60 L 78 57 Z" fill="#c8bfa6" stroke="#8a8371" stroke-width="0.6" stroke-opacity="0.4" />
  <path d="M 18 68 L 12 70 L 15 76 L 20 74 Z" fill="#c8bfa6" stroke="#8a8371" stroke-width="0.6" stroke-opacity="0.4" />
  <path d="M 66 74 L 73 76 L 71 82 L 64 80 Z" fill="#c8bfa6" stroke="#8a8371" stroke-width="0.6" stroke-opacity="0.4" />
  <circle cx="30" cy="42" r="1.4" fill="#b8b19c" opacity="0.55" />
  <circle cx="72" cy="38" r="1.2" fill="#b8b19c" opacity="0.55" />
  <circle cx="62" cy="70" r="1.3" fill="#b8b19c" opacity="0.55" />
  <ellipse cx="40" cy="50" rx="7" ry="8" fill="white" stroke="#1a1a1a" stroke-width="1" />
  <ellipse cx="60" cy="50" rx="7" ry="8" fill="white" stroke="#1a1a1a" stroke-width="1" />
  <circle cx="40" cy="50" r="2.6" fill="#1a1a1a" /><circle cx="60" cy="50" r="2.6" fill="#1a1a1a" />
  <circle cx="39.1" cy="49.1" r="0.7" fill="white" /><circle cx="59.1" cy="49.1" r="0.7" fill="white" />`;

// ---- Hexa — hollow hexagon shell + eyes. The hover spin turns the SHELL
// ONLY (eyes stay put), so the eyes live OUTSIDE the spinning <g>. ----
export const HEXA_SVG = `
  <ellipse cx="50" cy="90" rx="22" ry="4" fill="rgba(0,0,0,0.18)" />
  <g class="hexa-spin">
    <path d="M50 16 L80 33 L80 67 L50 84 L20 67 L20 33 Z"
          stroke="var(--w-text)" stroke-width="7" stroke-linejoin="round" fill="none" />
  </g>
  <circle cx="42" cy="47" r="6.5" fill="var(--w-text)" />
  <circle cx="58" cy="47" r="6.5" fill="var(--w-text)" />`;

// ---- Bloom — an exact port of the app's BloomFace (control-ring windmill).
// Built with DIVS, not SVG, so it keeps the app's gradient petals (light top →
// accent bottom) and the layered 3D box-shadow that SVG can't reproduce. It's
// drawn in a fixed 200px "stage" that we scale down to fit the host element,
// exactly like the app scales BASE=200 by min(w,h)/200. ----
const BLOOM_BASE = 200, BLOOM_R = 66, BLOOM_PW = 54, BLOOM_PH = 44, BLOOM_CIRCLE = 48;

// Exact port of `.cw-pad.is-accent` from the app.
const BLOOM_PAD =
  `position:absolute;width:${BLOOM_PW}px;height:${BLOOM_PH}px;border-radius:12px;` +
  `background:linear-gradient(180deg, color-mix(in srgb, var(--accent) 78%, white) 0%, var(--accent) 100%);` +
  `box-shadow:inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -3px 5px rgba(0,0,0,0.22),` +
  ` 0 3px 0 color-mix(in srgb, var(--accent) 55%, black), 0 6px 10px rgba(0,0,0,0.5),` +
  ` 0 0 10px color-mix(in srgb, var(--accent) 45%, transparent);`;

export function bloomHTML() {
  const c = BLOOM_BASE / 2;
  let pads = '';
  for (let i = 0; i < 6; i++) {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    const bx = c + BLOOM_R * Math.cos(a);
    const by = c + BLOOM_R * Math.sin(a);
    pads += `<div style="${BLOOM_PAD}left:${bx - BLOOM_PW / 2}px;top:${by - BLOOM_PH / 2}px;transform:rotate(${i * 60}deg) scale(1.2)"></div>`;
  }
  // Eyes — option A (centered): tall white ovals + dark pupils, no cursor track.
  const gap = 9, ew = 14, eh = 16, pr = 3.5;
  const eye = `position:absolute;width:${ew}px;height:${eh}px;top:${c - eh / 2}px;background:#fff;border-radius:50%`;
  const pupil = `position:absolute;width:${pr * 2}px;height:${pr * 2}px;top:${c - pr + 1.5}px;background:#161922;border-radius:50%`;
  const center =
    `<div style="position:absolute;width:${BLOOM_CIRCLE}px;height:${BLOOM_CIRCLE}px;left:${c - BLOOM_CIRCLE / 2}px;top:${c - BLOOM_CIRCLE / 2}px;border-radius:50%;` +
    `background:radial-gradient(circle at 40% 35%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 60%, transparent);` +
    `border:1.5px solid color-mix(in srgb, var(--accent) 45%, transparent);` +
    `box-shadow:0 0 14px color-mix(in srgb, var(--accent) 22%, transparent), inset 0 0 12px rgba(0,0,0,0.35)"></div>`;
  const eyes =
    `<div style="${eye};left:${c - gap - ew / 2}px"></div>` +
    `<div style="${eye};left:${c + gap - ew / 2}px"></div>` +
    `<div style="${pupil};left:${c - gap - pr}px"></div>` +
    `<div style="${pupil};left:${c + gap - pr}px"></div>`;
  return (
    `<div class="bloom-stage" style="position:absolute;left:50%;top:50%;width:${BLOOM_BASE}px;height:${BLOOM_BASE}px">` +
    `<div class="bloom-petals" style="position:absolute;inset:0;transform-origin:center">${pads}</div>` +
    center + eyes +
    `</div>`
  );
}

// Scale the 200px stage down to the host element's size (centered).
function sizeBloom(el) {
  const stage = el.querySelector('.bloom-stage');
  if (!stage) return;
  const s = Math.min(el.clientWidth, el.clientHeight) / BLOOM_BASE;
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}

// Paint every placeholder inside `root` (default: the whole page). Safe to
// call again after injecting new markup (e.g. a form's thank-you state).
export function injectCharacters(root = document) {
  root.querySelectorAll('.dusty-real').forEach((el) => { el.innerHTML = DUSTY_SVG; });
  root.querySelectorAll('.hexa-real').forEach((el) => { el.innerHTML = HEXA_SVG; });
  const bloom = bloomHTML();
  root.querySelectorAll('.bloom-real').forEach((el) => {
    el.innerHTML = bloom;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    sizeBloom(el);
  });
}

injectCharacters();

// Let non-module scripts on the page re-paint after they swap markup in.
window.injectCharacters = injectCharacters;

// Re-size every Bloom. Call this after showing one that was display:none
// (a Bloom hidden at inject time measures 0 and would render at scale 0).
window.sizeBlooms = () => document.querySelectorAll('.bloom-real').forEach(sizeBloom);
window.addEventListener('resize', window.sizeBlooms);

// Bloom petals nudge a little each second (eyes stay put). The transition
// lives in CSS: .bloom-real .bloom-petals { transition: transform .7s ... }
let bloomDeg = 0;
setInterval(() => {
  bloomDeg += 45;
  document.querySelectorAll('.bloom-real .bloom-petals').forEach((g) => {
    g.style.transform = `rotate(${bloomDeg}deg)`;
  });
}, 1000);
