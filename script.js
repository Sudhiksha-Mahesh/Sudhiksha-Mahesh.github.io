/* =============================================================
   SUDHIKSHA M K — PORTFOLIO SCRIPT
   Handles: Loader · Cursor · Scroll · Nav · Hero · Skills Canvas
            · Reveal Animations · Stats Counter · Tilt · Magnetic
   ============================================================= */

'use strict';

/* ─────────────────────────────────────────────────────────────
   LOADER
───────────────────────────────────────────────────────────── */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const bar     = document.getElementById('loaderBar');
  const pct     = document.getElementById('loaderPct');

  if (!loader) return;

  document.body.classList.add('loading');

  let progress = 0;
  const duration = 1800; // ms
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    progress = Math.min(100, Math.round((elapsed / duration) * 100));

    bar.style.width = progress + '%';
    pct.textContent = progress;

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      // Small pause so "100" is visible, then fade out
      setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('loading');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
        // Kick off hero name animation after loader
        revealHeroName();
      }, 300);
    }
  }

  // Wait for fonts / window load, then start
  window.addEventListener('load', () => requestAnimationFrame(tick));
})();

/* ─────────────────────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────────────────────── */
(function initCursor() {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  if (!cursor || !cursorTrail) return;

  let mx = -200, my = -200;
  let tx = -200, ty = -200;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Trail follows with lerp
  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top  = ty + 'px';
    raf = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Cursor state based on hovered element
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('[data-cursor]');
    const type = el ? el.dataset.cursor : null;
    document.body.classList.remove('cursor-link', 'cursor-magnetic');
    if (type === 'link')     document.body.classList.add('cursor-link');
    if (type === 'magnetic') document.body.classList.add('cursor-magnetic');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '';
    cursorTrail.style.opacity = '';
  });
})();

/* ─────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─────────────────────────────────────────────────────────────
   NAVIGATION — scroll-hide / scroll-show + active link
───────────────────────────────────────────────────────────── */
(function initNav() {
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('navBurger');
  const menu    = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!nav) return;

  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Scrolled glass style
    if (y > 40) nav.classList.add('scrolled');
    else        nav.classList.remove('scrolled');

    // Hide on scroll-down, show on scroll-up (only after 100px)
    if (y > 100) {
      if (y > lastY) nav.classList.add('hidden');
      else           nav.classList.remove('hidden');
    }
    lastY = y;

    // Active link highlighting
    setActiveNavLink();
  }, { passive: true });

  // Mobile burger
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
    });

    // Close on mobile link click
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }

  // Active section detection
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  setActiveNavLink();
})();

/* ─────────────────────────────────────────────────────────────
   HERO — name type-on, role scramble, spotlight
───────────────────────────────────────────────────────────── */
function revealHeroName() {
  const nameLine  = document.getElementById('heroNameLine');
  const roleEl    = document.getElementById('roleScramble');
  const spotlight = document.getElementById('heroSpotlight');
  const hero      = document.getElementById('hero');

  /* ── Name type-on ── */
  if (nameLine) {
    const name  = 'Sudhiksha M K';
    let   idx   = 0;

    function typeChar() {
      if (idx <= name.length) {
        nameLine.textContent = name.slice(0, idx);
        idx++;
        setTimeout(typeChar, idx === 1 ? 400 : 60);
      } else {
        // Trigger role scramble after name is done
        setTimeout(() => scrambleRole(roleEl), 200);
      }
    }
    typeChar();
  }

  /* ── Hero spotlight follows mouse ── */
  if (spotlight && hero) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      spotlight.style.left = (e.clientX - rect.left) + 'px';
      spotlight.style.top  = (e.clientY - rect.top)  + 'px';
    });
  }
}

