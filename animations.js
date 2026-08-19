/* =================================================================
   AVINASH VERMA PORTFOLIO — PREMIUM ANIMATIONS ENGINE
   Powered by Anime.js 3.2 + GSAP 3 ScrollTrigger
   ================================================================= */

(function () {
  'use strict';

  /* ── Helper: Easing preset constants ────────────────────────── */
  const EASE = {
    out: 'power3.out',
    expo: 'power4.out',
    back: 'back.out(1.7)',
    soft: 'power2.inOut',
    spring: 'elastic.out(1, 0.6)'
  };

  /* ── Guard: Wait for Anime.js & GSAP + ScrollTrigger ───────── */
  function waitForLibraries(cb) {
    if (typeof anime !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      cb();
    } else {
      setTimeout(() => waitForLibraries(cb), 50);
    }
  }

  /* ── Respect user motion preferences ───────────────────────── */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  waitForLibraries(function () {
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      document.querySelectorAll('.reveal, .anim-hidden').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       1. HERO — ANIME.JS ELASTIC SPRING TIMELINE
       ───────────────────────────────────────────────────────────── */
    (function heroEntranceAnime() {
      const heroTl = anime.timeline({
        autoplay: true,
        easing: 'easeOutExpo'
      });

      heroTl.add({
        targets: '.hero-tag',
        opacity: [0, 1],
        translateY: [-24, 0],
        scale: [0.85, 1],
        duration: 900,
        easing: 'spring(1, 80, 10, 0)'
      }, 100);

      heroTl.add({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      }, 250);

      heroTl.add({
        targets: '.hero-description',
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 900,
        easing: 'easeOutCubic'
      }, 450);

      heroTl.add({
        targets: '.hero-buttons .btn',
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.92, 1],
        delay: anime.stagger(120),
        duration: 800,
        easing: 'spring(1, 75, 10, 0)'
      }, 600);

      heroTl.add({
        targets: '.social-links .social-icon',
        opacity: [0, 1],
        translateY: [16, 0],
        scale: [0.75, 1],
        delay: anime.stagger(80),
        duration: 700,
        easing: 'spring(1, 85, 12, 0)'
      }, 750);

      heroTl.add({
        targets: '.hero-image-wrapper',
        opacity: [0, 1],
        translateX: [50, 0],
        scale: [0.92, 1],
        duration: 1200,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      }, 350);
    })();


    /* ─────────────────────────────────────────────────────────────
       2. MOUSE PARALLAX — Hero elements follow cursor subtly
       ───────────────────────────────────────────────────────────── */
    (function mouseParallax() {
      const hero = document.querySelector('.hero');
      if (!hero) return;

      const layers = [
        { el: '.hero-image-wrapper', depth: 0.018 },
        { el: '.hero-orb-1',         depth: 0.012 },
        { el: '.hero-orb-2',         depth: -0.010 },
        { el: '.hero-grid',          depth: 0.006 },
        { el: '.ring-1',             depth: 0.022 },
        { el: '.ring-2',             depth: -0.016 },
      ];

      let cx = window.innerWidth / 2;
      let cy = window.innerHeight / 2;
      let targetX = {}, targetY = {};
      let currentX = {}, currentY = {};

      layers.forEach(({ el }) => {
        targetX[el] = 0; targetY[el] = 0;
        currentX[el] = 0; currentY[el] = 0;
      });

      hero.addEventListener('mousemove', e => {
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        layers.forEach(({ el, depth }) => {
          targetX[el] = dx * depth;
          targetY[el] = dy * depth;
        });
      });

      hero.addEventListener('mouseleave', () => {
        layers.forEach(({ el }) => {
          targetX[el] = 0; targetY[el] = 0;
        });
      });

      function lerp(a, b, t) { return a + (b - a) * t; }
      function tickParallax() {
        layers.forEach(({ el }) => {
          const node = document.querySelector(el);
          if (!node) return;
          currentX[el] = lerp(currentX[el], targetX[el], 0.06);
          currentY[el] = lerp(currentY[el], targetY[el], 0.06);
          gsap.set(node, { x: currentX[el], y: currentY[el] });
        });
        requestAnimationFrame(tickParallax);
      }
      tickParallax();
    })();


    /* ─────────────────────────────────────────────────────────────
       3. SCROLL PARALLAX — Background depth effect
       ───────────────────────────────────────────────────────────── */
    (function scrollParallax() {
      gsap.to('.hero-grid', {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to('.hero-image-frame', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        }
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       4. SECTION HEADINGS — Clip-path text reveal + underline draw
       ───────────────────────────────────────────────────────────── */
    (function sectionHeadings() {
      document.querySelectorAll('.section-header').forEach(header => {
        const tag   = header.querySelector('.section-tag');
        const title = header.querySelector('.section-title');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: header,
            start: 'top 82%',
            once: true,
          }
        });

        if (tag) {
          tl.fromTo(tag,
            { opacity: 0, y: 14, letterSpacing: '6px' },
            { opacity: 1, y: 0, letterSpacing: '2px', duration: 0.7, ease: EASE.out },
            0);
        }

        if (title) {
          tl.fromTo(title,
            { opacity: 0, y: 36, clipPath: 'inset(100% 0% 0% 0%)' },
            { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: EASE.expo },
            0.1);

          const hl = title.querySelector('.highlight');
          if (hl) {
            if (!hl.querySelector('.hl-line')) {
              const line = document.createElement('span');
              line.className = 'hl-line';
              hl.appendChild(line);
            }
            tl.fromTo(hl.querySelector('.hl-line'),
              { scaleX: 0, transformOrigin: 'left center' },
              { scaleX: 1, duration: 0.8, ease: EASE.expo },
              0.6);
          }
        }
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       5. ABOUT SECTION — Split-reveal layout
       ───────────────────────────────────────────────────────────── */
    (function aboutSection() {
      const grid = document.querySelector('.about-grid');
      if (!grid) return;

      gsap.fromTo('.stat-card',
        { opacity: 0, y: 50, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, ease: EASE.spring,
          stagger: { each: 0.1, from: 'start' },
          scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%',
            once: true,
          }
        });

      gsap.fromTo('.about-text',
        { opacity: 0, x: 50, filter: 'blur(6px)' },
        {
          opacity: 1, x: 0, filter: 'blur(0px)',
          duration: 0.9, ease: EASE.expo,
          scrollTrigger: {
            trigger: '.about-text',
            start: 'top 80%',
            once: true,
          }
        });

      gsap.fromTo('.about-text p',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6, ease: EASE.out,
          stagger: 0.14,
          scrollTrigger: {
            trigger: '.about-text',
            start: 'top 78%',
            once: true,
          }
        });

      gsap.fromTo('.detail-item',
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0,
          duration: 0.5, ease: EASE.out,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.about-details',
            start: 'top 85%',
            once: true,
          }
        });
    })();


    /* ─────────────────────────────────────────────────────────────
       6. EDUCATION TIMELINE — Progressive line draw + card reveal
       ───────────────────────────────────────────────────────────── */
    (function educationTimeline() {
      const timeline = document.querySelector('.timeline');
      if (!timeline) return;

      const animLine = timeline.querySelector('.timeline-line-animated');
      if (animLine) {
        gsap.fromTo(animLine,
          { height: 0 },
          {
            height: '100%',
            duration: 1.8,
            ease: EASE.out,
            scrollTrigger: {
              trigger: timeline,
              start: 'top 80%',
              once: true,
            }
          });
      }

      gsap.fromTo('.timeline-dot',
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.5, ease: EASE.spring,
          stagger: 0.25,
          scrollTrigger: {
            trigger: timeline,
            start: 'top 78%',
            once: true,
          }
        });

      document.querySelectorAll('.timeline-item').forEach((item, i) => {
        gsap.fromTo(item.querySelector('.timeline-card'),
          { opacity: 0, x: -48, filter: 'blur(6px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: 0.8, ease: EASE.expo,
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              once: true,
            },
            delay: i * 0.15,
          });
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       7. SKILLS SECTION — BARS, COUNTERS & TECH ICON RADIAL GRID
       ───────────────────────────────────────────────────────────── */
    (function skillsSection() {
      const skillsGrid = document.querySelector('.skills-grid');
      if (skillsGrid) {
        ScrollTrigger.create({
          trigger: skillsGrid,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            anime({
              targets: '.skills-group',
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.95, 1],
              delay: anime.stagger(150),
              duration: 900,
              easing: 'cubicBezier(0.16, 1, 0.3, 1)'
            });

            document.querySelectorAll('.skill-bar-fill').forEach(fill => {
              const targetWidth = parseInt(fill.getAttribute('data-width') || '0', 10);
              anime({
                targets: fill,
                width: [0, targetWidth + '%'],
                duration: 1500,
                easing: 'cubicBezier(0.25, 1, 0.5, 1)'
              });

              const pctEl = fill.closest('.skill-bar-item')?.querySelector('.skill-percent');
              if (pctEl) {
                const counterObj = { value: 0 };
                anime({
                  targets: counterObj,
                  value: targetWidth,
                  round: 1,
                  duration: 1500,
                  easing: 'easeOutExpo',
                  update: () => { pctEl.textContent = counterObj.value + '%'; }
                });
              }
            });
          }
        });
      }

      const techIcons = document.querySelector('.tech-icons');
      if (techIcons) {
        ScrollTrigger.create({
          trigger: techIcons,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            anime({
              targets: '.tech-icon-card',
              opacity: [0, 1],
              scale: [0.6, 1],
              translateY: [25, 0],
              delay: anime.stagger(65, { grid: [5, 3], from: 'center' }),
              duration: 800,
              easing: 'spring(1, 80, 12, 0)'
            });
          }
        });
      }
    })();


    /* ─────────────────────────────────────────────────────────────
       8. PROJECTS — CATEGORY FILTERS & ANIME.JS 3D TILT PHYSICS
       ───────────────────────────────────────────────────────────── */
    (function projectCards() {
      const projectsGrid = document.querySelector('.projects-grid');
      const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
      const cards = document.querySelectorAll('.project-card');

      if (projectsGrid) {
        ScrollTrigger.create({
          trigger: projectsGrid,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            anime({
              targets: '.project-card',
              opacity: [0, 1],
              translateY: [60, 0],
              scale: [0.92, 1],
              delay: anime.stagger(140),
              duration: 900,
              easing: 'spring(1, 78, 10, 0)'
            });
          }
        });
      }

      /* Category filtering transition with Anime.js */
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filterVal = btn.getAttribute('data-filter');

          anime({
            targets: '.project-card',
            opacity: 0,
            scale: 0.85,
            translateY: 20,
            duration: 250,
            easing: 'easeInCubic',
            complete: () => {
              cards.forEach(card => {
                const cat = card.getAttribute('data-category') || '';
                if (filterVal === 'all' || cat.includes(filterVal)) {
                  card.style.display = 'block';
                } else {
                  card.style.display = 'none';
                }
              });

              const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
              anime({
                targets: visibleCards,
                opacity: [0, 1],
                scale: [0.85, 1],
                translateY: [20, 0],
                delay: anime.stagger(90),
                duration: 650,
                easing: 'spring(1, 80, 12, 0)'
              });
            }
          });
        });
      });

      /* Cursor lens mode on project card hover */
      const follower = document.getElementById('cursorFollower');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          if (follower) follower.classList.add('cursor-view-lens');
        });
        card.addEventListener('mouseleave', () => {
          if (follower) follower.classList.remove('cursor-view-lens');
        });

        /* 3D Tilt physics */
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          anime({
            targets: card,
            rotateX: -y * 14,
            rotateY: x * 14,
            translateZ: 16,
            translateY: -8,
            duration: 400,
            easing: 'easeOutQuad'
          });
        });

        card.addEventListener('mouseleave', () => {
          anime({
            targets: card,
            rotateX: 0,
            rotateY: 0,
            translateZ: 0,
            translateY: 0,
            duration: 800,
            easing: 'spring(1, 75, 10, 0)'
          });
        });
      });
    })();

    /* ─────────────────────────────────────────────────────────────
       16. ACHIEVEMENTS — SCROLL ENTRANCE, 3D TILT & FILTER ANIMATION
       ───────────────────────────────────────────────────────────── */
    (function achievementsSection() {
      const grid = document.querySelector('.achievements-grid');
      const counters = document.querySelector('.achievement-counters');
      const filters = document.querySelector('.achievement-filters');

      /* Entrance animation for achievement cards (called on initial load + filter) */
      function animateCards() {
        const cards = grid?.querySelectorAll('.achievement-card');
        if (!cards || cards.length === 0) return;

        anime({
          targets: Array.from(cards),
          opacity: [0, 1],
          translateY: [50, 0],
          scale: [0.92, 1],
          delay: anime.stagger(100),
          duration: 800,
          easing: 'spring(1, 78, 10, 0)'
        });

        /* 3D Tilt physics on hover */
        cards.forEach(card => {
          card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            anime({
              targets: card,
              rotateX: -y * 10,
              rotateY: x * 10,
              translateZ: 12,
              duration: 400,
              easing: 'easeOutQuad'
            });
          });

          card.addEventListener('mouseleave', () => {
            anime({
              targets: card,
              rotateX: 0,
              rotateY: 0,
              translateZ: 0,
              duration: 800,
              easing: 'spring(1, 75, 10, 0)'
            });
          });
        });
      }

      /* Initial scroll-triggered entrance */
      if (grid) {
        ScrollTrigger.create({
          trigger: grid,
          start: 'top 82%',
          once: true,
          onEnter: animateCards
        });

        /* Watch for DOM changes (filter/view-all re-renders cards) */
        const observer = new MutationObserver(() => {
          animateCards();
        });
        observer.observe(grid, { childList: true });
      }

      /* Counter pills entrance */
      if (counters) {
        ScrollTrigger.create({
          trigger: counters,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            anime({
              targets: '.achievement-counter-pill',
              opacity: [0, 1],
              scale: [0.8, 1],
              translateY: [16, 0],
              delay: anime.stagger(80),
              duration: 700,
              easing: 'spring(1, 80, 12, 0)'
            });

            anime({
              targets: '.achievement-counter-separator',
              opacity: [0, 1],
              delay: anime.stagger(80, { start: 100 }),
              duration: 500,
              easing: 'easeOutCubic'
            });
          }
        });
      }

      /* Filter buttons entrance */
      if (filters) {
        ScrollTrigger.create({
          trigger: filters,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            anime({
              targets: '.achievement-filters .filter-btn',
              opacity: [0, 1],
              translateY: [12, 0],
              delay: anime.stagger(60),
              duration: 600,
              easing: 'easeOutCubic'
            });
          }
        });
      }

      /* View All button entrance */
      const viewAllWrap = document.querySelector('.achievements-view-all-wrap');
      if (viewAllWrap) {
        ScrollTrigger.create({
          trigger: viewAllWrap,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            anime({
              targets: viewAllWrap,
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 800,
              easing: 'easeOutCubic'
            });
          }
        });
      }
    })();


    /* Click ripple for buttons (includes achievement filter buttons) */
    (function buttonRipples() {
      document.querySelectorAll('.btn, .filter-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
          const rect = btn.getBoundingClientRect();
          const ripple = document.createElement('span');
          ripple.className = 'btn-ripple-fx';
          const size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
          ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
          btn.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       9. HOBBIES SECTION — STAGGER & HOVER FLOAT
       ───────────────────────────────────────────────────────────── */
    (function hobbiesSection() {
      const grid = document.querySelector('.hobbies-grid');
      if (!grid) return;

      ScrollTrigger.create({
        trigger: grid,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          anime({
            targets: '.hobby-card',
            opacity: [0, 1],
            scale: [0.8, 1],
            translateY: [35, 0],
            delay: anime.stagger(100),
            duration: 850,
            easing: 'spring(1, 80, 12, 0)'
          });
        }
      });

      document.querySelectorAll('.hobby-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          anime({
            targets: card,
            translateY: -10,
            scale: 1.04,
            duration: 400,
            easing: 'spring(1, 85, 12, 0)'
          });
        });
        card.addEventListener('mouseleave', () => {
          anime({
            targets: card,
            translateY: 0,
            scale: 1,
            duration: 600,
            easing: 'easeOutCubic'
          });
        });
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       10. CONTACT — SPLIT SLIDE & STAGGER REVEAL
       ───────────────────────────────────────────────────────────── */
    (function contactSection() {
      const contactGrid = document.querySelector('.contact-grid');
      if (!contactGrid) return;

      ScrollTrigger.create({
        trigger: contactGrid,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          anime({
            targets: '.contact-info',
            opacity: [0, 1],
            translateX: [-50, 0],
            duration: 1000,
            easing: 'cubicBezier(0.16, 1, 0.3, 1)'
          });

          anime({
            targets: '.contact-form-wrapper',
            opacity: [0, 1],
            translateX: [50, 0],
            duration: 1000,
            delay: 150,
            easing: 'cubicBezier(0.16, 1, 0.3, 1)'
          });

          anime({
            targets: '.contact-detail',
            opacity: [0, 1],
            translateX: [-20, 0],
            delay: anime.stagger(100, { start: 300 }),
            duration: 750,
            easing: 'easeOutCubic'
          });
        }
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       11. MAGNETIC BUTTONS — ANIME.JS ELASTIC SPRING
       ───────────────────────────────────────────────────────────── */
    (function magneticButtons() {
      document.querySelectorAll('.btn').forEach(btn => {
        const icon = btn.querySelector('i');

        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
          const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
          anime({
            targets: btn,
            translateX: dx,
            translateY: dy,
            duration: 350,
            easing: 'easeOutQuad'
          });
          if (icon) {
            anime({
              targets: icon,
              translateX: dx * 0.4,
              translateY: dy * 0.4,
              duration: 350,
              easing: 'easeOutQuad'
            });
          }
        });

        btn.addEventListener('mouseleave', () => {
          anime({
            targets: btn,
            translateX: 0,
            translateY: 0,
            duration: 850,
            easing: 'spring(1, 70, 8, 0)'
          });
          if (icon) {
            anime({
              targets: icon,
              translateX: 0,
              translateY: 0,
              duration: 850,
              easing: 'spring(1, 70, 8, 0)'
            });
          }
        });
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       12. FOOTER REVEAL
       ───────────────────────────────────────────────────────────── */
    (function footerReveal() {
      gsap.fromTo('.footer-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: EASE.out,
          scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            once: true,
          }
        });

      gsap.fromTo('.footer-bottom',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7, ease: EASE.out,
          scrollTrigger: {
            trigger: '.footer-bottom',
            start: 'top 95%',
            once: true,
          },
          delay: 0.3,
        });
    })();


    /* ─────────────────────────────────────────────────────────────
       13. PROFILE AVATAR — Hover interaction
       ───────────────────────────────────────────────────────────── */
    (function avatarHover() {
      const frame = document.querySelector('.hero-image-frame');
      if (!frame) return;
      frame.addEventListener('mouseenter', () => {
        gsap.to(frame, { scale: 1.03, duration: 0.4, ease: EASE.spring });
      });
      frame.addEventListener('mouseleave', () => {
        gsap.to(frame, { scale: 1, duration: 0.4, ease: EASE.out });
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       14. FLOATING BADGES — Continuous gentle motion
       ───────────────────────────────────────────────────────────── */
    (function floatingBadges() {
      gsap.to('.badge-1', {
        y: -8, rotation: -2,
        duration: 3.2, repeat: -1, yoyo: true, ease: EASE.soft,
      });
      gsap.to('.badge-2', {
        y: 8, rotation: 2,
        duration: 2.8, repeat: -1, yoyo: true, ease: EASE.soft,
        delay: 0.8,
      });
    })();


    /* ─────────────────────────────────────────────────────────────
       15. TECH ICON CARDS — Hover 3D flip tease
       ───────────────────────────────────────────────────────────── */
    (function techIconHover() {
      document.querySelectorAll('.tech-icon-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            rotateY: 12, scale: 1.08, y: -6,
            duration: 0.35, ease: EASE.spring,
            transformPerspective: 600,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateY: 0, scale: 1, y: 0,
            duration: 0.4, ease: EASE.out,
          });
        });
      });
    })();

  }); /* end waitForLibraries */

})();
