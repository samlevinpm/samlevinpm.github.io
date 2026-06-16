// Nav scroll state
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
if (navToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when any nav link is clicked (anchor nav on one-pager)
  nav.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeMenu();
  });
}

// Expandable work card project panels
document.querySelectorAll('.work-card-expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.work-card');
    const isExpanded = card.classList.toggle('work-card--expanded');
    btn.setAttribute('aria-expanded', String(isExpanded));
  });
});

// Live AQI cards
(async () => {
  const cities = [
    { name: 'Memphis, TN',     lat: 35.1495, lon: -90.0490 },
    { name: 'New Orleans, LA', lat: 29.9511, lon: -90.0715 },
    { name: 'Birmingham, AL',  lat: 33.5186, lon: -86.8104 },
    { name: 'Austin, TX',      lat: 30.2672, lon: -97.7431 },
  ];

  const aqiMeta = (aqi) => {
    if (aqi <= 50)  return { label: 'Good',            color: '#4caf6e', dot: '#4caf6e' };
    if (aqi <= 100) return { label: 'Moderate',        color: '#e6a817', dot: '#e6a817' };
    if (aqi <= 150) return { label: 'Unhealthy for Some', color: '#e8621a', dot: '#e8621a' };
    if (aqi <= 200) return { label: 'Unhealthy',       color: '#d63c3c', dot: '#d63c3c' };
    return           { label: 'Very Unhealthy',        color: '#8b1a8b', dot: '#8b1a8b' };
  };

  const grid = document.getElementById('aqi-grid');
  if (!grid) return;

  const results = await Promise.all(cities.map(c =>
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${c.lat}&longitude=${c.lon}&current=us_aqi,pm2_5&timezone=auto`)
      .then(r => r.json())
      .then(d => ({ ...c, aqi: d.current.us_aqi, pm25: d.current.pm2_5 }))
      .catch(() => ({ ...c, aqi: null }))
  ));

  grid.innerHTML = results.map(({ name, aqi, pm25 }) => {
    if (aqi === null) return `<div class="aqi-card"><span class="aqi-city">${name}</span><span class="aqi-status" style="color:var(--text-muted)">Unavailable</span></div>`;
    const { label, color } = aqiMeta(aqi);
    return `
      <div class="aqi-card">
        <span class="aqi-city">${name}</span>
        <span class="aqi-index" style="color:${color}">${aqi}</span>
        <span class="aqi-status" style="color:${color}">${label}</span>
        <span class="aqi-pm">PM2.5 · ${pm25.toFixed(1)} µg/m³</span>
      </div>`;
  }).join('');
})();

// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

