/* ============================================================
   AMAN PANDEY — PORTFOLIO JAVASCRIPT
   Features:
   1. Sticky header shadow on scroll
   2. Active nav link highlight based on scroll position
   3. Hamburger / mobile nav toggle
   4. Scroll-reveal animations (Intersection Observer)
   5. Typing effect in hero subtitle
   6. Contact form validation + success toast
   7. "Back to top" button appearance on scroll
   ============================================================ */

'use strict';

/* ── 1. STICKY HEADER SHADOW ── */
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


/* ── 2. ACTIVE NAV LINK ON SCROLL ── */
const sections  = document.querySelectorAll('main section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observerOptions = {
  root: null,
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));


/* ── 3. MOBILE NAV TOGGLE ── */
// Inject hamburger button into nav
const navContainer = document.querySelector('.nav-container');
const navLinksList = document.querySelector('.nav-links');

const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.setAttribute('aria-label', 'Toggle navigation');
hamburger.setAttribute('aria-expanded', 'false');
hamburger.innerHTML = `
  <span class="bar"></span>
  <span class="bar"></span>
  <span class="bar"></span>
`;
navContainer.appendChild(hamburger);

hamburger.addEventListener('click', () => {
  const isOpen = navLinksList.classList.toggle('nav-open');
  hamburger.classList.toggle('is-active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked
navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('nav-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (!navContainer.contains(e.target)) {
    navLinksList.classList.remove('nav-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});


/* ── 4. SCROLL-REVEAL ANIMATIONS ── */
const revealEls = document.querySelectorAll(
  '.skill-card, .project-card, .stat-card, .contact-item, .about-text p, .section-title, .section-label'
);

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.55s ease ${(i % 6) * 0.08}s, transform 0.55s ease ${(i % 6) * 0.08}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


/* ── 5. TYPING EFFECT (hero role line) ── */
const roleEl = document.querySelector('.hero-role');
if (roleEl) {
  const phrases = [
    'Computer Science Student & Web Developer',
    'DSA Enthusiast & Problem Solver',
    'Building things for the Web',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    // Rebuild inner HTML preserving the & divider style only on first phrase
    const displayed = current.slice(0, charIndex);
    roleEl.textContent = displayed;

    let delay = isDeleting ? 40 : 75;

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;  // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start after a short delay so page load feels clean
  setTimeout(type, 1200);
}


/* ── 6. CONTACT FORM VALIDATION + TOAST ── */
const form = document.querySelector('.contact-form');

// Inject toast container
const toast = document.createElement('div');
toast.className = 'toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast toast--${type} toast--show`;
  setTimeout(() => {
    toast.classList.remove('toast--show');
  }, 3800);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal    = form.querySelector('#name').value.trim();
    const emailVal   = form.querySelector('#email').value.trim();
    const messageVal = form.querySelector('#message').value.trim();

    // Basic validation
    if (!nameVal) {
      showToast('Please enter your name.', 'error');
      form.querySelector('#name').focus();
      return;
    }
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showToast('Please enter a valid email address.', 'error');
      form.querySelector('#email').focus();
      return;
    }
    if (messageVal.length < 10) {
      showToast('Message must be at least 10 characters.', 'error');
      form.querySelector('#message').focus();
      return;
    }

    // Simulate send
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      showToast('Message sent! I\'ll get back to you soon. 🚀', 'success');
    }, 1200);
  });
}


/* ── 7. BACK TO TOP BUTTON ── */
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>`;
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
