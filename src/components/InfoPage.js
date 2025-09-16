import React from 'react';
import Navbar from './Navbar';
import BackgroundWords from './BackgroundWords';

const InfoPage = ({ theme, toggleTheme, onBack }) => {
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
      <BackgroundWords theme={theme} containerId="info-page" />
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeSection="info"
        onSectionChange={() => {}}
        hideNavLinks={true}
      />
      <div className="info-page-content">
        <div className="info-page-card">
          <div className="info-page-body">
            <h1>Information Page</h1>
            <p>This is a blank page with inverted theme.</p>
            <p>
              Fun Fact: All words visible on this page are actual topics I have recently been thinking about. If you are interested in any of these, let's{' '}
              <a href="#contact" className="link-underline" onClick={handleChatClick}>chat</a>.
              And if you find yourself on there, Be Proud!
            </p>
          </div>
        </div>
      </div>
      
      {/* Back Icon - same style as info icon but with left arrow */}
      <div className="info-icon back-icon" onClick={onBack}>
        <span className="info-text">‹</span>
      </div>
    </div>
  );
};
export default InfoPage;