/* ── Role text scramble ── */
function scrambleRole(el) {
  if (!el) return;

  const target  = el.textContent;
  const chars   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
  let   iteration = 0;
  const total   = target.length * 3;

  const interval = setInterval(() => {
    el.textContent = target
      .split('')
      .map((ch, i) => {
        if (i < Math.floor(iteration / 3)) return ch;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    iteration++;
    if (iteration > total) clearInterval(interval);
  }, 40);
}

/* ─────────────────────────────────────────────────────────────
   HERO PARTICLE CANVAS
───────────────────────────────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 58, 237, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  loop();
})();

/* ─────────────────────────────────────────────────────────────
   SKILLS ORBIT CANVAS
───────────────────────────────────────────────────────────── */
(function initSkillsCanvas() {
  const canvas      = document.getElementById('skillsCanvas');
  const centerLabel = document.getElementById('skillCenterText');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, cx, cy, raf;
  let hoveredNode = null;

  const SKILLS = [
    // orbit 0 — innermost
    { label: 'Python',     orbit: 0, color: '#7C3AED' },
    { label: 'C++',        orbit: 0, color: '#8B5CF6' },
    { label: 'C',          orbit: 0, color: '#A78BFA' },
    // orbit 1
    { label: 'React',      orbit: 1, color: '#7C3AED' },
    { label: 'Vue.js',     orbit: 1, color: '#8B5CF6' },
    { label: 'Svelte',     orbit: 1, color: '#A78BFA' },
    { label: 'JavaScript', orbit: 1, color: '#C4B5FD' },
    { label: 'HTML',       orbit: 1, color: '#7C3AED' },
    { label: 'CSS',        orbit: 1, color: '#8B5CF6' },
    // orbit 2 — outer
    { label: 'FastAPI',    orbit: 2, color: '#7C3AED' },
    { label: 'Flask',      orbit: 2, color: '#8B5CF6' },
    { label: 'Node.js',    orbit: 2, color: '#A78BFA' },
    { label: 'PostgreSQL', orbit: 2, color: '#7C3AED' },
    { label: 'MongoDB',    orbit: 2, color: '#8B5CF6' },
    { label: 'React',      orbit: 2, color: '#A78BFA' },
    { label: 'Figma',      orbit: 2, color: '#C4B5FD' },
    { label: 'Git',        orbit: 2, color: '#7C3AED' },
    { label: 'Supabase',   orbit: 2, color: '#8B5CF6' },
  ];

  // Assign angular positions per orbit
  const orbitSpeeds = [0.004, 0.0025, 0.0015];
  const orbitRadii  = () => {
    const base = Math.min(W, H) * 0.5 - 40;
    return [base * 0.32, base * 0.57, base * 0.88];
  };

  // Build nodes with angle offsets
  const byOrbit = [[], [], []];
  SKILLS.forEach(s => byOrbit[s.orbit].push(s));
  byOrbit.forEach((group, oi) => {
    group.forEach((node, i) => {
      node.angle = (i / group.length) * Math.PI * 2;
    });
  });

  let nodes = SKILLS;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
  }

  function getPos(node) {
    const radii = orbitRadii();
    const r = radii[node.orbit];
    return {
      x: cx + Math.cos(node.angle) * r,
      y: cy + Math.sin(node.angle) * r,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const radii = orbitRadii();

    // Draw orbit rings
    radii.forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124,58,237,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#7C3AED';
    ctx.shadowColor = '#7C3AED';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Lines from center to nodes
    nodes.forEach(node => {
      const pos = getPos(node);
      const isHovered = node === hoveredNode;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = isHovered
        ? 'rgba(124,58,237,0.5)'
        : 'rgba(124,58,237,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(node => {
      const pos = getPos(node);
      const isHovered = node === hoveredNode;
      const radius = isHovered ? 7 : 5;

      // Glow on hover
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124,58,237,0.15)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#A78BFA' : node.color;
      if (isHovered) {
        ctx.shadowColor = '#A78BFA';
        ctx.shadowBlur = 15;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.font = `${isHovered ? 600 : 400} ${isHovered ? 13 : 11}px 'DM Mono', monospace`;
      ctx.fillStyle = isHovered ? '#FFFFFF' : 'rgba(161,161,170,0.8)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Position label outside node
      const radii = orbitRadii();
      const r = radii[node.orbit];
      const lx = cx + Math.cos(node.angle) * (r + 20);
      const ly = cy + Math.sin(node.angle) * (r + 20);
      ctx.fillText(node.label, lx, ly);
    });
  }

  function animate() {
    nodes.forEach(node => {
      node.angle += orbitSpeeds[node.orbit];
    });
    draw();
    raf = requestAnimationFrame(animate);
  }

  // Hit-test
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let found = null;

    nodes.forEach(node => {
      const pos = getPos(node);
      const dist = Math.hypot(mx - pos.x, my - pos.y);
      if (dist < 16) found = node;
    });

    hoveredNode = found;
    if (centerLabel) {
      centerLabel.textContent = found ? found.label : 'Hover a node';
    }
    canvas.style.cursor = found ? 'none' : '';
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
    if (centerLabel) centerLabel.textContent = 'Hover a node';
  });

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  resize();
  animate();
})();

