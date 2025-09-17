import React from 'react';

const MusicSection = () => {
  return (
    <section id="work-in-progress" className="section">
      <div className="section-content">
        <h2 className="section-title">Music</h2>
        <div className="work-progress-content">
          <div className="progress-card">
            <h3>Coming Soon</h3>
            <p>This section is currently under development. Check back soon for exciting new content!</p>
            <div className="progress-indicator">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <span className="progress-text">In Development</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
