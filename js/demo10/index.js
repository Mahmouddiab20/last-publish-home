// Import functionality moved inline to avoid ES6 modules

// Variable to store the Lenis smooth scrolling object
let lenis;

// ===== CTRL+R REDIRECT TO TOP FUNCTIONALITY (IMMEDIATE) =====
// Add this functionality immediately when script loads
let ctrlRHandled = false;

document.addEventListener('keydown', (e) => {
    // Check if Ctrl+R is pressed
    if (e.ctrlKey && (e.key === 'r' || e.key === 'R' || e.keyCode === 82)) {
        e.preventDefault(); // Prevent default browser refresh
        e.stopPropagation(); // Stop event bubbling
        e.stopImmediatePropagation(); // Stop all event handlers
        
        if (!ctrlRHandled) {
            ctrlRHandled = true;
            console.log('Ctrl+R pressed - redirecting to top immediately');
            
            // Multiple scroll methods for reliability
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            // Also try to scroll to top using Lenis if available
            setTimeout(() => {
                if (lenis) {
                    try {
                        lenis.scrollTo(0, { duration: 1.2 });
                    } catch (error) {
                        console.log('Lenis scroll failed, using standard scroll');
                    }
                }
                
                // Force scroll after delay
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    ctrlRHandled = false;
                }, 200);
            }, 100);
        }
        
        return false;
    }
}, { capture: true, passive: false });

// Selecting DOM elements

const contentElements = [...document.querySelectorAll('.content--sticky')];
const totalContentElements = contentElements.length;

// Initializes Lenis for smooth scrolling with specific properties
const initSmoothScrolling = () => {
	// Instantiate the Lenis object with specified properties
	lenis = new Lenis({
		lerp: 0.2, // Lower values create a smoother scroll effect
		smoothWheel: true // Enables smooth scrolling for mouse wheel events
	});

	// Update ScrollTrigger each time the user scrolls
	lenis.on('scroll', () => ScrollTrigger.update());

	// Define a function to run at each animation frame
	const scrollFn = (time) => {
		lenis.raf(time); // Run Lenis' requestAnimationFrame method
		requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
	};
	// Start the animation frame loop
	requestAnimationFrame(scrollFn);
};

// Function to handle scroll-triggered animations
const scroll = () => {

    contentElements.forEach((el, position) => {
        
		const isLast = position === totalContentElements-1;
		
        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: isLast ? 'top top' : 'bottom top',
                end: '+=100%',
                scrub: true
            }
        })
        .to(el, {
			ease: 'none',
            yPercent: -100
        }, 0);

    });

};

// Initialization function
const init = () => {
    initSmoothScrolling(); // Initialize Lenis for smooth scrolling
    scroll(); // Apply scroll-triggered animations
};

// ===== DESKTOP APARTMENT SLIDER FUNCTIONALITY =====

