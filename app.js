// Muhammad Inshal's Professional CS & Security Portfolio logic (app.js)

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Dark Mode / Light Mode Toggle Engine
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const mainNav = document.getElementById('main-nav');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Theme Settings
  const currentTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply saved theme or system preference
  if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }

  // Toggle Theme Click Listener
  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark')) {
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  });


  // ==========================================
  // 2. Active Navigation Scroll Highlighter
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    let scrollPos = window.scrollY || window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  const updateNavElevation = () => {
    if (!mainNav) return;
    mainNav.classList.toggle('scrolled', window.scrollY > 12);
  };

  updateNavElevation();
  window.addEventListener('scroll', updateNavElevation, { passive: true });


  // ==========================================
  // 3. Hero Text Typing Animation
  // ==========================================
  const typingSubEl = document.getElementById('hero-subtitle');
  const phrasingIndex = [
    'BS Computer Science Student @ NUTECH',
    'Certified Ethical Hacker (CEH)',
    'Penetration Tester & Full-Stack Developer'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 90;

  const typeHeroSubtitle = () => {
    const fullText = phrasingIndex[phraseIdx];
    
    if (isDeleting) {
      typingSubEl.textContent = fullText.substring(0, charIdx - 1);
      charIdx--;
      speed = 40;
    } else {
      typingSubEl.textContent = fullText.substring(0, charIdx + 1);
      charIdx++;
      speed = 80;
    }

    if (!isDeleting && charIdx === fullText.length) {
      isDeleting = true;
      speed = 2200;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrasingIndex.length;
      speed = 400;
    }

    setTimeout(typeHeroSubtitle, speed);
  };

  if (prefersReducedMotion) {
    typingSubEl.textContent = phrasingIndex[0];
  } else {
    typeHeroSubtitle();
  }


  // ==========================================
  // 4. Skills Section Progress Bar Animation
  // ==========================================
  const skillSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.progress-fill');

  const triggerProgressFills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach((bar, i) => {
          // Stagger each bar by 100ms
          setTimeout(() => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
          }, i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  };

  const skillObserver = new IntersectionObserver(triggerProgressFills, {
    threshold: 0.15
  });

  if (skillSection) {
    skillObserver.observe(skillSection);
  }


  // ==========================================
  // 5. Projects Showcase Category Filter
  // ==========================================
  const filterAll = document.getElementById('filter-all');
  const filterSec = document.getElementById('filter-sec');
  const filterDev = document.getElementById('filter-dev');
  const projectCards = document.querySelectorAll('[data-category]');

  const applyCategoryFilter = (activeBtn, filterCategory) => {
    [filterAll, filterSec, filterDev].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      card.style.opacity = '0';
      card.style.transform = 'perspective(1000px) scale(0.95) rotateX(3deg)';
      
      setTimeout(() => {
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'perspective(1000px) scale(1) rotateX(0deg)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      }, 200);
    });
  };

  if (filterAll) filterAll.addEventListener('click', () => applyCategoryFilter(filterAll, 'all'));
  if (filterSec) filterSec.addEventListener('click', () => applyCategoryFilter(filterSec, 'sec'));
  if (filterDev) filterDev.addEventListener('click', () => applyCategoryFilter(filterDev, 'dev'));


  // ==========================================
  // 6. Corporate Contact Form Submission
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      const initialBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Sending Message...</span>
      `;

      formFeedback.classList.add('hidden');

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = initialBtnText;

        formFeedback.classList.remove('hidden');
        formFeedback.className = 'text-sm p-3.5 rounded border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 font-medium';
        formFeedback.textContent = 'Message sent! Thank you. I will reply to your inquiry shortly.';
        
        contactForm.reset();

        setTimeout(() => {
          formFeedback.classList.add('hidden');
        }, 6000);

      }, 1500);
    });
  }


  // ==========================================
  // 7. 3D Interactive Tilt Effect Engine
  //    Applies premium parallax tilt to cards
  //    and profile photo on mouse hover.
  // ==========================================
  if (!prefersReducedMotion) {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    const profileContainer = document.getElementById('hero-profile-container');

    const applyTilt = (el, maxTilt = 8, glareStrength = 0.08) => {
      let bounds;
      let isHovered = false;
      let animFrame;

      const onMouseEnter = () => {
        bounds = el.getBoundingClientRect();
        isHovered = true;
        el.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease';
      };

      const onMouseMove = (e) => {
        if (!isHovered) return;
        if (animFrame) cancelAnimationFrame(animFrame);

        animFrame = requestAnimationFrame(() => {
          const mouseX = e.clientX - bounds.left;
          const mouseY = e.clientY - bounds.top;
          const centerX = bounds.width / 2;
          const centerY = bounds.height / 2;

          // Calculate rotation: tilt toward the mouse
          const rotateX = ((mouseY - centerY) / centerY) * -maxTilt;
          const rotateY = ((mouseX - centerX) / centerX) * maxTilt;

          // Dynamic shadow that shifts opposite to tilt direction
          const shadowX = -rotateY * 1.5;
          const shadowY = rotateX * 1.5;

          el.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
          el.style.boxShadow = `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 30px rgba(37, 99, 235, ${glareStrength}), 0 14px 34px rgba(15, 23, 42, 0.10)`;
        });
      };

      const onMouseLeave = () => {
        isHovered = false;
        if (animFrame) cancelAnimationFrame(animFrame);
        el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease';
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        el.style.boxShadow = '';
      };

      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mousemove', onMouseMove);
      el.addEventListener('mouseleave', onMouseLeave);
    };

    // Apply tilt to all [data-tilt] cards
    tiltElements.forEach(el => applyTilt(el, 6, 0.06));

    // Apply stronger tilt to profile photo
    if (profileContainer) {
      applyTilt(profileContainer, 12, 0.12);
    }
  }


  // ==========================================
  // 8. Scroll-Triggered Entrance Animations
  //    Elements fade + slide in when they
  //    enter the viewport for the first time.
  // ==========================================
  if (!prefersReducedMotion) {
    const animateOnScrollTargets = document.querySelectorAll(
      '.corporate-card, .timeline-item, .progress-container, .badge-verified, .profile-frame, .hero-stat, section > div'
    );

    // Set initial hidden state
    animateOnScrollTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 6) * 0.07}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 6) * 0.07}s`;
    });

    const revealOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealOnScroll.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    animateOnScrollTargets.forEach(el => revealOnScroll.observe(el));
  }


});
