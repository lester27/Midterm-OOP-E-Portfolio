/* ============================================================
   OOP PORTFOLIO — script.js
   Lester R. Panganiban
============================================================ */

/* -----------------------------------------------------------
   1. PAGE NAVIGATION (SPA)
----------------------------------------------------------- */
const pages = {
  home:    document.getElementById('page-home'),
  midterm: document.getElementById('page-midterm'),
  finals:  document.getElementById('page-finals'),
};

const navLinks = document.querySelectorAll('.nav-link[data-page]');

function navigateTo(pageKey) {
  // Hide all pages
  Object.values(pages).forEach(p => p.classList.remove('active'));

  // Show target
  const target = pages[pageKey];
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update active nav link
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageKey);
  });

  // Move the pill
  movePillToActive();
}

/* -----------------------------------------------------------
   2. SLIDING NAV PILL
----------------------------------------------------------- */
const pill = document.getElementById('navPill');
const wrapper = document.querySelector('.nav-links-wrapper');

function movePillToLink(linkEl) {
  if (!linkEl) { pill.style.opacity = '0'; return; }
  const wrapperRect = wrapper.getBoundingClientRect();
  const linkRect    = linkEl.getBoundingClientRect();
  pill.style.opacity = '1';
  pill.style.left    = (linkRect.left - wrapperRect.left - 2) + 'px';
  pill.style.width   = linkRect.width + 'px';
}

function movePillToActive() {
  const active = wrapper.querySelector('.nav-link.active');
  movePillToLink(active);
}

// Hover effect
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => movePillToLink(link));
  link.addEventListener('mouseleave', () => movePillToActive());
});

// Include the contact scroll-link in hover too
const contactLink = document.querySelector('.nav-link.scroll-contact');
if (contactLink) {
  contactLink.addEventListener('mouseenter', () => movePillToLink(contactLink));
  contactLink.addEventListener('mouseleave', () => movePillToActive());

  contactLink.addEventListener('click', e => {
    e.preventDefault();
    // Ensure we're on the home page
    if (!pages.home.classList.contains('active')) {
      navigateTo('home');
      // Wait a tick then scroll
      setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Nav link clicks
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const page = link.dataset.page;
    if (page) {
      e.preventDefault();
      navigateTo(page);
    }
  });
});

// Position pill on load
window.addEventListener('load', () => {
  movePillToActive();
});
window.addEventListener('resize', () => {
  movePillToActive();
});

/* -----------------------------------------------------------
   3. MAIN ACCORDIONS (Midterm categories)
----------------------------------------------------------- */
const accordionTriggers = document.querySelectorAll('.accordion-trigger');

accordionTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const group = trigger.dataset.group;
    const body  = document.getElementById('body-' + group);
    const isOpen = trigger.classList.contains('open');

    // Close all
    accordionTriggers.forEach(t => {
      t.classList.remove('open');
      const b = document.getElementById('body-' + t.dataset.group);
      if (b) b.style.maxHeight = '0';
    });

    // Toggle clicked
    if (!isOpen && body) {
      trigger.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 400 + 'px'; // extra room for nested
    }
  });
});

/* -----------------------------------------------------------
   4. SUB-ACCORDIONS (Individual output items)
----------------------------------------------------------- */
function initSubAccordions() {
  const subTriggers = document.querySelectorAll('.sub-trigger');

  subTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const subBody = trigger.nextElementSibling;
      const isOpen  = trigger.classList.contains('open');

      // Close siblings within the same acc-sub-list
      const siblingList = trigger.closest('.acc-sub-list');
      if (siblingList) {
        siblingList.querySelectorAll('.sub-trigger').forEach(t => {
          t.classList.remove('open');
          if (t.nextElementSibling) t.nextElementSibling.style.maxHeight = '0';
        });
      }

      if (!isOpen && subBody) {
        trigger.classList.add('open');
        subBody.style.maxHeight = subBody.scrollHeight + 'px';

        // Re-adjust parent body height
        const parentBody = trigger.closest('.accordion-body');
        if (parentBody) {
          parentBody.style.maxHeight = parentBody.scrollHeight + subBody.scrollHeight + 'px';
        }
      }

      // Rotate chevron
      const chevron = trigger.querySelector('.acc-chevron');
      if (chevron) {
        chevron.style.transform = trigger.classList.contains('open')
          ? 'rotate(180deg)'
          : 'rotate(0deg)';
      }
    });
  });
}

initSubAccordions();

/* -----------------------------------------------------------
   5. PROFILE PICTURE
   To add your photo: replace the .profile-initials div in index.html
   with: <img src="your-photo.jpg" alt="Profile Photo" />
----------------------------------------------------------- */

/* -----------------------------------------------------------
   6. FILE ATTACHMENTS
   Files are embedded directly in index.html by the portfolio owner.
   No viewer upload interaction needed.
----------------------------------------------------------- */

/* -----------------------------------------------------------
   7. NAVBAR SCROLL SHADOW
----------------------------------------------------------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 4px 24px rgba(26,115,232,0.12)';
  } else {
    navbar.style.boxShadow = '0 2px 8px rgba(26,115,232,0.08)';
  }
}, { passive: true });

/* -----------------------------------------------------------
   8. ENTRANCE ANIMATIONS ON PAGE SWITCH
   Re-trigger animations by toggling a class
----------------------------------------------------------- */
function triggerPageAnimations(pageKey) {
  const page = pages[pageKey];
  if (!page) return;

  // For cards on home page
  if (pageKey === 'home') {
    page.querySelectorAll('.nav-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + i * 120);
    });
  }

  // For accordion groups on midterm
  if (pageKey === 'midterm') {
    page.querySelectorAll('.accordion-group').forEach((group, i) => {
      group.style.opacity = '0';
      group.style.transform = 'translateY(20px)';
      setTimeout(() => {
        group.style.transition = 'opacity 0.5s ease, transform 0.5s var(--ease-out)';
        group.style.opacity = '1';
        group.style.transform = 'translateY(0)';
      }, 80 + i * 80);
    });
  }
}

// Wrap navigateTo to also run animations
const _origNavigateTo = navigateTo;
window.navigateTo = function (pageKey) {
  _origNavigateTo(pageKey);
  triggerPageAnimations(pageKey);
};

// Run on initial load for home
triggerPageAnimations('home');

/* -----------------------------------------------------------
   9. SMOOTH SCROLL — on-page links
----------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target && this.getAttribute('href') !== '#') {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* -----------------------------------------------------------
   DARK MODE TOGGLE
----------------------------------------------------------- */
function toggleDark() {
  document.body.classList.toggle('dark');
  const icon = document.getElementById('darkIcon');
  const isDark = document.body.classList.contains('dark');

  // Swap icon between moon and sun
  icon.innerHTML = isDark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

  // Remember preference
  localStorage.setItem('darkMode', isDark);
}

// Apply saved preference on load
if (localStorage.getItem('darkMode') === 'true') toggleDark();
