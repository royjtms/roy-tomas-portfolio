/* ============================================================
  SCROLL REVEAL
   ============================================================ */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale')
  .forEach(el => revealObserver.observe(el));

/* ============================================================
  MOBILE NAV TOGGLE
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const navClose  = document.getElementById('nav-close');
const navMenu   = document.getElementById('nav-menu');
const navLinks  = document.querySelectorAll('.nav-link');

navToggle?.addEventListener('click', () => navMenu.classList.add('show-menu'));
navClose?.addEventListener('click',  () => navMenu.classList.remove('show-menu'));

navLinks.forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('show-menu'));
});

/* ============================================================
  SCROLL-SPY — active nav link
  Watches each section; highlights the matching nav link
  when that section is ≥ 40% in the viewport.
   ============================================================ */
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active from all links
      allNavLinks.forEach(link => link.classList.remove('active-link'));

      // Add active to the matching link
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      activeLink?.classList.add('active-link');
    }
  });
}, {
  threshold: 0.4,       // section must be 40% visible
  rootMargin: '-80px 0px -20% 0px'  // offset for fixed header height
});

sections.forEach(section => spyObserver.observe(section));

/* ============================================================
  TYPEWRITER
   ============================================================ */
const words = ['DEVELOPER', 'WEB DESIGNER', 'CREATOR'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const el = document.getElementById('typewriter');

function type() {
  const current = words[wordIndex];
  el.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);

  isDeleting ? charIndex-- : charIndex++;

  let speed = isDeleting ? 80 : 120;

  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 400;
  }

  setTimeout(type, speed);
}

type();

/* ============================================================
  TEXTAREA CHARACTER COUNTER
  Shows a live count below the message field.
  Warns at 800 chars, enforces 1000 max.
   ============================================================ */
const MAX_CHARS = 1000;
const textarea  = document.querySelector('.form-textarea');
const counter   = document.getElementById('char-counter');

if (textarea && counter) {
  // Enforce maxlength programmatically (backup to the HTML attribute)
  textarea.setAttribute('maxlength', MAX_CHARS);

  textarea.addEventListener('input', () => {
    const remaining = MAX_CHARS - textarea.value.length;
    counter.textContent = `${textarea.value.length} / ${MAX_CHARS}`;

    // Warn at 200 chars remaining
    counter.classList.toggle('counter--warn',  remaining <= 200 && remaining > 50);
    counter.classList.toggle('counter--limit', remaining <= 50);
  });
}

/* ============================================================
  EMAILJS
   ============================================================ */
emailjs.init('i4JN8yG1lKfivyTIz');

const contactForm = document.getElementById('contact-form');
const sendBtn     = document.getElementById('send-btn');
const formStatus  = document.getElementById('form-status');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  sendBtn.disabled  = true;
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  sendBtn.classList.remove('btn--success', 'btn--error');
  formStatus.textContent = '';
  formStatus.className   = 'form-status';

  emailjs.sendForm(
    'service_x2dhzka',
    'template_qd3sjyk',
    this
  ).then(() => {
    formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formStatus.classList.add('success');

    sendBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent!';
    sendBtn.classList.add('btn--success');
    contactForm.reset();

    // Reset counter after form clear
    if (counter) counter.textContent = `0 / ${MAX_CHARS}`;

    setTimeout(() => {
      sendBtn.disabled  = false;
      sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      sendBtn.classList.remove('btn--success');
    }, 3000);

  }).catch((error) => {
    console.error('EmailJS error:', error);

    formStatus.textContent = '✗ Something went wrong. Please try again.';
    formStatus.classList.add('error');

    sendBtn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Failed';
    sendBtn.classList.add('btn--error');

    setTimeout(() => {
      sendBtn.disabled  = false;
      sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      sendBtn.classList.remove('btn--error');
    }, 3000);
  });
});