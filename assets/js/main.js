(function () {
  const html = document.documentElement;
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const yearEl = document.getElementById('y');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  navToggle?.addEventListener('click', () => {
    const open = navMenu?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          navMenu?.classList.remove('open');
          navToggle?.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
})();

// Contact form (static demo)
function submitContactForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('formStatus');
  const formData = new FormData(form);
  const name = formData.get('name');
  status.textContent = 'تم إرسال رسالتك (عرض تجريبي). سنعود إليك قريبًا.';
  status.style.color = 'var(--ok)';
  form.reset();
  return false;
}

// Mortgage calculator
function calculateMortgage() {
  const price = Number(document.getElementById('price')?.value || 0);
  const years = Number(document.getElementById('years')?.value || 0);
  const rateYear = 0.05; // 5% fixed rate
  const n = Math.max(1, Math.round(years * 12));
  const r = rateYear / 12; // monthly rate

  let monthly = 0;
  if (r > 0) {
    const pow = Math.pow(1 + r, n);
    monthly = price * (r * pow) / (pow - 1);
  } else {
    monthly = price / n;
  }

  const nf = new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 });
  const monthlyEl = document.getElementById('monthlyPayment');
  if (monthlyEl) monthlyEl.textContent = nf.format(Math.round(monthly)) + ' ريال';
}

// Initialize calculator on first load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('mortgage')) {
    calculateMortgage();
  }
  
  // Initialize animations
  initScrollAnimations();
  initParticleEffect();
  initCounterAnimations();
  initVideoSection();
  
  // Fix glitch issues for desktop screens (768px+)
  if (window.innerWidth >= 768) {
    initDesktopGlitchFix();
  }
});

// Scroll-triggered animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe all elements with scroll animation classes
  document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale').forEach(el => {
    observer.observe(el);
  });
}

// Particle effect for hero section
function initParticleEffect() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and size
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 6000);
  }

  // Create particles periodically
  setInterval(createParticle, 300);
}

// Counter animations for stats
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.textContent);
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Enhanced form interactions
document.addEventListener('DOMContentLoaded', () => {
  // Add focus animations to form inputs
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });
});

// Add loading animation to buttons
function addLoadingAnimation(button) {
  const originalText = button.textContent;
  button.innerHTML = '<div class="loading-spinner"></div>';
  button.disabled = true;
  
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 2000);
}

// Enhanced contact form with loading animation
function submitContactForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitBtn = form.querySelector('button[type="submit"]');
  const status = document.getElementById('formStatus');
  
  // Add loading animation
  addLoadingAnimation(submitBtn);
  
  // Simulate form submission
  setTimeout(() => {
    const formData = new FormData(form);
    const name = formData.get('name');
    status.textContent = 'تم إرسال رسالتك (عرض تجريبي). سنعود إليك قريبًا.';
    status.style.color = 'var(--ok)';
    form.reset();
  }, 2000);
  
  return false;
}

