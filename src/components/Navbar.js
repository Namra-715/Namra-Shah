import React, { useEffect, useRef } from 'react';

const Navbar = ({ theme, toggleTheme, activeSection, onSectionChange, hideNavLinks = false, experimentMode = false }) => {
  const navRef = useRef(null);
  const underlineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      if (experimentMode) {
        // Handle experiment page sections
        const heroSection = document.getElementById('experiment-hero');
        if (heroSection) {
          const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          
          if (scrollPosition < heroBottom) {
            onSectionChange('experiment-hero');
            return;
          }
        }
        
        // Check experiment sections
        const sections = ['background-words-section', 'work-in-progress', 'pictures', 'insights'];
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              onSectionChange(sections[i]);
              break;
            }
          }
        }
      } else {
        // Handle main page sections
        const heroSection = document.getElementById('hero');
        if (heroSection) {
          const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          
          if (scrollPosition < heroBottom) {
            onSectionChange('hero');
            return;
          }
        }
        
        // Check other sections
        const sections = ['about', 'experience', 'projects', 'contact'];
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              onSectionChange(sections[i]);
              break;
            }
          }
        }
      }
    };

    // Only update if scrolling direction changed significantly (like original)
    let lastScrollTop = 0;
    const throttledScrollHandler = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (Math.abs(scrollTop - lastScrollTop) > 50) {
        handleScroll();
        lastScrollTop = scrollTop;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler);
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [onSectionChange, experimentMode]);

  // Update underline position (exactly like original)
  useEffect(() => {
    const updateUnderline = () => {
      const activeLink = navRef.current?.querySelector(`[data-section="${activeSection}"]`);
      if (activeLink && underlineRef.current) {
        const rect = activeLink.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        
        // Check if we're on mobile (navbar is stacked vertically)
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
          // On mobile, position underline below the active link
          underlineRef.current.style.width = `${rect.width}px`;
          underlineRef.current.style.left = `${rect.left - navRect.left}px`;
          underlineRef.current.style.top = `${rect.bottom - navRect.top + 5}px`; // Position below the link
          underlineRef.current.style.bottom = 'auto';
        } else {
          // On desktop, position underline closer to the text
          underlineRef.current.style.width = `${rect.width}px`;
          underlineRef.current.style.left = `${rect.left - navRect.left}px`;
          underlineRef.current.style.top = 'auto';
          underlineRef.current.style.bottom = '8px';
        }
      } else {
        // No active link (we're in hero section), hide the underline
        if (underlineRef.current) {
          underlineRef.current.style.width = '0';
        }
      }
    };

    updateUnderline();
  }, [activeSection]);

  const handleNavClick = (e, section) => {
    e.preventDefault();
    const targetSection = document.getElementById(section);
    if (targetSection) {
      // Use different offsets for different sections
      let offset = 80; // default offset
      const isMobile = window.innerWidth <= 768;
      const isIOS = /iP(ad|hone|od)/.test(navigator.platform) || (/Mac/.test(navigator.platform) && 'ontouchend' in document);
      
      if (experimentMode) {
        // Experiment page sections - consistent scroll offset except insights
        if (section === 'insights') {
          offset = 0; // Scroll to very bottom with no further scroll possible
        } else {
          offset = 30; // Same offset for other experiment sections
        }
      } else {
        // Main page sections
        if (section === 'about') {
          offset = 65;
        } else if (section === 'contact') {
          // Scroll specifically to the contact title for precise alignment
          const titleEl = targetSection.querySelector('.section-title');
          const baseTop = titleEl
            ? (titleEl.getBoundingClientRect().top + window.pageYOffset)
            : targetSection.offsetTop;

          // Smaller offsets to reduce extra spacing beneath navbar/toolbar
          if (isMobile && isIOS) {
            offset = 70;
          } else if (isMobile) {
            offset = 60;
          } else {
            offset = 50;
          }

          const targetPosition = baseTop - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          return;
        }
      }
      const targetPosition = targetSection.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-container">
        {!hideNavLinks && (
          <ul className="nav-menu">
            {experimentMode ? (
              // Experiment page navigation
              <>
                <li className="nav-item">
                  <a 
                    href="#background-words-section" 
                    className={`nav-link ${activeSection === 'background-words-section' ? 'active' : ''}`} 
                    data-section="background-words-section"
                    onClick={(e) => handleNavClick(e, 'background-words-section')}
                  >
                    Thoughts
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#work-in-progress" 
                    className={`nav-link ${activeSection === 'work-in-progress' ? 'active' : ''}`} 
                    data-section="work-in-progress"
                    onClick={(e) => handleNavClick(e, 'work-in-progress')}
                  >
                    Music
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#pictures" 
                    className={`nav-link ${activeSection === 'pictures' ? 'active' : ''}`} 
                    data-section="pictures"
                    onClick={(e) => handleNavClick(e, 'pictures')}
                  >
                    Pictures
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#insights" 
                    className={`nav-link ${activeSection === 'insights' ? 'active' : ''}`} 
                    data-section="insights"
                    onClick={(e) => handleNavClick(e, 'insights')}
                  >
                    Insights
                  </a>
                </li>
              </>
            ) : (
              // Main page navigation
              <>
                <li className="nav-item">
                  <a 
                    href="#about" 
                    className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} 
                    data-section="about"
                    onClick={(e) => handleNavClick(e, 'about')}
                  >
                    About Me
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#experience" 
                    className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`} 
                    data-section="experience"
                    onClick={(e) => handleNavClick(e, 'experience')}
                  >
                    Experience
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#projects" 
                    className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} 
                    data-section="projects"
                    onClick={(e) => handleNavClick(e, 'projects')}
                  >
                    Projects
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#contact" 
                    className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} 
                    data-section="contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                  >
                    Contact Me
                  </a>
                </li>
              </>
            )}
          </ul>
        )}
        <div className="theme-toggle">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              id="theme-btn" 
              checked={theme === 'light'}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      {!hideNavLinks && <div className="nav-underline" ref={underlineRef}></div>}
    </nav>
  );
};

export default Navbar;
