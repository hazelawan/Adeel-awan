
// ===== CONFIG — apne asal links yahan lagao =====
const WHATSAPP_NUMBER = "923410101415";
const EMAIL_ADDRESS   = "adeelmakhial@gmail.com";

const waBtn = document.getElementById('waBtn'), mailBtn = document.getElementById('mailBtn');
if (waBtn) {
  waBtn.href = WHATSAPP_NUMBER
    ? "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hi Adeel! I saw your portfolio — let's talk about a project.")
    : "#contact";
  if (!WHATSAPP_NUMBER) waBtn.onclick = () => alert("WhatsApp number abhi set nahi — CONFIG mein lagao 🙂");
}
if (mailBtn) {
  mailBtn.href = EMAIL_ADDRESS ? "mailto:" + EMAIL_ADDRESS : "#contact";
  if (!EMAIL_ADDRESS) mailBtn.onclick = () => alert("Email abhi set nahi — CONFIG mein lagao 🙂");
}

// ===== scroll reveal =====
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// ===== animated counters =====
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  cio.unobserve(e.target);
  const el = e.target, target = +el.dataset.n, t0 = performance.now(), dur = 1400;
  (function tick(t){
    const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * ease);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}), { threshold: .5 });
document.querySelectorAll('.count').forEach(el => cio.observe(el));

// ===== back to top =====
const topBtn = document.getElementById('top');
addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 600), { passive: true });
topBtn.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

// ===== tap bounce (mobile touch feedback) =====
document.querySelectorAll('.pj,.sv,.stat,.btn1,.btn2,.photostk').forEach(el => {
  el.addEventListener('touchstart', () => { el.classList.remove('tap'); void el.offsetWidth; el.classList.add('tap'); }, { passive: true });
});

// ===== scroll progress bar =====
const pbar = document.getElementById('pbar');
addEventListener('scroll', () => {
  const h = document.documentElement;
  pbar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

// ===== 3D tilt on cards (desktop pointers) =====
const fine = matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
if (fine) {
  document.querySelectorAll('.pj,.sv,.stat').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transition = 'transform .08s';
      card.style.transform = `perspective(900px) rotateX(${(-y*10).toFixed(2)}deg) rotateY(${(x*12).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1)'; card.style.transform = ''; });
  });
  // ===== hero 3D parallax =====
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
  const pPhoto = document.querySelector('.photostk');
  heroEl && heroEl.addEventListener('pointermove', e => {
    const cx = e.clientX / innerWidth - .5, cy = e.clientY / innerHeight - .5;
    document.querySelectorAll('.hero .shape').forEach((el, i) => {
      const d = (i % 4 + 1) * 16;
      el.style.translate = `${(-cx*d).toFixed(1)}px ${(-cy*d).toFixed(1)}px`;
    });
    if (pPhoto) pPhoto.style.translate = `${(cx*26).toFixed(1)}px ${(cy*20).toFixed(1)}px`;
  });
  heroEl.addEventListener('pointerleave', () => {
    document.querySelectorAll('.hero .shape').forEach(el => el.style.translate = '');
    if (pPhoto) pPhoto.style.translate = '';
  });
}

  }

// ===== confetti burst on CTA =====
document.querySelectorAll('.btn1').forEach(b => b.addEventListener('click', e => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#FFD23F','#E8722A','#1d1d22','#22c55e','#e0559f'];
  for (let i = 0; i < 28; i++) {
    const c = document.createElement('i');
    c.className = 'bconf';
    c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
    c.style.background = colors[i % colors.length];
    if (i % 3 === 0) c.style.borderRadius = '50%';
    document.body.appendChild(c);
    const a = Math.random() * Math.PI * 2, v = 70 + Math.random() * 130;
    c.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${(Math.cos(a)*v).toFixed(0)}px,${(Math.sin(a)*v+90).toFixed(0)}px) rotate(${(Math.random()*540).toFixed(0)}deg)`, opacity: 0 }
    ], { duration: 750 + Math.random() * 550, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => c.remove();
  }
}));

// ===== nav shrink on scroll =====
const navEl = document.querySelector('nav');
addEventListener('scroll', () => navEl.classList.toggle('scrolled', scrollY > 40), { passive: true });

// ===== stagger cards in view =====
const sio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  sio.unobserve(e.target);
  const kids = e.target.querySelectorAll(':scope > *');
  kids.forEach((k, i) => { k.style.transitionDelay = (i * 90) + 'ms'; k.classList.add('in'); });
}), { threshold: .15 });
document.querySelectorAll('.proj,.svc,.stats').forEach(el => {
  el.querySelectorAll(':scope > *').forEach(k => k.classList.add('rv'));
  sio.observe(el);
});
