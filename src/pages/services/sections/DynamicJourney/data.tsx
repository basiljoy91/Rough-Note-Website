import React from 'react';

export interface JourneyStep {
  num: string;
  icon: React.ReactNode | string;
  title: string;
  bullets: string[];
}

export interface JourneyData {
  id: string;
  title: string;
  subtitle: React.ReactNode;
  timelineBg?: string; 
  timelineStepBg?: string; 
  stamp?: React.ReactNode;
  steps: JourneyStep[];
  renderDecorations?: () => React.ReactNode; // For middle stickies and doodles
  renderBottomCTA: () => React.ReactNode; // For the bottom section
}

export const brandJourneyData: JourneyData = {
  id: 'brand',
  title: 'Brand Identity',
  subtitle: 'We craft brands that tell your story,<br/>build trust,<br/>and leave a lasting impression.',
  stamp: <>BRAND<br/>APPROVED</>,
  steps: [
    {
      num: '01',
      icon: '👥',
      title: 'Discovery',
      bullets: ['Understand your business', 'Goals & Vision', 'Target Audience']
    },
    {
      num: '02',
      icon: '🔍',
      title: 'Research',
      bullets: ['Market Study', 'Competitor Analysis', 'Brand Insights']
    },
    {
      num: '03',
      icon: '📝',
      title: 'Conceptualize',
      bullets: ['Creative Direction', 'Mood Boards', 'Logo Concepts']
    },
    {
      num: '04',
      icon: '✒️',
      title: 'Design',
      bullets: ['Logo Refinement', 'Color Palette', 'Typography']
    },
    {
      num: '05',
      icon: '📋',
      title: 'Brand System',
      bullets: ['Brand Guidelines', 'Identity Elements', 'Usage Rules']
    },
    {
      num: '06',
      icon: '📇',
      title: 'Applications',
      bullets: ['Business Cards', 'Stationery', 'Social Media Kit']
    },
    {
      num: '07',
      icon: '📦',
      title: 'Delivery',
      bullets: ['Final Files', 'Source Files', 'Brand Book']
    }
  ],
  renderDecorations: () => (
    <>
      {/* Middle Left Sticky */}
      <div className="dj-sticky dj-sticky--mid-left">
        <img src="/assets/images/sticky-note-2-bg-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          You focus on<br/>your business.<br/>We handle the<br/>creative journey.
          <span style={{ position: 'absolute', bottom: '-10px', left: '-10px', fontSize: '1.2rem' }}>☺</span>
        </div>
      </div>
    </>
  ),
  renderBottomCTA: () => (
    <>
      <div className="dj-bottom-cta">
        <div className="dj-bottom__strip">
          <img src="/assets/images/Paper_Strip.png" alt="Strip" className="dj-bottom__strip-img" />
          <div className="dj-bottom__strip-content">
            
            <div className="cta-left">
              <span style={{ fontSize: '2rem' }}>💡</span>
              <div className="cta-text-group">
                Every strong brand starts with<br/>
                <span className="highlight">a clear story and a strong identity.</span>
              </div>
            </div>

            <div className="cta-arrow">
              <svg width="80" height="32" viewBox="0 0 100 40" style={{ overflow: 'visible' }}>
                <path d="M 0 35 Q 50 -10 95 20" fill="transparent" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                <path d="M 85 10 L 98 22 L 80 25" fill="transparent" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="cta-right dj-bottom__cta-text">
              <h4 className="dj-bottom__cta-title">Ready to build your brand identity?</h4>
              <a href="#contact" className="dj-bottom__cta-link">Start Your Rough Note →</a>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Right Sticky */}
      <div className="dj-sticky dj-sticky--bottom-right">
        <img src="/assets/images/sticky-note-div3-bg3-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2, marginTop: '15px' }}>
          Your brand is<br/>
          your promise.<br/>
          <span style={{ fontSize: '1.3rem', display: 'block', marginTop: '0px' }}>👑</span>
        </div>
      </div>
    </>
  )
};

export const motionJourneyData: JourneyData = {
  id: 'motion',
  title: 'Motion Graphics',
  subtitle: 'From idea to animation — crafted<br/>with creativity, precision and emotion.',
  timelineBg: 'none',
  timelineStepBg: '/assets/images/d-3-p-2-2.png',
  stamp: <>STORY<br/>IN MOTION</>,
  steps: [
    {
      num: '01',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v1" />
          <path d="M12 7v1" />
          <path d="M5.6 5.6l.7.7" />
          <path d="M18.4 5.6l-.7.7" />
          <path d="M2 12h1" />
          <path d="M21 12h1" />
          <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
        </svg>
      ),
      title: 'Creative Brief',
      bullets: ['Understand the goal', 'Target audience', 'Message & tone', 'Reference study']
    },
    {
      num: '02',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      title: 'Script & Concept',
      bullets: ['Story writing', 'Concept direction', 'Scene breakdown', 'Voice over plan']
    },
    {
      num: '03',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <line x1="2" y1="8" x2="22" y2="8" />
          <line x1="2" y1="16" x2="22" y2="16" />
          <line x1="6" y1="4" x2="6" y2="20" />
          <line x1="10" y1="4" x2="10" y2="20" />
          <line x1="14" y1="4" x2="14" y2="20" />
          <line x1="18" y1="4" x2="18" y2="20" />
        </svg>
      ),
      title: 'Storyboard',
      bullets: ['Visual storytelling', 'Scene planning', 'Camera angles', 'Client review']
    },
    {
      num: '04',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <path d="M16 10l-4-4-4 4" />
          <path d="M12 6v8" />
        </svg>
      ),
      title: 'Illustration & Design',
      bullets: ['Custom illustration', 'Character design', 'Asset creation', 'Visual style']
    },
    {
      num: '05',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <circle cx="12" cy="10" r="3" />
          <path d="M7 10h2" />
          <path d="M15 10h2" />
        </svg>
      ),
      title: 'Animation',
      bullets: ['2D/3D animation', 'Motion design', 'Transitions', 'Keyframe setup']
    },
    {
      num: '06',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ),
      title: 'Sound Design',
      bullets: ['Background music', 'Voice over', 'Sound effects', 'Audio mixing']
    },
    {
      num: '07',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polygon points="10 7 15 10 10 13 10 7" />
        </svg>
      ),
      title: 'Final Render',
      bullets: ['High quality render', 'Version review', 'Revisions', 'Final export']
    },
    {
      num: '08',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
      title: 'Delivery',
      bullets: ['Final video files', 'Multiple formats', 'Social versions', 'Source files']
    }
  ],
  renderDecorations: () => (
    <>
      <div className="dj-sticky dj-sticky--motion-left">
        <img src="/assets/images/sticky-note-div3-bg3-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2, padding: '10px', fontSize: '0.6rem', lineHeight: '1.4' }}>
          We don't just<br/>create videos,<br/>we tell stories<br/>that move people.<br/>
          <span style={{ position: 'absolute', bottom: '-10px', right: '10px', fontSize: '1.2rem' }}>☺</span>
        </div>
      </div>
    </>
  ),
  renderBottomCTA: () => (
    <div className="dj-motion-bottom">
      
      {/* Left Notebook Checklist */}
      <div className="dj-motion-bottom__checklist">
        <h4 className="dj-motion-bottom__title">Things we always keep in mind:</h4>
        <ul className="dj-motion-bottom__list">
          <li><span className="check">✔</span> Clear Message</li>
          <li><span className="check">✔</span> Emotional Connection</li>
          <li><span className="check">✔</span> Visual Impact</li>
          <li><span className="check">✔</span> Audience Engagement</li>
        </ul>
      </div>

      {/* Middle Sticky */}
      <div className="dj-sticky dj-sticky--motion-mid">
        <img src="/assets/images/sticky-note-2-bg-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          Your story.<br/>
          Our creativity.<br/>
          Unforgettable impact.<br/>
          <svg style={{ position: 'absolute', top: '0', right: '-10px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>

      {/* Camera Sketch */}
      <div className="dj-motion-bottom__camera">
        <svg className="dj-camera-icon" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '80px', height: '80px' }}>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          <line x1="1" y1="10" x2="16" y2="10" />
        </svg>
        <div className="dj-camera-text">
          Lights,<br/>
          Camera,<br/>
          <span style={{ textDecoration: 'underline', textDecorationColor: '#e65100', textDecorationThickness: '2px' }}>Emotion!</span>
        </div>
      </div>

      {/* Right Blue Sticky */}
      <div className="dj-sticky dj-sticky--motion-right">
        <img src="/assets/images/sticky-note-4-v2-clean.png" alt="Blue Sticky" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#1565c0' }}>Deliverables</h4>
          <ul className="dj-deliverables-list">
            <li><span className="check">✔</span> Full HD Video</li>
            <li><span className="check">✔</span> Social Media Cuts</li>
            <li><span className="check">✔</span> Source Project Files</li>
            <li><span className="check">✔</span> Voice Over (if required)</li>
            <li><span className="check">✔</span> Revisions Included <span style={{ fontSize: '1rem', marginLeft: '5px' }}>♡</span></li>
          </ul>
        </div>
      </div>

      {/* Pencil Decor */}
      <img src="/assets/images/pencil-right.png" alt="Pencil" className="dj-motion-bottom__pencil" />

    </div>
  )
};