// Desktop Apartment Slider Class
class DesktopApartmentSlider {
    constructor() {
        this.slider = document.getElementById('desktopApartmentSlider');
        this.slides = document.querySelectorAll('#desktopApartmentSlider .slider-slide');
        this.prevBtn = document.getElementById('desktopPrevSlide');
        this.nextBtn = document.getElementById('desktopNextSlide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds
        this.imagesLoaded = new Set(); // Track loaded images
        
        if (this.slider) {
            // Store instance in DOM element for resize handling
            this.slider.sliderInstance = this;
            this.init();
        }
    }
    
    init() {
        console.log('Desktop slider initialized with', this.totalSlides, 'slides');
        
        // Preload all slider images
        this.preloadImages();
        
        // Initialize content visibility
        this.updateContentVisibility();
        
        // Add event listeners
        this.prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.prevBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.prevBtn.style.transform = 'scale(1)';
            }, 100);
            console.log('Desktop Previous button clicked');
            this.prevSlide();
        });
        
        this.nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.nextBtn.style.transform = 'scale(1)';
            }, 100);
            console.log('Desktop Next button clicked');
            this.nextSlide();
        });
        
        // Add touch/swipe support
        this.addTouchSupport();
        
        // Start auto-play
        this.startAutoPlay();
        
        // Pause auto-play on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    updateContentVisibility() {
        // Hide all content first
        const allContent = document.querySelectorAll('.desktop-slider-content-container .slider-content');
        allContent.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show current content
        const currentContent = document.querySelector(`.desktop-slider-content-container .slider-content[data-slide="${this.currentSlide}"]`);
        if (currentContent) {
            currentContent.classList.add('active');
        }
    }
    
    // Preload all slider images to prevent delays with priority
    preloadImages() {
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('.slider-img');
            if (img && img.src) {
                const imageLoader = new Image();
                imageLoader.loading = 'eager'; // Prioritize loading
                imageLoader.decoding = 'async'; // Async decoding for better performance
                imageLoader.onload = () => {
                    this.imagesLoaded.add(index);
                    console.log(`Desktop image ${index + 1} preloaded successfully`);
                };
                imageLoader.onerror = () => {
                    console.warn(`Failed to preload desktop image ${index + 1}: ${img.src}`);
                };
                imageLoader.src = img.src;
            }
        });
    }
    
    goToSlide(index, direction = 'next') {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Preload next and previous images for smoother experience
        this.preloadNextImages(index, direction);
        
        // Perform transition immediately
        this.performSlideTransition(index, direction);
    }
    
    // Preload next and previous images
    preloadNextImages(currentIndex, direction) {
        const nextIndex = (currentIndex + 1) % this.totalSlides;
        const prevIndex = (currentIndex - 1 + this.totalSlides) % this.totalSlides;
        
        // Preload images that will likely be needed next
        [nextIndex, prevIndex].forEach(index => {
            if (!this.imagesLoaded.has(index)) {
                const slide = this.slides[index];
                const img = slide.querySelector('.slider-img');
                if (img && img.src) {
                    const imageLoader = new Image();
                    imageLoader.loading = 'eager';
                    imageLoader.decoding = 'async';
                    imageLoader.onload = () => {
                        this.imagesLoaded.add(index);
                    };
                    imageLoader.onerror = () => {
                        console.warn(`Failed to preload image for slide ${index + 1}`);
                    };
                    imageLoader.src = img.src;
                }
            }
        });
    }
    
    performSlideTransition(index, direction) {
        const current = this.slides[this.currentSlide];
        const next = this.slides[index];
        
        // Remove active classes from slides
        current.classList.remove('active');
        
        // Remove active classes from content
        const currentContent = document.querySelector(`.desktop-slider-content-container .slider-content[data-slide="${this.currentSlide}"]`);
        if (currentContent) {
            currentContent.classList.remove('active');
        }
        
        // Add animation classes based on direction
        if (direction === 'next') {
            current.classList.add('slide-out');
        } else {
            current.classList.add('slide-out-right');
        }
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active classes to new slide
        next.classList.add('active');
        
        // Add slide-in animation based on direction
        if (direction === 'next') {
            next.classList.add('slide-in');
        } else {
            next.classList.add('slide-in-left');
        }
        
        // Listen for animation end instead of setTimeout
        const onAnimationEnd = () => {
            current.classList.remove('slide-out', 'slide-out-right');
            next.classList.remove('slide-in', 'slide-in-left');
            
            // Show content after animation completes
            const newContent = document.querySelector(`.desktop-slider-content-container .slider-content[data-slide="${this.currentSlide}"]`);
            if (newContent) {
                newContent.classList.add('active');
            }
            
            this.isAnimating = false;
            next.removeEventListener('animationend', onAnimationEnd);
        };
        
        next.addEventListener('animationend', onAnimationEnd);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex, 'next');
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex, 'prev');
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let isScrolling = false;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                isScrolling = true;
                e.preventDefault();
            }
        }, { passive: false });
        
        this.slider.addEventListener('touchend', (e) => {
            if (!startX || !startY || !isScrolling) return;
            
            const diffX = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            startX = 0;
            startY = 0;
            endX = 0;
            endY = 0;
            isScrolling = false;
        });
    }
}

// ===== MOBILE APARTMENT SLIDER FUNCTIONALITY =====

// Apartment Slider Class
class ApartmentSlider {
    constructor() {
        this.slider = document.getElementById('apartmentSlider');
        this.slides = document.querySelectorAll('#apartmentSlider .slider-slide');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds
        this.imagesLoaded = new Set(); // Track loaded images
        
        if (this.slider) {
            // Store instance in DOM element for resize handling
            this.slider.sliderInstance = this;
            this.init();
        }
    }
    
