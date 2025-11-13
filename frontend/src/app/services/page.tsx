'use client';

export default function Services() {
  const timelineSteps = [
    {
      number: '1',
      title: 'Explore',
      subhead: 'Set Direction & Standards'
    },
    {
      number: '2',
      title: 'Design',
      subhead: 'Build a Clear Blueprint'
    },
    {
      number: '3',
      title: 'Trial',
      subhead: 'Test with Evidence'
    },
    {
      number: '4',
      title: 'Launch',
      subhead: 'Enable at Scale'
    },
    {
      number: '5',
      title: 'Measure',
      subhead: 'Make Impact Visible'
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="services-hero-content">
          <h1 className="services-hero-title">GenAI Services</h1>
          <p className="services-hero-subtitle">Practical GenAI for education—faster feedback, fairer assessment, and confident rollouts.</p>
        </div>
        
        {/* Timeline Boxes Container - positioned to be half in hero, half below */}
        <div className="timeline-container">
          {timelineSteps.map((step, index) => (
            <div key={index} className="timeline-box">
              <div className="timeline-icon">
                <span className="timeline-number">{step.number}</span>
              </div>
              <h3 className="timeline-title">{step.title}</h3>
              <p className="timeline-subhead">{step.subhead}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container services-content">
        {/* Services page content will be added here */}
      </div>
    </div>
  );
}
