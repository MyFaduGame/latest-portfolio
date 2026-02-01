/* script.js - Global JavaScript utilities for all pages */

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Common initialization for all pages
    initializeNavigation();
    initializeAnimations();
    initializeTheme();
});

// Navigation active state management
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mobile navigation toggle (if needed)
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            const navLinksContainer = document.querySelector('.nav-links');
            navLinksContainer.classList.toggle('mobile-active');
        });
    }
}

// Initialize scroll animations
function initializeAnimations() {
    // Lazy load animation for elements
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.getAttribute('data-animate') || 'fadeInUp';
                    element.style.animation = `${animation} 0.6s ease forwards`;
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            observer.observe(element);
        });
    }
}

// Theme management (for future dark/light mode toggle)
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcon(isLight);
        });
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            updateThemeIcon(true);
        }
    }
}

function updateThemeIcon(isLight) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = isLight ? '🌙' : '☀️';
    }
}

// Utility function for smooth scrolling to anchors
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const offset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Debounce utility for performance optimization
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

// Throttle utility for scroll events
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

// Copy to clipboard utility
function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
        return true;
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    });
}

// Format date utility
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Sanitize HTML utility
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Performance measurement utility
function measurePerformance(name, callback) {
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(`${name}-start`);
        const result = callback();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measures = performance.getEntriesByName(name);
        console.log(`${name} took ${measures[0].duration.toFixed(2)}ms`);
        return result;
    }
    return callback();
}

// Error handling wrapper
function withErrorHandling(fn, fallback = null) {
    return function(...args) {
        try {
            return fn(...args);
        } catch (error) {
            console.error('Error in function:', fn.name, error);
            if (typeof fallback === 'function') {
                return fallback(...args);
            }
            return fallback;
        }
    };
}