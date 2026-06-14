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

// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

