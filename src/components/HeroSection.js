import React, { useEffect, useRef, useState } from 'react';
import BackgroundWords from './BackgroundWords';

const HeroSection = ({ theme }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFading, setIsFading] = useState(false);
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
      const heroSection = document.getElementById('hero');
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
      
      // Update info icon opacity based on scroll
      updateInfoIconOpacity(scrollProgress);
    };

    // Update info icon opacity based on scroll progress
    const updateInfoIconOpacity = (scrollProgress) => {
      const infoIcon = document.getElementById('info-icon');
      if (!infoIcon) return;
      
      // Start fading out when scroll begins, completely fade out by 50% scroll
      const fadeStart = 0;
      const fadeEnd = 0.5;
      
      if (scrollProgress <= fadeStart) {
        // At the top, fully visible
        infoIcon.style.opacity = '1';
      } else if (scrollProgress >= fadeEnd) {
        // Past fade end, completely hidden
        infoIcon.style.opacity = '0';
      } else {
        // During fade, calculate opacity
        const fadeProgress = (scrollProgress - fadeStart) / (fadeEnd - fadeStart);
        const opacity = 1 - fadeProgress;
        infoIcon.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInfoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Info icon clicked!'); // Debug log
    setShowTooltip(true);
    setIsFading(false);
    
    // Start fade out after 5 seconds
    setTimeout(() => {
      setIsFading(true);
      // Hide completely after fade animation (2 seconds)
      setTimeout(() => {
        setShowTooltip(false);
        setIsFading(false);
      }, 2000);
    }, 5000);
  };

  return (
    <section id="hero" className="hero-section">
      <BackgroundWords theme={theme} />
      <div className="hero-content">
        <div className="name-container">
          <h1 className="first-name" ref={firstNameRef}>Namra</h1>
          <h1 className="last-name" ref={lastNameRef}>Shah</h1>
        </div>
      </div>
      
      {/* Info Icon */}
      <div className={`info-icon ${showTooltip ? 'active' : ''} ${isFading ? 'fading' : ''}`} id="info-icon" onClick={handleInfoClick}>
        <span className="info-text">i</span>
        <div className="info-tooltip">
          <p>Fun Fact: All words visible on this page are actual topics I have recently been thinking about. If you are interested in any of these, let's chat.
              And if you find yourself on there, Be Proud!</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
