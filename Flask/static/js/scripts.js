/*!
 * Enhanced LiverAI Scripts
 * Modern JavaScript for improved user experience
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeFormEnhancements();
    initializeAnimations();
    initializeProgressTracking();
    
    console.log('LiverAI application initialized successfully');
});

/**
 * Navigation Enhancement
 */
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(href);
                }
            }
        });
    });
    
    // Bootstrap ScrollSpy enhancement
    if (document.querySelector('#mainNav')) {
        const scrollSpy = new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }
    
    // Mobile menu auto-close
    const navbarToggler = document.querySelector('.navbar-toggler');
    const responsiveNavItems = document.querySelectorAll('#navbarNav .nav-link');
    
    responsiveNavItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(activeHref) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

/**
 * Scroll Effects and Animations
 */
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.feature-item, .service-card, .info-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-slide-up');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const sections = document.querySelectorAll('section, .hero-content, .about-content');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Form Enhancements
 */
function initializeFormEnhancements() {
    const predictionForm = document.querySelector('.prediction-form');
    const contactForm = document.querySelector('.contact-form');
    
    if (predictionForm) {
        enhancePredictionForm(predictionForm);
    }
    
    if (contactForm) {
        enhanceContactForm(contactForm);
    }
    
    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        addFormValidation(form);
    });
}

/**
 * Enhance prediction form with progress tracking and validation
 */
function enhancePredictionForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const submitButton = form.querySelector('.btn-predict');
    
    // Track form completion progress
    function updateProgress() {
        const totalFields = inputs.length;
        const filledFields = Array.from(inputs).filter(input => {
            return input.value.trim() !== '';
        }).length;
        
        const progress = (filledFields / totalFields) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            if (progress === 100) {
                progressText.textContent = 'All fields completed - Ready for prediction!';
                progressText.style.color = 'var(--success-color)';
            } else {
                progressText.textContent = `${Math.round(progress)}% completed - ${totalFields - filledFields} fields remaining`;
                progressText.style.color = 'var(--gray-600)';
            }
        }
        
        // Enable/disable submit button based on required fields
        const requiredFields = form.querySelectorAll('[required]');
        const requiredFilled = Array.from(requiredFields).every(field => field.value.trim() !== '');
        
        if (submitButton) {
            submitButton.disabled = !requiredFilled;
            submitButton.style.opacity = requiredFilled ? '1' : '0.6';
        }
    }
    
    // Add event listeners for progress tracking
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
    
    // Initial progress update
    updateProgress();
    
    // Form submission with loading state
    form.addEventListener('submit', function(e) {
        if (submitButton) {
            submitButton.classList.add('loading');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        }
        
        // Add a small delay to show loading state (remove in production)
        setTimeout(() => {
            // Form will submit normally
        }, 1000);
    });
    
    // Auto-save form data to localStorage
    const formId = 'liver-prediction-form';
    
    // Load saved data
    loadFormData(form, formId);
    
    // Save data on input
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            saveFormData(form, formId);
        });
    });
}

/**
 * Enhance contact form
 */
function enhanceContactForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (submitButton) {
            const originalText = submitButton.innerHTML;
            submitButton.classList.add('loading');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            
            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                submitButton.classList.remove('loading');
                submitButton.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
                submitButton.style.background = 'var(--success-color)';
                
                // Reset form
                form.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = '';
                }, 3000);
            }, 2000);
        }
    });
}

/**
 * Add form validation
 */
function addFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear validation state on input
            this.classList.remove('is-valid', 'is-invalid');
            const feedback = this.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.remove();
            }
        });
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            
            // Scroll to first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remove existing feedback
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    field.classList.remove('is-valid', 'is-invalid');
    
    // Required field validation
    if (required && value === '') {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Skip validation for empty non-required fields
    if (!required && value === '') {
        return true;
    }
    
    // Type-specific validation
    switch (type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'number':
            const num = parseFloat(value);
            if (isNaN(num)) {
                showFieldError(field, 'Please enter a valid number');
                return false;
            }
            
            // Check min/max constraints
            const min = field.getAttribute('min');
            const max = field.getAttribute('max');
            
            if (min !== null && num < parseFloat(min)) {
                showFieldError(field, `Value must be at least ${min}`);
                return false;
            }
            
            if (max !== null && num > parseFloat(max)) {
                showFieldError(field, `Value must be no more than ${max}`);
                return false;
            }
            break;
    }
    
    // Show success state
    field.classList.add('is-valid');
    return true;
}

/**
 * Show field validation error
 */
function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    feedback.style.display = 'block';
    feedback.style.color = 'var(--danger-color)';
    feedback.style.fontSize = 'var(--font-size-sm)';
    feedback.style.marginTop = 'var(--spacing-xs)';
    
    field.parentNode.appendChild(feedback);
}

/**
 * Save form data to localStorage
 */
function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(formId, JSON.stringify(data));
}

/**
 * Load form data from localStorage
 */
function loadFormData(form, formId) {
    const savedData = localStorage.getItem(formId);
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        } catch (e) {
            console.warn('Failed to load saved form data:', e);
        }
    }
}

/**
 * Initialize animations and interactive elements
 */
function initializeAnimations() {
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element, .floating-card');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.service-card, .feature-item, .info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Typing effect for hero title (optional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.dataset.typing === 'true') {
        typeWriter(heroTitle);
    }
}

/**
 * Typing effect for text elements
 */
function typeWriter(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid';
    
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        
        if (i >= text.length) {
            clearInterval(timer);
            element.style.borderRight = 'none';
        }
    }, 100);
}

/**
 * Progress tracking for form completion
 */
function initializeProgressTracking() {
    // Track user engagement
    let startTime = Date.now();
    let interactions = 0;
    
    document.addEventListener('click', () => interactions++);
    document.addEventListener('scroll', () => interactions++);
    
    // Send analytics on page unload (replace with actual analytics)
    window.addEventListener('beforeunload', () => {
        const timeSpent = Date.now() - startTime;
        console.log('User engagement:', {
            timeSpent: Math.round(timeSpent / 1000),
            interactions: interactions
        });
    });
}

/**
 * Utility functions
 */

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add optimized scroll listener
window.addEventListener('scroll', throttle(function() {
    // Optimized scroll handling
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, 16)); // ~60fps

// Newsletter form enhancement
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button');
            
            if (email) {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = 'var(--success-color)';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                    this.reset();
                }, 2000);
            }
        });
    }
});

// Add CSS classes for enhanced styling
const style = document.createElement('style');
style.textContent = `
    .scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .is-invalid {
        border-color: var(--danger-color) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .is-valid {
        border-color: var(--success-color) !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
    
    .loading {
        pointer-events: none;
        opacity: 0.8;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(style);

