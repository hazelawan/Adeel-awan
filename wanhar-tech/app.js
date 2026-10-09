// ---------- scroll progress ----------
const prog = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
  prog.style.width = (p * 100) + '%';
}, {passive: true});

// ---------- reveal on scroll (with stagger) ----------
document.querySelectorAll('[data-stagger]').forEach(parent => {
  [...parent.children].forEach((ch, i) => ch.style.transitionDelay = (i * 0.09) + 's');
});
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold: .12});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-z').forEach(el => io.observe(el));

// ---------- animated counters ----------
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  (function tick(t) {
    const p = Math.min(1, (t - t0) / 1300);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + '+';
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
  cio.unobserve(el);
}), {threshold: .5});
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// ---------- 3D tilt on cards (fine pointers) ----------
if (matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  // ---------- hero mouse parallax ----------
  const hero = document.querySelector('.hero');
  if (hero) {
    const layers = hero.querySelectorAll('[data-depth]');
    hero.addEventListener('pointermove', e => {
      const cx = e.clientX / innerWidth - .5, cy = e.clientY / innerHeight - .5;
      layers.forEach(el => {
        const d = +el.dataset.depth;
        el.style.translate = `${cx * d * 46}px ${cy * d * 46}px`;
      });
    });
    hero.addEventListener('pointerleave', () =>
      layers.forEach(el => el.style.translate = '0px 0px'));
  }
}

// ---------- tap bounce (touch) ----------
document.querySelectorAll('.card,.btn,.step,.contact-card').forEach(el => {
  el.addEventListener('touchstart', () => el.classList.add('tap'), {passive: true});
  el.addEventListener('touchend', () => setTimeout(() => el.classList.remove('tap'), 140));
});

// ---------- confetti ----------
function confettiBurst(x, y) {
  const c = document.createElement('canvas');
  c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const colors = ['#E8722A', '#FFD23F', '#2B7FFF', '#25D366', '#ffffff'];
  const parts = Array.from({length: 90}, () => ({
    x, y,
    vx: (Math.random() - .5) * 15, vy: Math.random() * -12 - 3,
    s: Math.random() * 9 + 4, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
    col: colors[Math.random() * colors.length | 0], life: 1
  }));
  (function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    let alive = false;
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += .35; p.r += p.vr; p.life -= .011;
      if (p.life > 0) {
        alive = true;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.col; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .62);
        ctx.restore();
      }
    }
    alive ? requestAnimationFrame(tick) : c.remove();
  })();
}
document.querySelectorAll('.confetti-btn').forEach(b =>
  b.addEventListener('click', e => confettiBurst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2)));

// ---------- mobile menu ----------
const burger = document.getElementById('burger'), mm = document.getElementById('mobilemenu');
burger.addEventListener('click', () => mm.classList.toggle('open'));
mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.classList.remove('open')));

// ---------- nav shrink + active link ----------
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), {passive: true});
const page = document.body.dataset.page;
document.querySelectorAll('[data-nav]').forEach(a => {
  if (a.dataset.nav === page) a.classList.add('active');
});

// ---------- quote form → WhatsApp ----------
const qf = document.getElementById('quoteform');
if (qf) qf.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('qname').value.trim();
  const type = document.getElementById('qtype').value;
  const msg = document.getElementById('qmsg').value.trim();
  const text = encodeURIComponent(`Hi Wanhar Tech! I'm ${name}. I need: ${type}. Details: ${msg}`);
  confettiBurst(innerWidth / 2, innerHeight / 3);
  setTimeout(() => open(`https://wa.me/923410101415?text=${text}`, '_blank'), 450);
});
