import React from 'react';

const ProjectsSection = () => {
  const projects = [
    {
      id: 1,
      title: "Slate",
      description: "A collaborative note-sharing web application, enabling students to upload, summarize, and share notes using AI-powered features.",
      tech: "Next.js, Gemini API, Firestore, Oauth",
      link: "https://github.com/Namra-715/Slate"
    },
    {
      id: 2,
      title: "TimeCloud",
      description: "Time keeping application and task management web extension.",
      tech: "JavaScript, HTML, CSS",
      link: "https://github.com/Namra-715/TimeCloud"
    },
    {
      id: 3,
      title: "Sub-leasing Application",
      description: "A subleasing application for students to find roommates and list their rooms for rent.",
      tech: "React, Firebase, Google Maps API",
      link: "https://github.com/Namra-715/sharedhouse"
    }
  ];

  const handleProjectClick = (link) => {
    window.open(link, '_blank');
  };

  return (
    <section id="projects" className="section">
      <div className="section-content">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="project-card" 
              onClick={() => handleProjectClick(project.link)}
            >
              <div className="project-arrow">↑</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">{project.tech}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
