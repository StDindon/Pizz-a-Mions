// ==========================================
// PIZZ'A MIONS - JAVASCRIPT ULTRA-CLEAN
// ==========================================

let currentLang = 'fr';

// ==========================================
// MULTILINGUE
// ==========================================

function changeLang(lang) {
    currentLang = lang;
    
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        const translation = el.getAttribute(`data-${lang}`);
        if (translation) {
            el.innerHTML = translation;
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const translation = link.getAttribute(`data-${lang}`);
        if (translation) link.setAttribute('data-text', translation);
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    localStorage.setItem('pizzamions-lang', lang);
}

// ==========================================
// NAVIGATION
// ==========================================

const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
let lastScroll = 0;

// Hide navbar on scroll
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('hide');
    } else if (currentScroll > lastScroll && currentScroll > 80) {
        navbar.classList.add('hide');
    } else if (currentScroll < lastScroll) {
        navbar.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
}, { passive: true });

// Mobile menu
menuToggle.addEventListener('click', () => {
    const isActive = menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
});

// Close menu
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.service-card, .contact-card, .contact-form-wrapper').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ==========================================
// MARQUEE
// ==========================================

const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    const clone = marqueeContent.cloneNode(true);
    marqueeContent.parentElement.appendChild(clone);
}

// ==========================================
// FORMULAIRE
// ==========================================

const contactForm = document.getElementById('contactForm');
const messageTextarea = document.getElementById('message');
const charCount = document.querySelector('.char-count');

if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', () => {
        const length = messageTextarea.value.length;
        charCount.textContent = `${length} / 500`;
        charCount.style.color = length > 500 ? '#C92A2A' : '';
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = messageTextarea.value;
        
        if (!name || !email || !message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        if (message.length > 500) {
            showNotification('Le message ne peut pas dépasser 500 caractères.', 'error');
            return;
        }
        
        console.log('Form submitted');
        showNotification('Votre message a été envoyé avec succès !', 'success');
        contactForm.reset();
        charCount.textContent = '0 / 500';
    });
}

// ==========================================
// SCROLL TO TOP
// ==========================================

document.querySelector('.logo-wrapper')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('pizzamions-lang') || 'fr';
    if (savedLang !== 'fr') changeLang(savedLang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => changeLang(btn.dataset.lang));
    });
    
    setTimeout(() => document.body.classList.add('loaded'), 100);
});