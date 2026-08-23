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
  initCustomCursor();
  initNavbar();
  initHamburger();
  initScrollProgress();
  initThemeToggle();
  initParticles();       // canvas particles (not a GSAP animation)
  initTypingEffect();    // hero typing effect
  initSkillBars();       // fills progress bar widths via IntersectionObserver
  initActiveNavLink();   // active pill indicator
  initBackToTop();       // back to top button visibility
  initAchievements();    // achievements & certifications section

  /* NOTE: Hero entrance, scroll reveal, count-up, timeline animation,
     and magnetic buttons are all handled by animations.js (GSAP) */

  // Check auth and update nav link (kept for safety)
  const authNavLink = document.getElementById('authNavLink');
  if (authNavLink) {
    const { data: { user } } = await insforge.auth.getCurrentUser();
    if (user) {
      authNavLink.textContent = 'Dashboard';
      authNavLink.href = 'dashboard.html';
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
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .hobby-card, .stat-card, .tech-icon-card, .achievement-card, .detail-item, .timeline-card, .filter-btn');
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

  if (!hamburger || !navLinks) return;

  function toggleMenu(open) {
    const isOpen = open ?? !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      // Focus first nav link when menu opens
      const firstLink = navLinks.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
  }

  // Toggle menu open/close
  hamburger.addEventListener('click', () => toggleMenu());

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
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
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous errors
    clearFormErrors();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate
    let hasError = false;
    if (!name) { showFieldError('name', 'nameError', 'Please enter your name.'); hasError = true; }
    if (!email || !validateEmail(email)) { showFieldError('email', 'emailError', 'Please enter a valid email address.'); hasError = true; }
    if (!message) { showFieldError('message', 'messageError', 'Please enter a message.'); hasError = true; }
    if (hasError) return;

    const sendBtn = document.getElementById('sendBtn');
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;

    try {
      let aiResponse = null;

      // 1. Call InsForge AI Edge Function
      const edgeFunctionUrls = [
        'https://r4s69m7b.function2.insforge.app/handle-contact',
        'https://n9cxde66.function2.insforge.app/handle-contact'
      ];

      for (const url of edgeFunctionUrls) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
          });

          if (response.ok) {
            const data = await response.json();
            aiResponse = data.ai_response;
            if (aiResponse) break;
          }
        } catch (fnErr) {
          console.warn(`Edge function at ${url} unavailable:`, fnErr);
        }
      }

      // 2. Direct InsForge Database Backup
      try {
        const { error: dbErr } = await insforge
          .database
          .from('messages')
          .insert([{ name, email, message }]);
        if (dbErr) console.warn('InsForge database direct insert notice:', dbErr);
      } catch (e) {
        console.warn('InsForge database direct insert exception:', e);
      }

      // 3. Direct Email Notification via FormSubmit
      try {
        await fetch('https://formsubmit.co/ajax/avinashverma3939@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            subject: subject || 'New Message from Portfolio',
            message,
            _captcha: 'false'
          })
        });
      } catch (e) {
        console.warn('Direct email notification notice:', e);
      }

      // Display success feedback
      form.style.display = 'none';
      const formSuccess = document.getElementById('formSuccess');

      const successH3 = formSuccess.querySelector('h3');
      const successP  = formSuccess.querySelector('p');
      if (successH3) successH3.innerText = 'Message Sent Successfully!';
      if (successP)  successP.innerText  = aiResponse || "Thank you for reaching out! Avinash will get back to you shortly.";

      formSuccess.style.display = 'block';

    } catch (err) {
      console.error(err);
      showFieldError('message', 'messageError', 'Sorry, there was an error. Please check your network and try again.');
      sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      sendBtn.disabled = false;
    }
  });
})();

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (field) field.classList.add('input-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
  });
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

  // Load saved theme or system preference
  const saved = localStorage.getItem('av-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
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


/* initHeroEntrance — REMOVED: handled by animations.js */


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


/* initScrollReveal — REMOVED: handled by animations.js */


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

/* initCountUpNumbers — REMOVED: handled by animations.js */


/* =============================================
   18. ACTIVE NAV LINK ON SCROLL & CLICK
   ============================================= */
function initActiveNavLink() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const navLinksList = document.querySelector('.nav-links');

  if (!sections.length || !navLinks.length) return;

  // Create or retrieve sliding pill element
  let pill = document.querySelector('.nav-active-pill');
  if (!pill && navLinksList) {
    pill = document.createElement('div');
    pill.className = 'nav-active-pill';
    navLinksList.appendChild(pill);
  }

  let isClickScrolling = false;
  let clickTimeout = null;

  function updatePill(activeLink) {
    if (!pill || !activeLink || !navLinksList) return;
    const linkRect = activeLink.getBoundingClientRect();
    const parentRect = navLinksList.getBoundingClientRect();
    if (parentRect.width > 0 && linkRect.width > 0) {
      pill.style.left = (linkRect.left - parentRect.left) + 'px';
      pill.style.width = linkRect.width + 'px';
      pill.style.opacity = '1';
    }
  }

  function setActive(targetId) {
    if (!targetId) return;
    let currentActive = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === `#${targetId}` || href.endsWith(`#${targetId}`)) {
        link.classList.add('active');
        currentActive = link;
      } else {
        link.classList.remove('active');
      }
    });

    if (currentActive) {
      updatePill(currentActive);
    }
  }

  // Handle immediate click selection and lock scroll spy during smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      const hashIndex = href.indexOf('#');
      if (hashIndex !== -1) {
        const id = href.slice(hashIndex + 1);
        if (id) {
          isClickScrolling = true;
          setActive(id);
          clearTimeout(clickTimeout);
          clickTimeout = setTimeout(() => {
            isClickScrolling = false;
            determineActiveSection();
          }, 850);
        }
      }
    });
  });

  function determineActiveSection() {
    if (isClickScrolling) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
    const offset = navbarHeight + 80;

    // Top of page
    if (scrollY < 120) {
      setActive('home');
      return;
    }

    // Bottom of page
    if (scrollY + winHeight >= docHeight - 60) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) setActive(lastSection.id);
      return;
    }

    // Check which section encompasses the offset line
    let activeId = 'home';
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const rect = sec.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom > offset) {
        activeId = sec.id;
        break;
      } else if (rect.top <= offset) {
        activeId = sec.id;
      }
    }

    setActive(activeId);
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        determineActiveSection();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) updatePill(active);
  });

  // Initial update
  setTimeout(() => {
    determineActiveSection();
    const initialActive = document.querySelector('.nav-link.active') || navLinks[0];
    if (initialActive) updatePill(initialActive);
  }, 100);
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


