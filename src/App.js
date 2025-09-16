import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import InfoPage from './components/InfoPage';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPage, setCurrentPage] = useState('main'); // 'main' or 'info'
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Prevent scroll restoration on page reload (exactly like original)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Reset scroll position to top on page load
    window.scrollTo(0, 0);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleInfoClick = () => {
    setIsTransitioning(true);
    
    // Start fade out
    setTimeout(() => {
      // Invert theme when going to info page
      const invertedTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(invertedTheme);
      document.documentElement.setAttribute('data-theme', invertedTheme);
      setCurrentPage('info');
      
      // Start fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleBackToMain = () => {
    setIsTransitioning(true);
    
    // Start fade out
    setTimeout(() => {
      // Invert theme back when returning to main page
      const invertedTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(invertedTheme);
      document.documentElement.setAttribute('data-theme', invertedTheme);
      setCurrentPage('main');
      
      // Start fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  if (currentPage === 'info') {
    return (
      <div className={`page-transition ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <InfoPage 
          theme={theme}
          toggleTheme={toggleTheme}
          onBack={handleBackToMain}
        />
      </div>
    );
  }

  return (
    <div className={`page-transition ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <div className="App">
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <HeroSection theme={theme} onInfoClick={handleInfoClick} />
        <main className="main-content">
          <AboutSection theme={theme} />
          <ExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </div>
    </div>
  );
}

export default App;
