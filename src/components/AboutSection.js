import React, { useEffect, useState, useRef } from 'react';

const AboutSection = ({ theme }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const sectionRef = useRef(null);
  const phaseRef = useRef(0); // 0 -> not started, 1 -> armed (About >= 80%)
  const cooldownRef = useRef(false);

  useEffect(() => {
    const aboutEl = sectionRef.current;
    if (!aboutEl) return;

    // Observer to arm when About is >= 80% visible
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.8 && phaseRef.current === 0) {
          phaseRef.current = 1; // arm
        }
        // Optional: disarm if About not visible at all
        if (ratio <= 0 && phaseRef.current !== 0 && !cooldownRef.current) {
          phaseRef.current = 0;
        }
      },
      { threshold: [0, 0.8, 1] }
    );

    aboutObserver.observe(aboutEl);

    // Observer to flip when next section is >= 30% visible
    const nextEl = document.getElementById('experience');
    let nextObserver;
    if (nextEl) {
      nextObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const ratio = entry.intersectionRatio;
          if (ratio >= 0.3 && phaseRef.current === 1 && !cooldownRef.current) {
            cooldownRef.current = true;
            setIsFlipped((prev) => !prev);
            phaseRef.current = 0; // reset for next cycle
            setTimeout(() => {
              cooldownRef.current = false;
            }, 800);
          }
        },
        { threshold: [0, 0.3, 1] }
      );
      nextObserver.observe(nextEl);
    }

    return () => {
      aboutObserver.disconnect();
      if (nextObserver) nextObserver.disconnect();
    };
  }, []);

  const showDark = (theme === 'dark') !== isFlipped;
  const showLight = (theme === 'light') !== isFlipped;

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="section-content">
        <h1 className="section-title">About Me</h1>
        <div className="typewriter-text">
          <p>Hello, I'm a CS grad student at Santa Clara University, originally from Ahmedabad, India.</p>
          <p>I am eager to learn more about software development, cybersecurity, and artificial intelligence.</p>
          <p>Apart from that, my interests also extend to finance, business, and football. I absolutely love travelling.</p>
        </div>
        <div className="profile-photo">
          <img 
            src="profile-dark.JPG" 
            alt="Namra Shah" 
            className="profile-img dark-mode-img"
            style={{ display: showDark ? 'block' : 'none' }}
          />
          <img 
            src="profile-light.JPG" 
            alt="Namra Shah" 
            className="profile-img light-mode-img"
            style={{ display: showLight ? 'block' : 'none' }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