    init() {
        // Preload all slider images
        this.preloadImages();
        
        // Add event listeners with immediate visual feedback
        this.prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.prevBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.prevBtn.style.transform = 'scale(1)';
            }, 100);
            console.log('Previous button clicked - going left');
            this.prevSlide();
        });
        this.nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.nextBtn.style.transform = 'scale(1)';
            }, 100);
            console.log('Next button clicked - going right');
            this.nextSlide();
        });
        
        // Add touch/swipe support
        this.addTouchSupport();
        
        // Start auto-play
        this.startAutoPlay();
        
        // Pause auto-play on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    // Preload all slider images to prevent delays with priority
    preloadImages() {
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('.slider-img');
            if (img && img.src) {
                const imageLoader = new Image();
                imageLoader.loading = 'eager'; // Prioritize loading
                imageLoader.decoding = 'async'; // Async decoding for better performance
                imageLoader.onload = () => {
                    this.imagesLoaded.add(index);
                    console.log(`Image ${index + 1} preloaded successfully`);
                };
                imageLoader.onerror = () => {
                    console.warn(`Failed to preload image ${index + 1}: ${img.src}`);
                };
                imageLoader.src = img.src;
            }
        });
    }
    
    goToSlide(index, direction = 'next') {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Preload next and previous images for smoother experience
        this.preloadNextImages(index, direction);
        
        // Perform transition immediately
        this.performSlideTransition(index, direction);
    }
    
    // Preload next and previous images
    preloadNextImages(currentIndex, direction) {
        const nextIndex = (currentIndex + 1) % this.totalSlides;
        const prevIndex = (currentIndex - 1 + this.totalSlides) % this.totalSlides;
        
        // Preload images that will likely be needed next
        [nextIndex, prevIndex].forEach(index => {
            if (!this.imagesLoaded.has(index)) {
                const slide = this.slides[index];
                const img = slide.querySelector('.slider-img');
                if (img && img.src) {
                    const imageLoader = new Image();
                    imageLoader.loading = 'eager';
                    imageLoader.decoding = 'async';
                    imageLoader.onload = () => {
                        this.imagesLoaded.add(index);
                    };
                    imageLoader.onerror = () => {
                        console.warn(`Failed to preload image for slide ${index + 1}`);
                    };
                    imageLoader.src = img.src;
                }
            }
        });
    }
    
    performSlideTransition(index, direction) {
        const current = this.slides[this.currentSlide];
        const next = this.slides[index];
        
        // Remove active classes
        current.classList.remove('active');
        
        // Add animation classes based on direction
        if (direction === 'next') {
            current.classList.add('slide-out');
        } else {
            current.classList.add('slide-out-right');
        }
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active classes to new slide
        next.classList.add('active');
        
        // Add slide-in animation based on direction
        if (direction === 'next') {
            next.classList.add('slide-in');
        } else {
            next.classList.add('slide-in-left');
        }
        
        // Listen for animation end instead of setTimeout
        const onAnimationEnd = () => {
            current.classList.remove('slide-out', 'slide-out-right');
            next.classList.remove('slide-in', 'slide-in-left');
            this.isAnimating = false;
            next.removeEventListener('animationend', onAnimationEnd);
        };
        
        next.addEventListener('animationend', onAnimationEnd);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex, 'next');
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex, 'prev');
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let isScrolling = false;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Determine if it's a horizontal or vertical swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                isScrolling = true;
                e.preventDefault(); // Prevent vertical scroll
            }
        }, { passive: false });
        
        this.slider.addEventListener('touchend', (e) => {
            if (!startX || !startY || !isScrolling) return;
            
            const diffX = startX - endX;
            const threshold = 50; // Minimum swipe distance
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.prevSlide();
                }
            }
            
            // Reset values
            startX = 0;
            startY = 0;
            endX = 0;
            endY = 0;
            isScrolling = false;
        });
    }
}

// Initialize apartment slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // امنع المتصفح من تذكر مكان السكرول (الحل الأساسي لـ bfcache)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // إرجاع السكرول لأول الصفحة عند DOM Ready
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // إرجاع السكرول مع Lenis إذا كان متوفرًا (مع immediate: true لمنع الانيميشن)
    setTimeout(() => {
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, { immediate: true });
        }
    }, 50);

    // Initialize desktop slider for screens > 768px
    if (window.innerWidth > 768) {
        new DesktopApartmentSlider();
    }
    
    // Initialize mobile slider for screens <= 768px
    if (window.innerWidth <= 768) {
        new ApartmentSlider();
    }
    
    // Initialize Cards Slider
    initializeCardsSlider();
    
    // Additional check to ensure autoplay starts after page load
    setTimeout(() => {
        if (cardsSwiperInstance && !cardsSwiperInstance.autoplay.running) {
            cardsSwiperInstance.autoplay.start();
            console.log('Autoplay started after page load');
        }
    }, 1000);
});

