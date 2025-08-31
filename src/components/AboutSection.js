import React, { useEffect, useState, useRef } from 'react';

const AboutSection = ({ theme }) => {
  const [scrollCounter, setScrollCounter] = useState(1); // Start at 1 like original
  const [darkThemePhoto, setDarkThemePhoto] = useState('profile-dark.JPG');
  const [lightThemePhoto, setLightThemePhoto] = useState('profile-light.JPG');
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const scrollY = window.scrollY;
        const aboutTop = aboutSection.offsetTop;
        const aboutHeight = aboutSection.offsetHeight;
        
        // Calculate how far we've scrolled through the about section (0 to 1)
        const scrollProgress = Math.min(Math.max((scrollY - aboutTop) / aboutHeight, 0), 1);
        
        // Two-threshold system for reliable photo flipping (exactly like original)
        const threshold1 = 0.05;          // First threshold - scroll up to this point
        const threshold2 = 0.4;           // Second threshold - flip when scrolling down past this
        
        console.log('Scroll progress:', (scrollProgress * 100).toFixed(1) + '%', 'Counter:', scrollCounter);
        
        // When scrolling up above threshold1, set counter to 1
        if (scrollY < lastScrollYRef.current && scrollProgress <= threshold1) {
          console.log('Scrolling up above 5% - setting counter to 1');
          setScrollCounter(1);
        }
        
        // For first load case: if we're past threshold2 and counter is still 1, allow first flip
        if (scrollY > lastScrollYRef.current && scrollProgress >= threshold2 && scrollCounter === 1) {
          console.log('Scrolling down past 40% with counter=1 - flipping photo!');
          // Exchange the theme photo addresses (exactly like original)
          const currentDark = darkThemePhoto;
          const currentLight = lightThemePhoto;
          setDarkThemePhoto(currentLight);
          setLightThemePhoto(currentDark);
          console.log('Swapping photos:', currentDark, '↔', currentLight);
          setScrollCounter(0); // Reset counter after flip
        }
        
        lastScrollYRef.current = scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollCounter]); // eslint-disable-line react-hooks/exhaustive-deps

  // No theme change effect - let scroll counter work independently

  return (
    <section id="about" className="section">
      <div className="section-content">
        <h1 className="section-title">About Me</h1>
        <div className="typewriter-text">
          <p>Hello, I'm a CS grad student at Santa Clara University, originally from Ahmedabad, India.</p>
          <p>I am eager to learn more about software development, cybersecurity, and artificial intelligence.</p>
          <p>Apart from that, my interests also extend to finance, business, and football.</p>
        </div>
        <div className="profile-photo">
          <img 
            src={darkThemePhoto} 
            alt="Namra Shah" 
            className="profile-img dark-mode-img"
            style={{ display: theme === 'dark' ? 'block' : 'none' }}
          />
          <img 
            src={lightThemePhoto} 
            alt="Namra Shah" 
            className="profile-img light-mode-img"
            style={{ display: theme === 'light' ? 'block' : 'none' }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
