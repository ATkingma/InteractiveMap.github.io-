// Landing page functionality

// Animated counter function with easing
function animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const startTime = performance.now();
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        let current = start + (target * easedProgress);
        
        // Format the number based on target value
        let displayValue;
        if (target >= 1000) {
            // For values like 5000, show as "5k"
            displayValue = Math.floor(current / 1000);
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = displayValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Final value
            let finalValue;
            if (target >= 1000) {
                finalValue = Math.floor(target / 1000);
            } else {
                finalValue = target;
            }
            element.textContent = finalValue + suffix;
            
            // Add final glow effect
            element.style.animation = 'counterGlow 0.5s ease-out';
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize counters with intersection observer
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const statsContainer = entry.target.closest('.hero-stats');
                const allCounters = statsContainer.querySelectorAll('.stat-number[data-target]');
                
                // Animate all counters in this container with staggered delays
                allCounters.forEach((counter, index) => {
                    if (!counter.classList.contains('animated')) {
                        const target = parseInt(counter.dataset.target);
                        const suffix = counter.dataset.suffix || '';
                        
                        // Mark as animated to prevent re-animation
                        counter.classList.add('animated');
                        
                        // Start the animation with staggered delay
                        setTimeout(() => {
                            animateCounter(counter, target, 2000, suffix);
                        }, index * 300); // 300ms delay between each counter
                    }
                });
                
                // Stop observing all counters in this container
                allCounters.forEach(counter => observer.unobserve(counter));
            }
        });
    }, observerOptions);
    
    // Start observing all counter elements
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Global functions for button clicks
function scrollToMaps() {
    document.getElementById('maps').scrollIntoView({
        behavior: 'smooth'
    });
}

// Map navigation function
function openMap(mapName) {
    window.location.href = `map-leaflet.html?map=${mapName}`;
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animated counters
    initializeCounters();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add click handlers to map cards
    const mapCards = document.querySelectorAll('.map-card');
    mapCards.forEach(card => {
        const mapName = card.dataset.map;
        
        // Add click handler to the entire card
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on play button
            if (!e.target.closest('.play-btn')) {
                openMap(mapName);
            }
        });
        
        // Add specific handler to play button
        const playBtn = card.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openMap(mapName);
            });
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks2 = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks2) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks2.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // "Get Started" button
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.addEventListener('click', function() {
            window.location.href = 'map-leaflet.html';
        });
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animateElements = document.querySelectorAll('.map-card, .feature-card, .hero-content, .hero-stats');
    animateElements.forEach(el => observer.observe(el));
});

// Test function for GDPR popup
function testGDPRPopup() {
    // Clear secure storage to force GDPR popup
    HashUtils.removeSecureStorage('gdpr_consent_given');
    HashUtils.removeSecureStorage('gdpr_consent');
    
    // Show the popup if the AdBlockerManager is available
    if (window.adBlockerManager) {
        window.adBlockerManager.showMandatoryGDPRPopup();
    } else {
        console.log('AdBlockerManager not available yet');
        // Wait a moment and try again
        setTimeout(() => {
            if (window.adBlockerManager) {
                window.adBlockerManager.showMandatoryGDPRPopup();
            }
        }, 1000);
    }
}