/* initTimelineAnimation — REMOVED: handled by animations.js */

/* initMagneticButtons — REMOVED: handled by animations.js */


/* =============================================
   22. ACHIEVEMENTS & CERTIFICATIONS
   ============================================= */

/* ── Achievement Data — Add your own entries here ─── */
const achievementsData = [
  {
    id: 'cert-cpp',
    title: 'C++ Programming Certificate',
    category: 'certificate',
    organization: 'Coursera',
    date: 'April 2025',
    description: 'Completed a comprehensive C++ programming course covering OOP, STL, memory management, and modern C++ features with hands-on projects.',
    skills: ['C++', 'OOP', 'STL'],
    image: null, // Replace with actual certificate image path
    credentialUrl: '#',
    credentialId: 'CERT-CPP-2025-001'
  },
  {
    id: 'course-webdev',
    title: 'Web Development Course ',
    category: 'course',
    organization: 'Udemy',
    date: 'Mar 2026',
    description: 'Mastered full-stack web development fundamentals including HTML5, CSS3, responsive design, and JavaScript ES6+ With using AI tools for coding and debugging.',
    skills: ['HTML', 'CSS', 'JavaScript', 'AI Tools'],
    image: null,
    credentialUrl: '#',
    credentialId: 'UC-WEBDEV-2026'
  },
  {
    id: 'Summer-Internship-JAVA',
  title: 'Summer Internship — JAVA Development',
    category: 'internship',
    organization: 'TechCorp Solutions',
    date: 'Jun 2025',
    description: 'Worked as a JAVA Development Intern building scalable applications, collaborating with senior developers, and delivering Projects using AI-assisted coding tools to enhance productivity and code quality.',
    skills: ['JAVA', 'Team Collaboration', 'AI Tools'],
    image: null,
    credentialUrl: '#',
    credentialId: null
  },
 /* {
    id: 'course-dsa',
    title: 'DSA Course ',
    category: 'course',
    organization: 'GeeksforGeeks',
    date: 'Feb 2025',
    description: 'Completed an intensive Data Structures and Algorithms course covering arrays, linked lists, trees, graphs, dynamic programming, and competitive coding strategies.',
    skills: ['C++', 'DSA', 'Algorithms'],
    image: null,
    credentialUrl: '#',
    credentialId: 'GFG-DSA-2025'
  },*/

  {
    id: 'Hack-2026',
    title: 'Hackathon -2026 RR Institute of Modern Technology',
    category: 'achievement',
    organization: 'RRGI INNOVATHON - 2026',
    date: 'Apr 2025',
    description: 'Participated in Hackthon RRGI and give our best to solve real-world problems using innovative solutions and collaborative teamwork. Our team developed a web application that addressed a pressing social issue, showcasing our technical skills and creativity.',
    skills: ['Problem Solving', 'Teamwork', 'Web Dev'],
    image: null,
    credentialUrl: '#',
    credentialId: null
  },

 /* {
    id: 'cert-python',
    title: 'Python Programming Certificate',
    category: 'certificate',
    organization: 'Coursera',
    date: 'Dec 2024',
    description: 'Earned a certification in Python programming covering data types, control flow, functions, file handling, and introduction to libraries like NumPy and Pandas.',
    skills: ['Python', 'Automation', 'Data Analysis'],
    image: null,
    credentialUrl: '#',
    credentialId: 'CERT-PY-2024-042'
  },*/

  {
    id: 'course-git',
    title: 'Git & GitHub Masterclass',
    category: 'course',
    organization: 'Simplilearn',
    date: 'Nov 2025',
    description: 'All Basic version control with Git and GitHub including branching strategies, pull requests, collaboration workflows, and CI/CD fundamentals and push code to GitHub repository for real-world project collaboration.',
    skills: ['Git', 'GitHub', 'Version Control'],
    image: null,
    credentialUrl: '#',
    credentialId: null
  },
  {
    id: 'award-academic',
    title: 'Academic Excellence',
    category: 'achievement',
    organization: 'R R Institute of Modern Technology',
    date: 'Aug 2025',
    description: 'Recognized for outstanding academic performance and consistent contributions to the Computer Science department through projects and Academic Results.',
    skills: ['Computer Science', 'Leadership'],
    image: null,
    credentialUrl: '#',
    credentialId: null
  }
];

