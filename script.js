// ==========================================
// PIZZ'A MIONS - JAVASCRIPT COMPLET
// ==========================================

// Variables globales
let currentLang = 'fr';
const translations = {
    fr: {},
    en: {},
    it: {}
};

// ==========================================
// SYSTÈME MULTILINGUE
// ==========================================

// Initialiser les traductions au chargement
function initTranslations() {
    // Collecter toutes les traductions depuis les data-attributes
    document.querySelectorAll('[data-fr]').forEach(el => {
        const fr = el.getAttribute('data-fr');
        const en = el.getAttribute('data-en');
        const it = el.getAttribute('data-it');
        
        if (fr) translations.fr[el.textContent.trim()] = fr;
        if (en) translations.en[el.textContent.trim()] = en;
        if (it) translations.it[el.textContent.trim()] = it;
    });
}

// Changer la langue
function changeLang(lang) {
    currentLang = lang;
    
    // Mettre à jour tous les éléments avec data-lang
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        const translation = el.getAttribute(`data-${lang}`);
        if (translation) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });
    
    // Mettre à jour les data-text pour les effets hover
    document.querySelectorAll('.nav-link').forEach(link => {
        const translation = link.getAttribute(`data-${lang}`);
        if (translation) {
            link.setAttribute('data-text', translation);
        }
    });
    
    // Mettre à jour les boutons de langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Sauvegarder la préférence
    localStorage.setItem('pizzamions-lang', lang);
}

// Event listeners pour les boutons de langue
document.addEventListener('DOMContentLoaded', () => {
    initTranslations();
    
    // Charger la langue sauvegardée ou utiliser FR par défaut
    const savedLang = localStorage.getItem('pizzamions-lang') || 'fr';
    if (savedLang !== 'fr') {
        changeLang(savedLang);
    }
    
    // Ajouter les event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLang(lang);
        });
    });
});

// ==========================================
// NAVIGATION
// ==========================================

const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

let lastScroll = 0;

// Hide navbar on scroll down
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('hide');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('hide')) {
        navbar.classList.add('hide');
    } else if (currentScroll < lastScroll && navbar.classList.contains('hide')) {
        navbar.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observer tous les éléments qui doivent être animés
document.querySelectorAll('.service-card, .histoire-image, .histoire-text, .horaire-item, .contact-card, .contact-form-wrapper').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ==========================================
// MARQUEE ANIMATION
// ==========================================

const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    // Clone le contenu pour créer une boucle infinie
    const marqueeClone = marqueeContent.cloneNode(true);
    marqueeContent.parentElement.appendChild(marqueeClone);
}

// ==========================================
// FORMULAIRE DE CONTACT
// ==========================================

const contactForm = document.getElementById('contactForm');
const messageTextarea = document.getElementById('message');
const charCount = document.querySelector('.char-count');

// Compteur de caractères
if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', () => {
        const length = messageTextarea.value.length;
        charCount.textContent = `${length} / 500`;
        
        if (length > 500) {
            charCount.style.color = 'var(--color-rosso)';
        } else {
            charCount.style.color = '';
        }
    });
}

// Validation et soumission du formulaire
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupérer les valeurs
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: messageTextarea.value
        };
        
        // Validation
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        if (formData.message.length > 500) {
            showNotification('Le message ne peut pas dépasser 500 caractères.', 'error');
            return;
        }
        
        // Simuler l'envoi (à remplacer par votre vraie fonction d'envoi)
        console.log('Form submitted:', formData);
        
        // Afficher message de succès
        showNotification('Votre message a été envoyé avec succès !', 'success');
        
        // Réinitialiser le formulaire
        contactForm.reset();
        charCount.textContent = '0 / 500';
    });
}

// Validation email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification toast
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ==========================================
// CURSEUR PERSONNALISÉ
// ==========================================

const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'custom-cursor-follower';
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

// Suivre la position de la souris
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animer le curseur avec requestAnimationFrame
function animateCursor() {
    // Curseur principal (rapide)
    const cursorSpeed = 0.2;
    cursorX += (mouseX - cursorX) * cursorSpeed;
    cursorY += (mouseY - cursorY) * cursorSpeed;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    // Curseur suiveur (lent)
    const followerSpeed = 0.1;
    followerX += (mouseX - followerX) * followerSpeed;
    followerY += (mouseY - followerY) * followerSpeed;
    
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Agrandir le curseur sur les éléments interactifs
const interactiveElements = document.querySelectorAll('a, button, input, textarea, .service-card, .contact-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
    });
});

// Cacher le curseur personnalisé sur mobile
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
}

// ==========================================
// SCROLL TO TOP ON LOGO CLICK
// ==========================================

document.querySelector('.logo-wrapper').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// LAZY LOADING IMAGES
// ==========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// PERFORMANCES
// ==========================================

// Debounce function pour optimiser les events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimiser le resize
window.addEventListener('resize', debounce(() => {
    // Actions à effectuer lors du resize
    console.log('Window resized');
}, 250));

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c🍕 Pizz\'a Mions', 'font-size: 24px; font-weight: bold; color: #C92A2A;');
console.log('%cSite créé par LBS Digital', 'font-size: 14px; color: #218838;');
console.log('%chttps://lbsdigital.fr', 'font-size: 12px; color: #6B6B6B;');

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Pizz\'a Mions website loaded successfully!');
    
    // Ajouter la classe 'loaded' au body après un court délai
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});