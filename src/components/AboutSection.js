import React, { useEffect, useState, useRef } from 'react';

const AboutSection = ({ theme }) => {
  const [scrollCounter, setScrollCounter] = useState(1); // Start at 1 like original
  const [darkThemePhoto, setDarkThemePhoto] = useState('profile-dark.JPG');
  const [lightThemePhoto, setLightThemePhoto] = useState('profile-light.JPG');
  const lastScrollYRef = useRef(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    let scrollCounter = 0;
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollProgress = Math.min(Math.max(1 - rect.top / viewportHeight, 0), 1);

      // previous logic without logs
      if (scrollProgress < 0.05) {
        scrollCounter = 1;
      } else if (scrollProgress > 0.4 && scrollCounter === 1) {
        scrollCounter = 2;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // No theme change effect - let scroll counter work independently

  return (
    <section id="about" className="section" ref={sectionRef}>
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