// Re-initialize on window resize
window.addEventListener('resize', () => {
    // Clear existing sliders
    const existingDesktopSlider = document.querySelector('#desktopApartmentSlider');
    const existingMobileSlider = document.querySelector('#apartmentSlider');
    
    if (window.innerWidth > 768) {
        // Initialize desktop slider
        if (existingDesktopSlider && !existingDesktopSlider.sliderInstance) {
            existingDesktopSlider.sliderInstance = new DesktopApartmentSlider();
        }
    } else {
        // Initialize mobile slider
        if (existingMobileSlider && !existingMobileSlider.sliderInstance) {
            existingMobileSlider.sliderInstance = new ApartmentSlider();
        }
    }
    
    // Re-initialize cards slider on all screen sizes
    const swiperElement = document.querySelector('.mySwiper');
    if (swiperElement) {
        // Always re-initialize to ensure autoplay works after resize
        initializeCardsSlider();
    }
});

// ===== CARDS SLIDER FUNCTIONALITY =====

// Global variable to store Swiper instance
let cardsSwiperInstance = null;

function initializeCardsSlider() {
    // Check if Swiper is available
    if (typeof Swiper !== 'undefined') {
        // Destroy existing swiper instance if it exists
        if (cardsSwiperInstance) {
            try {
                cardsSwiperInstance.destroy(true, true);
                cardsSwiperInstance = null;
            } catch (e) {
                console.log('Error destroying existing swiper:', e);
            }
        }
        
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            try {
                cardsSwiperInstance = new Swiper('.mySwiper', {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    loop: true,
                    autoplay: {
                        delay: 1500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                        stopOnLastSlide: false,
                    },
                    speed: 800, // Faster transition speed
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        480: {
                            slidesPerView: 3,
                            spaceBetween: 15,
                        },
                        768: {
                            slidesPerView: 3,
                            slidesPerGroup: 1,
                            spaceBetween: 0,
                        },
                    },
                    on: {
                        init: function() {
                            console.log('Swiper initialized and autoplay started');
                            // Force start autoplay
                            this.autoplay.start();
                        },
                        autoplayStart: function() {
                            console.log('Autoplay started');
                        },
                        autoplayStop: function() {
                            console.log('Autoplay stopped - restarting in 2 seconds');
                            // Store reference to the swiper instance
                            const swiperInstance = this;
                            // Restart autoplay after 2 seconds if it stops
                            setTimeout(() => {
                                if (swiperInstance && swiperInstance.autoplay && !swiperInstance.autoplay.running) {
                                    swiperInstance.autoplay.start();
                                }
                            }, 2000);
                        }
                    }
                });
                
                // Force start autoplay immediately
                setTimeout(() => {
                    if (cardsSwiperInstance && !cardsSwiperInstance.autoplay.running) {
                        cardsSwiperInstance.autoplay.start();
                        console.log('Forced autoplay start');
                    }
                }, 500);
                
                // Add hover effects to cards
                const cards = document.querySelectorAll('.SingleCard');
                cards.forEach(card => {
                    card.addEventListener('mouseenter', function() {
                        this.style.transform = 'translateY(-10px) scale(1.02)';
                    });
                    
                    card.addEventListener('mouseleave', function() {
                        this.style.transform = 'translateY(0) scale(1)';
                    });
                });
                
                console.log('Cards Slider initialized successfully');
            } catch (error) {
                console.error('Error initializing swiper:', error);
                addFallbackCardsFunctionality();
            }
        }, 100);
    } else {
        console.warn('Swiper library not loaded. Cards slider will not work.');
        
        // Fallback: Add basic click functionality
        addFallbackCardsFunctionality();
    }
}

// Fallback functionality if Swiper is not available
function addFallbackCardsFunctionality() {
    const cards = document.querySelectorAll('.SingleCard');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // You can add more functionality here
            console.log('Card clicked:', this.querySelector('.SingleCard_cardTitle').textContent);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
    });
}

// ===== CTRL+R REDIRECT TO TOP FUNCTIONALITY =====

// Function to handle Ctrl+R key combination to redirect to top
const handleCtrlRRedirect = () => {
    document.addEventListener('keydown', (e) => {
        // Check if Ctrl+R is pressed
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault(); // Prevent default browser refresh
            
            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Also scroll to top using Lenis if available
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            }
            
            console.log('Ctrl+R pressed - redirecting to top');
        }
    });
};

// Use preloadImages from global scope
window.preloadImages('.content__img').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
    init();
    
    // إرجاع السكرول لأول الصفحة بعد التهيئة الكاملة مع Lenis
    setTimeout(() => {
        window.scrollTo(0, 0);
        if (lenis) {
            // استخدام immediate: true لمنع الانيميشن وإرجاع السكرول فوراً
            lenis.scrollTo(0, { immediate: true });
        }
        // إزالة overflow hidden بعد التأكد من إرجاع السكرول
        document.body.style.overflow = 'auto';
    }, 100);
    
    // Initialize Ctrl+R redirect functionality
    handleCtrlRRedirect();
});