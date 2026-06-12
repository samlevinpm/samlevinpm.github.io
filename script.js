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

// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Resume inline form ───────────────────────────────────
const EMAILJS_PUBLIC_KEY  = '0AkjaF5JBSV9k0aeS';
const EMAILJS_SERVICE_ID  = 'service_g8o00zj';
const EMAILJS_TEMPLATE_ID = 'template_op9ct1j';

if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const contactDefault = document.getElementById('contact-default');
const contactResume  = document.getElementById('contact-resume');
const resumeForm     = document.getElementById('resume-form');
const resumeSuccess  = document.getElementById('resume-success');

function openResumeForm() {
  if (!contactDefault || !contactResume) return;
  contactDefault.hidden = true;
  contactResume.hidden  = false;
  resumeForm.querySelector('input').focus();
}

function closeResumeForm() {
  if (!contactDefault || !contactResume) return;
  contactDefault.hidden = false;
  contactResume.hidden  = true;
  if (resumeForm)    { resumeForm.hidden = false; resumeForm.reset(); }
  if (resumeSuccess)   resumeSuccess.hidden = true;
}

document.querySelectorAll('[data-resume-trigger]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); openResumeForm(); });
});

const resumeBack = document.getElementById('resume-back');
if (resumeBack) resumeBack.addEventListener('click', closeResumeForm);

const RATE_LIMIT_KEY = 'resume_last_sent';
const RATE_LIMIT_MS  = 5 * 60 * 1000; // 5 minutes

if (resumeForm) {
  resumeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: bots fill hidden fields, humans don't
    if (resumeForm.honeypot && resumeForm.honeypot.value) return;

    // Rate limit: one submission per 5 minutes per browser
    const lastSent = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0', 10);
    if (Date.now() - lastSent < RATE_LIMIT_MS) {
      alert('You already requested the resume — check your downloads.');
      return;
    }

    const btn = resumeForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  resumeForm.from_name.value,
        from_email: resumeForm.from_email.value,
      });
      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      resumeForm.hidden    = true;
      resumeSuccess.hidden = false;
      document.getElementById('resume-download-link').href = 'Sam-Levin-Resume.pdf';
    } catch {
      btn.textContent = 'Get Resume';
      btn.disabled    = false;
      alert('Something went wrong — please reach out on LinkedIn instead.');
    }
  });
}
