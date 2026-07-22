/* ═══════════════════════════════════════════
   FAMATINA — Shared JavaScript
   Animaciones 21st.dev / Aceternity style
═══════════════════════════════════════════ */

/* ──────────────────────────────
   CURSOR
────────────────────────────── */
const cursor  = document.getElementById('cursor');
const cursorR = document.getElementById('cursor-ring');

if (cursor && cursorR) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function raf() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    cursorR.style.left = rx + 'px';
    cursorR.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ──────────────────────────────
   LOADER
────────────────────────────── */
const loader = document.getElementById('loader');
if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('gone'), 2500);
  });
}

/* ──────────────────────────────
   NAV SCROLL
────────────────────────────── */
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ──────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rv').forEach(el => revealObs.observe(el));

/* ──────────────────────────────
   WORD CLIP REVEAL
────────────────────────────── */
document.querySelectorAll('.reveal-words').forEach(el => {
  const words = el.innerHTML.trim().split(/\s+/);
  el.innerHTML = words.map(w =>
    `<span class="word-wrap"><span class="word-inner">${w}</span></span>`
  ).join(' ');
});

const wordObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.word-wrap').forEach((w, i) => {
        setTimeout(() => w.classList.add('in'), i * 60);
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal-words').forEach(el => wordObs.observe(el));

/* ──────────────────────────────
   21st.dev — TEXT SCRAMBLE (Aceternity)
────────────────────────────── */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&';
function scrambleText(el, finalText, duration = 1600, delay = 0) {
  let frame = 0;
  const totalFrames = Math.round(duration / 16);
  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = finalText.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (frame / totalFrames > i / finalText.length) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        el.textContent = finalText;
      }
    }, 16);
  }, delay);
}

/* Run scramble on all .scramble-text when visible */
const scrambleObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const text = el.dataset.text || el.textContent;
      el.dataset.text = text;
      scrambleText(el, text, 1400, 0);
      scrambleObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.scramble-text').forEach(el => scrambleObs.observe(el));

/* ──────────────────────────────
   21st.dev — FLIP WORDS
────────────────────────────── */
document.querySelectorAll('.flip-words-wrap').forEach(wrap => {
  const words = wrap.dataset.words ? wrap.dataset.words.split(',') : [];
  if (!words.length) return;
  let idx = 0;

  function showWord() {
    const el = document.createElement('span');
    el.className = 'flip-word';
    el.textContent = words[idx];
    wrap.innerHTML = '';
    wrap.appendChild(el);
    idx = (idx + 1) % words.length;
  }
  showWord();
  setInterval(showWord, 2200);
});

/* ──────────────────────────────
   21st.dev — SPOTLIGHT on grids
────────────────────────────── */
document.querySelectorAll('.spotlight-grid').forEach(grid => {
  grid.addEventListener('mousemove', e => {
    const r = grid.getBoundingClientRect();
    grid.style.setProperty('--sx', (e.clientX - r.left) + 'px');
    grid.style.setProperty('--sy', (e.clientY - r.top) + 'px');
  });
});

/* ──────────────────────────────
   21st.dev — 3D CARD TILT
────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {
  const strength = parseFloat(card.dataset.tilt || '8');

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform =
      `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

/* ──────────────────────────────
   21st.dev — MAGNETIC BUTTONS
────────────────────────────── */
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
    btn.style.transition = 'transform .5s var(--ease-out)';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform .1s ease';
  });
});

/* ──────────────────────────────
   21st.dev — SPARKLES on logo/title
────────────────────────────── */
function createSparkle(parent) {
  const s = document.createElement('span');
  s.style.cssText = `
    position:absolute;
    pointer-events:none;
    z-index:10;
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    width:4px; height:4px;
    background:var(--c-gold);
    border-radius:50%;
    transform:scale(0);
    animation:sparkleAnim .6s ease forwards;
  `;
  parent.style.position = 'relative';
  parent.appendChild(s);
  setTimeout(() => s.remove(), 700);
}

const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkleAnim {
    0%  { transform:scale(0) rotate(0deg); opacity:1; }
    50% { transform:scale(1) rotate(180deg); opacity:1; }
    100%{ transform:scale(0) rotate(360deg); opacity:0; }
  }
`;
document.head.appendChild(sparkleStyle);

document.querySelectorAll('.sparkle-el').forEach(el => {
  let interval;
  el.addEventListener('mouseenter', () => {
    interval = setInterval(() => createSparkle(el), 100);
  });
  el.addEventListener('mouseleave', () => clearInterval(interval));
});

/* ──────────────────────────────
   HERO PARALLAX
────────────────────────────── */
const heroPanel = document.querySelector('.hero-panel');
if (heroPanel) {
  window.addEventListener('scroll', () => {
    heroPanel.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}

/* ──────────────────────────────
   ACTIVE NAV LINK
────────────────────────────── */
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();
