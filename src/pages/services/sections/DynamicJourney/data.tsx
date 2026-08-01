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

export const fallbackJourneyData = (id: string, title: string): JourneyData => ({
  ...brandJourneyData,
  id,
  title: title.replace('<br/>', ' '),
});