// Video Section Initialization
function initVideoSection() {
  const video = document.getElementById('mainVideo');
  const playButton = document.getElementById('playButton');
  const muteButton = document.getElementById('muteButton');
  const fullscreenButton = document.getElementById('fullscreenButton');
  const videoContainer = document.querySelector('.video-container');
  
  if (!video) return;

  // Create loading spinner
  const loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'video-loading';
  loadingSpinner.innerHTML = '<div class="loading-spinner-large"></div>';
  videoContainer.appendChild(loadingSpinner);

  // Hide play button by default since video auto-plays
  playButton.style.display = 'none';
  
  // Don't try to play immediately - wait for user interaction or scroll
  // This prevents downloading the video until needed
  
  // Video startup sequence
  let startupSequenceStarted = false;
  
  function startVideoSequence() {
    if (startupSequenceStarted) return;
    startupSequenceStarted = true;
    
    // Add startup animation class
    video.classList.add('startup');
    
    // Add pulse effect to container
    videoContainer.classList.add('pulse');
    
    // Hide loading spinner after video starts
    setTimeout(() => {
      loadingSpinner.classList.add('hidden');
    }, 1000);
    
    // Remove pulse effect after startup
    setTimeout(() => {
      videoContainer.classList.remove('pulse');
    }, 3000);
    
    // Ensure video is playing
    video.play().catch(e => {
      console.log('Autoplay prevented, showing play button:', e);
      playButton.style.display = 'flex';
    });
  }

  // Video event listeners
  video.addEventListener('loadstart', () => {
    console.log('Video loading started');
  });

  video.addEventListener('loadeddata', () => {
    console.log('Video data loaded');
    video.classList.add('loaded');
    startVideoSequence();
    // Force play immediately
    video.play().catch(e => {
      console.log('Autoplay prevented on loadeddata:', e);
      playButton.style.display = 'flex';
    });
  });

  video.addEventListener('canplay', () => {
    console.log('Video can start playing');
    startVideoSequence();
    // Force play immediately
    video.play().catch(e => {
      console.log('Autoplay prevented on canplay:', e);
      playButton.style.display = 'flex';
    });
  });

  video.addEventListener('canplaythrough', () => {
    console.log('Video can play through');
    // Force play immediately
    video.play().catch(e => {
      console.log('Autoplay prevented on canplaythrough:', e);
      playButton.style.display = 'flex';
    });
  });

  video.addEventListener('error', (e) => {
    console.error('Video error:', e);
    loadingSpinner.innerHTML = '<p style="color: white;">خطأ في تحميل الفيديو - الملف كبير جداً</p>';
  });

  // Add timeout for large files
  const loadTimeout = setTimeout(() => {
    if (video.readyState < 3) {
      console.log('Video taking too long to load, showing fallback');
      loadingSpinner.innerHTML = `
        <div style="text-align: center; color: white;">
          <p>جاري تحميل الفيديو...</p>
          <p style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.8;">
            💡 نصيحة: قم بضغط الفيديو لتسريع التحميل
          </p>
        </div>
      `;
    }
  }, 3000);

  // Clear timeout when video loads
  video.addEventListener('loadeddata', () => {
    clearTimeout(loadTimeout);
  });

  // Play/Pause functionality
  playButton.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playButton.style.display = 'none';
    } else {
      video.pause();
      playButton.style.display = 'flex';
    }
  });

  // Mute/Unmute functionality
  muteButton.addEventListener('click', () => {
    video.muted = !video.muted;
    const icon = muteButton.querySelector('svg path');
    if (video.muted) {
      icon.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
    } else {
      icon.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
    }
  });

  // Fullscreen functionality
  fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Hide play button when video is playing
  video.addEventListener('play', () => {
    playButton.style.display = 'none';
  });

  video.addEventListener('pause', () => {
    playButton.style.display = 'flex';
  });

  // Handle video end (3 seconds only, no loop)
  video.addEventListener('ended', () => {
    console.log('Video ended after 3 seconds');
    // Hide video and show fallback content
    video.style.opacity = '0';
    setTimeout(() => {
      video.style.display = 'none';
      // Show fallback content
      const fallback = document.querySelector('.video-fallback');
      if (fallback) {
        fallback.style.display = 'flex';
      }
    }, 500);
  });

  // Countdown timer for video duration
  function startCountdown() {
    const timerCount = document.querySelector('.timer-count');
    if (!timerCount) return;
    
    let count = 3;
    timerCount.textContent = count;
    
    const countdown = setInterval(() => {
      count--;
      if (count > 0) {
        timerCount.textContent = count;
      } else {
        timerCount.textContent = '0';
        clearInterval(countdown);
        // Hide timer after countdown
        setTimeout(() => {
          const timer = document.querySelector('.video-timer');
          if (timer) {
            timer.style.opacity = '0';
            timer.style.transform = 'scale(0.8)';
          }
        }, 500);
      }
    }, 1000);
  }

  // Start countdown when video starts playing
  video.addEventListener('play', () => {
    startCountdown();
  });

  // Intersection Observer for video section - only load when in view
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Video is in view, load and play it
        if (video.readyState === 0) {
          // Video not loaded yet, load it
          video.load();
          video.play().catch(e => {
            console.log('Autoplay prevented:', e);
            playButton.style.display = 'flex';
          });
        } else if (video.paused && video.readyState >= 3) {
          // Video loaded, just play it
          video.play().catch(e => console.log('Autoplay prevented:', e));
        }
      } else {
        // Video is out of view, pause it
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, { threshold: 0.3 });

  videoObserver.observe(video);

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (videoContainer.contains(document.activeElement) || videoContainer.matches(':hover')) {
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;
        case 'KeyM':
          e.preventDefault();
          video.muted = !video.muted;
          break;
        case 'KeyF':
          e.preventDefault();
          if (!document.fullscreenElement) {
            videoContainer.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
      }
    }
  });
}