export const webDesignData: JourneyData = {
  id: 'web',
  title: 'Website Design',
  subtitle: 'We design user-focused websites that look<br/>beautiful, load fast, and convert visitors into customers.',
  timelineBg: 'none',
  timelineStepBg: '/assets/images/d-3-p-2-2.png',
  stamp: <>USER<br/>APPROVED<br/><span style={{fontSize: '1.2rem', display: 'block', marginTop: '-5px'}}>✔</span></>,
  steps: [
    {
      num: '01',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Discovery',
      bullets: ['Understand business goals', 'Target audience', 'Competitor review', 'Success metrics']
    },
    {
      num: '02',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="2" width="8" height="6" rx="1" />
          <path d="M12 8v4" />
          <path d="M6 12h12" />
          <path d="M6 12v2" />
          <path d="M18 12v2" />
          <rect x="2" y="14" width="8" height="6" rx="1" />
          <rect x="14" y="14" width="8" height="6" rx="1" />
        </svg>
      ),
      title: 'Information Architecture',
      bullets: ['Sitemap creation', 'Page structure', 'Content planning', 'User flow mapping']
    },
    {
      num: '03',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
      title: 'Wireframing',
      bullets: ['Low-fidelity layouts', 'Page wireframes', 'Content placement', 'UX flow validation']
    },
    {
      num: '04',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <path d="M17 12l-4-4-4 4" />
        </svg>
      ),
      title: 'UI Design',
      bullets: ['Visual design', 'Color & typography', 'UI components', 'Responsive layouts']
    },
    {
      num: '05',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      title: 'Prototype',
      bullets: ['Interactive prototype', 'User testing', 'Feedback collection', 'Design refinement']
    },
    {
      num: '06',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: 'Development',
      bullets: ['Clean coding', 'CMS integration', 'Responsive build', 'Speed optimization']
    },
    {
      num: '07',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      title: 'Testing & QA',
      bullets: ['Functionality test', 'Cross-browser test', 'Mobile optimization', 'Bug fixing']
    },
    {
      num: '08',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.5 2.5l5.5 5.5-12 12-7.5 1.5 1.5-7.5 12-12z" />
          <path d="M12 5l7 7" />
        </svg>
      ),
      title: 'Launch',
      bullets: ['Deployment', 'SEO setup', 'Analytics setup', 'Performance check']
    }
  ],
  renderDecorations: () => (
    <>
      <div className="dj-sticky dj-sticky--motion-left">
        <img src="/assets/images/sticky-note-4-v2-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2, padding: '10px', fontSize: '0.8rem', lineHeight: '1.4' }}>
          Focus on<br/>user experience,<br/>clarity, and<br/>conversions.<br/>
          <span style={{ position: 'absolute', bottom: '-10px', right: '10px', fontSize: '1.2rem' }}>☺</span>
        </div>
      </div>
    </>
  ),
  renderBottomCTA: () => (
    <div className="dj-motion-bottom">
      
      {/* Left Wireframe Sketch */}
      <div className="dj-motion-bottom__camera" style={{ flexDirection: 'column', alignItems: 'flex-start', left: '20px', top: '-190px' }}>
        <svg viewBox="0 0 100 100" style={{ width: '130px', transform: 'rotate(-2deg)' }} fill="none" stroke="#444" strokeWidth="2">
          <rect x="5" y="10" width="90" height="80" rx="2" />
          <line x1="5" y1="22" x2="95" y2="22" />
          <circle cx="14" cy="16" r="2" />
          <circle cx="22" cy="16" r="2" />
          <circle cx="30" cy="16" r="2" />
          <rect x="15" y="30" width="70" height="30" rx="1" />
          <rect x="15" y="68" width="30" height="15" rx="1" />
          <rect x="55" y="68" width="30" height="15" rx="1" />
          <line x1="15" y1="30" x2="85" y2="60" />
          <line x1="15" y1="60" x2="85" y2="30" />
        </svg>
        <div className="dj-camera-text" style={{ fontSize: '1.1rem', position: 'relative', marginTop: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '10px', marginBottom: '5px' }}>
            <path d="M10 19 Q 5 12 14 5" />
            <polyline points="8,5 14,5 14,11" />
          </svg><br/>
          Keep it<br/>
          <span style={{ fontStyle: 'italic' }}>simple and</span><br/>
          impactful.
        </div>
      </div>

      {/* Middle Notebook Checklist with UI Sketch Inside */}
      <div className="dj-motion-bottom__checklist" style={{ backgroundImage: "url('/assets/images/bottom-left.png')", width: '800px', height: '260px', padding: '50px 5px 15px 30px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Left side: Checklist */}
        <div style={{ flex: 1 }}>
          <h4 className="dj-motion-bottom__title" style={{ fontSize: '1rem', marginBottom: '5px', marginTop: '0' }}>What you'll get</h4>
          <div style={{ display: 'flex', gap: '15px' }}>
            <ul className="dj-motion-bottom__list" style={{ fontSize: '0.65rem', lineHeight: '1.5', margin: 0 }}>
              <li><span className="check">✔</span> Modern & Responsive Website</li>
              <li><span className="check">✔</span> SEO Optimized</li>
              <li><span className="check">✔</span> Fast Loading Speed</li>
              <li><span className="check">✔</span> CMS / Admin Panel</li>
            </ul>
            <ul className="dj-motion-bottom__list" style={{ fontSize: '0.65rem', lineHeight: '1.5', margin: 0 }}>
              <li><span className="check">✔</span> Security & Performance</li>
              <li><span className="check">✔</span> User-Friendly Experience</li>
              <li><span className="check">✔</span> Analytics Integration</li>
              <li><span className="check">✔</span> Ongoing Support</li>
            </ul>
          </div>
        </div>

        {/* Right side: Wireframe UI Sketch */}
        <div style={{ display: 'flex', alignItems: 'center', opacity: 0.8, marginTop: '20px' }}>
          <svg viewBox="0 0 100 100" style={{ width: '130px' }} fill="none" stroke="#333" strokeWidth="1.5">
            <rect x="5" y="10" width="90" height="80" rx="2" />
            <line x1="5" y1="20" x2="95" y2="20" />
            <circle cx="12" cy="15" r="1.5" />
            <circle cx="17" cy="15" r="1.5" />
            <circle cx="22" cy="15" r="1.5" />
            <rect x="15" y="30" width="70" height="30" rx="2" />
            <rect x="15" y="65" width="30" height="20" rx="2" />
            <rect x="55" y="65" width="30" height="20" rx="2" />
            <line x1="15" y1="30" x2="85" y2="60" />
            <line x1="15" y1="60" x2="85" y2="30" />
          </svg>
          
          {/* Right side labels with arrows */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '90px', marginLeft: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(45deg)' }}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              Clear Headline
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              Strong CTA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              Engaging Content
            </div>
          </div>
        </div>
      </div>

      {/* Right Pink Sticky */}
      <div className="dj-sticky dj-sticky--motion-right" style={{ width: '180px', height: '180px', top: '-70px', left: '-20px', transform: 'rotate(2deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/assets/images/sticky-note-div3-bg2.png" alt="Pink Sticky" style={{ objectFit: 'fill' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '15px', fontSize: '0.75rem', lineHeight: '1.4', textAlign: 'center' }}>
          Great websites<br/>
          don't happen<br/>
          by accident.<br/>
          They're designed<br/>
          with intent.<br/>
          <span style={{ display: 'block', marginTop: '5px', fontSize: '1rem', color: '#c2185b' }}>♥</span>
        </div>
      </div>

      {/* Pencil Decor */}
      <img src="/assets/images/pencil-right.png" alt="Pencil" className="dj-motion-bottom__pencil" />

    </div>
  )
};

export const threeDModelingData: JourneyData = {
  id: '3d',
  title: '3D Modeling',
  subtitle: "From concept to photorealistic renders,<br/>we create 3D models that bring your ideas to life.",
  timelineBg: 'none',
  timelineStepBg: '/assets/images/d-3-p-2-2.png',
  stamp: (
    <div className="dj-stamp dj-stamp--brand" style={{ top: '-40px', right: '-10px', transform: 'rotate(-5deg)', opacity: 0.8 }}>
      <svg width="120" height="60" viewBox="0 0 160 80">
        <rect x="5" y="5" width="150" height="70" fill="none" stroke="#e65100" strokeWidth="3" strokeDasharray="5,2" />
        <text stroke="none" x="80" y="38" textAnchor="middle" fill="#e65100" fontSize="18" fontWeight="bold" fontFamily="sans-serif">RENDER</text>
        <text stroke="none" x="80" y="60" textAnchor="middle" fill="#e65100" fontSize="18" fontWeight="bold" fontFamily="sans-serif">APPROVED</text>
      </svg>
    </div>
  ),
  steps: [
    {
      num: '01',
      title: 'Concept & Brief',
      icon: (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="shadow01" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.2"/>
            </filter>
          </defs>
          <g filter="url(#shadow01)">
            <rect x="25" y="20" width="50" height="60" rx="3" fill="#fdfdfd" stroke="#333" strokeWidth="2" transform="rotate(-5 50 50)" />
            <line x1="30" y1="35" x2="70" y2="35" stroke="#333" strokeWidth="2" transform="rotate(-5 50 50)" />
            <line x1="30" y1="45" x2="60" y2="45" stroke="#333" strokeWidth="2" transform="rotate(-5 50 50)" />
            <line x1="30" y1="55" x2="65" y2="55" stroke="#333" strokeWidth="2" transform="rotate(-5 50 50)" />
            <circle cx="50" cy="50" r="15" fill="#fff9c4" stroke="#fbc02d" strokeWidth="1.5" transform="translate(15, 10)" opacity="0.9" />
            <path d="M50 35c-5 0-8 4-8 8s3 7 5 9v3h6v-3c2-2 5-5 5-9s-3-8-8-8zm-2 22h4m-3 3h2" fill="none" stroke="#f57f17" strokeWidth="2" transform="translate(15, 10)" />
          </g>
        </svg>
      ),
      bullets: ['Understand goals', 'Reference collection', 'Concept sketches', 'Style exploration']
    },
    {
      num: '02',
      title: '3D Modeling',
      icon: (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="shadow02" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="10" stdDeviation="6" floodOpacity="0.3"/>
            </filter>
            <linearGradient id="cubeTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5f5f5"/>
              <stop offset="100%" stopColor="#e0e0e0"/>
            </linearGradient>
            <linearGradient id="cubeLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9e9e9e"/>
              <stop offset="100%" stopColor="#757575"/>
            </linearGradient>
            <linearGradient id="cubeRight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#616161"/>
              <stop offset="100%" stopColor="#424242"/>
            </linearGradient>
          </defs>
          <g filter="url(#shadow02)">
            <polygon points="50,20 20,35 50,50 80,35" fill="url(#cubeTop)" stroke="#333" strokeWidth="1" strokeLinejoin="round"/>
            <polygon points="20,35 50,50 50,80 20,65" fill="url(#cubeLeft)" stroke="#333" strokeWidth="1" strokeLinejoin="round"/>
            <polygon points="50,50 80,35 80,65 50,80" fill="url(#cubeRight)" stroke="#333" strokeWidth="1" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      bullets: ['High-poly modeling', 'Accurate topology', 'Proportion & scale', 'Scene blocking']
    },
    {
      num: '03',
      title: 'UV Mapping',
      icon: (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="shadow03">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.2"/>
            </filter>
          </defs>
          <g filter="url(#shadow03)">
            <polygon points="50,25 25,38 50,51 75,38" fill="none" stroke="#555" strokeWidth="1.5" strokeLinejoin="round"/>
            <polygon points="25,38 50,51 50,77 25,64" fill="none" stroke="#555" strokeWidth="1.5" strokeLinejoin="round"/>
            <polygon points="50,51 75,38 75,64 50,77" fill="none" stroke="#555" strokeWidth="1.5" strokeLinejoin="round"/>
            {/* Inner wireframe lines */}
            <path d="M50,25 L50,51 M25,38 L75,38 M25,64 L50,51 M75,64 L50,51" stroke="#999" strokeWidth="0.5" />
            <path d="M37.5,31.5 L62.5,44.5 M37.5,44.5 L62.5,31.5" stroke="#999" strokeWidth="0.5" />
            <path d="M37.5,44.5 L37.5,70.5 M62.5,44.5 L62.5,70.5" stroke="#999" strokeWidth="0.5" />
            <path d="M25,51 L50,64 M50,64 L75,51" stroke="#999" strokeWidth="0.5" />
          </g>
        </svg>
      ),
      bullets: ['UV unwrapping', 'Texel optimization', 'Seam management', 'UV layout']
    },
    {
      num: '04',
      title: 'Texturing',
      icon: (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="sphereMatte" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#795548"/>
              <stop offset="70%" stopColor="#4e342e"/>
              <stop offset="100%" stopColor="#212121"/>
            </radialGradient>
            <radialGradient id="sphereGlossy" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="20%" stopColor="#cfd8dc"/>
              <stop offset="70%" stopColor="#546e7a"/>
              <stop offset="100%" stopColor="#263238"/>
            </radialGradient>
            <filter id="shadow04">
              <feDropShadow dx="3" dy="8" stdDeviation="5" floodOpacity="0.3"/>
            </filter>
          </defs>
          <g filter="url(#shadow04)">
            {/* Bases */}
            <ellipse cx="35" cy="70" rx="15" ry="6" fill="#3e2723" />
            <ellipse cx="65" cy="70" rx="15" ry="6" fill="#212121" />
            <path d="M25,60 Q35,75 45,60" fill="#5d4037" />
            <path d="M55,60 Q65,75 75,60" fill="#424242" />
            
            <circle cx="35" cy="45" r="20" fill="url(#sphereMatte)" />
            <circle cx="65" cy="45" r="20" fill="url(#sphereGlossy)" />
          </g>
        </svg>
      ),
      bullets: ['PBR materials', 'Color & roughness', 'Normal & detail maps', 'Texture baking']
    },
    {
      num: '05',
      title: 'Lighting',
      icon: (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="shadow05">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.2"/>
            </filter>
          </defs>
          <g filter="url(#shadow05)">
            {/* Stand left */}
            <path d="M25,75 L35,50 L45,75" stroke="#333" strokeWidth="2" fill="none" />
            <line x1="35" y1="50" x2="35" y2="35" stroke="#333" strokeWidth="2" />
            {/* Light head left */}
            <polygon points="25,25 45,25 40,35 30,35" fill="#424242" stroke="#212121" strokeWidth="1" />
            <polygon points="30,35 40,35 37,40 33,40" fill="#616161" />
            <path d="M25,25 L15,15 M45,25 L55,15" stroke="#ffb300" strokeWidth="1.5" strokeDasharray="2,2" />

            {/* Stand right */}
            <path d="M55,75 L65,55 L75,75" stroke="#333" strokeWidth="2" fill="none" />
            <line x1="65" y1="55" x2="65" y2="40" stroke="#333" strokeWidth="2" />
            {/* Light head right */}
            <polygon points="55,30 75,30 70,40 60,40" fill="#424242" stroke="#212121" strokeWidth="1" />
            <polygon points="60,40 70,40 67,45 63,45" fill="#616161" />
            <path d="M55,30 L45,20 M75,30 L85,20" stroke="#ffb300" strokeWidth="1.5" strokeDasharray="2,2" />
          </g>
        </svg>
      ),
      bullets: ['HDRI / Studio setup', 'Light composition', 'Shadows & mood', 'Realistic ambience']
    },
    {
      num: '06',
      title: 'Rendering',
      icon: (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="shadow06">
              <feDropShadow dx="3" dy="6" stdDeviation="5" floodOpacity="0.25"/>
            </filter>
            <linearGradient id="lensGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4dd0e1"/>
              <stop offset="50%" stopColor="#0277bd"/>
              <stop offset="100%" stopColor="#004d40"/>
            </linearGradient>
          </defs>
          <g filter="url(#shadow06)">
            {/* Camera Body */}
            <rect x="20" y="35" width="60" height="40" rx="5" fill="#263238" stroke="#eceff1" strokeWidth="1.5" />
            <rect x="35" y="25" width="30" height="10" rx="2" fill="#37474f" stroke="#eceff1" strokeWidth="1" />
            <circle cx="50" cy="55" r="22" fill="#37474f" stroke="#eceff1" strokeWidth="1.5" />
            <circle cx="50" cy="55" r="16" fill="url(#lensGrad)" />
            <circle cx="45" cy="50" r="4" fill="#ffffff" opacity="0.6" />
            <rect x="25" y="40" width="10" height="6" rx="1" fill="#ef5350" />
            <circle cx="72" cy="42" r="3" fill="#ffffff" />
          </g>
        </svg>
      ),
      bullets: ['High quality render', 'Multi-pass rendering', 'Denoising & optimization', 'Angle variations']
    },
    {
      num: '07',
      title: 'Post Processing',
      icon: (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="shadow07">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.2"/>
            </filter>
          </defs>
          <g filter="url(#shadow07)">
            {/* Monitor */}
            <rect x="15" y="25" width="70" height="45" rx="2" fill="#212121" stroke="#e0e0e0" strokeWidth="2" />
            <rect x="20" y="30" width="60" height="35" fill="#37474f" />
            <path d="M45,70 L55,70 L55,80 L45,80 Z" fill="#757575" />
            <rect x="35" y="80" width="30" height="5" rx="1" fill="#424242" />
            {/* Render on screen */}
            <circle cx="40" cy="45" r="8" fill="#ffb300" opacity="0.8"/>
            <path d="M30,65 L70,65 L50,40 Z" fill="#ab47bc" opacity="0.8"/>
            <path d="M50,65 L70,65 L60,50 Z" fill="#ef5350" opacity="0.8"/>
            <path d="M22,32 L35,32 M22,36 L30,36" stroke="#4dd0e1" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      ),
      bullets: ['Color correction', 'Glare & effects', 'Background cleanup', 'Final touches']
    },
    {
      num: '08',
      title: 'Delivery',
      icon: (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="shadow08">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.2"/>
            </filter>
          </defs>
          <g filter="url(#shadow08)">
            {/* Box bottom */}
            <polygon points="50,85 20,70 50,55 80,70" fill="#d7ccc8" stroke="#5d4037" strokeWidth="1" strokeLinejoin="round"/>
            <polygon points="20,70 50,85 50,55 20,40" fill="#bcaaa4" stroke="#5d4037" strokeWidth="1" strokeLinejoin="round"/>
            <polygon points="50,85 80,70 80,40 50,55" fill="#a1887f" stroke="#5d4037" strokeWidth="1" strokeLinejoin="round"/>
            {/* Box flaps */}
            <polygon points="20,40 50,55 35,35 5,20" fill="#d7ccc8" stroke="#5d4037" strokeWidth="1" opacity="0.9" />
            <polygon points="80,40 50,55 65,35 95,20" fill="#d7ccc8" stroke="#5d4037" strokeWidth="1" opacity="0.9" />
            <polygon points="50,55 20,40 40,25 70,40" fill="#efebe9" stroke="#5d4037" strokeWidth="1" opacity="0.9" />
            {/* Magic sparkles */}
            <circle cx="50" cy="30" r="2" fill="#ffeb3b" />
            <circle cx="40" cy="20" r="1.5" fill="#ffeb3b" />
            <circle cx="60" cy="25" r="2.5" fill="#ffeb3b" />
          </g>
        </svg>
      ),
      bullets: ['Final 3D files', 'High-res renders', 'Source files', 'Usage rights']
    }
  ],
  renderDecorations: () => (
    <>
      <div className="dj-sticky dj-sticky--motion-left">
        <img src="/assets/images/sticky-note-4-v2-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2, padding: '10px', fontSize: '0.8rem', lineHeight: '1.4' }}>
          Precision.<br/>Creativity.<br/>Realism.<br/>That's our<br/>promise.<br/>
          <span style={{ position: 'absolute', bottom: '-10px', right: '10px', fontSize: '1.2rem' }}>☺</span>
        </div>
      </div>
    </>
  ),
  renderBottomCTA: () => (
    <div className="dj-motion-bottom">
      
      {/* Left Wireframe Sketch (Chairs) */}
      <div className="dj-motion-bottom__camera" style={{ flexDirection: 'column', alignItems: 'flex-start', left: '-40px', top: '-50px' }}>
        <div style={{ backgroundImage: "url('/assets/images/sticky-note-2-bg-clean.png')", width: '240px', height: '240px', backgroundSize: '100% 100%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', filter: 'drop-shadow(3px 5px 10px rgba(0,0,0,0.2))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', width: '100%' }}>
            {/* Wireframe chair representation */}
            <svg viewBox="0 0 100 100" width="90" height="90" fill="none" stroke="#555" strokeWidth="1">
              <path d="M20,60 L20,30 L80,30 L80,60" />
              <path d="M30,30 L30,10 L70,10 L70,30" />
              <path d="M40,60 L40,90 M60,60 L60,90 M20,90 L80,90" />
              <path d="M20,30 L80,60 M20,60 L80,30 M30,10 L70,30 M30,30 L70,10" stroke="#aaa" />
            </svg>
            {/* Realistic chair representation */}
            <svg viewBox="0 0 100 100" width="90" height="90" fill="#795548" stroke="#4e342e" strokeWidth="2" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
              <rect x="20" y="30" width="60" height="30" rx="5" />
              <rect x="30" y="10" width="40" height="20" rx="5" />
              <rect x="45" y="60" width="10" height="20" fill="#333" stroke="none" />
              <path d="M30,90 L70,90 L50,80 Z" fill="#424242" stroke="none" />
            </svg>
          </div>
          <div className="dj-camera-text" style={{ fontSize: '1rem', textAlign: 'center', lineHeight: '1.2' }}>
            Turning ideas<br/>
            <span style={{ fontStyle: 'italic' }}>into real-world visuals.</span>
          </div>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', bottom: '10px', right: '10px', transform: 'rotate(-45deg)' }}>
            <path d="M10 19 Q 5 12 14 5" />
            <polyline points="8,5 14,5 14,11" />
          </svg>
        </div>
      </div>

      {/* Middle Notebook Checklist */}
      <div className="dj-motion-bottom__checklist" style={{ backgroundImage: "url('/assets/images/bottom-left.png')", width: '360px', height: '200px', padding: '15px 35px', boxSizing: 'border-box', transform: 'translate(-60px, 40px)' }}>
        <h4 className="dj-motion-bottom__title" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>What you'll get</h4>
        <div style={{ display: 'flex', gap: '15px' }}>
          <ul className="dj-motion-bottom__list" style={{ fontSize: '0.3rem', lineHeight: '0.9' }}>
            <li style={{ marginBottom: '0px' }}><span className="check">✔</span> High quality 3D models</li>
            <li style={{ marginBottom: '0px' }}><span className="check">✔</span> Photorealistic renders</li>
            <li style={{ marginBottom: '0px' }}><span className="check">✔</span> Multiple angles & variations</li>
            <li style={{ marginBottom: '0px' }}><span className="check">✔</span> Ready for marketing & production</li>
            <li style={{ marginBottom: '0px' }}><span className="check">✔</span> Fast turnaround & revisions</li>
          </ul>
        </div>
      </div>

      {/* Third Note - Blueprint Car Sketch */}
      <div className="dj-motion-bottom__camera" style={{ left: '-60px', top: '-40px', opacity: 0.9 }}>
        <div style={{ backgroundColor: '#fcfcfc', width: '380px', height: '220px', padding: '20px', display: 'flex', flexDirection: 'column', filter: 'drop-shadow(4px 6px 12px rgba(0,0,0,0.15))', border: '1px solid #ddd', position: 'relative', borderRadius: '2px', backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
          {/* Detailed Car wireframe sketch SVG */}
          <svg viewBox="0 0 200 100" width="100%" height="120" fill="none" stroke="#222" strokeWidth="1">
            {/* Base construction lines */}
            <path d="M10,80 L190,80 M40,90 L40,30 M150,90 L150,30" stroke="#aaa" strokeWidth="0.5" strokeDasharray="2,2"/>
            {/* Body contour */}
            <path d="M15,65 C20,50 45,45 65,35 C85,25 125,25 155,35 C175,42 185,55 185,65 C185,72 180,75 170,75 L25,75 C15,75 15,70 15,65 Z" fill="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Windows */}
            <path d="M70,35 C85,28 120,28 140,35 C145,40 148,45 150,48 L105,48 L75,48 C72,42 70,38 70,35 Z" fill="#f5f5f5" strokeWidth="1"/>
            <path d="M105,30 L105,48 M140,35 C135,45 130,48 130,48" stroke="#555" strokeWidth="0.5"/>
            {/* Wheels & Arches */}
            <path d="M25,75 C25,60 55,60 55,75" strokeWidth="1.5" strokeDasharray="3,1"/>
            <path d="M135,75 C135,60 165,60 165,75" strokeWidth="1.5" strokeDasharray="3,1"/>
            {/* Detailed Wheels */}
            <circle cx="40" cy="75" r="12" strokeWidth="1.5" fill="#fcfcfc" />
            <circle cx="40" cy="75" r="8" strokeWidth="1" />
            <circle cx="40" cy="75" r="3" strokeWidth="1.5" />
            <path d="M40,67 L40,72 M40,78 L40,83 M32,75 L37,75 M43,75 L48,75" strokeWidth="1"/>
            
            <circle cx="150" cy="75" r="12" strokeWidth="1.5" fill="#fcfcfc"/>
            <circle cx="150" cy="75" r="8" strokeWidth="1" />
            <circle cx="150" cy="75" r="3" strokeWidth="1.5" />
            <path d="M150,67 L150,72 M150,78 L150,83 M142,75 L147,75 M153,75 L158,75" strokeWidth="1"/>
            {/* Details (Lights, Grille, Lines) */}
            <path d="M175,60 C180,60 183,62 183,65" strokeWidth="1"/>
            <path d="M20,62 C25,60 30,60 30,60" strokeWidth="1"/>
            <path d="M60,55 L160,55" stroke="#777" strokeWidth="0.5"/>
            <path d="M55,65 L170,65" stroke="#777" strokeWidth="0.5"/>
            {/* Cross-hatching shading */}
            <path d="M25,65 L30,70 M30,65 L35,70 M35,65 L40,70 M160,65 L165,70 M165,65 L170,70 M170,65 L175,70" stroke="#999" strokeWidth="0.5"/>
            <path d="M10,82 L190,82 M15,85 L185,85" stroke="#ccc" strokeWidth="1"/>
          </svg>
          {/* Labels */}
          <div style={{ fontSize: '0.85rem', fontFamily: "'Caveat', cursive", position: 'absolute', top: '10px', right: '30px', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ transform: 'rotate(135deg)', marginRight: '5px' }}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Clean Geometry
          </div>
          <div style={{ fontSize: '0.85rem', fontFamily: "'Caveat', cursive", position: 'absolute', top: '60px', right: '10px', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ marginRight: '5px' }}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Realistic Materials
          </div>
          <div style={{ fontSize: '0.85rem', fontFamily: "'Caveat', cursive", position: 'absolute', bottom: '15px', right: '60px', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ transform: 'rotate(-45deg)', marginRight: '5px' }}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Perfect Lighting
          </div>
          {/* Material Swatches */}
          <div style={{ display: 'flex', gap: '15px', position: 'absolute', bottom: '20px', left: '20px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#9e9e9e', boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.5), inset -2px -2px 5px rgba(0,0,0,0.5), 2px 2px 4px rgba(0,0,0,0.2)' }}></div>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#795548', boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.2), inset -2px -2px 5px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.2)' }}></div>
          </div>
        </div>
      </div>

      {/* Right Sticky */}
      <div className="dj-sticky" style={{ position: 'absolute', top: '30px', right: '-40px', zIndex: 10, width: '180px', transform: 'rotate(2deg)' }}>
        <img src="/assets/images/sticky-note-5-bg-clean.png" alt="Sticky Note" style={{ width: '100%', height: 'auto', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '20px 25px' }}>
          <div className="dj-note__text" style={{ fontSize: '0.9rem', marginTop: '10px' }}>
            Great products<br/>
            deserve great<br/>
            visuals.<br/>
          </div>
          <svg className="dj-note__doodle" style={{ bottom: '10px', right: '20px', position: 'absolute' }} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
            <path d="M2 19l4-12 6 5 6-5 4 12z" />
          </svg>
        </div>
      </div>

    </div>
  )
};

export const erpSoftwareData: JourneyData = {
  id: 'erp',
  title: 'ERP Software',
  subtitle: 'We design and develop ERP solutions that streamline<br/>processes, connect departments, and deliver real-time insights.',
  timelineBg: 'none',
  timelineStepBg: '/assets/images/d-3-p-2-2.png',
  stamp: (
    <div className="dj-stamp dj-stamp--brand" style={{ top: '-40px', right: '-10px', transform: 'rotate(-5deg)', opacity: 0.8 }}>
      <svg width="120" height="60" viewBox="0 0 160 80">
        <rect x="5" y="5" width="150" height="70" fill="none" stroke="#43a047" strokeWidth="3" strokeDasharray="5,2" />
        <text stroke="none" x="80" y="38" textAnchor="middle" fill="#43a047" fontSize="18" fontWeight="bold" fontFamily="sans-serif">PROCESS</text>
        <text stroke="none" x="80" y="60" textAnchor="middle" fill="#43a047" fontSize="18" fontWeight="bold" fontFamily="sans-serif">APPROVED</text>
      </svg>
      <svg style={{ position: 'absolute', top: '15px', right: '-25px' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#43a047" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </div>
  ),
  steps: [
    {
      num: '01',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M14 6h5M14 10h3" strokeDasharray="1,1" />
        </svg>
      ),
      title: 'Business Analysis',
      bullets: ['Understand business goals', 'Process study', 'Pain points', 'Requirement gathering']
    },
    {
      num: '02',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="8" y="2" width="8" height="6" />
          <path d="M12 8v4" />
          <path d="M6 12h12" />
          <path d="M6 12v4" />
          <path d="M18 12v4" />
          <rect x="2" y="16" width="8" height="6" />
          <rect x="14" y="16" width="8" height="6" />
        </svg>
      ),
      title: 'Department Mapping',
      bullets: ['Map departments', 'Define roles & access', 'Data flow analysis', 'Process alignment']
    },
    {
      num: '03',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="10" width="5" height="5" transform="rotate(45 5.5 12.5)" />
          <path d="M9 12.5h4" />
          <rect x="13" y="10" width="5" height="5" />
          <path d="M15.5 15v3h-4" />
          <rect x="9" y="18" width="5" height="5" />
          <path d="M11.5 8v-2h4" />
          <rect x="15" y="4" width="5" height="5" />
        </svg>
      ),
      title: 'Workflow Design',
      bullets: ['Process automation', 'Workflow diagrams', 'Approval flows', 'Rule definitions']
    },
    {
      num: '04',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 8h20" />
          <path d="M7 8v12" />
          <path d="M10 12h8" />
          <path d="M10 16h6" />
          <circle cx="5" cy="6" r="1" />
          <circle cx="8" cy="6" r="1" />
        </svg>
      ),
      title: 'Module Planning',
      bullets: ['Module selection', 'Feature planning', 'Data structure', 'Integration points']
    },
    {
      num: '05',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M2 20h20" />
          <path d="M8 10l2 2-2 2" />
          <path d="M11 14h4" />
        </svg>
      ),
      title: 'Development',
      bullets: ['Custom development', 'Module integration', 'Database setup', 'API connections']
    },
    {
      num: '06',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M9 10l2 2 4-4" />
          <path d="M9 15l2 2 4-4" />
        </svg>
      ),
      title: 'Testing',
      bullets: ['Functionality test', 'User acceptance test', 'Performance test', 'Security test']
    },
    {
      num: '07',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="10" y="4" width="12" height="10" />
          <path d="M14 8h4" />
          <circle cx="5" cy="10" r="3" />
          <path d="M2 18v-2a4 4 0 0 1 4-4h2" />
          <path d="M7 16l3-6" />
        </svg>
      ),
      title: 'Training',
      bullets: ['User training', 'Documentation', 'Role-based training', 'Process walkthrough']
    },
    {
      num: '08',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13.5 2.5l6 6-9 9-4 4-2-2 4-4 9-9z" />
          <path d="M9.5 6.5l8 8" />
          <path d="M17.5 4.5c2 2 4 6 4 6s-4-2-6-4" />
          <path d="M7 17l-3 3" />
          <path d="M10 20l-3 3" />
        </svg>
      ),
      title: 'Deployment',
      bullets: ['Go-live setup', 'Data migration', 'System monitoring', 'Ongoing support']
    }
  ],
  renderDecorations: () => (
    <>
      <div className="dj-sticky dj-sticky--motion-left">
        <img src="/assets/images/sticky-note-4-v2-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2, padding: '10px', fontSize: '0.8rem', lineHeight: '1.4' }}>
          Every business<br/>has a unique<br/>workflow.<br/>We build ERP<br/>around it.<br/>
          <span style={{ position: 'absolute', bottom: '-10px', right: '10px', fontSize: '1.2rem' }}>☺</span>
        </div>
      </div>
    </>
  ),
  renderBottomCTA: () => (
    <div className="dj-motion-bottom" style={{ position: 'relative' }}>
      
      {/* Bottom Item 1 (Left Sticky Note with Dashboard Sketch) */}
      <div className="dj-motion-bottom__camera" style={{ flexDirection: 'column', alignItems: 'flex-start', left: '-50px', top: '-50px', transform: 'scale(0.85)' }}>
        <div style={{ backgroundImage: "url('/assets/images/sticky-note-2-bg-clean.png')", width: '240px', height: '240px', backgroundSize: '100% 100%', padding: '20px', display: 'flex', flexDirection: 'column', filter: 'drop-shadow(3px 5px 10px rgba(0,0,0,0.2))', position: 'relative' }}>
          
          {/* Dashboard sketch */}
          <div style={{ width: '100%', height: '140px', border: '1px solid #777', borderRadius: '4px', padding: '10px', boxSizing: 'border-box', marginBottom: '10px', position: 'relative', backgroundColor: '#fdfdfd' }}>
            <div style={{ borderBottom: '1px solid #777', height: '15px', marginBottom: '8px', display: 'flex', gap: '4px', paddingLeft: '5px' }}>
               <circle cx="5" cy="8" r="2.5" fill="#777" />
               <circle cx="15" cy="8" r="2.5" fill="#777" />
               <circle cx="25" cy="8" r="2.5" fill="#777" />
            </div>
            <div style={{ display: 'flex', gap: '8px', height: '80px' }}>
              <div style={{ width: '35px', border: '1px solid #777', borderRadius: '2px', padding: '5px' }}>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#aaa', marginBottom: '5px' }}></div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#aaa', marginBottom: '5px' }}></div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#aaa', marginBottom: '5px' }}></div>
              </div>
              <div style={{ flex: 1, border: '1px solid #777', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                 <svg viewBox="0 0 100 50" width="100%" height="100%" fill="none" stroke="#444">
                   <polyline points="0,40 20,30 40,35 60,15 80,25 100,5" strokeWidth="1.5" />
                   <rect x="20" y="25" width="10" height="25" fill="#ccc" stroke="none" />
                   <rect x="40" y="15" width="10" height="35" fill="#aaa" stroke="none" />
                   <rect x="60" y="30" width="10" height="20" fill="#999" stroke="none" />
                 </svg>
              </div>
            </div>
          </div>

          {/* Small green sticky note overlay */}
          <div style={{ position: 'absolute', bottom: '15px', left: '10px', backgroundColor: '#dce775', padding: '10px 15px', width: '130px', fontSize: '0.75rem', transform: 'rotate(-5deg)', boxShadow: '2px 3px 6px rgba(0,0,0,0.2)', fontFamily: "'Caveat', cursive", lineHeight: '1.2' }}>
            Real-time insights.<br/>Better decisions.
            <svg style={{ position: 'absolute', bottom: '5px', right: '5px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          
        </div>
      </div>

      {/* Bottom Item 2 (Middle Checklist) */}
      <div className="dj-motion-bottom__checklist" style={{ backgroundImage: "url('/assets/images/bottom-left.png')", width: '360px', height: '200px', padding: '15px 30px', boxSizing: 'border-box', transform: 'translate(-50px, 40px) scale(0.85)' }}>
        <h4 className="dj-motion-bottom__title" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>What you'll get</h4>
        <div style={{ display: 'flex', gap: '15px' }}>
          <ul className="dj-motion-bottom__list" style={{ fontSize: '0.55rem', lineHeight: '1.2', flex: 1, margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Centralized Dashboard</li>
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Inventory Management</li>
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Sales & CRM</li>
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Purchase Management</li>
          </ul>
          <ul className="dj-motion-bottom__list" style={{ fontSize: '0.55rem', lineHeight: '1.2', flex: 1, margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> HR & Payroll</li>
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Accounting & Finance</li>
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Reports & Analytics</li>
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Role-based Access</li>
          </ul>
        </div>
      </div>

      {/* Bottom Item 4 (ERP Workflow Diagram on White Board) */}
      <div className="dj-motion-bottom__camera" style={{ left: '-50px', top: '-40px', opacity: 0.9, transform: 'scale(0.85)' }}>
        <div style={{ backgroundColor: '#fcfcfc', width: '380px', height: '220px', padding: '20px', display: 'flex', flexDirection: 'column', filter: 'drop-shadow(4px 6px 12px rgba(0,0,0,0.15))', border: '1px solid #ddd', position: 'relative', borderRadius: '2px', backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
          
          {/* ERP Diagram SVG */}
          <svg viewBox="0 0 380 220" width="100%" height="100%" fill="none" stroke="#333" strokeWidth="1.2">
            {/* Center Box (ERP SYSTEM) */}
            <rect x="130" y="80" width="120" height="40" fill="#e8f5e9" stroke="#4caf50" strokeWidth="2" rx="2" />
            <text stroke="none" fill="#333" x="190" y="105" textAnchor="middle" fontSize="14" fontFamily="sans-serif" fontWeight="bold">ERP SYSTEM</text>
            
            {/* Sales - top left */}
            <rect x="40" y="25" width="70" height="25" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="75" y="42" textAnchor="middle" fontSize="11" fontFamily="sans-serif">Sales</text>
            
            {/* Inventory - top middle */}
            <rect x="155" y="25" width="70" height="25" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="190" y="42" textAnchor="middle" fontSize="11" fontFamily="sans-serif">Inventory</text>
            
            {/* Purchase - top right */}
            <rect x="270" y="25" width="70" height="25" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="305" y="42" textAnchor="middle" fontSize="11" fontFamily="sans-serif">Purchase</text>
            
            {/* Finance - bottom left */}
            <rect x="40" y="155" width="70" height="25" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="75" y="172" textAnchor="middle" fontSize="11" fontFamily="sans-serif">Finance</text>
            
            {/* HR - bottom middle */}
            <rect x="155" y="155" width="70" height="25" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="190" y="172" textAnchor="middle" fontSize="11" fontFamily="sans-serif">HR</text>
            
            {/* Reports - bottom right */}
            <rect x="270" y="155" width="70" height="25" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="305" y="172" textAnchor="middle" fontSize="11" fontFamily="sans-serif">Reports</text>

            {/* Arrows */}
            {/* To Sales */}
            <path d="M130,90 L75,90 L75,50" strokeDasharray="3,2" />
            <polyline points="70,55 75,50 80,55" />
            
            {/* To Inventory */}
            <path d="M190,80 L190,50" strokeDasharray="3,2" />
            <polyline points="185,55 190,50 195,55" />
            
            {/* To Purchase */}
            <path d="M250,90 L305,90 L305,50" strokeDasharray="3,2" />
            <polyline points="300,55 305,50 310,55" />
            
            {/* To Finance */}
            <path d="M130,110 L75,110 L75,155" strokeDasharray="3,2" />
            <polyline points="70,150 75,155 80,150" />
            
            {/* To HR */}
            <path d="M190,120 L190,155" strokeDasharray="3,2" />
            <polyline points="185,150 190,155 195,150" />
            
            {/* To Reports */}
            <path d="M250,110 L305,110 L305,155" strokeDasharray="3,2" />
            <polyline points="300,150 305,155 310,150" />
          </svg>
        </div>

        {/* Bottom Item 3 (Small Sticky Note - Built for growth) Overlay */}
        <div className="dj-sticky" style={{ width: '130px', position: 'absolute', top: '100px', left: '-110px', transform: 'rotate(-4deg)', zIndex: 5 }}>
           <div className="dj-note__paper" style={{ backgroundImage: "url('/assets/images/sticky-note-4-v2-clean.png')", width: '100%', height: '130px', backgroundSize: '100% 100%', padding: '15px 20px', backgroundColor: 'rgba(205, 220, 57, 0.4)', backgroundBlendMode: 'multiply' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: "'Caveat', cursive", lineHeight: '1.2', color: '#222', marginTop: '1px' }}>
                Built for your business. Built for growth.
              </div>
              <svg style={{ position: 'absolute', bottom: '15px', right: '15px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5">
                 <path d="M2 19l4-12 6 5 6-5 4 12z" />
              </svg>
           </div>
        </div>
      </div>

      {/* Bottom Item 5 (Right Sticky - Blue) */}
      <div className="dj-sticky" style={{ position: 'absolute', top: '30px', right: '-40px', zIndex: 10, width: '180px', transform: 'scale(0.85) rotate(2deg)' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src="/assets/images/sticky-note-5-bg-clean.png" alt="Sticky Note" style={{ width: '100%', height: 'auto', display: 'block' }} />
          {/* Blue overlay tint */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(33, 150, 243, 0.25)', mixBlendMode: 'multiply', borderRadius: '5px' }}></div>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, padding: '25px 20px' }}>
            <div className="dj-note__text" style={{ fontSize: '0.85rem', marginTop: '5px', lineHeight: '1.4' }}>
              One system.
              One source of truth.
              Endless possibilities.
            </div>
            <svg className="dj-note__doodle" style={{ bottom: '15px', right: '15px', position: 'absolute' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.9 7.9 7.9-7.9 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  )
};

export const customSoftwareData: JourneyData = {
  id: 'custom',
  title: 'Custom Software',
  subtitle: 'From concept to scalable solution — we build custom software<br/>that grows with your business.',
  timelineBg: 'none',
  timelineStepBg: '/assets/images/d-3-p-2-2.png',
  stamp: (
    <div className="dj-stamp dj-stamp--brand" style={{ top: '-40px', right: '-10px', transform: 'rotate(-5deg)', opacity: 0.8 }}>
      <svg width="180" height="60" viewBox="0 0 200 80">
        <rect x="5" y="5" width="190" height="70" fill="none" stroke="#673ab7" strokeWidth="3" strokeDasharray="5,2" />
        <text stroke="none" x="100" y="38" textAnchor="middle" fill="#673ab7" fontSize="16" fontWeight="bold" fontFamily="sans-serif">CODE QUALITY</text>
        <text stroke="none" x="100" y="60" textAnchor="middle" fill="#673ab7" fontSize="18" fontWeight="bold" fontFamily="sans-serif">APPROVED</text>
      </svg>
      <svg style={{ position: 'absolute', top: '15px', right: '-25px' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#673ab7" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </div>
  ),
  steps: [
    {
      num: '01',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v1" />
          <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
          <path d="M18.36 6.64l.71-.71" />
          <path d="M5.64 6.64l-.71-.71" />
        </svg>
      ),
      title: 'Requirements',
      bullets: ['Understand goals', 'Gather requirements', 'Define scope', 'Identify key features']
    },
    {
      num: '02',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="8" y="2" width="8" height="6" />
          <path d="M12 8v4" />
          <path d="M6 12h12" />
          <path d="M6 12v4" />
          <path d="M18 12v4" />
          <rect x="2" y="16" width="8" height="6" />
          <rect x="14" y="16" width="8" height="6" />
        </svg>
      ),
      title: 'Architecture',
      bullets: ['System architecture', 'Technology stack', 'Database design', 'API planning']
    },
    {
      num: '03',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 8h20" />
          <path d="M6 4v4" />
          <rect x="6" y="12" width="4" height="4" />
          <rect x="14" y="12" width="4" height="4" />
        </svg>
      ),
      title: 'UI / UX Design',
      bullets: ['User flow', 'Wireframes', 'UI Design', 'Interactive prototype']
    },
    {
      num: '04',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 12l2 2-2 2" />
          <path d="M13 16h4" />
        </svg>
      ),
      title: 'Development',
      bullets: ['Clean coding', 'Feature development', 'API integration', 'Version control']
    },
    {
      num: '05',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M9 10l2 2 4-4" />
          <path d="M9 15l2 2 4-4" />
        </svg>
      ),
      title: 'Testing',
      bullets: ['Functional testing', 'Performance testing', 'Security testing', 'Bug fixing']
    },
    {
      num: '06',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 12v9" />
          <path d="M16 16l-4-4-4 4" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
      ),
      title: 'Deployment',
      bullets: ['Server setup', 'CI/CD pipeline', 'Staging testing', 'Production deploy']
    },
    {
      num: '07',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 16l4-4 4 2 4-6" />
          <circle cx="18" cy="8" r="1" />
        </svg>
      ),
      title: 'Monitoring',
      bullets: ['Performance monitoring', 'Error tracking', 'User analytics', 'System alerts']
    },
    {
      num: '08',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4z" />
          <path d="M3 19a2 2 0 0 0 2 2h1v-6H3v4z" />
          <path d="M12 17v4" />
        </svg>
      ),
      title: 'Support & Scale',
      bullets: ['Ongoing support', 'Feature updates', 'Scalability planning', 'Continuous improvement']
    }
  ],
  renderDecorations: () => (
    <>
      <div className="dj-sticky dj-sticky--motion-left">
        <img src="/assets/images/sticky-note-philosophy-bg-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2, padding: '15px 10px', fontSize: '0.8rem', lineHeight: '1.4' }}>
          Your idea.<br/>Our code.<br/>Endless<br/>possibilities.<br/>
          <span style={{ position: 'absolute', bottom: '0px', right: '15px', fontSize: '1.2rem' }}>☺</span>
        </div>
      </div>
    </>
  ),
  renderBottomCTA: () => (
    <div className="dj-motion-bottom" style={{ position: 'relative' }}>
      
      {/* Bottom Item 1 (Left Box with Code Editor Sketch) */}
      <div className="dj-motion-bottom__camera" style={{ flexDirection: 'column', alignItems: 'flex-start', left: '-50px', top: '-50px', transform: 'scale(0.85)' }}>
        <div style={{ backgroundImage: "url('/assets/images/sticky-note-2-bg-clean.png')", width: '250px', height: '240px', backgroundSize: '100% 100%', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', filter: 'drop-shadow(3px 5px 10px rgba(0,0,0,0.2))', position: 'relative' }}>
          
          {/* Dark Code Editor sketch */}
          <div style={{ width: '100%', height: '140px', backgroundColor: '#1e1e1e', borderRadius: '4px', padding: '10px', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', border: '1px solid #444', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
               <circle cx="4" cy="4" r="3" fill="#ff5f56" />
               <circle cx="12" cy="4" r="3" fill="#ffbd2e" />
               <circle cx="20" cy="4" r="3" fill="#27c93f" />
            </div>
            {/* Fake Code Lines */}
            <svg width="100%" height="90" viewBox="0 0 200 90">
               <rect x="0" y="0" width="30" height="4" fill="#c586c0" />
               <rect x="35" y="0" width="40" height="4" fill="#9cdcfe" />
               <rect x="80" y="0" width="10" height="4" fill="#d4d4d4" />
               
               <rect x="10" y="10" width="40" height="4" fill="#569cd6" />
               <rect x="55" y="10" width="60" height="4" fill="#ce9178" />
               
               <rect x="10" y="20" width="20" height="4" fill="#c586c0" />
               <rect x="35" y="20" width="30" height="4" fill="#4ec9b0" />
               
               <rect x="20" y="30" width="30" height="4" fill="#dcdcaa" />
               <rect x="55" y="30" width="40" height="4" fill="#9cdcfe" />
               
               <rect x="30" y="40" width="50" height="4" fill="#ce9178" />
               
               <rect x="20" y="50" width="20" height="4" fill="#c586c0" />
               <rect x="0" y="60" width="10" height="4" fill="#d4d4d4" />
            </svg>
          </div>

          {/* Hand annotation below editor */}
          <div style={{ marginTop: '15px', paddingLeft: '15px', fontSize: '0.65rem', fontFamily: "'Caveat', cursive", lineHeight: '1.2', transform: 'rotate(-2deg)' }}>
            Clean code.<br/>
            Better performance.<br/>
            Scalable solution.<br/>
          </div>
          
        </div>
      </div>

      {/* Bottom Item 2 (Middle Checklist) */}
      <div className="dj-motion-bottom__checklist" style={{ backgroundImage: "url('/assets/images/bottom-left.png')", width: '360px', height: '200px', padding: '15px 30px', boxSizing: 'border-box', transform: 'translate(-50px, 40px) scale(0.85)' }}>
        <h4 className="dj-motion-bottom__title" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>What you'll get</h4>
        <div style={{ display: 'flex', gap: '15px' }}>
          <ul className="dj-motion-bottom__list" style={{ fontSize: '0.55rem', lineHeight: '1.2', flex: 1, margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Custom Solution</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Scalable Architecture</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Clean & Secure Code</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> High Performance</li>
          </ul>
          <ul className="dj-motion-bottom__list" style={{ fontSize: '0.55rem', lineHeight: '1.2', flex: 1, margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Admin Dashboard</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> API Integrations</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Documentation</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Ongoing Support</li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Item 3 (Small Purple Sticky Note) */}
      {/* Placed between Checklist and Diagram as requested */}
      <div className="dj-sticky" style={{ width: '130px', position: 'absolute', top: '0px', left: '460px', transform: 'rotate(-4deg) scale(0.85)', zIndex: 6 }}>
         <div style={{ backgroundImage: "url('/assets/images/sticky-note-philosophy-bg-clean.png')", width: '100%', height: '140px', backgroundSize: '100% 100%', padding: '20px', boxShadow: '3px 4px 8px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '0.6rem', fontFamily: "'Caveat', cursive", lineHeight: '1.2', color: '#222', textAlign: 'center' }}>
              We don't just write code.
              We solve business problems.
            </div>
            <svg style={{ position: 'absolute', top: '10px', left: '10px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5">
               <path d="M9 18h6" />
               <path d="M10 22h4" />
               <path d="M12 2v1" />
               <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
            </svg>
            <svg style={{ position: 'absolute', bottom: '10px', right: '15px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#673ab7" strokeWidth="1.5">
               <path d="M2 19l4-12 6 5 6-5 4 12z" />
            </svg>
         </div>
      </div>

      {/* Bottom Item 4 (API Gateway Diagram on White Board) */}
      <div className="dj-motion-bottom__camera" style={{ left: '-50px', top: '-40px', opacity: 0.9, transform: 'scale(0.85)', zIndex: 1 }}>
        <div style={{ backgroundColor: '#fcfcfc', width: '400px', height: '240px', padding: '15px', display: 'flex', flexDirection: 'column', filter: 'drop-shadow(4px 6px 12px rgba(0,0,0,0.15))', border: '1px solid #ddd', position: 'relative', borderRadius: '2px', backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
          
          {/* API Gateway Diagram SVG */}
          <svg viewBox="0 0 400 240" width="100%" height="100%" fill="none" stroke="#333" strokeWidth="1.2">
            
            {/* Top: Web/Mobile Application */}
            <rect x="130" y="15" width="140" height="25" fill="#fff" stroke="#555" rx="2" />
            <text stroke="none" fill="#333" x="200" y="32" textAnchor="middle" fontSize="10" fontFamily="sans-serif">Web / Mobile Application</text>
            
            {/* Center: API Gateway */}
            <rect x="150" y="70" width="100" height="25" fill="#f5f5f5" stroke="#555" rx="2" />
            <text stroke="none" fill="#333" x="200" y="87" textAnchor="middle" fontSize="10" fontFamily="sans-serif" fontWeight="bold">API Gateway</text>
            
            {/* Below Center: Business Logic */}
            <rect x="150" y="125" width="100" height="35" fill="#fff" stroke="#555" strokeDasharray="3,3" />
            <text stroke="none" fill="#333" x="200" y="146" textAnchor="middle" fontSize="10" fontFamily="sans-serif">Business Logic</text>

            {/* Bottom: Database */}
            <path d="M150,190 C150,185 250,185 250,190 L250,210 C250,215 150,215 150,210 Z" fill="#fff" stroke="#555" />
            <path d="M150,190 C150,195 250,195 250,190" stroke="#555" />
            <text stroke="none" fill="#333" x="200" y="206" textAnchor="middle" fontSize="10" fontFamily="sans-serif">Database</text>
            
            {/* Left: Auth Service */}
            <rect x="25" y="125" width="90" height="30" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="70" y="140" textAnchor="middle" fontSize="9" fontFamily="sans-serif">Authentication</text>
            <text stroke="none" fill="#333" x="70" y="150" textAnchor="middle" fontSize="9" fontFamily="sans-serif">Service</text>
            
            {/* Right: File Storage */}
            <rect x="285" y="125" width="90" height="30" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="330" y="140" textAnchor="middle" fontSize="9" fontFamily="sans-serif">File Storage</text>
            <text stroke="none" fill="#333" x="330" y="150" textAnchor="middle" fontSize="9" fontFamily="sans-serif">Service</text>

            {/* Bottom-right: Third-party */}
            <rect x="285" y="185" width="90" height="25" fill="#fff" stroke="#555" />
            <text stroke="none" fill="#333" x="330" y="202" textAnchor="middle" fontSize="9" fontFamily="sans-serif">Third-party Services</text>

            {/* Arrows */}
            {/* App to API Gateway */}
            <path d="M200,40 L200,70" strokeDasharray="2,2" />
            <polyline points="196,65 200,70 204,65" />
            
            {/* API Gateway to Logic */}
            <path d="M200,95 L200,125" strokeDasharray="2,2" />
            <polyline points="196,120 200,125 204,120" />
            
            {/* Logic to Database */}
            <path d="M200,160 L200,185" strokeDasharray="2,2" />
            <polyline points="196,180 200,185 204,180" />

            {/* API Gateway to Auth */}
            <path d="M150,82 L70,82 L70,125" strokeDasharray="2,2" />
            <polyline points="66,120 70,125 74,120" />

            {/* API Gateway to File Storage */}
            <path d="M250,82 L330,82 L330,125" strokeDasharray="2,2" />
            <polyline points="326,120 330,125 334,120" />

            {/* API Gateway to Third-party */}
            <path d="M250,90 L380,90 L380,197 L375,197" strokeDasharray="2,2" />
            <polyline points="380,193 375,197 380,201" />

          </svg>
          
          <div style={{ position: 'absolute', top: '-10px', right: '30px' }}>
             {/* Paper clip doodle */}
             <svg width="20" height="40" viewBox="0 0 20 40" fill="none" stroke="#777" strokeWidth="2">
               <path d="M10,5 L10,35 C10,38 15,38 15,35 L15,10 C15,5 5,5 5,10 L5,30" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
          </div>
        </div>
      </div>

    </div>
  )
};

export const aiAutomationData: JourneyData = {
  id: 'ai',
  title: 'AI Automation',
  subtitle: 'We use AI and automation to eliminate repetitive tasks,<br/>improve accuracy, and save hours of manual work.',
  timelineBg: 'none',
  timelineStepBg: '/assets/images/d-3-p-2-2.png',
  stamp: (
    <div className="dj-stamp dj-stamp--brand" style={{ top: '-40px', right: '-10px', transform: 'rotate(-5deg)', opacity: 0.8 }}>
      <svg width="180" height="60" viewBox="0 0 200 80">
        <rect x="5" y="5" width="190" height="70" fill="none" stroke="#673ab7" strokeWidth="3" strokeDasharray="5,2" />
        <text stroke="none" x="100" y="38" textAnchor="middle" fill="#673ab7" fontSize="16" fontWeight="bold" fontFamily="sans-serif">AUTOMATION</text>
        <text stroke="none" x="100" y="60" textAnchor="middle" fill="#673ab7" fontSize="18" fontWeight="bold" fontFamily="sans-serif">APPROVED</text>
      </svg>
      <svg style={{ position: 'absolute', top: '15px', right: '-25px' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#673ab7" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </div>
  ),
  steps: [
    {
      num: '01',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M7 11h8" />
          <path d="M11 7v8" />
        </svg>
      ),
      title: 'Problem Discovery',
      bullets: ['Identify repetitive tasks', 'Evaluate business impact', 'Understand pain points', 'Define automation goals']
    },
    {
      num: '02',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="8" y="2" width="8" height="6" />
          <path d="M12 8v4" />
          <path d="M6 12h12" />
          <path d="M6 12v4" />
          <path d="M18 12v4" />
          <rect x="2" y="16" width="8" height="6" />
          <rect x="14" y="16" width="8" height="6" />
        </svg>
      ),
      title: 'Workflow Analysis',
      bullets: ['Map current workflow', 'Find bottlenecks', 'Document processes', 'Prioritize opportunities']
    },
    {
      num: '03',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 8V4" />
          <path d="M12 20v-4" />
          <path d="M8 12H4" />
          <path d="M20 12h-4" />
          <circle cx="12" cy="2" r="2" />
          <circle cx="12" cy="22" r="2" />
          <circle cx="2" cy="12" r="2" />
          <circle cx="22" cy="12" r="2" />
          <text stroke="none" fill="#333" x="12" y="14" textAnchor="middle" fontSize="6" fontFamily="sans-serif">AI</text>
        </svg>
      ),
      title: 'AI Opportunity Mapping',
      bullets: ['Spot automation areas', 'Choose right AI tools', 'Define data needs', 'Plan integration points']
    },
    {
      num: '04',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 8h20" />
          <path d="M6 12h8" />
          <path d="M6 16h12" />
          <circle cx="6" cy="6" r="1" />
          <circle cx="10" cy="6" r="1" />
        </svg>
      ),
      title: 'Solution Design',
      bullets: ['Design automation flow', 'Build prompt logic', 'Plan user interactions', 'Define success metrics']
    },
    {
      num: '05',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 8v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M12 12v4" />
          <path d="M10 14h4" />
          <path d="M8 4v4" />
          <path d="M16 4v4" />
        </svg>
      ),
      title: 'Build & Integration',
      bullets: ['Develop automation', 'Integrate with tools', 'Connect APIs & data', 'Configure workflows']
    },
    {
      num: '06',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 14l2 2 4-4" />
          <circle cx="18" cy="18" r="4" />
          <path d="M21 21l2 2" />
        </svg>
      ),
      title: 'Testing & Validation',
      bullets: ['Test all scenarios', 'Validate accuracy', 'Check edge cases', 'Improve performance']
    },
    {
      num: '07',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M6 13l4-4 4 2 4-6" />
        </svg>
      ),
      title: 'Deployment',
      bullets: ['Deploy automation', 'User training', 'Documentation', 'Go-live support']
    },
    {
      num: '08',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 2 6-8" />
          <path d="M21 6v4" />
          <path d="M17 6h4" />
        </svg>
      ),
      title: 'Optimize & Scale',
      bullets: ['Monitor performance', 'Analyze results', 'Optimize workflows', 'Scale automation']
    }
  ],
  renderDecorations: () => (
    <>
      <div className="dj-sticky dj-sticky--motion-left">
        <img src="/assets/images/sticky-note-2-bg-clean.png" alt="Sticky Note" />
        <div style={{ position: 'relative', zIndex: 2, padding: '15px 10px', fontSize: '0.75rem', lineHeight: '1.4' }}>
          Smart automation<br/>for real results.<br/>Faster workflows.<br/>Smarter teams.<br/>
          <span style={{ position: 'absolute', bottom: '0px', right: '15px', fontSize: '1.2rem' }}>☺</span>
        </div>
      </div>
    </>
  ),
  renderBottomCTA: () => (
    <div className="dj-motion-bottom" style={{ position: 'relative' }}>
      
      {/* Bottom Item 1 (Left Box with Example Workflow) */}
      <div className="dj-motion-bottom__camera" style={{ flexDirection: 'column', alignItems: 'flex-start', left: '-50px', top: '-50px', transform: 'scale(0.85)' }}>
        <div style={{ backgroundImage: "url('/assets/images/sticky-note-2-bg-clean.png')", width: '250px', height: '240px', backgroundSize: '100% 100%', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', filter: 'drop-shadow(3px 5px 10px rgba(0,0,0,0.2))', position: 'relative' }}>
          <h4 style={{ fontSize: '0.8rem', fontFamily: "'Caveat', cursive", textAlign: 'center', marginBottom: '10px' }}>Example Workflow</h4>
          
          <div style={{ width: '100%', height: '180px', position: 'relative' }}>
            <svg viewBox="0 0 220 180" width="100%" height="100%" fill="none" stroke="#333" strokeWidth="1.2">
              
              {/* Row 1: Form -> AI -> Process */}
              <rect x="5" y="20" width="60" height="30" fill="#fff" stroke="#333" rx="2" />
              <text stroke="none" fill="#333" x="35" y="34" textAnchor="middle" fontSize="7" fontFamily="sans-serif">Form / Email</text>
              <text stroke="none" fill="#333" x="35" y="44" textAnchor="middle" fontSize="7" fontFamily="sans-serif">Received</text>

              <path d="M65,35 L85,35" strokeDasharray="2,2" />
              <polyline points="82,32 85,35 82,38" />

              <rect x="85" y="20" width="55" height="30" fill="#fff" stroke="#333" rx="2" />
              <text stroke="none" fill="#333" x="112.5" y="34" textAnchor="middle" fontSize="7" fontFamily="sans-serif">Data Extracted</text>
              <text stroke="none" fill="#333" x="112.5" y="44" textAnchor="middle" fontSize="7" fontFamily="sans-serif">( AI )</text>

              <path d="M140,35 L160,35" strokeDasharray="2,2" />
              <polyline points="157,32 160,35 157,38" />

              <rect x="160" y="20" width="55" height="30" fill="#fff" stroke="#333" rx="2" />
              <text stroke="none" fill="#333" x="187.5" y="34" textAnchor="middle" fontSize="7" fontFamily="sans-serif">Process</text>
              <text stroke="none" fill="#333" x="187.5" y="44" textAnchor="middle" fontSize="7" fontFamily="sans-serif">Automated</text>

              {/* Row 2: Response & DB */}
              <path d="M187.5,50 L187.5,90" strokeDasharray="2,2" />
              <polyline points="184.5,87 187.5,90 190.5,87" />
              
              <rect x="160" y="90" width="55" height="30" fill="#fff" stroke="#333" rx="2" />
              <text stroke="none" fill="#333" x="187.5" y="104" textAnchor="middle" fontSize="7" fontFamily="sans-serif">Data Stored</text>

              {/* Arrow from Data Stored left to Response */}
              <path d="M160,105 L70,105" strokeDasharray="2,2" />
              <polyline points="73,102 70,105 73,108" />
              <polyline points="157,102 160,105 157,108" />

              <rect x="15" y="90" width="55" height="30" fill="#fff" stroke="#333" rx="2" />
              <text stroke="none" fill="#333" x="42.5" y="104" textAnchor="middle" fontSize="7" fontFamily="sans-serif">Response Sent</text>
              
              {/* Database Icon under Data Stored */}
              <path d="M175,135 C175,130 200,130 200,135 L200,155 C200,160 175,160 175,155 Z" fill="#fff" stroke="#333" />
              <path d="M175,135 C175,140 200,140 200,135" stroke="#333" />
              <path d="M175,145 C175,150 200,150 200,145" stroke="#333" />
              
            </svg>
          </div>
          
        </div>
      </div>

      {/* Bottom Item 2 (Middle Checklist) */}
      <div className="dj-motion-bottom__checklist" style={{ backgroundImage: "url('/assets/images/bottom-left.png')", width: '360px', height: '200px', padding: '15px 20px', boxSizing: 'border-box', transform: 'translate(-50px, 40px) scale(0.85)' }}>
        <h4 className="dj-motion-bottom__title" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>What you'll get</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <ul className="dj-motion-bottom__list" style={{ fontSize: '0.35rem', lineHeight: '0.85', flex: 1, margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> AI-Powered Automation</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Reduced Manual Work</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Improved Accuracy</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Faster Response Time</li>
          </ul>
          <ul className="dj-motion-bottom__list" style={{ fontSize: '0.45rem', lineHeight: '1.25', flex: 1, margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Cost Savings</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Real-Time Insights</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Scalable Solutions</li>
            <li style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start' }}><span className="check" style={{ marginRight: '4px' }}>✔</span> Continuous Optimization</li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Item 3 (Small Purple Sticky Note) */}
      <div className="dj-sticky" style={{ width: '130px', position: 'absolute', top: '0px', left: '420px', transform: 'rotate(-4deg) scale(0.85)', zIndex: 6 }}>
         <div style={{ backgroundImage: "url('/assets/images/sticky-note-philosophy-bg-clean.png')", width: '120%', height: '140px', backgroundSize: '100% 100%', padding: '20px', boxShadow: '3px 4px 8px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '0.55rem', fontFamily: "'Caveat', cursive", lineHeight: '1.1', color: '#222', textAlign: 'center', marginTop: '5px' }}>
              Let AI handle the busy work, so your team can do their best work.
            </div>
            <svg style={{ position: 'absolute', bottom: '15px', right: '15px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#673ab7" strokeWidth="1.5">
               <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
         </div>
      </div>

      {/* Bottom Item 4 (AI Automation Stack Diagram on White Board) */}
      <div className="dj-motion-bottom__camera" style={{ left: '-50px', top: '-40px', opacity: 0.9, transform: 'scale(0.85)', zIndex: 1 }}>
        <div style={{ backgroundColor: '#fcfcfc', width: '400px', height: '240px', padding: '15px', display: 'flex', flexDirection: 'column', filter: 'drop-shadow(4px 6px 12px rgba(0,0,0,0.15))', border: '1px solid #ddd', position: 'relative', borderRadius: '2px', backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
          
          <h4 style={{ fontSize: '0.9rem', fontFamily: "'Caveat', cursive", textAlign: 'center', marginBottom: '5px' }}>AI Automation Stack</h4>

          {/* AI Stack Diagram SVG */}
          <svg viewBox="0 0 400 180" width="100%" height="100%" fill="none" stroke="#333" strokeWidth="1.2">
            
            {/* 1. Data Sources */}
            <path d="M40,50 C40,45 70,45 70,50 L70,80 C70,85 40,85 40,80 Z" fill="#fff" stroke="#333" />
            <path d="M40,50 C40,55 70,55 70,50" stroke="#333" />
            <path d="M40,60 C40,65 70,65 70,60" stroke="#333" />
            <path d="M40,70 C40,75 70,75 70,70" stroke="#333" />
            <text stroke="none" fill="#333" x="55" y="105" textAnchor="middle" fontSize="10" fontFamily="sans-serif">Data Sources</text>

            <path d="M80,65 L105,65" strokeDasharray="2,2" />
            <polyline points="102,62 105,65 102,68" />

            {/* 2. AI Engine */}
            <rect x="115" y="40" width="40" height="40" fill="#fff" stroke="none" />
            <path d="M125,50 C125,40 145,40 145,50 C150,55 145,65 135,70 C125,75 115,70 125,60 Z" stroke="#333" strokeWidth="1.5" />
            <path d="M135,50 v15 M125,60 h10" stroke="#333" />
            <text stroke="none" fill="#333" x="135" y="105" textAnchor="middle" fontSize="10" fontFamily="sans-serif">AI Engine</text>
            
            <path d="M160,65 L185,65" strokeDasharray="2,2" />
            <polyline points="182,62 185,65 182,68" />

            {/* 3. Automation */}
            <circle cx="215" cy="60" r="16" fill="#fff" stroke="#333" />
            <circle cx="215" cy="60" r="6" stroke="#333" />
            <path d="M215,38 v6 M215,76 v6 M193,60 h6 M231,60 h6 M200,45 l4,4 M230,75 l-4,-4 M200,75 l4,-4 M230,45 l-4,4" stroke="#333" strokeWidth="1.5" />
            <text stroke="none" fill="#333" x="215" y="105" textAnchor="middle" fontSize="10" fontFamily="sans-serif">Automation</text>

            <path d="M245,65 L270,65" strokeDasharray="2,2" />
            <polyline points="267,62 270,65 267,68" />

            {/* 4. Apps & Tools */}
            <rect x="285" y="45" width="20" height="30" rx="2" fill="#fff" stroke="#333" />
            <rect x="315" y="45" width="25" height="30" rx="2" fill="#fff" stroke="#333" />
            <line x1="285" y1="50" x2="305" y2="50" />
            <line x1="315" y1="52" x2="340" y2="52" />
            <text stroke="none" fill="#333" x="312.5" y="105" textAnchor="middle" fontSize="10" fontFamily="sans-serif">Apps & Tools</text>

            {/* Bottom Process Box */}
            <rect x="110" y="130" width="220" height="30" fill="#fff" stroke="#555" strokeDasharray="3,3" />
            <text stroke="none" fill="#333" x="140" y="149" textAnchor="middle" fontSize="9" fontFamily="sans-serif">Monitor</text>
            
            <path d="M165,145 L180,145" strokeDasharray="2,2" />
            <polyline points="177,142 180,145 177,148" />
            
            <text stroke="none" fill="#333" x="205" y="149" textAnchor="middle" fontSize="9" fontFamily="sans-serif">Analyze</text>
            
            <path d="M230,145 L245,145" strokeDasharray="2,2" />
            <polyline points="242,142 245,145 242,148" />

            <text stroke="none" fill="#333" x="275" y="149" textAnchor="middle" fontSize="9" fontFamily="sans-serif">Optimize</text>

          </svg>
          
          <div style={{ position: 'absolute', top: '-10px', right: '30px' }}>
             {/* Paper clip doodle */}
             <svg width="20" height="40" viewBox="0 0 20 40" fill="none" stroke="#777" strokeWidth="2">
               <path d="M10,5 L10,35 C10,38 15,38 15,35 L15,10 C15,5 5,5 5,10 L5,30" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
          </div>
        </div>
      </div>

    </div>
  )
};

export const fallbackJourneyData = (id: string, title: string): JourneyData => ({
  ...brandJourneyData,
  id,
  title: title.replace('<br/>', ' '),
});
