/* ================================
   DOREE KASLIWAL — script.js
   ================================ */

/* ===== LOADER ===== */
(function() {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  const label  = document.getElementById('loaderLabel');
  const canvas = document.getElementById('loaderCanvas');
  const ctx    = canvas.getContext('2d');

  const labels = ['INITIALIZING','LOADING MODULES','RENDERING UI','ALMOST DONE','LAUNCHING'];
  let  pct     = 0;

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Digital rain on loader
  const cols  = Math.floor(canvas.width / 18);
  const drops = Array.from({ length: cols }, () => Math.random() * canvas.height);
  const chars = '01アイウエオカキクケコDKDOREEKASLIWAL';

  function drawRain() {
    ctx.fillStyle = 'rgba(3,3,8,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const alpha = Math.random() * 0.5 + 0.05;
      ctx.fillStyle = i % 7 === 0 ? `rgba(0,245,212,${alpha + 0.3})` : `rgba(0,245,212,${alpha})`;
      ctx.fillText(ch, i * 18, y);
      drops[i] = y > canvas.height + Math.random() * 100 ? 0 : y + 18;
    });
  }

  let rafId;
  function rainLoop() { drawRain(); rafId = requestAnimationFrame(rainLoop); }
  rainLoop();

  // Progress
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 5;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';
    label.textContent = labels[Math.floor((pct / 100) * (labels.length - 1))];
    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        cancelAnimationFrame(rafId);
        loader.classList.add('hide');
        document.body.classList.remove('loading');
        initPage();
      }, 400);
    }
  }, 80);
})();

/* ===== INIT PAGE ===== */
function initPage() {
  initCursor();
  initNav();
  initHeroCanvas();
  initCounters();
  initAOS();
  initMobileNav();
  initMagneticBtns();
  initClickSparks();
  logConsole();
}

/* ===== CURSOR ===== */
function initCursor() {
  const blob = document.getElementById('cursorBlob');
  const dot  = document.getElementById('cursorDot');
  let mx = 0, my = 0, bx = 0, by = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animate() {
    bx += (mx - bx) * 0.08;
    by += (my - by) * 0.08;
    blob.style.left = bx + 'px';
    blob.style.top  = by + 'px';
    requestAnimationFrame(animate);
  })();

  document.querySelectorAll('a,button,.proj-card,.skill-block,.ach-card,.wm-card,.et-card,.cg-item,.em-item').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('big'));
    el.addEventListener('mouseleave', () => dot.classList.remove('big'));
  });
}

/* ===== NAV ===== */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 60);
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Active nav highlight
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nl');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(l => {
      l.style.color = l.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
    });
  });
}

/* ===== MOBILE NAV ===== */
function initMobileNav() {
  const btn  = document.getElementById('navToggle');
  const menu = document.getElementById('mobileNav');
  let isOpen = false;

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    menu.classList.toggle('open', isOpen);
    const s = btn.querySelectorAll('span');
    s[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
    s[1].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      isOpen = false;
      menu.classList.remove('open');
      btn.querySelectorAll('span').forEach(s => s.style.transform = '');
    });
  });
}

/* ===== HERO CANVAS — GRID + NODES ===== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Nodes
  const NODES = 55;
  const nodes = Array.from({ length: NODES }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 1.5 + 0.5,
  }));

  // Mouse
  let mx = -9999, my = -9999;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(0,245,212,0.03)';
    ctx.lineWidth = 1;
    const gs = 70;
    for (let x = 0; x < canvas.width; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Move & bounce
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      // Repel from mouse
      const dx = n.x - mx, dy = n.y - my;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        n.x += (dx / dist) * 1.5;
        n.y += (dy / dist) * 1.5;
      }
    });

    // Connections
    for (let i = 0; i < NODES; i++) {
      for (let j = i + 1; j < NODES; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 150) {
          ctx.strokeStyle = `rgba(0,245,212,${(1 - d/150) * 0.12})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,245,212,0.4)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ===== COUNTERS ===== */
function initCounters() {
  const els = document.querySelectorAll('.hs-num');
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      els.forEach(el => {
        const target = parseFloat(el.dataset.val);
        const dec = target % 1 !== 0;
        const dur = 1800;
        const t0  = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 4);
          el.textContent = dec ? (target * e).toFixed(2) : Math.floor(target * e);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = dec ? target.toFixed(2) : target;
        })(t0);
      });
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  const hs = document.querySelector('.hero-stats');
  if (hs) obs.observe(hs);
}

/* ===== SCROLL REVEAL (AOS) ===== */
function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  const grids = [
    '.proj-grid .proj-card',
    '.skills-layout .skill-block',
    '.ach-grid .ach-card',
    '.wm-grid .wm-card',
    '.about-traits .trait',
    '.soft-row .soft-chip',
  ];

  // Stagger grids
  grids.forEach(sel => {
    const els = document.querySelectorAll(sel);
    if (!els.length) return;
    const parent = els[0].closest('section') || els[0].parentElement;
    const o = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        els.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 100));
        o.disconnect();
      }
    }, { threshold: 0.08 });
    o.observe(parent);
  });

  // Regular items
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  items.forEach(el => io.observe(el));
}

/* ===== MAGNETIC BUTTONS ===== */
function initMagneticBtns() {
  document.querySelectorAll('.btn-fill,.btn-outline,.nl-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.2}px,${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  // 3D tilt for project cards
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}

/* ===== CLICK SPARKS ===== */
function initClickSparks() {
  const colors = ['#00f5d4','#a8ff57','#f72585','#ffd60a','#7b2fff'];
  document.addEventListener('click', e => {
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('div');
      s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:5px;height:5px;background:${colors[i%colors.length]};border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%)`;
      document.body.appendChild(s);
      const angle = (i / 8) * Math.PI * 2;
      const dist  = 40 + Math.random() * 50;
      s.animate([
        { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' },
        { opacity: 0, transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)` }
      ], { duration: 500 + Math.random() * 300, easing: 'cubic-bezier(0.16,1,0.3,1)' }).onfinish = () => s.remove();
    }
  });
}

/* ===== CONSOLE GREETING ===== */
function logConsole() {
  const style1 = 'font-family:monospace;font-size:16px;color:#00f5d4;font-weight:bold';
  const style2 = 'font-family:monospace;font-size:12px;color:#a8ff57';
  const style3 = 'font-family:monospace;font-size:11px;color:#888';
  console.log('%c DOREE KASLIWAL — PORTFOLIO ', style1);
  console.log('%c You found the console. Nice.', style2);
  console.log('%c ──────────────────────────', style3);
  console.log('%c 📧 doree.k@somaiya.edu', style3);
  console.log('%c 💻 github.com/DOREE20', style3);
  console.log('%c 💼 linkedin.com/in/doree-kasliwal-1aa985267', style3);
  console.log('%c ──────────────────────────', style3);
  console.log('%c Open to opportunities 🚀', style2);
}
