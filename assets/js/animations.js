/**
 * Modern Animation System for White Diamond Plaza
 * Clean, performant animations using CSS and vanilla JavaScript
 * No external dependencies - completely free!
 */

class AnimationController {
  constructor() {
    this.animations = new Map();
    this.init();
  }

  init() {
    this.initCSSAnimations();
    this.initScrollAnimations();
    this.initHoverEffects();
    this.initPageLoadAnimations();
    
    // Add CSS animation classes after DOM is ready
    setTimeout(() => {
      this.addAnimationClasses();
    }, 100);
  }

  initCSSAnimations() {
    // Add CSS animation classes to body
    document.body.classList.add('css-animations');
    
    // Add animation classes to elements
    setTimeout(() => {
      document.querySelectorAll('.animate-on-load').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('animate');
      });
    }, 100);
  }

  addAnimationClasses() {
    // Add CSS animation classes for page load animations
    const header = document.querySelector(".site-header");
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");
    const projectCards = document.querySelectorAll(".project-card");

    if (header) {
      header.classList.add('animate-fade-in-up');
    }
    
    if (heroContent) {
      heroContent.classList.add('animate-fade-in-right');
    }
    
    if (heroImage) {
      heroImage.classList.add('animate-fade-in-left');
    }
    
    projectCards.forEach((card, index) => {
      card.style.animationDelay = `${0.5 + (index * 0.1)}s`;
      card.classList.add('animate-fade-in-up');
    });
  }

  initScrollAnimations() {
    // CSS-based scroll animations using Intersection Observer
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

    // Observe scroll animation elements
    document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale').forEach(el => {
      observer.observe(el);
    });

    // Observe section elements for staggered animations
    this.observeSections();
  }

  observeSections() {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSectionElements(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    // Observe main sections
    const sections = ['#apartments', '#testimonials', '#contact'];
    sections.forEach(selector => {
      const section = document.querySelector(selector);
      if (section) {
        sectionObserver.observe(section);
      }
    });
  }

  animateSectionElements(section) {
    const sectionId = section.id;
    let elements = [];

    switch(sectionId) {
      case 'apartments':
        elements = section.querySelectorAll('.project-card');
        break;
      case 'testimonials':
        elements = section.querySelectorAll('.testimonial-card');
        break;
      case 'contact':
        elements = section.querySelectorAll('.contact-form-section, .contact-info');
        break;
    }

    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
      element.classList.add('animate-fade-in-up');
    });
  }

  initHoverEffects() {
    // Button hover effects using CSS transitions
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px) scale(1.05)';
        btn.style.transition = 'transform 0.3s ease';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Card hover effects
    document.querySelectorAll('.project-card, .card, .testimonial-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
      });
    });

    // Image hover effects
    document.querySelectorAll('.project-image img').forEach(img => {
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
        img.style.transition = 'transform 0.3s ease';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });
  }

  initPageLoadAnimations() {
    // Floating buttons animation using CSS
    const floatingBtns = document.querySelectorAll('.floating-btn');
    floatingBtns.forEach((btn, index) => {
      btn.style.animationDelay = `${1.5 + (index * 0.2)}s`;
      btn.classList.add('animate-fade-in-scale');
    });
  }

  // Smooth scrolling using native CSS
  initSmoothScrolling() {
    document.querySelectorAll('.nav-list a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('.site-header').offsetHeight;
          const offsetTop = targetElement.offsetTop - headerHeight - 20;
          
          // Use native smooth scrolling
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Navbar scroll effect
  initNavbarScroll() {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Counter animations
  initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + '+';
    }, 16);
  }

  // Cleanup method
  destroy() {
    this.animations.clear();
  }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.animationController = new AnimationController();
  
  // Initialize additional features
  window.animationController.initSmoothScrolling();
  window.animationController.initNavbarScroll();
  window.animationController.initCounterAnimations();
});

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.body.classList.add('reduced-animations');
}

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion');
}