// Theme switching functionality
const themeBtn = document.getElementById('theme-btn');
const body = document.body;
let isDarkMode = true;

// Check for saved theme preference or default to dark mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    isDarkMode = savedTheme === 'dark';
    updateTheme();
}

themeBtn.addEventListener('change', () => {
    isDarkMode = !isDarkMode;
    updateTheme();
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

function updateTheme() {
    if (isDarkMode) {
        body.removeAttribute('data-theme');
        themeBtn.checked = false;
    } else {
        body.setAttribute('data-theme', 'light');
        themeBtn.checked = true;
    }
}

// Navbar underline animation and active section detection
const navLinks = document.querySelectorAll('.nav-link');
const navUnderline = document.querySelector('.nav-underline');
const sections = document.querySelectorAll('.section');

// Initialize underline position
function updateUnderline() {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        const rect = activeLink.getBoundingClientRect();
        const navRect = document.querySelector('.navbar').getBoundingClientRect();
        
        // Check if we're on mobile (navbar is stacked vertically)
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, position underline below the active link
            navUnderline.style.width = `${rect.width}px`;
            navUnderline.style.left = `${rect.left - navRect.left}px`;
            navUnderline.style.top = `${rect.bottom - navRect.top + 5}px`; // Position below the link
            navUnderline.style.bottom = 'auto';
        } else {
            // On desktop, position underline at the bottom of navbar
            navUnderline.style.width = `${rect.width}px`;
            navUnderline.style.left = `${rect.left - navRect.left}px`;
            navUnderline.style.top = 'auto';
            navUnderline.style.bottom = '0';
        }
    } else {
        // No active link (we're in hero section), hide the underline
        navUnderline.style.width = '0';
    }
}

// Update active section based on scroll position
function updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    // Check if we're in the hero section (before any navigation sections)
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        if (scrollPosition < heroBottom) {
            // We're in the hero section, remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Hide the underline
            navUnderline.style.width = '0';
            return;
        }
    }
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to corresponding link
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`[data-section="${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
                updateUnderline();
            }
        }
    });
}

// No entrance animation needed - CSS handles it

// Update hero section scroll animation
function updateHeroScrollAnimation() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const heroTop = heroSection.offsetTop;
    
    // Calculate how far we've scrolled through the hero section (0 to 1)
    const scrollProgress = Math.min(Math.max((scrollY - heroTop) / heroHeight, 0), 1);
    
    // Get the name elements
    const firstName = document.querySelector('.first-name');
    const lastName = document.querySelector('.last-name');
    
    if (firstName && lastName) {
        // Check if initial entrance animation is complete (after 2.5 seconds total)
        const timeSinceLoad = Date.now() - (window.pageLoadTime || Date.now());
        const initialAnimationComplete = timeSinceLoad > 2500;
        
        // Debug logging
        console.log('Scroll Y:', scrollY, 'Hero Top:', heroTop, 'Hero Height:', heroHeight, 'Scroll Progress:', scrollProgress, 'Time since load:', timeSinceLoad, 'Initial animation complete:', initialAnimationComplete);
        
        if (initialAnimationComplete) {
            // Handle scroll-based exit animation
            if (scrollProgress > 0) {
                // Move first name further right (continuing its initial direction from left to center)
                const firstNameTransform = scrollProgress * 100; // From 0 to 100vw (right)
                firstName.style.setProperty('transform', `translateX(${firstNameTransform}vw)`, 'important');
                
                // Move last name further left (continuing its initial direction from right to center)
                const lastNameTransform = -(scrollProgress * 100); // From 0 to -100vw (left)
                lastName.style.setProperty('transform', `translateX(${lastNameTransform}vw)`, 'important');
                
                // Fade out opacity as we scroll
                const opacity = 1 - scrollProgress;
                firstName.style.setProperty('opacity', opacity, 'important');
                lastName.style.setProperty('opacity', opacity, 'important');
                
                console.log('Moving names - First name transform:', firstNameTransform, 'Last name transform:', lastNameTransform, 'Opacity:', opacity);
            } else {
                // When back at the top, reset names to center position
                firstName.style.setProperty('transform', 'translateX(0)', 'important');
                lastName.style.setProperty('transform', 'translateX(0)', 'important');
                firstName.style.setProperty('opacity', '1', 'important');
                lastName.style.setProperty('opacity', '1', 'important');
            }
        }
    }
}



// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const isContact = targetId === 'contact';
            if (isContact) {
                // Position contact section to match the visual layout exactly
                const sectionTop = targetSection.offsetTop;
                const navbarHeight = 80; // Account for fixed navbar
                const titleOffset = 80; // Match the scroll-margin-top used by other sections
                
                const targetTop = sectionTop - navbarHeight + titleOffset;
                
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            } else {
                const targetPosition = targetSection.offsetTop - 80; // Account for scroll-margin-top
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Update underline position on window resize
window.addEventListener('resize', () => {
    // Add a small delay to ensure layout has fully adjusted
    setTimeout(() => {
        updateUnderline();
        updateHeroScrollAnimation();
    }, 100);
});

// Handle orientation change on mobile devices
window.addEventListener('orientationchange', () => {
    // Add a longer delay for orientation changes
    setTimeout(() => {
        updateUnderline();
        updateHeroScrollAnimation();
    }, 300);
});

// Update active section and underline on scroll
window.addEventListener('scroll', () => {
    console.log('Scroll event triggered!');
    updateActiveSection();
    updateHeroScrollAnimation();
});

// Initialize EmailJS
(function() {
    emailjs.init("5qJ-qZdE_OSefij_X"); // You'll add your EmailJS public key here
})();

// Handle contact form submission
document.addEventListener('DOMContentLoaded', () => {
    // Set page load time for hero animation timing
    window.pageLoadTime = Date.now();
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Send email using EmailJS
            emailjs.send('service_luvoo37', 'template_crw12yb', formData)
                .then(function(response) {
                    // Success
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = 'var(--text-primary)';
                    submitBtn.style.color = 'var(--bg-primary)';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'transparent';
                        submitBtn.style.color = 'var(--text-primary)';
                        submitBtn.disabled = false;
                    }, 3000);
                }, function(error) {
                    // Error
                    submitBtn.textContent = 'Failed to Send';
                    submitBtn.style.background = '#ff4444';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'transparent';
                        submitBtn.style.color = 'var(--text-primary)';
                        submitBtn.disabled = false;
                    }, 3000);
                });
        });
    }
    
    // Prevent scroll restoration on page reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Don't scroll on page load - let the browser handle it naturally
    // This prevents the mismatch between reload and navigation
    
    updateActiveSection();
    updateUnderline();
    console.log('Page loaded, calling updateHeroScrollAnimation');
    updateHeroScrollAnimation();
});

// Add intersection observer for better performance
const observerOptions = {
    threshold: 0.5,
    rootMargin: '-50px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`[data-section="${sectionId}"]`);
            
            if (correspondingLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
                updateUnderline();
            }
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Simple section detection for navbar highlighting
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Only update if scrolling direction changed significantly
    if (Math.abs(scrollTop - lastScrollTop) > 50) {
        updateActiveSection();
        lastScrollTop = scrollTop;
    }
});



// Add smooth reveal animations for sections
const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, revealOptions);

// Observe all sections for reveal animation
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
});
