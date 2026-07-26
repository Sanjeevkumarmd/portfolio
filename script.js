// Interactive & Dynamic Features for Portfolio Website
document.addEventListener('DOMContentLoaded', () => {
  
  // Haptic feedback function for mobile/touch devices
  const triggerHaptic = (pattern = [15]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Fallback for non-supported browsers
      }
    }
  };

  // 1. 3-Second Handwritten Cursive Tap Animation for Top Left Header Name
  const navLogo = document.getElementById('nav-logo');
  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      triggerHaptic([15]);
      navLogo.classList.remove('handwritten-active');
      void navLogo.offsetWidth; // Force reflow
      navLogo.classList.add('handwritten-active');
      
      setTimeout(() => {
        navLogo.classList.remove('handwritten-active');
      }, 3000);
    });
  }

  // 2. Ultra-Clear & Transparent Water Drop Theme Transition (Default: Dark Mode)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  let currentTheme = localStorage.getItem('theme-mode') || 'dark';

  const applyTheme = (theme) => {
    let effectiveTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', effectiveTheme);

    if (themeIcon) {
      themeIcon.classList.remove('theme-icon-anim');
      void themeIcon.offsetWidth;
      themeIcon.classList.add('theme-icon-anim');

      if (effectiveTheme === 'dark') {
        themeIcon.className = 'fas fa-moon theme-icon-anim';
        if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Theme: Dark (Click for Light)');
      } else {
        themeIcon.className = 'fas fa-sun theme-icon-anim';
        if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Theme: Light (Click for Dark)');
      }
    }
  };

  applyTheme(currentTheme);

  // Clear & Transparent Water Drop Ring Expanding from Icon Center
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      triggerHaptic([12]);

      const rect = themeToggleBtn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      const corners = [
        { x: 0, y: 0 },
        { x: window.innerWidth, y: 0 },
        { x: 0, y: window.innerHeight },
        { x: window.innerWidth, y: window.innerHeight }
      ];
      
      let maxDist = 0;
      corners.forEach(corner => {
        const dist = Math.hypot(corner.x - originX, corner.y - originY);
        if (dist > maxDist) maxDist = dist;
      });

      const ringDiameter = maxDist * 2.25;
      const nextTheme = (currentTheme === 'dark') ? 'light' : 'dark';

      // Transparent Water Ring Element
      const waterRing = document.createElement('div');
      waterRing.className = 'water-drop-ring';
      waterRing.style.left = `${originX}px`;
      waterRing.style.top = `${originY}px`;
      waterRing.style.width = `${ringDiameter}px`;
      waterRing.style.height = `${ringDiameter}px`;

      document.body.appendChild(waterRing);

      void waterRing.offsetWidth;
      waterRing.classList.add('expanding');

      setTimeout(() => {
        currentTheme = nextTheme;
        localStorage.setItem('theme-mode', currentTheme);
        applyTheme(currentTheme);
      }, 300);

      setTimeout(() => {
        waterRing.style.opacity = '0';
        setTimeout(() => {
          if (waterRing.parentNode) waterRing.parentNode.removeChild(waterRing);
        }, 350);
      }, 750);
    });
  }

  // 3. 60fps Throttled Top Navbar Scroll & Scroll-Spy Handler
  const navbar = document.getElementById('navbar');
  let isScrollTicking = false;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-Spy Active Nav Link Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }

    isScrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(handleScroll);
      isScrollTicking = true;
    }
  }, { passive: true });

  // 4. Floating Back to Top Button Popup & Smooth Scroll
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      triggerHaptic([15]);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinksList = document.querySelectorAll('.nav-links a');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      triggerHaptic([15]);
      navbar.classList.toggle('mobile-active');
      const icon = navToggle.querySelector('i');
      if (navbar.classList.contains('mobile-active')) {
        icon.className = 'fas fa-xmark';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    navLinksList.forEach(link => {
      link.addEventListener('click', () => {
        triggerHaptic([12]);
        navbar.classList.remove('mobile-active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // 6. Smooth Typewriter Effect for Hero Section
  const typedElement = document.getElementById('typed-text');
  if (typedElement) {
    const words = JSON.parse(typedElement.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typedElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
      }

      setTimeout(typeEffect, typeSpeed);
    };

    typeEffect();
  }

  // 7. Scroll-Triggered Reveal Animations using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale, .reveal-up, .reveal-center-expand');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 8. Skill Pill Tap Unique Animations & Haptic Vibration
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      triggerHaptic([18]);
      const animType = pill.getAttribute('data-anim') || 'blink';
      const animClass = `anim-${animType}`;
      pill.classList.remove(animClass);
      void pill.offsetWidth;
      pill.classList.add(animClass);
      setTimeout(() => {
        pill.classList.remove(animClass);
      }, 700);
    });
  });

  // 9. Project Category Filtering Logic with Pill Border Highlight
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      triggerHaptic([15]);
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        card.classList.remove('revealed-filter');
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          void card.offsetWidth;
          card.classList.add('revealed-filter');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 10. PDF Quick Preview Modal (Light Paper Mode Default)
  const pdfModal = document.getElementById('pdf-modal');
  const pdfIframe = document.getElementById('pdf-modal-iframe');
  const pdfTitle = document.getElementById('pdf-modal-title');
  const pdfOpenTab = document.getElementById('pdf-modal-opentab-btn');
  const pdfDownload = document.getElementById('pdf-modal-download-btn');
  const pdfClose = document.getElementById('pdf-modal-close');
  const pdfThemeToggle = document.getElementById('pdf-modal-theme-toggle');
  const pdfThemeIcon = document.getElementById('pdf-theme-icon');
  const pdfThemeLabel = document.getElementById('pdf-theme-label');
  const pdfModalBody = pdfModal ? pdfModal.querySelector('.pdf-modal-body') : null;

  let isPdfDarkMode = false;

  const updatePdfThemeUI = () => {
    if (!pdfModalBody) return;
    if (isPdfDarkMode) {
      pdfModalBody.classList.add('pdf-dark-mode');
      if (pdfThemeIcon) pdfThemeIcon.className = 'fas fa-sun';
      if (pdfThemeLabel) pdfThemeLabel.textContent = 'Light Mode';
    } else {
      pdfModalBody.classList.remove('pdf-dark-mode');
      if (pdfThemeIcon) pdfThemeIcon.className = 'fas fa-moon';
      if (pdfThemeLabel) pdfThemeLabel.textContent = 'Dark Mode';
    }
  };

  const openPdfModal = (pdfUrl, titleText) => {
    triggerHaptic([20]);
    if (pdfIframe) pdfIframe.src = pdfUrl;
    if (pdfTitle) pdfTitle.innerHTML = `<i class="fas fa-file-pdf pdf-pulse-icon"></i> ${titleText}`;
    if (pdfOpenTab) pdfOpenTab.href = pdfUrl;
    if (pdfDownload) {
      pdfDownload.href = pdfUrl;
      pdfDownload.setAttribute('download', pdfUrl.split('/').pop());
    }

    isPdfDarkMode = false;
    updatePdfThemeUI();

    if (pdfModal) {
      pdfModal.classList.add('active');
      pdfModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closePdfModal = () => {
    triggerHaptic([12]);
    if (pdfModal) {
      pdfModal.classList.remove('active');
      pdfModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
    }
    if (pdfIframe) pdfIframe.src = '';
  };

  document.querySelectorAll('.btn-preview-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfUrl = btn.getAttribute('data-pdf');
      const pdfTitleText = btn.getAttribute('data-title') || 'Document Preview';
      openPdfModal(pdfUrl, pdfTitleText);
    });
  });

  if (pdfThemeToggle) {
    pdfThemeToggle.addEventListener('click', () => {
      triggerHaptic([15]);
      isPdfDarkMode = !isPdfDarkMode;
      updatePdfThemeUI();
    });
  }

  if (pdfClose) pdfClose.addEventListener('click', closePdfModal);

  if (pdfModal) {
    pdfModal.addEventListener('click', (e) => {
      if (e.target === pdfModal) closePdfModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('active')) {
      closePdfModal();
    }
  });

  // 11. Contact Info Clipboard Copy Helper
  const copyToClipboard = (text, iconElement, originalClass) => {
    triggerHaptic([20, 50, 20]);
    navigator.clipboard.writeText(text).then(() => {
      iconElement.className = 'fas fa-check';
      iconElement.style.color = 'var(--accent-emerald)';
      setTimeout(() => {
        iconElement.className = originalClass;
        iconElement.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailIcon = document.getElementById('email-copy-icon');
  if (copyEmailBtn && emailIcon) {
    copyEmailBtn.addEventListener('click', () => {
      copyToClipboard('mail.to.sanjeev.m.d@gmail.com', emailIcon, 'far fa-copy');
    });
  }

  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  const phoneIcon = document.getElementById('phone-copy-icon');
  if (copyPhoneBtn && phoneIcon) {
    copyPhoneBtn.addEventListener('click', () => {
      copyToClipboard('+917676441765', phoneIcon, 'far fa-copy');
    });
  }

});
