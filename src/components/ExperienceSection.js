import React from 'react';

const ExperienceSection = () => {
  const experiences = [
    {
      id: 1,
      title: "Software Developer",
      company: "Codelab",
      duration: "2024 - 2024",
      description: "Built a password management mobile application using Flutter, with a strong focus on frontend development."
    },
    {
      id: 2,
      title: "Tech Lead / Software Developer",
      company: "Google Developer Student Clubs",
      duration: "2022 - 2023",
      description: "Built backend focused web applications using React, Flask and third party APIs like Google Maps API."
    },
    {
      id: 3,
      title: "Event Staff",
      company: "UC Davis",
      duration: "2023 - 2025",
      description: "Provided customer service and technical support for events on campus."
    }
  ];

  return (
    <section id="experience" className="section">
      <div className="section-content">
        <h2 className="section-title">Experience</h2>
        <div className="timeline">
          {experiences.map((experience, index) => (
            <div key={experience.id} className="timeline-item">
              <div className="timeline-content">
                <h3>{experience.title}</h3>
                <p className="company">{experience.company}</p>
                <p className="duration">{experience.duration}</p>
                <p>{experience.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
