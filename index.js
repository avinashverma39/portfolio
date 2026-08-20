/* =============================================
   AVINASH VERMA PORTFOLIO — JAVASCRIPT
   Premium Enhanced Edition
   ============================================= */

import { createClient } from 'https://esm.sh/@insforge/sdk@latest';

const insforge = createClient({
  baseUrl: 'https://r4s69m7b.ap-southeast.insforge.app',
  anonKey: 'anon_e477484020cb5f6036d7fa05715227a98204ee6b293d38ad446f77bf4dde73a2'
});

/* Respect user motion preferences globally */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Wait for DOM to load ---- */
document.addEventListener('DOMContentLoaded', async () => {
  initThemeToggle();
  initParticles();       // canvas ambient particles
  initTypingEffect();    // hero typing effect
  initActiveNavLink();   // active section observer
  initBackToTop();       // back to top button click

  /* NOTE: Animations, Motion scroll progress, custom cursor, magnetic buttons, 
     timeline, project tilt & filters are all powered by Motion.js in animations.js */

  // Check auth and update nav link
  const authNavLink = document.getElementById('authNavLink');
  if (authNavLink) {
    try {
      const { data: { user } } = await insforge.auth.getCurrentUser();
      if (user) {
        authNavLink.textContent = 'Dashboard';
        authNavLink.href = 'dashboard.html';
      }
    } catch (e) {
      console.warn('Auth check error:', e);
    }
  }
});


/* =============================================
   1. CUSTOM CURSOR — ENHANCED MAGNETIC
   ============================================= */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  if (prefersReducedMotion) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth RAF-based follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Expand cursor on hover
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .hobby-card, .stat-card, .tech-icon-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '0.6'; });
}


/* =============================================
   2. NAVBAR — SCROLL EFFECT
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}


/* =============================================
   3. HAMBURGER MENU (MOBILE)
   ============================================= */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  if (!hamburger || !navLinks) return;

  function toggleMenu(show) {
    const isOpen = show !== undefined ? show : !navLinks.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    if (navOverlay) navOverlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  // Toggle menu open/close
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close menu when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      toggleMenu(false);
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}


/* =============================================
   4. TYPING EFFECT — ENHANCED
   ============================================= */
function initTypingEffect() {
  const greetEl = document.getElementById('typedGreeting');
  const roleEl  = document.getElementById('typedRole');
  const descEl  = document.getElementById('heroDesc');
  if (!greetEl || !roleEl) return;

  const greeting = "Hi, I'm Avinash";
  const roles = [
    'Web Developer',
    'Frontend Developer',
    'C++ Programmer',
    'Java Programmer',
    'Problem Solver',
    'BTech CS Student',
  ];
  const description = "A passionate BTech Computer Science student crafting clean, efficient, and user-friendly web experiences. I turn ideas into interactive digital reality.";

  // Inject a real caret span (not CSS ::after)
  function setCaret(el, show) {
    let caret = el.parentElement?.querySelector('.type-caret');
    if (!caret) {
      caret = document.createElement('span');
      caret.className = 'type-caret';
      caret.textContent = '|';
      el.insertAdjacentElement('afterend', caret);
    }
    caret.style.display = show ? 'inline' : 'none';
  }

  // Phase 1: Type the greeting
  function typeGreeting(cb) {
    let i = 0;
    setCaret(greetEl, true);
    function tick() {
      const idx = greeting.indexOf('Avinash');
      if (i > idx) {
        greetEl.innerHTML =
          greeting.slice(0, idx) +
          '<span class="highlight">' + greeting.slice(idx, idx + 7) + '</span>' +
          greeting.slice(idx + 7, i);
      } else {
        greetEl.textContent = greeting.slice(0, i);
      }
      i++;
      if (i <= greeting.length) {
        setTimeout(tick, prefersReducedMotion ? 0 : 65);
      } else {
        setTimeout(cb, prefersReducedMotion ? 0 : 300);
      }
    }
    setTimeout(tick, prefersReducedMotion ? 0 : 450);
  }

  // Phase 2: Cycle roles
  function startRoles() {
    setCaret(greetEl, false);
    setCaret(roleEl, true);
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function typeRole() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        roleEl.textContent = currentRole.slice(0, charIndex - 1);
        roleEl.classList.remove('role-shimmer-active');
        charIndex--;
      } else {
        roleEl.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 45 : 85;

      if (!isDeleting && charIndex === currentRole.length) {
        // Apply shimmer when fully typed
        roleEl.classList.add('role-shimmer-active');
        speed = 1800;
        isDeleting = true;
        if (roleIndex === 0 && descEl) {
          setTimeout(() => typeDesc(), 600);
        }
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 300;
      }

      setTimeout(typeRole, prefersReducedMotion ? 0 : speed);
    }
    setTimeout(typeRole, 200);
  }

  // Phase 3: Type description once
  function typeDesc() {
    if (!descEl) return;
    let i = 0;
    function tick() {
      descEl.textContent = description.slice(0, i);
      i++;
      if (i <= description.length) {
        setTimeout(tick, prefersReducedMotion ? 0 : 24);
      }
    }
    tick();
  }

  // ── Kick off sequence ────────────────────────────────────
  typeGreeting(startRoles);
}



