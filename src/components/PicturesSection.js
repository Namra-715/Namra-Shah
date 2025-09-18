import React from 'react';

const PicturesSection = () => {
  return (
    <section id="pictures" className="section">
      <div className="section-content">
        <h2 className="section-title">Pictures</h2>
        <div className="work-progress-content">
          <div className="progress-card">
            <h3>Storage Full!</h3>
            <p>I am eager to travel more so I can click photos to add here.</p>
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

export default PicturesSection;