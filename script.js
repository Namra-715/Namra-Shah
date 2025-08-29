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
    }
}

// Update active section based on scroll position
function updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
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
    setTimeout(updateUnderline, 100);
});

// Handle orientation change on mobile devices
window.addEventListener('orientationchange', () => {
    // Add a longer delay for orientation changes
    setTimeout(updateUnderline, 300);
});

// Update active section and underline on scroll
window.addEventListener('scroll', () => {
    updateActiveSection();
});

// Initialize EmailJS
(function() {
    emailjs.init("5qJ-qZdE_OSefij_X"); // You'll add your EmailJS public key here
})();

// Handle contact form submission
document.addEventListener('DOMContentLoaded', () => {
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