function initAchievements() {
  const grid = document.getElementById('achievementsGrid');
  const countersEl = document.getElementById('achievementCounters');
  const filterBtns = document.querySelectorAll('[data-achievement-filter]');
  const viewAllWrap = document.getElementById('achievementsViewAllWrap');
  const viewAllBtn = document.getElementById('achievementsViewAllBtn');

  if (!grid) return;

  const INITIAL_VISIBLE = 6;
  let showAll = false;
  let currentFilter = 'all';

  /* ── Render Counters ─── */
  renderCounters();

  /* ── Render Cards ─── */
  renderCards();

  /* ── Setup Filters ─── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-achievement-filter');
      showAll = false;
      if (viewAllBtn) {
        viewAllBtn.querySelector('span').textContent = 'View All Achievements';
      }
      renderCards();
    });
  });

  /* ── Setup View All ─── */
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      showAll = !showAll;
      viewAllBtn.querySelector('span').textContent = showAll ? 'Show Less' : 'View All Achievements';
      renderCards();
    });
  }

  /* ── Setup Modal ─── */
  initCertModal();

  /* ── Render counters ─── */
  function renderCounters() {
    if (!countersEl) return;

    const counts = {};
    const labels = {
      certificate: { label: 'Certificates', icon: 'fa-certificate' },
      course: { label: 'Courses', icon: 'fa-book' },
      internship: { label: 'Internships', icon: 'fa-briefcase' },
      achievement: { label: 'Achievements', icon: 'fa-trophy' }
    };

    achievementsData.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });

    const pills = [];
    Object.entries(labels).forEach(([cat, meta], i) => {
      const count = counts[cat] || 0;
      if (count === 0) return;
      if (i > 0 && pills.length > 0) {
        pills.push('<span class="achievement-counter-separator">|</span>');
      }
      pills.push(`
        <div class="achievement-counter-pill">
          <i class="fa-solid ${meta.icon}"></i>
          <span class="counter-num" data-count="${count}">${count}+</span>
          ${meta.label}
        </div>
      `);
    });

    countersEl.innerHTML = pills.join('');
  }

  /* ── Render cards ─── */
  function renderCards() {
    const filtered = currentFilter === 'all'
      ? achievementsData
      : achievementsData.filter(a => a.category === currentFilter);

    const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

    grid.innerHTML = visible.map(a => createCardHTML(a)).join('');

    // Show/hide "View All" button
    if (viewAllWrap) {
      viewAllWrap.style.display = filtered.length > INITIAL_VISIBLE ? 'block' : 'none';
    }

    // Attach card click handlers for modal
    grid.querySelectorAll('.achievement-view-cert-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-achievement-id');
        openCertModal(id);
      });
    });

    // Lazy load images
    lazyLoadImages();

    // Re-register custom cursor interactives on new cards
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (cursor && follower && !prefersReducedMotion) {
      grid.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          cursor.classList.add('cursor-hover');
          follower.classList.add('cursor-hover');
        });
        card.addEventListener('mouseleave', () => {
          cursor.classList.remove('cursor-hover');
          follower.classList.remove('cursor-hover');
        });
      });
    }
  }

  /* ── Create card HTML ─── */
  function createCardHTML(a) {
    const categoryMeta = {
      certificate: { icon: 'fa-certificate', label: 'Certificate' },
      course: { icon: 'fa-book', label: 'Course' },
      internship: { icon: 'fa-briefcase', label: 'Internship' },
      achievement: { icon: 'fa-trophy', label: 'Achievement' }
    };
    const meta = categoryMeta[a.category] || { icon: 'fa-star', label: 'Other' };

    const imageHTML = a.image
      ? `<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${a.image}" alt="${a.title}" loading="lazy" />`
      : `<div class="achievement-placeholder-img">
           <i class="fa-solid ${meta.icon} placeholder-icon"></i>
           <span class="placeholder-label">Replace with certificate image</span>
         </div>`;

    const credentialHTML = a.credentialId
      ? `<div class="achievement-card-credential"><strong>ID:</strong> ${a.credentialId}</div>`
      : '';

    const skillsHTML = a.skills.map(s => `<span>${s}</span>`).join('');

    return `
      <article class="achievement-card" data-achievement-category="${a.category}" data-achievement-id="${a.id}">
        <div class="achievement-card-image">
          ${imageHTML}
          <div class="achievement-card-badge">
            <i class="fa-solid ${meta.icon}"></i>
            ${meta.label}
          </div>
        </div>
        <div class="achievement-card-body">
          <div class="achievement-card-header">
            <h3 class="achievement-card-title">${a.title}</h3>
            <span class="achievement-card-date">${a.date}</span>
          </div>
          <div class="achievement-card-org">
            <i class="fa-solid fa-building"></i>
            ${a.organization}
          </div>
          <p class="achievement-card-desc">${a.description}</p>
          ${credentialHTML}
          <div class="achievement-card-skills">${skillsHTML}</div>
        </div>
        <div class="achievement-card-actions">
          <button class="btn btn-outline achievement-view-cert-btn" data-achievement-id="${a.id}">
            <i class="fa-solid fa-eye"></i> View Certificate
          </button>
        </div>
      </article>
    `;
  }

  /* ── Lazy load images ─── */
  function lazyLoadImages() {
    const images = grid.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imgObserver.unobserve(img);
      });
    }, { rootMargin: '100px' });

    images.forEach(img => imgObserver.observe(img));
  }
}


