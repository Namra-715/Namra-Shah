import React from 'react';

const InsightsSection = () => {
  return (
    <section id="insights" className="section">
      <div className="section-content">
        <h2 className="section-title">Insights</h2>
        <div className="work-progress-content">
          <div className="progress-card">
            <h3>I am busy curating</h3>
            <p>LMK if you find something interesting to read, listen or watch!</p>
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

export default InsightsSection;