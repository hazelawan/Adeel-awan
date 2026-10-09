// scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// animated counters
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  (function tick(t) {
    const p = Math.min(1, (t - t0) / 1200);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + '+';
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
  cio.unobserve(el);
}), {threshold: .5});
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// 3D tilt on cards (desktop)
if (matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
}

// mobile menu
const burger = document.getElementById('burger'), mm = document.getElementById('mobilemenu');
burger.addEventListener('click', () => mm.classList.toggle('open'));
mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.classList.remove('open')));

// nav shrink on scroll
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), {passive: true});