/* =============================================
   23. CERTIFICATE PREVIEW MODAL
   ============================================= */
function initCertModal() {
  const overlay = document.getElementById('certModalOverlay');
  const closeBtn = document.getElementById('certModalClose');
  const modalImg = document.getElementById('certModalImage');
  const modalInfo = document.getElementById('certModalInfo');
  const zoomInBtn = document.getElementById('certModalZoomIn');
  const zoomOutBtn = document.getElementById('certModalZoomOut');
  const zoomResetBtn = document.getElementById('certModalZoomReset');

  if (!overlay) return;

  let currentZoom = 1;
  const ZOOM_STEP = 0.25;
  const ZOOM_MAX = 3;
  const ZOOM_MIN = 0.5;

  /* ── Close modal ─── */
  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    currentZoom = 1;
    if (modalImg) modalImg.style.transform = `scale(1)`;
    // Use a slight delay to let CSS transition finish before hiding
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        overlay.style.display = 'none';
      }
    }, 400);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Click outside modal to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Keyboard Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  /* ── Zoom controls ─── */
  function setZoom(level) {
    currentZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, level));
    if (modalImg) modalImg.style.transform = `scale(${currentZoom})`;
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(currentZoom + ZOOM_STEP));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(currentZoom - ZOOM_STEP));
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => setZoom(1));
}

