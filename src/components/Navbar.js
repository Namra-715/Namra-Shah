import React, { useEffect, useRef } from 'react';

const Navbar = ({ theme, toggleTheme, activeSection, onSectionChange, hideNavLinks = false }) => {
  const navRef = useRef(null);
  const underlineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Check if we're in the hero section (before any navigation sections)
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        if (scrollPosition < heroBottom) {
          // We're in the hero section, remove active class from all links
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
  }, [onSectionChange]);

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
      if (section === 'about') {
        offset = 65;
      } else if (section === 'contact') {
        offset = 0; // scroll to very bottom of contact section
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
