/* =================================================================
   AVINASH VERMA PORTFOLIO — PREMIUM MOTION.DEV ANIMATIONS ENGINE
   Powered by Motion for JavaScript (https://motion.dev/)
   ================================================================= */

import { animate, scroll, inView, stagger, spring, hover, press } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';

/* ── Motion & System Preferences ───────────────────────── */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbarMotion();
  initMobileDrawerMotion();
  initHeroCinematicSequence();
  initParallaxEffects();
  initSectionHeadings();
  initAboutSection();
  initEducationTimeline();
  initSkillsSection();
  initProjectsSection();
  initHobbiesSection();
  initContactSection();
  initButtonMicroInteractions();
  initFooterReveal();
  initCustomCursorMotion();
});

/* ─────────────────────────────────────────────────────────────
   1. SCROLL PROGRESS BAR — Motion scroll() API
   ───────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  if (reducedMotion) {
    bar.style.transform = 'scaleX(1)';
    return;
  }

  // Bind scroll progress directly to scaleX
  scroll((progress) => {
    bar.style.transform = `scaleX(${progress})`;
  });
}

/* ─────────────────────────────────────────────────────────────
   2. NAVBAR MOTION — Directional Auto-Hide, Sticky Blur & Active Pill
   ───────────────────────────────────────────────────────────── */
function initNavbarMotion() {
  const navbar = document.getElementById('navbar');
  const navLinksContainer = document.getElementById('navLinks');
  if (!navbar) return;

  // Staggered navbar entrance on load (desktop only for links)
  if (!reducedMotion) {
    animate('.nav-brand', { opacity: [0, 1], y: [-20, 0] }, { duration: 0.6, easing: spring({ stiffness: 120, damping: 14 }) });
    if (window.innerWidth > 900) {
      animate('.nav-links li', { opacity: [0, 1], y: [-15, 0] }, { delay: stagger(0.06, { start: 0.1 }), duration: 0.5, easing: spring({ stiffness: 140, damping: 16 }) });
    }
    animate('.nav-actions', { opacity: [0, 1], y: [-20, 0] }, { delay: 0.3, duration: 0.5 });
  }

  // Active link indicator pill setup (desktop only)
  let pill = navLinksContainer ? navLinksContainer.querySelector('.nav-active-pill') : null;
  if (navLinksContainer && !pill && !isTouchDevice && window.innerWidth > 900) {
    pill = document.createElement('div');
    pill.className = 'nav-active-pill';
    navLinksContainer.appendChild(pill);
  }

  function updateActivePill() {
    if (!pill || window.innerWidth <= 900) return;
    const activeLink = navLinksContainer.querySelector('.nav-link.active');
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const parentRect = navLinksContainer.getBoundingClientRect();
      const targetLeft = rect.left - parentRect.left;
      const targetWidth = rect.width;

      animate(pill, {
        left: `${targetLeft}px`,
        width: `${targetWidth}px`,
        opacity: 1
      }, {
        easing: spring({ stiffness: 260, damping: 24 })
      });
    } else {
      pill.style.opacity = '0';
    }
  }

  window.addEventListener('resize', updateActivePill, { passive: true });
  setTimeout(updateActivePill, 400);

  // Directional scroll auto-hide navbar
  let lastScrollY = window.scrollY;
  let isNavHidden = false;

  scroll(() => {
    const currentScrollY = window.scrollY;
    
    // Sticky state
    if (currentScrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Auto hide on scroll down (only after passing hero height)
    if (currentScrollY > 320) {
      if (currentScrollY > lastScrollY + 12 && !isNavHidden) {
        isNavHidden = true;
        animate(navbar, { y: '-100%' }, { duration: 0.3, easing: [0.16, 1, 0.3, 1] });
      } else if (currentScrollY < lastScrollY - 12 && isNavHidden) {
        isNavHidden = false;
        animate(navbar, { y: '0%' }, { duration: 0.3, easing: [0.16, 1, 0.3, 1] });
      }
    } else if (isNavHidden) {
      isNavHidden = false;
      animate(navbar, { y: '0%' }, { duration: 0.3, easing: [0.16, 1, 0.3, 1] });
    }

    lastScrollY = currentScrollY;
    updateActivePill();
  });
}