/* =============================================
   9. CONTACT FORM SUBMIT HANDLER
   ============================================= */
window.handleFormSubmit = async function() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) { alert('Please enter your name.'); return; }
  if (!email || !validateEmail(email)) { alert('Please enter a valid email address.'); return; }
  if (!message) { alert('Please enter a message.'); return; }

  const sendBtn = document.getElementById('sendBtn');
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  sendBtn.disabled = true;

  try {
    let aiResponse = null;

    // Call InsForge Edge Function
    try {
      const response = await fetch('https://n9cxde66.function2.insforge.app/handle-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (response.ok) {
        const data = await response.json();
        aiResponse = data.ai_response;
      }
    } catch (fnErr) {
      console.warn('Edge Function fallback:', fnErr);
    }

    // Direct Database Backup if edge function was unavailable
    if (!aiResponse) {
      try {
        const { error: dbErr } = await insforge
          .database
          .from('messages')
          .insert([{ name, email, message }]);
        if (dbErr) console.error('Database insert fallback error:', dbErr);
      } catch (e) {
        console.error('Direct database insert exception:', e);
      }
    }

    // Display success feedback
    document.getElementById('contactForm').style.display = 'none';
    const formSuccess = document.getElementById('formSuccess');

    const successH3 = formSuccess.querySelector('h3');
    const successP  = formSuccess.querySelector('p');
    if (successH3) successH3.innerText = 'Message Sent Successfully!';
    if (successP)  successP.innerText  = aiResponse || "Thank you for reaching out! Avinash will get back to you shortly.";

    formSuccess.style.display = 'block';

  } catch (err) {
    console.error(err);
    alert('Sorry, there was an error sending your message. Please check your network and try again.');
    sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    sendBtn.disabled = false;
  }
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}




/* =============================================
   10. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});


/* =============================================
   11. SCROLL PROGRESS BAR
   ============================================= */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}


/* =============================================
   12. DARK / LIGHT THEME TOGGLE
   ============================================= */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;
  if (!btn) return;

  // Always default to dark theme unless user explicitly saved light theme preference
  const saved = localStorage.getItem('av-theme');
  const initial = saved || 'dark';
  setTheme(initial, false);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  });

  function setTheme(theme, animate) {
    if (animate && !prefersReducedMotion) {
      html.classList.add('theme-transitioning');
      setTimeout(() => html.classList.remove('theme-transitioning'), 600);
    }
    html.setAttribute('data-theme', theme);
    localStorage.setItem('av-theme', theme);
  }
}


/* =============================================
   13. HERO CINEMATIC ENTRANCE
   ============================================= */
