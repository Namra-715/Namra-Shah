import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import BackgroundWords from './BackgroundWords';
import ExperimentHeroSection from './ExperimentHeroSection';
import MusicSection from './MusicSection';
import PicturesSection from './PicturesSection';
import InsightsSection from './InsightsSection';

const InfoPage = ({ theme, toggleTheme, onBack }) => {
  const [activeSection, setActiveSection] = useState('experiment-hero');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    if (onBack) {
      onBack();
      // After page transition back to main, trigger the navbar's contact link click
      setTimeout(() => {
        const contactNavLink = document.querySelector('.nav-link[data-section="contact"]');
        if (contactNavLink) {
          contactNavLink.click();
        } else {
          const contact = document.getElementById('contact');
          if (contact) {
            window.scrollTo({ top: contact.offsetTop, behavior: 'smooth' });
          } else {
            window.location.hash = '#contact';
          }
        }
      }, 550);
    }
  };

  return (
    <div id="info-page" className="info-page">
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        hideNavLinks={false}
        experimentMode={true}
      />
      
      <ExperimentHeroSection theme={theme} onBack={onBack} />
      
      <main className="main-content">
        <section id="background-words-section" className="section">
          <BackgroundWords theme={theme} containerId="background-words-section" />
          <div className="section-content">
            <div className="info-page-card">
              <div className="info-page-body">
                <h1>Thoughts</h1>
                <p>
                  Fun Fact: All words visible on this page are actual topics I have recently been thinking about. If you are interested in any of these, let's{' '}
                  <a href="#contact" className="link-underline" onClick={handleChatClick}>chat</a>.
                  And if you find yourself here, Be Proud!
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <MusicSection />
        
        <PicturesSection />
        
        <InsightsSection />
      </main>
    </div>
  );
};

export default InfoPage;