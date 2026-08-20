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
    bar.style.width = '100%';
    return;
  }

  // Bind scroll progress directly to the bar scaleX / width
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

  // Staggered navbar entrance on load
  if (!reducedMotion) {
    animate('.nav-brand', { opacity: [0, 1], y: [-20, 0] }, { duration: 0.6, easing: spring({ stiffness: 120, damping: 14 }) });
    animate('.nav-links li', { opacity: [0, 1], y: [-15, 0] }, { delay: stagger(0.06, { start: 0.1 }), duration: 0.5, easing: spring({ stiffness: 140, damping: 16 }) });
    animate('.nav-actions', { opacity: [0, 1], y: [-20, 0] }, { delay: 0.3, duration: 0.5 });
  }

  // Active link indicator pill setup
  let pill = navLinksContainer ? navLinksContainer.querySelector('.nav-active-pill') : null;
  if (navLinksContainer && !pill && !isTouchDevice) {
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
        easing: spring({ stiffness: 250, damping: 22 })
      });
    } else {
      pill.style.opacity = '0';
    }
  }

  // Update on scroll & resize
  window.addEventListener('resize', updateActivePill, { passive: true });
  setTimeout(updateActivePill, 300);

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
    if (currentScrollY > 300) {
      if (currentScrollY > lastScrollY + 10 && !isNavHidden) {
        isNavHidden = true;
        animate(navbar, { y: '-100%' }, { duration: 0.35, easing: [0.16, 1, 0.3, 1] });
      } else if (currentScrollY < lastScrollY - 10 && isNavHidden) {
        isNavHidden = false;
        animate(navbar, { y: '0%' }, { duration: 0.35, easing: [0.16, 1, 0.3, 1] });
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
   3. CINEMATIC HERO ANIMATION
   ───────────────────────────────────────────────────────────── */
function initHeroCinematicSequence() {
  if (reducedMotion) return;

  // Staggered clip reveal for hero content
  const heroTag = document.querySelector('.hero-tag');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-description');
  const heroButtons = document.querySelectorAll('.hero-buttons .btn');
  const socialIcons = document.querySelectorAll('.social-links .social-icon');
  const heroImage = document.querySelector('.hero-image-wrapper');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (heroTag) {
    animate(heroTag, 
      { opacity: [0, 1], y: [24, 0], scale: [0.92, 1] }, 
      { duration: 0.7, easing: spring({ stiffness: 150, damping: 15 }) }
    );
  }

  if (heroTitle) {
    animate(heroTitle, 
      { opacity: [0, 1], y: [35, 0] }, 
      { delay: 0.15, duration: 0.85, easing: [0.16, 1, 0.3, 1] }
    );
  }

  if (heroDesc) {
    animate(heroDesc, 
      { opacity: [0, 1], y: [20, 0] }, 
      { delay: 0.3, duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );
  }

  if (heroButtons.length) {
    animate(heroButtons, 
      { opacity: [0, 1], y: [20, 0], scale: [0.95, 1] }, 
      { delay: stagger(0.12, { start: 0.45 }), duration: 0.6, easing: spring({ stiffness: 180, damping: 16 }) }
    );
  }

  if (socialIcons.length) {
    animate(socialIcons, 
      { opacity: [0, 1], y: [16, 0], scale: [0.8, 1] }, 
      { delay: stagger(0.08, { start: 0.6 }), duration: 0.5, easing: spring({ stiffness: 200, damping: 15 }) }
    );
  }

  if (heroImage) {
    animate(heroImage, 
      { opacity: [0, 1], x: [45, 0], scale: [0.92, 1] }, 
      { delay: 0.25, duration: 1.1, easing: [0.16, 1, 0.3, 1] }
    );
  }

  if (scrollIndicator) {
    animate(scrollIndicator, 
      { opacity: [0, 1], y: [15, 0] }, 
      { delay: 0.9, duration: 0.8 }
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
   4. PARALLAX & CURSOR MOTION
   ───────────────────────────────────────────────────────────── */
function initParallaxEffects() {
  if (reducedMotion || isTouchDevice) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const heroGrid = document.querySelector('.hero-grid');
  const heroImageFrame = document.querySelector('.hero-image-frame');

  // Mouse tilt parallax on hero
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (orb1) animate(orb1, { x: x * 40, y: y * 40 }, { duration: 0.8, easing: [0.16, 1, 0.3, 1] });
    if (orb2) animate(orb2, { x: -x * 30, y: -y * 30 }, { duration: 0.8, easing: [0.16, 1, 0.3, 1] });
    if (heroGrid) animate(heroGrid, { x: x * 15, y: y * 15 }, { duration: 1, easing: [0.16, 1, 0.3, 1] });
    if (heroImageFrame) {
      animate(heroImageFrame, 
        { rotateY: x * 12, rotateX: -y * 12, x: x * 20, y: y * 20 }, 
        { duration: 0.5, easing: [0.16, 1, 0.3, 1] }
      );
    }
  });

  hero.addEventListener('mouseleave', () => {
    if (heroImageFrame) {
      animate(heroImageFrame, { rotateY: 0, rotateX: 0, x: 0, y: 0 }, { duration: 0.8, easing: spring({ stiffness: 100, damping: 14 }) });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   5. SECTION HEADINGS — Clip reveal & Underline draw
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
        animate(tag, { opacity: [0, 1], y: [16, 0], letterSpacing: ['6px', '2px'] }, { duration: 0.6, easing: [0.16, 1, 0.3, 1] });
      }
      if (title) {
        animate(title, { opacity: [0, 1], y: [30, 0] }, { delay: 0.1, duration: 0.7, easing: [0.16, 1, 0.3, 1] });
      }
    }, { amount: 0.3 });
  });
}

/* ─────────────────────────────────────────────────────────────
   6. ABOUT SECTION — Editorial stagger & Counter numbers
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
      { opacity: [0, 1], y: [40, 0], scale: [0.88, 1] }, 
      { delay: stagger(0.12), duration: 0.7, easing: spring({ stiffness: 160, damping: 15 }) }
    );
  }, { amount: 0.2 });

  // Paragraph text reveal
  inView('.about-text', () => {
    const paragraphs = document.querySelectorAll('.about-text p');
    const details = document.querySelectorAll('.detail-item');
    const ctas = document.querySelectorAll('.about-text .btn');

    animate(paragraphs, 
      { opacity: [0, 1], y: [20, 0] }, 
      { delay: stagger(0.1), duration: 0.6, easing: [0.16, 1, 0.3, 1] }
    );

    animate(details, 
      { opacity: [0, 1], x: [-15, 0] }, 
      { delay: stagger(0.08, { start: 0.3 }), duration: 0.5, easing: [0.16, 1, 0.3, 1] }
    );

    animate(ctas, 
      { opacity: [0, 1], y: [15, 0] }, 
      { delay: stagger(0.1, { start: 0.5 }), duration: 0.5 }
    );
  }, { amount: 0.2 });
}

/* ─────────────────────────────────────────────────────────────
   7. EDUCATION TIMELINE — Progressive Line Draw & Alternating Cards
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
    animate(line, { height: ['0%', '100%'] }, { duration: 1.6, easing: [0.16, 1, 0.3, 1] });

    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
      const dot = item.querySelector('.timeline-dot');
      const card = item.querySelector('.timeline-card');
      const offsetX = index % 2 === 0 ? -30 : 30;

      if (dot) {
        animate(dot, 
          { opacity: [0, 1], scale: [0, 1] }, 
          { delay: 0.2 + index * 0.25, duration: 0.5, easing: spring({ stiffness: 220, damping: 14 }) }
        );
      }

      if (card) {
        animate(card, 
          { opacity: [0, 1], x: [offsetX, 0] }, 
          { delay: 0.3 + index * 0.25, duration: 0.75, easing: [0.16, 1, 0.3, 1] }
        );
      }
    });
  }, { amount: 0.1 });
}

/* ─────────────────────────────────────────────────────────────
   8. SKILLS SECTION — Bars, Count-Up & Tech Icon Burst
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
      { opacity: [0, 1], y: [35, 0], scale: [0.96, 1] }, 
      { delay: stagger(0.15), duration: 0.75, easing: [0.16, 1, 0.3, 1] }
    );

    // Animate skill bars fill
    document.querySelectorAll('.skill-bar-fill').forEach(fill => {
      const targetPct = parseInt(fill.getAttribute('data-width') || '0', 10);
      animate(fill, { width: [0, `${targetPct}%`] }, { duration: 1.2, easing: [0.16, 1, 0.3, 1] });

      // Animate percentage label counter
      const pctEl = fill.closest('.skill-bar-item')?.querySelector('.skill-percent');
      if (pctEl) {
        const obj = { val: 0 };
        animate(obj, { val: targetPct }, {
          duration: 1.2,
          easing: [0.16, 1, 0.3, 1],
          onUpdate: () => {
            pctEl.textContent = `${Math.round(obj.val)}%`;
          }
        });
      }
    });
  }, { amount: 0.2 });

  // Tech Icons staggered radial burst
  inView('.tech-icons', () => {
    const iconCards = document.querySelectorAll('.tech-icon-card');
    animate(iconCards, 
      { opacity: [0, 1], scale: [0.7, 1], y: [20, 0] }, 
      { delay: stagger(0.06), duration: 0.5, easing: spring({ stiffness: 180, damping: 15 }) }
    );
  }, { amount: 0.2 });

  // Tech Icon Card hover 3D tilt
  if (!isTouchDevice && !reducedMotion) {
    document.querySelectorAll('.tech-icon-card').forEach(card => {
      hover(card, 
        (el) => {
          animate(el, { y: -6, scale: 1.08, rotateY: 10 }, { duration: 0.25, easing: spring({ stiffness: 250, damping: 15 }) });
          return () => {
            animate(el, { y: 0, scale: 1, rotateY: 0 }, { duration: 0.4, easing: spring({ stiffness: 180, damping: 18 }) });
          };
        }
      );
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   9. PROJECTS SECTION — Category Filter & 3D Spring Tilt
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
        { opacity: [0, 1], y: [45, 0], scale: [0.94, 1] }, 
        { delay: stagger(0.12), duration: 0.8, easing: spring({ stiffness: 140, damping: 15 }) }
      );
    }, { amount: 0.1 });
  }

  // Category Filtering with Motion layout transitions
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

      // Smooth animate out -> toggle display -> animate in
      animate(cards, { opacity: 0, scale: 0.9, y: 15 }, { duration: 0.2, easing: [0.4, 0, 1, 1] }).then(() => {
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
          { opacity: [0, 1], scale: [0.92, 1], y: [20, 0] }, 
          { delay: stagger(0.08), duration: 0.6, easing: spring({ stiffness: 160, damping: 16 }) }
        );
      });
    });
  });

  // Project Card 3D Tilt with Spring Reset on Mouse Move
  if (!isTouchDevice && !reducedMotion) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        animate(card, {
          rotateX: -y * 12,
          rotateY: x * 12,
          y: -8,
          scale: 1.02
        }, { duration: 0.2, easing: [0.16, 1, 0.3, 1] });
      });

      card.addEventListener('mouseleave', () => {
        animate(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1
        }, { duration: 0.6, easing: spring({ stiffness: 150, damping: 15 }) });
      });
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   10. HOBBIES SECTION — Floating & Staggered Reveal
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
      { opacity: [0, 1], scale: [0.82, 1], y: [30, 0] }, 
      { delay: stagger(0.09), duration: 0.7, easing: spring({ stiffness: 160, damping: 15 }) }
    );
  }, { amount: 0.15 });

  // Hover float interaction
  if (!isTouchDevice && !reducedMotion) {
    document.querySelectorAll('.hobby-card').forEach(card => {
      hover(card, (el) => {
        animate(el, { y: -8, scale: 1.04 }, { duration: 0.3, easing: spring({ stiffness: 200, damping: 14 }) });
        return () => {
          animate(el, { y: 0, scale: 1 }, { duration: 0.4, easing: spring({ stiffness: 150, damping: 16 }) });
        };
      });
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   11. CONTACT SECTION — Split Entrance & Form Interaction
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
      { opacity: [0, 1], x: [-40, 0] }, 
      { duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );

    animate('.contact-form-wrapper', 
      { opacity: [0, 1], x: [40, 0] }, 
      { delay: 0.15, duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );

    animate('.contact-detail', 
      { opacity: [0, 1], x: [-15, 0] }, 
      { delay: stagger(0.08, { start: 0.3 }), duration: 0.5, easing: [0.16, 1, 0.3, 1] }
    );
  }, { amount: 0.2 });
}

/* ─────────────────────────────────────────────────────────────
   12. BUTTON MICRO-INTERACTIONS — Magnetic Hover & Press Feedback
   ───────────────────────────────────────────────────────────── */
function initButtonMicroInteractions() {
  const buttons = document.querySelectorAll('.btn, .social-icon, .filter-btn, .theme-toggle, .back-to-top');

  buttons.forEach(btn => {
    // Press tactile spring feedback
    press(btn, (el) => {
      animate(el, { scale: 0.94 }, { duration: 0.1 });
      return () => {
        animate(el, { scale: 1 }, { duration: 0.3, easing: spring({ stiffness: 300, damping: 15 }) });
      };
    });

    // Magnetic cursor pull (desktop only)
    if (!isTouchDevice && !reducedMotion && (btn.classList.contains('btn') || btn.classList.contains('social-icon'))) {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;

        animate(btn, { x: dx, y: dy }, { duration: 0.2, easing: [0.16, 1, 0.3, 1] });

        const icon = btn.querySelector('i');
        if (icon) {
          animate(icon, { x: dx * 0.3, y: dy * 0.3 }, { duration: 0.2 });
        }
      });

      btn.addEventListener('mouseleave', () => {
        animate(btn, { x: 0, y: 0 }, { duration: 0.5, easing: spring({ stiffness: 180, damping: 14 }) });
        const icon = btn.querySelector('i');
        if (icon) {
          animate(icon, { x: 0, y: 0 }, { duration: 0.5, easing: spring({ stiffness: 180, damping: 14 }) });
        }
      });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   13. FOOTER REVEAL
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
    animate('.footer-content', { opacity: [0, 1], y: [25, 0] }, { duration: 0.7, easing: [0.16, 1, 0.3, 1] });
    animate('.footer-bottom', { opacity: [0, 1] }, { delay: 0.2, duration: 0.6 });
  }, { amount: 0.2 });
}

/* ─────────────────────────────────────────────────────────────
   14. CUSTOM CURSOR MOTION — Smooth Spring Ring & States
   ───────────────────────────────────────────────────────────── */
function initCustomCursorMotion() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower || isTouchDevice || reducedMotion) return;

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
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

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
