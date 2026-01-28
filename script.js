// ==========================================
// CONFIGURATION & UTILS
// ==========================================

const CONFIG = {
    MOBILE_BREAKPOINT: 768,
    SCROLL_THRESHOLD: 100,
    ANIMATION_DURATION: 400
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const isMobile = () => window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;

// ==========================================
// NAVIGATION
// ==========================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupActiveLinks();
    }
    
    setupMobileMenu() {
        this.menuToggle?.addEventListener('click', () => {
            const isActive = this.menuToggle.classList.toggle('active');
            this.navMenu?.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMobile()) {
                    this.menuToggle?.classList.remove('active');
                    this.navMenu?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Hide/show navbar on scroll
        if (currentScrollY > CONFIG.SCROLL_THRESHOLD) {
            if (currentScrollY > this.lastScrollY && !this.navMenu?.classList.contains('active')) {
                this.navbar?.classList.add('hide');
            } else {
                this.navbar?.classList.remove('hide');
            }
        } else {
            this.navbar?.classList.remove('hide');
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-100px 0px -100px 0px'
            }
        );
        
        sections.forEach(section => observer.observe(section));
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .horaire-item, .contact-card');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    }
}

// ==========================================
// HERO INTERACTIONS
// ==========================================

class HeroInteractions {
    constructor() {
        this.heroScroll = document.querySelector('.hero-scroll');
        this.init();
    }
    
    init() {
        this.heroScroll?.addEventListener('click', () => {
            const servicesSection = document.getElementById('services');
            servicesSection?.scrollIntoView({ behavior: 'smooth' });
        });
        
        this.setupParallax();
    }
    
    setupParallax() {
        const shapes = document.querySelectorAll('.hero-shapes .shape');
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    shapes.forEach((shape, index) => {
                        const speed = 0.5 + (index * 0.2);
                        const yPos = -(scrolled * speed);
                        shape.style.transform = `translateY(${yPos}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// ==========================================
// CONTACT FORM
// ==========================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.messageInput = document.getElementById('message');
        this.charCount = document.querySelector('.char-count');
        this.phoneInput = document.getElementById('phone');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupCharCounter();
        this.setupPhoneFormatting();
        this.setupFormSubmission();
    }
    
    setupCharCounter() {
        this.messageInput?.addEventListener('input', (e) => {
            const currentLength = e.target.value.length;
            const maxLength = 500;
            
            if (this.charCount) {
                this.charCount.textContent = `${currentLength} / ${maxLength}`;
                this.charCount.style.color = currentLength > maxLength ? '#D45B3E' : '#6B6B6B';
            }
        });
    }
    
    setupPhoneFormatting() {
        this.phoneInput?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            if (value.length >= 2) {
                value = value.match(/.{1,2}/g).join(' ');
            }
            
            e.target.value = value;
        });
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Validation
            if (!this.validateForm(data)) return;
            
            // Simulate submission
            await this.submitForm(data);
        });
    }
    
    validateForm(data) {
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Veuillez entrer une adresse email valide', 'error');
            return false;
        }
        
        if (data.message.length > 500) {
            this.showNotification('Le message ne doit pas dépasser 500 caractères', 'error');
            return false;
        }
        
        return true;
    }
    
    async submitForm(data) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.querySelector('span').textContent;
        
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.querySelector('span').textContent = 'Envoi...';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.showNotification('Message envoyé avec succès ! Nous vous répondrons sous 24h.', 'success');
        this.form.reset();
        
        if (this.charCount) {
            this.charCount.textContent = '0 / 500';
        }
        
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        submitButton.querySelector('span').textContent = originalText;
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '120px',
            right: '40px',
            background: type === 'success' ? '#3D5A3C' : '#D45B3E',
            color: 'white',
            padding: '20px 30px',
            border: '3px solid #1A1A1A',
            boxShadow: '6px 6px 0px #1A1A1A',
            zIndex: '10000',
            maxWidth: '400px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        });
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(500px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(500px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ==========================================
// SMOOTH SCROLL
// ==========================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ==========================================
// CURSOR EFFECTS (Desktop only)
// ==========================================

class CursorEffects {
    constructor() {
        if (isMobile()) return;
        
        this.cursor = this.createCursor();
        this.cursorDot = this.createCursorDot();
        this.init();
    }
    
    createCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        Object.assign(cursor.style, {
            width: '40px',
            height: '40px',
            border: '2px solid #D45B3E',
            borderRadius: '50%',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: '9998',
            transition: 'transform 0.15s ease, opacity 0.15s ease',
            opacity: '0'
        });
        document.body.appendChild(cursor);
        return cursor;
    }
    
    createCursorDot() {
        const dot = document.createElement('div');
        dot.className = 'custom-cursor-dot';
        Object.assign(dot.style, {
            width: '8px',
            height: '8px',
            background: '#D45B3E',
            borderRadius: '50%',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: '9999',
            transition: 'transform 0.05s ease'
        });
        document.body.appendChild(dot);
        return dot;
    }
    
    init() {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.cursorDot.style.left = `${mouseX - 4}px`;
            this.cursorDot.style.top = `${mouseY - 4}px`;
            this.cursor.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
        
        // Animate cursor
        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            this.cursor.style.left = `${cursorX - 20}px`;
            this.cursor.style.top = `${cursorY - 20}px`;
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .contact-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursor.style.borderColor = '#3D5A3C';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.borderColor = '#D45B3E';
            });
        });
    }
}

// ==========================================
// MARQUEE DUPLICATION
// ==========================================

class Marquee {
    constructor() {
        this.marqueeContent = document.querySelector('.marquee-content');
        this.init();
    }
    
    init() {
        if (!this.marqueeContent) return;
        
        // Clone content to create seamless loop
        const clone = this.marqueeContent.cloneNode(true);
        this.marqueeContent.parentElement?.appendChild(clone);
    }
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Optimize scroll events
        this.optimizeScrollEvents();
        
        // Reduce animations on low-end devices
        this.checkPerformance();
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    optimizeScrollEvents() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                // Scroll-dependent operations here
            });
        }, { passive: true });
    }
    
    checkPerformance() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.classList.add('reduce-motion');
        }
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        // Initialize all components
        new Navigation();
        new ScrollAnimations();
        new HeroInteractions();
        new ContactForm();
        new SmoothScroll();
        new CursorEffects();
        new Marquee();
        new PerformanceOptimizer();
        
        // Log initialization
        console.log('%c🍕 Pizz\'a Mions', 'color: #D45B3E; font-size: 24px; font-weight: bold; font-family: Bebas Neue;');
        console.log('%cSite créé par LBS Digital', 'color: #6B6B6B; font-size: 14px; font-family: DM Sans;');
        console.log('%c🔗 https://lbsdigital.fr', 'color: #3D5A3C; font-size: 12px; font-family: DM Sans;');
        
        // Add loaded class to body
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }
}

// Start the app
new App();