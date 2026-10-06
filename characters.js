// Deskmate characters — the one canonical place the three companions live.
//
// Portable + dependency-free: drop this file next to a page, add
//   <script type="module" src="characters.js"></script>
// and any element with one of these classes gets the character painted in:
//   <svg class="dusty-real" viewBox="0 0 100 100"></svg>
//   <svg class="hexa-real"  viewBox="0 0 100 100"></svg>
//   <svg class="bloom-real" viewBox="0 0 100 100"></svg>
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

// ---- Bloom — the app's control-ring shape (six accent petals in a windmill)
// with a hollow center + eyes. Petals sit in a <g class="bloom-petals"> so
// they can rotate without dragging the eyes along. ----
export function bloomSVG() {
  const R = 27, PW = 30, PH = 24, RX = 7, cx = 50, cy = 50;
  let petals = '';
  for (let i = 0; i < 6; i++) {
    const ang = ((-90 + i * 60) * Math.PI) / 180;
    const px = (cx + R * Math.cos(ang)).toFixed(2);
    const py = (cy + R * Math.sin(ang)).toFixed(2);
    petals +=
      `<g transform="translate(${px} ${py}) rotate(${i * 60})">` +
      `<rect x="${-PW / 2}" y="${-PH / 2 + 1.6}" width="${PW}" height="${PH}" rx="${RX}" fill="rgba(0,0,0,0.33)"/>` +
      `<rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}" rx="${RX}" fill="var(--accent)"/>` +
      `<rect x="${-PW / 2 + 1.6}" y="${-PH / 2 + 1}" width="${PW - 3.2}" height="3.3" rx="1.6" fill="rgba(255,255,255,0.45)"/>` +
      `</g>`;
  }
  return (
    `<g class="bloom-petals">${petals}</g>` +
    `<circle cx="50" cy="50" r="15" fill="#0f1219"/>` +
    `<circle cx="50" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>` +
    `<ellipse cx="44.6" cy="49.5" rx="4.7" ry="5.5" fill="#fff"/>` +
    `<ellipse cx="55.4" cy="49.5" rx="4.7" ry="5.5" fill="#fff"/>` +
    `<circle cx="45.4" cy="51" r="2.5" fill="#161922"/>` +
    `<circle cx="56.2" cy="51" r="2.5" fill="#161922"/>`
  );
}

// Paint every placeholder inside `root` (default: the whole page). Safe to
// call again after injecting new markup (e.g. a form's thank-you state).
export function injectCharacters(root = document) {
  root.querySelectorAll('.dusty-real').forEach((el) => { el.innerHTML = DUSTY_SVG; });
  root.querySelectorAll('.hexa-real').forEach((el) => { el.innerHTML = HEXA_SVG; });
  const bloom = bloomSVG();
  root.querySelectorAll('.bloom-real').forEach((el) => { el.innerHTML = bloom; });
}

injectCharacters();

// Let non-module scripts on the page re-paint after they swap markup in.
window.injectCharacters = injectCharacters;

// Bloom petals nudge a little each second (eyes stay put). The transition
// lives in CSS: .bloom-real .bloom-petals { transition: transform .7s ... }
let bloomDeg = 0;
setInterval(() => {
  bloomDeg += 12;
  document.querySelectorAll('.bloom-real .bloom-petals').forEach((g) => {
    g.style.transform = `rotate(${bloomDeg}deg)`;
  });
}, 1000);