/* ─────────────────────────────────────────────────────────────
   3. MOBILE DRAWER MOTION — Smooth Spring & Stagger
   ───────────────────────────────────────────────────────────── */
function initMobileDrawerMotion() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  if (!hamburger || !navLinks) return;

  let isDrawerOpen = false;

  function openDrawer() {
    isDrawerOpen = true;
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (!reducedMotion) {
      if (navOverlay) {
        animate(navOverlay, { opacity: [0, 1] }, { duration: 0.3 });
      }
      animate(navLinks, { x: ['100%', '0%'], opacity: [0, 1] }, { duration: 0.45, easing: spring({ stiffness: 220, damping: 20 }) });
      
      const items = navLinks.querySelectorAll('li');
      animate(items, { opacity: [0, 1], x: [30, 0] }, { delay: stagger(0.05, { start: 0.1 }), duration: 0.4, easing: spring({ stiffness: 240, damping: 18 }) });
    }
  }

  function closeDrawer() {
    if (!isDrawerOpen) return;
    isDrawerOpen = false;
    hamburger.classList.remove('open');
    document.body.style.overflow = '';

    if (!reducedMotion) {
      if (navOverlay) {
        animate(navOverlay, { opacity: [1, 0] }, { duration: 0.25 });
      }
      animate(navLinks, { x: ['0%', '100%'], opacity: [1, 0] }, { duration: 0.3, easing: [0.4, 0, 1, 1] }).then(() => {
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('open');
      });
    } else {
      navLinks.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('open');
    }
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      closeDrawer();
    });
  }

  document.addEventListener('click', (e) => {
    if (isDrawerOpen && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDrawerOpen) {
      closeDrawer();
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   4. CINEMATIC HERO ANIMATION
   ───────────────────────────────────────────────────────────── */
function initHeroCinematicSequence() {
  if (reducedMotion) return;

  const heroTag = document.querySelector('.hero-tag');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-description');
  const heroButtons = document.querySelectorAll('.hero-buttons .btn');
  const socialIcons = document.querySelectorAll('.social-links .social-icon');
  const heroImage = document.querySelector('.hero-image-wrapper');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (heroImage) {
    animate(heroImage, 
      { opacity: [0, 1], scale: [0.88, 1], y: [25, 0] }, 
      { duration: 0.9, easing: spring({ stiffness: 150, damping: 16 }) }
    );
  }

  if (heroTag) {
    animate(heroTag, 
      { opacity: [0, 1], y: [20, 0], scale: [0.92, 1] }, 
      { delay: 0.15, duration: 0.7, easing: spring({ stiffness: 160, damping: 15 }) }
    );
  }

  if (heroTitle) {
    animate(heroTitle, 
      { opacity: [0, 1], y: [28, 0] }, 
      { delay: 0.25, duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );
  }

  if (heroDesc) {
    animate(heroDesc, 
      { opacity: [0, 1], y: [18, 0] }, 
      { delay: 0.4, duration: 0.75, easing: [0.16, 1, 0.3, 1] }
    );
  }

  if (heroButtons.length) {
    animate(heroButtons, 
      { opacity: [0, 1], y: [18, 0], scale: [0.94, 1] }, 
      { delay: stagger(0.1, { start: 0.5 }), duration: 0.6, easing: spring({ stiffness: 190, damping: 16 }) }
    );
  }

  if (socialIcons.length) {
    animate(socialIcons, 
      { opacity: [0, 1], y: [14, 0], scale: [0.8, 1] }, 
      { delay: stagger(0.08, { start: 0.65 }), duration: 0.5, easing: spring({ stiffness: 200, damping: 15 }) }
    );
  }

  if (scrollIndicator) {
    animate(scrollIndicator, 
      { opacity: [0, 1], y: [12, 0] }, 
      { delay: 0.95, duration: 0.8 }
    );
  }

  // Continuous subtle spring float on rings
  animate('.ring-1', 
    { rotate: [0, 360] }, 
    { duration: 25, repeat: Infinity, easing: 'linear' }
  );

  animate('.ring-2', 
    { rotate: [360, 0] }, 
    { duration: 35, repeat: Infinity, easing: 'linear' }
  );
}

/* ─────────────────────────────────────────────────────────────
   5. PARALLAX & CURSOR MOTION (Desktop Only)
   ───────────────────────────────────────────────────────────── */
function initParallaxEffects() {
  if (reducedMotion || isTouchDevice || window.innerWidth <= 900) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const heroGrid = document.querySelector('.hero-grid');
  const heroImageFrame = document.querySelector('.hero-image-frame');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (orb1) animate(orb1, { x: x * 35, y: y * 35 }, { duration: 0.8, easing: [0.16, 1, 0.3, 1] });
    if (orb2) animate(orb2, { x: -x * 25, y: -y * 25 }, { duration: 0.8, easing: [0.16, 1, 0.3, 1] });
    if (heroGrid) animate(heroGrid, { x: x * 12, y: y * 12 }, { duration: 1, easing: [0.16, 1, 0.3, 1] });
    if (heroImageFrame) {
      animate(heroImageFrame, 
        { rotateY: x * 10, rotateX: -y * 10, x: x * 16, y: y * 16 }, 
        { duration: 0.45, easing: [0.16, 1, 0.3, 1] }
      );
    }
  });

  hero.addEventListener('mouseleave', () => {
    if (heroImageFrame) {
      animate(heroImageFrame, { rotateY: 0, rotateX: 0, x: 0, y: 0 }, { duration: 0.7, easing: spring({ stiffness: 110, damping: 14 }) });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   6. SECTION HEADINGS — Clip reveal & Underline draw
   ───────────────────────────────────────────────────────────── */
function initSectionHeadings() {
  document.querySelectorAll('.section-header').forEach(header => {
    if (reducedMotion) {
      header.classList.add('visible');
      return;
    }

    inView(header, () => {
      header.classList.add('visible');
      const tag = header.querySelector('.section-tag');
      const title = header.querySelector('.section-title');

      if (tag) {
        animate(tag, { opacity: [0, 1], y: [16, 0], letterSpacing: ['5px', '2px'] }, { duration: 0.6, easing: [0.16, 1, 0.3, 1] });
      }
      if (title) {
        animate(title, { opacity: [0, 1], y: [26, 0] }, { delay: 0.1, duration: 0.7, easing: [0.16, 1, 0.3, 1] });
      }
    }, { amount: 0.25 });
  });
}

/* ─────────────────────────────────────────────────────────────
   7. ABOUT SECTION — Editorial stagger & Counter numbers
   ───────────────────────────────────────────────────────────── */
function initAboutSection() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  if (reducedMotion) {
    document.querySelectorAll('.stat-card, .about-text p, .detail-item').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Stat cards spring reveal
  inView('.about-stats', () => {
    const cards = document.querySelectorAll('.stat-card');
    animate(cards, 
      { opacity: [0, 1], y: [35, 0], scale: [0.9, 1] }, 
      { delay: stagger(0.1), duration: 0.7, easing: spring({ stiffness: 160, damping: 15 }) }
    );
  }, { amount: 0.15 });

  // Paragraph text reveal
  inView('.about-text', () => {
    const paragraphs = document.querySelectorAll('.about-text p');
    const details = document.querySelectorAll('.detail-item');
    const ctas = document.querySelectorAll('.about-text .btn');

    animate(paragraphs, 
      { opacity: [0, 1], y: [18, 0] }, 
      { delay: stagger(0.09), duration: 0.6, easing: [0.16, 1, 0.3, 1] }
    );

    animate(details, 
      { opacity: [0, 1], x: [-12, 0] }, 
      { delay: stagger(0.07, { start: 0.25 }), duration: 0.5, easing: [0.16, 1, 0.3, 1] }
    );

    animate(ctas, 
      { opacity: [0, 1], y: [14, 0] }, 
      { delay: stagger(0.08, { start: 0.45 }), duration: 0.5 }
    );
  }, { amount: 0.15 });
}

/* ─────────────────────────────────────────────────────────────
   8. EDUCATION TIMELINE — Progressive Line Draw & Cards
   ───────────────────────────────────────────────────────────── */
function initEducationTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  if (reducedMotion) {
    document.querySelectorAll('.timeline-item, .timeline-dot, .timeline-card').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Progressive timeline line draw on scroll
  const line = document.createElement('div');
  line.className = 'timeline-line-animated';
  timeline.prepend(line);

  inView(timeline, () => {
    animate(line, { height: ['0%', '100%'] }, { duration: 1.5, easing: [0.16, 1, 0.3, 1] });

    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
      const dot = item.querySelector('.timeline-dot');
      const card = item.querySelector('.timeline-card');
      const offsetX = index % 2 === 0 ? -24 : 24;

      if (dot) {
        animate(dot, 
          { opacity: [0, 1], scale: [0, 1] }, 
          { delay: 0.2 + index * 0.2, duration: 0.5, easing: spring({ stiffness: 220, damping: 14 }) }
        );
      }

      if (card) {
        animate(card, 
          { opacity: [0, 1], x: [offsetX, 0] }, 
          { delay: 0.25 + index * 0.2, duration: 0.7, easing: [0.16, 1, 0.3, 1] }
        );
      }
    });
  }, { amount: 0.1 });
}

/* ─────────────────────────────────────────────────────────────
   9. SKILLS SECTION — Bars, Count-Up & Tech Icon Burst
   ───────────────────────────────────────────────────────────── */
function initSkillsSection() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  if (reducedMotion) {
    document.querySelectorAll('.skill-bar-fill').forEach(fill => {
      fill.style.width = `${fill.getAttribute('data-width')}%`;
    });
    return;
  }

  inView('.skills-grid', () => {
    const groups = document.querySelectorAll('.skills-group');
    animate(groups, 
      { opacity: [0, 1], y: [30, 0], scale: [0.97, 1] }, 
      { delay: stagger(0.12), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
    );

    // Animate skill bars fill
    document.querySelectorAll('.skill-bar-fill').forEach(fill => {
      const targetPct = parseInt(fill.getAttribute('data-width') || '0', 10);
      animate(fill, { width: [0, `${targetPct}%`] }, { duration: 1.2, easing: [0.16, 1, 0.3, 1] });

      // Animate percentage label counter with rAF
      const pctEl = fill.closest('.skill-bar-item')?.querySelector('.skill-percent');
      if (pctEl) {
        const duration = 1200;
        const start = performance.now();
        function countUp(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          pctEl.textContent = `${Math.round(eased * targetPct)}%`;
          if (progress < 1) requestAnimationFrame(countUp);
        }
        requestAnimationFrame(countUp);
      }
    });
  }, { amount: 0.15 });

  // Tech Icons staggered radial burst
  inView('.tech-icons', () => {
    const iconCards = document.querySelectorAll('.tech-icon-card');
    animate(iconCards, 
      { opacity: [0, 1], scale: [0.75, 1], y: [16, 0] }, 
      { delay: stagger(0.05), duration: 0.5, easing: spring({ stiffness: 180, damping: 15 }) }
    );
  }, { amount: 0.15 });

  // Tech Icon Card hover 3D tilt (Desktop only)
  if (!isTouchDevice && !reducedMotion && window.innerWidth > 900) {
    document.querySelectorAll('.tech-icon-card').forEach(card => {
      hover(card, 
        (el) => {
          animate(el, { y: -5, scale: 1.07, rotateY: 8 }, { duration: 0.25, easing: spring({ stiffness: 250, damping: 15 }) });
          return () => {
            animate(el, { y: 0, scale: 1, rotateY: 0 }, { duration: 0.35, easing: spring({ stiffness: 180, damping: 18 }) });
          };
        }
      );
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   10. PROJECTS SECTION — Category Filter & 3D Spring Tilt
   ───────────────────────────────────────────────────────────── */
function initProjectsSection() {
  const projectsGrid = document.querySelector('.projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!projectsGrid) return;

  if (reducedMotion) {
    cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
  } else {
    inView(projectsGrid, () => {
      animate(cards, 
        { opacity: [0, 1], y: [35, 0], scale: [0.95, 1] }, 
        { delay: stagger(0.1), duration: 0.75, easing: spring({ stiffness: 150, damping: 16 }) }
      );
    }, { amount: 0.1 });
  }

  // Category Filtering with Motion transitions
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      if (reducedMotion) {
        cards.forEach(card => {
          const cat = card.getAttribute('data-category') || '';
          card.style.display = (filterVal === 'all' || cat.includes(filterVal)) ? 'flex' : 'none';
        });
        return;
      }

      animate(cards, { opacity: 0, scale: 0.92, y: 12 }, { duration: 0.2, easing: [0.4, 0, 1, 1] }).then(() => {
        cards.forEach(card => {
          const cat = card.getAttribute('data-category') || '';
          if (filterVal === 'all' || cat.includes(filterVal)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
        animate(visibleCards, 
          { opacity: [0, 1], scale: [0.94, 1], y: [16, 0] }, 
          { delay: stagger(0.07), duration: 0.55, easing: spring({ stiffness: 170, damping: 16 }) }
        );
      });
    });
  });

  // Project Card 3D Tilt with Spring Reset on Mouse Move (Desktop only)
  if (!isTouchDevice && !reducedMotion && window.innerWidth > 900) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        animate(card, {
          rotateX: -y * 10,
          rotateY: x * 10,
          y: -6,
          scale: 1.02
        }, { duration: 0.2, easing: [0.16, 1, 0.3, 1] });
      });

      card.addEventListener('mouseleave', () => {
        animate(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1
        }, { duration: 0.5, easing: spring({ stiffness: 160, damping: 15 }) });
      });
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   11. HOBBIES SECTION — Floating & Staggered Reveal
   ───────────────────────────────────────────────────────────── */
function initHobbiesSection() {
  const grid = document.querySelector('.hobbies-grid');
  if (!grid) return;

  if (reducedMotion) {
    document.querySelectorAll('.hobby-card').forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
    return;
  }

  inView(grid, () => {
    const hobbyCards = document.querySelectorAll('.hobby-card');
    animate(hobbyCards, 
      { opacity: [0, 1], scale: [0.86, 1], y: [25, 0] }, 
      { delay: stagger(0.08), duration: 0.65, easing: spring({ stiffness: 160, damping: 15 }) }
    );
  }, { amount: 0.1 });

  // Hover float interaction (Desktop only)
  if (!isTouchDevice && !reducedMotion && window.innerWidth > 900) {
    document.querySelectorAll('.hobby-card').forEach(card => {
      hover(card, (el) => {
        animate(el, { y: -6, scale: 1.03 }, { duration: 0.25, easing: spring({ stiffness: 200, damping: 14 }) });
        return () => {
          animate(el, { y: 0, scale: 1 }, { duration: 0.35, easing: spring({ stiffness: 150, damping: 16 }) });
        };
      });
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   12. CONTACT SECTION — Split Entrance & Form Interaction
   ───────────────────────────────────────────────────────────── */
function initContactSection() {
  const contactGrid = document.querySelector('.contact-grid');
  if (!contactGrid) return;

  if (reducedMotion) {
    document.querySelectorAll('.contact-info, .contact-form-wrapper, .contact-detail').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  inView(contactGrid, () => {
    animate('.contact-info', 
      { opacity: [0, 1], x: [-30, 0] }, 
      { duration: 0.75, easing: [0.16, 1, 0.3, 1] }
    );

    animate('.contact-form-wrapper', 
      { opacity: [0, 1], x: [30, 0] }, 
      { delay: 0.12, duration: 0.75, easing: [0.16, 1, 0.3, 1] }
    );

    animate('.contact-detail', 
      { opacity: [0, 1], x: [-12, 0] }, 
      { delay: stagger(0.07, { start: 0.25 }), duration: 0.5, easing: [0.16, 1, 0.3, 1] }
    );
  }, { amount: 0.15 });
}

/* ─────────────────────────────────────────────────────────────
   13. BUTTON MICRO-INTERACTIONS — Magnetic Hover & Press Feedback
   ───────────────────────────────────────────────────────────── */
function initButtonMicroInteractions() {
  const buttons = document.querySelectorAll('.btn, .social-icon, .filter-btn, .theme-toggle, .back-to-top');

  buttons.forEach(btn => {
    // Press tactile spring feedback
    press(btn, (el) => {
      animate(el, { scale: 0.95 }, { duration: 0.08 });
      return () => {
        animate(el, { scale: 1 }, { duration: 0.25, easing: spring({ stiffness: 320, damping: 16 }) });
      };
    });

    // Magnetic cursor pull (Desktop only)
    if (!isTouchDevice && !reducedMotion && window.innerWidth > 900 && (btn.classList.contains('btn') || btn.classList.contains('social-icon'))) {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;

        animate(btn, { x: dx, y: dy }, { duration: 0.15, easing: [0.16, 1, 0.3, 1] });

        const icon = btn.querySelector('i');
        if (icon) {
          animate(icon, { x: dx * 0.25, y: dy * 0.25 }, { duration: 0.15 });
        }
      });

      btn.addEventListener('mouseleave', () => {
        animate(btn, { x: 0, y: 0 }, { duration: 0.45, easing: spring({ stiffness: 180, damping: 14 }) });
        const icon = btn.querySelector('i');
        if (icon) {
          animate(icon, { x: 0, y: 0 }, { duration: 0.45, easing: spring({ stiffness: 180, damping: 14 }) });
        }
      });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   14. FOOTER REVEAL
   ───────────────────────────────────────────────────────────── */
function initFooterReveal() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  if (reducedMotion) {
    document.querySelectorAll('.footer-content, .footer-bottom').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  inView(footer, () => {
    animate('.footer-content', { opacity: [0, 1], y: [20, 0] }, { duration: 0.65, easing: [0.16, 1, 0.3, 1] });
    animate('.footer-bottom', { opacity: [0, 1] }, { delay: 0.15, duration: 0.55 });
  }, { amount: 0.15 });
}

/* ─────────────────────────────────────────────────────────────
   15. CUSTOM CURSOR MOTION — Smooth Spring Ring & States (Desktop Only)
   ───────────────────────────────────────────────────────────── */
function initCustomCursorMotion() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower || isTouchDevice || reducedMotion || window.innerWidth <= 900) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // RAF spring physics follower
  function updateCursorFollower() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(updateCursorFollower);
  }
  updateCursorFollower();

  // Hover state detection on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .hobby-card, .stat-card, .tech-icon-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');

      if (el.classList.contains('project-card')) {
        follower.classList.add('cursor-view-lens');
      }
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
      follower.classList.remove('cursor-view-lens');
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.6';
  });
}
