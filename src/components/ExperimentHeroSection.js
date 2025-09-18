import React, { useEffect, useRef } from 'react';

const ExperimentHeroSection = ({ theme, onBack }) => {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  useEffect(() => {
    // Set page load time for animation timing (exactly like original)
    window.pageLoadTime = Date.now();
    
    // Reset hero animation on page load
    const firstName = firstNameRef.current;
    const lastName = lastNameRef.current;
    
    if (firstName && lastName) {
      // Reset to initial state
      firstName.style.removeProperty('transform');
      firstName.style.removeProperty('opacity');
      lastName.style.removeProperty('transform');
      lastName.style.removeProperty('opacity');
    }
  }, []);

  useEffect(() => {
    // Scroll-based hero animation (exactly like original)
    const handleScroll = () => {
      const heroSection = document.getElementById('experiment-hero');
      if (!heroSection) return;

      const scrollY = window.scrollY;
      const heroHeight = heroSection.offsetHeight;
      const heroTop = heroSection.offsetTop;
      
      // Calculate how far we've scrolled through the hero section (0 to 1)
      const scrollProgress = Math.min(Math.max((scrollY - heroTop) / heroHeight, 0), 1);
      
      // Get the name elements
      const firstName = firstNameRef.current;
      const lastName = lastNameRef.current;
      
      if (firstName && lastName) {
        // Check if initial entrance animation is complete (after 2.5 seconds total)
        const timeSinceLoad = Date.now() - (window.pageLoadTime || Date.now());
        const initialAnimationComplete = timeSinceLoad > 2500;
        
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
          } else {
            // When back at the top, reset names to center position
            firstName.style.setProperty('transform', 'translateX(0)', 'important');
            lastName.style.setProperty('transform', 'translateX(0)', 'important');
            firstName.style.setProperty('opacity', '1', 'important');
            lastName.style.setProperty('opacity', '1', 'important');
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Scroll to top before transitioning
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (onBack) {
      onBack();
    }
  };

  return (
    <section id="experiment-hero" className="hero-section">
      {/* Warning Marquee */}
      <div className="warning-marquee">
        <div className="marquee-content">
          <span>Caution : This section of the website is currently under R&D, you might stumble across something crazy !</span>
        </div>
      </div>
      
      {/* Vertical Warning Marquee */}
      <div className="vertical-warning-marquee">
        <div className="vertical-marquee-content">
          <span>Caution : This section of the website is currently under R&D, you might stumble across something crazy !</span>
        </div>
      </div>
      
      {/* Top Right to Bottom Marquee */}
      <div className="top-right-marquee">
        <div className="top-right-marquee-content">
          <span>Caution : This section of the website is currently under R&D, you might stumble across something crazy !</span>
        </div>
      </div>
      
      {/* Bottom Left to Right Marquee */}
      <div className="bottom-left-marquee">
        <div className="bottom-left-marquee-content">
          <span>Caution : This section of the website is currently under R&D, you might stumble across something crazy !</span>
        </div>
      </div>
      
      <div className="hero-content">
        <div className="name-container">
          <h1 className="first-name" ref={firstNameRef}>Experiment</h1>
          <h1 className="last-name" ref={lastNameRef}>Space</h1>
        </div>
      </div>
      
      {/* Back Icon - same style as info icon but with left arrow */}
      <div className="info-icon back-icon" onClick={handleBackClick}>
        <span className="info-text">‹</span>
      </div>
    </section>
  );
};

export default ExperimentHeroSection;
