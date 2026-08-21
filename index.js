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

  // Toggle menu open/close
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
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