// ===== ANIMATED TEXT EFFECT =====
// Initialize animated text effects for hero-title, section h2, and page-section-title
function initAnimatedText() {
  // Check if anime.js is loaded
  if (typeof anime === 'undefined') {
    console.warn('Anime.js not loaded. Animated text effects will not work.');
    return;
  }

  // Function to wrap letters in spans and add animation structure
  function setupAnimatedText(element) {
    if (!element) return;
    
    // Store original text
    const originalText = element.textContent;
    
    // Create the animation structure
    element.innerHTML = `
      <span class="text-wrapper">
        <span class="line line1"></span>
        <span class="letters">${originalText}</span>
        <span class="line line2"></span>
      </span>
    `;
    
    // Wrap every letter in a span with better spacing for Arabic text
    const textWrapper = element.querySelector('.letters');
    if (textWrapper) {
      // For Arabic text, we need to handle letter spacing better
      const text = textWrapper.textContent;
      const letters = text.split('');
      const wrappedText = letters.map(letter => {
        if (letter.trim() === '') {
          return letter; // Keep spaces as they are
        }
        return `<span class='letter'>${letter}</span>`;
      }).join('');
      textWrapper.innerHTML = wrappedText;
    }
    
    return element;
  }

  // Function to start animation
  function startTextAnimation(element) {
    if (!element) return;
    
    // Reset any existing animations
    element.style.opacity = '1';
    
    // Create anime timeline
    const timeline = anime.timeline({
      loop: true,
      autoplay: true
    });
    
    timeline
      .add({
        targets: element.querySelectorAll('.letter'),
        scale: [0.3, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 600,
        delay: (el, i) => 70 * (i + 1)
      })
      .add({
        targets: element.querySelectorAll('.line'),
        scaleX: [0, 1],
        opacity: [0.5, 1],
        easing: "easeOutExpo",
        duration: 700,
        offset: '-=875',
        delay: (el, i, l) => 80 * (l - i)
      })
      .add({
        targets: element,
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }

  // Setup and animate hero-title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    setupAnimatedText(heroTitle);
    startTextAnimation(heroTitle);
  }

  // Setup and animate section h2 elements
  const sectionH2s = document.querySelectorAll('.section h2');
  sectionH2s.forEach((h2, index) => {
    setupAnimatedText(h2);
    // Stagger the animations
    setTimeout(() => {
      startTextAnimation(h2);
    }, index * 500);
  });

  // Setup and animate page-section-title
  const pageSectionTitle = document.querySelector('.page-section-title');
  if (pageSectionTitle) {
    setupAnimatedText(pageSectionTitle);
    startTextAnimation(pageSectionTitle);
  }
}

// Initialize animated text when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for anime.js to load if it's loaded via CDN
  setTimeout(() => {
    initAnimatedText();
  }, 100);
});

// ===== DESKTOP GLITCH FIX =====
// Fix glitch issues for desktop screens (768px+)
function initDesktopGlitchFix() {
  console.log('Initializing desktop glitch fix...');
  
  // Optimize ticker animations
  const tickers = document.querySelectorAll('.ticker-content');
  tickers.forEach(ticker => {
    ticker.style.willChange = 'transform';
    ticker.style.transform = 'translateZ(0)';
  });
  
  // Optimize sticky sections
  const stickySections = document.querySelectorAll('.content--sticky');
  stickySections.forEach(section => {
    section.style.willChange = 'transform';
    section.style.transform = 'translateZ(0)';
    section.style.backfaceVisibility = 'hidden';
  });
  
  // Pause ticker animations when not in view
  const tickerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const ticker = entry.target;
      if (entry.isIntersecting) {
        ticker.style.animationPlayState = 'running';
      } else {
        ticker.style.animationPlayState = 'paused';
      }
    });
  }, { threshold: 0.1 });
  
  // Observe ticker containers
  const tickerContainers = document.querySelectorAll('.ticker-container');
  tickerContainers.forEach(container => {
    tickerObserver.observe(container);
  });
  
  // Optimize scroll performance
  let ticking = false;
  function updateScrollElements() {
    // Add smooth transitions for section changes
    const sections = document.querySelectorAll('.content--sticky');
    sections.forEach(section => {
      section.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollElements);
      ticking = true;
    }
  });
  
  // Fix z-index issues
  const bg1 = document.querySelector('.content--sticky.bg-1');
  const bg2 = document.querySelector('.content--sticky.bg-2');
  const bg3 = document.querySelector('.content--sticky.bg-3');
  
  if (bg1) bg1.style.zIndex = '1';
  if (bg2) bg2.style.zIndex = '2';
  if (bg3) bg3.style.zIndex = '3';
  
  console.log('Desktop glitch fix initialized successfully');
}