/* ── Open modal with achievement data ─── */
function openCertModal(achievementId) {
  const overlay = document.getElementById('certModalOverlay');
  const modalImg = document.getElementById('certModalImage');
  const modalInfo = document.getElementById('certModalInfo');

  if (!overlay) return;

  const achievement = achievementsData.find(a => a.id === achievementId);
  if (!achievement) return;

  // Set image
  if (achievement.image) {
    modalImg.src = achievement.image;
    modalImg.style.display = 'block';
    modalImg.parentElement.querySelector('.achievement-placeholder-img')?.remove();
  } else {
    modalImg.style.display = 'none';
    // Show placeholder in modal
    const wrap = modalImg.parentElement;
    const existing = wrap.querySelector('.achievement-placeholder-img');
    if (!existing) {
      const categoryMeta = {
        certificate: 'fa-certificate',
        course: 'fa-book',
        internship: 'fa-briefcase',
        achievement: 'fa-trophy'
      };
      const icon = categoryMeta[achievement.category] || 'fa-star';
      const placeholder = document.createElement('div');
      placeholder.className = 'achievement-placeholder-img';
      placeholder.style.minHeight = '250px';
      placeholder.innerHTML = `<i class="fa-solid ${icon} placeholder-icon" style="font-size:5rem;"></i>
        <span class="placeholder-label">Certificate image placeholder</span>`;
      wrap.appendChild(placeholder);
    }
  }

  // Set info
  const credentialHTML = achievement.credentialId
    ? `<div class="cert-modal-info-credential"><strong>Credential ID:</strong> ${achievement.credentialId}</div>`
    : '';

  const skillsHTML = achievement.skills.map(s => `<span>${s}</span>`).join('');

  modalInfo.innerHTML = `
    <h3 class="cert-modal-info-title">${achievement.title}</h3>
    <div class="cert-modal-info-org"><i class="fa-solid fa-building"></i> ${achievement.organization}</div>
    <div class="cert-modal-info-date"><i class="fa-solid fa-calendar"></i> ${achievement.date}</div>
    <p class="cert-modal-info-desc">${achievement.description}</p>
    ${credentialHTML}
    <div class="cert-modal-info-skills">${skillsHTML}</div>
  `;

  // Show modal
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Trigger animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('active');
      overlay.focus();
    });
  });
}