/* ─────────────────────────────────────────────────────────────
   INTERSECTION OBSERVER — reveal animations
───────────────────────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────────────
   STATS COUNTER ANIMATION
───────────────────────────────────────────────────────────── */
(function initStats() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const dur    = 1200; // ms
        const start  = performance.now();

        function update(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / dur, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────────────
   TILT EFFECT on project cards
───────────────────────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  cards.forEach(card => {
    let rect;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', e => {
      if (!rect) return;
      const x  = e.clientX - rect.left;
      const y  = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -8; // max 8deg
      const ry = ((x - cx) / cx) *  8;

      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;

      // Move glow to cursor position
      const glow = card.querySelector('.pc-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124,58,237,0.18) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glow = card.querySelector('.pc-glow');
      if (glow) glow.style.background = '';
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   MAGNETIC BUTTON EFFECT
───────────────────────────────────────────────────────────── */
(function initMagnetic() {
  // Only on desktop
  if (window.matchMedia('(max-width: 640px)').matches) return;

  const magnetics = document.querySelectorAll('[data-cursor="magnetic"]');

  magnetics.forEach(el => {
    let rect;

    el.addEventListener('mouseenter', () => {
      rect = el.getBoundingClientRect();
    });

    el.addEventListener('mousemove', e => {
      if (!rect) return;
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      rect = null;
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   SMOOTH SCROLL — anchor links
───────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const hash = anchor.getAttribute('href');
      if (hash === '#') return; // e.g. download resume placeholder

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const navH   = document.getElementById('nav')?.offsetHeight ?? 64;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   DOWNLOAD RESUME — graceful fallback
───────────────────────────────────────────────────────────── */
(function initResumeDownload() {
  const btn = document.getElementById('downloadResume');
  if (!btn) return;

  btn.addEventListener('click', e => {
    const href = btn.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
      // Visual feedback
      const span = btn.querySelector('span');
      if (span) {
        const orig = span.textContent;
        span.textContent = 'Coming soon!';
        setTimeout(() => { span.textContent = orig; }, 1800);
      }
    }
  });
})();

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENT CARD — glow follows cursor
───────────────────────────────────────────────────────────── */
(function initAchievementGlow() {
  document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const glow = card.querySelector('.ach-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124,58,237,0.2) 0%, transparent 70%)`;
        glow.style.top  = '0';
        glow.style.left = '0';
        glow.style.right = 'unset';
        glow.style.width  = '100%';
        glow.style.height = '100%';
      }
    });

    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.ach-glow');
      if (glow) {
        glow.style.background = '';
        glow.style.top   = '-60px';
        glow.style.right = '-60px';
        glow.style.left  = '';
        glow.style.width  = '160px';
        glow.style.height = '160px';
      }
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   FOOTER — current year
───────────────────────────────────────────────────────────── */
(function initFooterYear() {
  const copy = document.querySelector('.footer-copy');
  if (!copy) return;
  copy.textContent = copy.textContent.replace(/\d{4}/, new Date().getFullYear());
})();