function initHeroEntrance() {
  const items = document.querySelectorAll('[data-entrance]');
  const delays = { tag: 0, title: 200, desc: 420, buttons: 620, social: 780 };

  items.forEach(el => {
    const key = el.getAttribute('data-entrance');
    const delay = delays[key] ?? 0;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';

    if (prefersReducedMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    setTimeout(() => {
      el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay + 200);
  });

  // Hero image — enter from right
  const heroImg = document.querySelector('.hero-image-wrapper');
  if (heroImg && !prefersReducedMotion) {
    heroImg.style.opacity = '0';
    heroImg.style.transform = 'translateX(48px) scale(0.95)';
    setTimeout(() => {
      heroImg.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
      heroImg.style.opacity = '1';
      heroImg.style.transform = 'translateX(0) scale(1)';
    }, 400);
  }
}


/* =============================================
   14. PARTICLE CANVAS
   ============================================= */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 45;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.45 + 0.1,
      color: Math.random() > 0.5 ? '50,205,50' : '0,255,255'
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(50,205,50,${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  particles = Array.from({ length: COUNT }, mkParticle);
  draw();
}


/* =============================================
   15. ADVANCED SCROLL REVEAL
   ============================================= */
function initScrollReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const configs = [
    { sel: '.stat-card',            type: 'scale-in',    stagger: 90  },
    { sel: '.timeline-card',        type: 'fade-left',   stagger: 120 },
    { sel: '.project-card',         type: 'fade-up',     stagger: 80  },
    { sel: '.hobby-card',           type: 'scale-in',    stagger: 70  },
    { sel: '.tech-icon-card',       type: 'fade-up',     stagger: 50  },
    { sel: '.skills-group',         type: 'fade-right',  stagger: 150 },
    { sel: '.about-text',           type: 'fade-right',  stagger: 0   },
    { sel: '.contact-info',         type: 'fade-left',   stagger: 0   },
    { sel: '.contact-form-wrapper', type: 'fade-right',  stagger: 0   },
    { sel: '.section-header',       type: 'fade-up',     stagger: 0   },
  ];

  configs.forEach(({ sel, type, stagger }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal', `reveal-${type}`);
      if (stagger && i > 0) el.style.transitionDelay = `${i * stagger}ms`;
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


/* =============================================
   16. SKILL BARS — ENHANCED WITH COUNTER
   ============================================= */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      const target = parseInt(fill.getAttribute('data-width'), 10);

      requestAnimationFrame(() => { fill.style.width = target + '%'; });

      // Count-up percentage label
      const pctEl = fill.closest('.skill-bar-item')?.querySelector('.skill-percent');
      if (pctEl) {
        countUp(0, target, 1200, v => { pctEl.textContent = v + '%'; });
      }
      observer.unobserve(fill);
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => { fill.style.width = '0'; observer.observe(fill); });
}


/* =============================================
   17. COUNT-UP ANIMATION
   ============================================= */
function countUp(from, to, duration, cb) {
  if (prefersReducedMotion) { cb(to); return; }
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    cb(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function initCountUpNumbers() {
  const cards = document.querySelectorAll('.stat-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const h3 = entry.target.querySelector('h3');
      if (!h3) return;
      const text = h3.textContent.trim();
      const match = text.match(/^(\d+)/);
      if (!match) return;
      const num = parseInt(match[1], 10);
      const suffix = text.slice(match[1].length);
      countUp(0, num, 1400, v => { h3.textContent = v + suffix; });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  cards.forEach(c => observer.observe(c));
}


/* =============================================
   18. ACTIVE NAV LINK ON SCROLL
   ============================================= */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) {
        active.classList.add('active');
        // Slide the active pill indicator
        const pill = document.querySelector('.nav-active-pill');
        if (pill) {
          const rect = active.getBoundingClientRect();
          const parentRect = active.closest('.nav-links')?.getBoundingClientRect();
          if (parentRect) {
            pill.style.left = (rect.left - parentRect.left) + 'px';
            pill.style.width = rect.width + 'px';
          }
        }
      }
    });
  }, { threshold: 0.35, rootMargin: '-60px 0px -60px 0px' });

  sections.forEach(s => observer.observe(s));

  // Create pill element
  const navLinksList = document.querySelector('.nav-links');
  if (navLinksList) {
    const pill = document.createElement('div');
    pill.className = 'nav-active-pill';
    navLinksList.appendChild(pill);
  }
}


/* =============================================
   19. BACK TO TOP BUTTON
   ============================================= */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}


/* =============================================
   20. TIMELINE ANIMATED LINE
   ============================================= */
function initTimelineAnimation() {
  const timeline = document.querySelector('.timeline');
  if (!timeline || prefersReducedMotion) return;

  // Inject a real element to animate (can't animate ::before)
  const line = document.createElement('div');
  line.className = 'timeline-line-animated';
  timeline.prepend(line);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        line.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(timeline);
}


/* =============================================
   21. MAGNETIC BUTTONS
   ============================================= */
function initMagneticButtons() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}