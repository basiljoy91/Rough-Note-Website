import './div2-rough-note.css';

export function Div2RoughNote() {
  const bottomPads = [
    { num: '01', title: 'ENTER\nTHE STUDIO', desc: '', active: true, visual: 'door' },
    { num: '02', title: 'THE THINKING', desc: 'Research, strategy\nand exploration.', active: false, visual: 'sketch' },
    { num: '03', title: 'BRANDS TAKE\nSHAPE', desc: 'From sketch to\nidentity.', active: false, visual: 'r-logo' },
    { num: '04', title: 'TURN IT\nDIGITAL', desc: 'Web experiences\nthat connect.', active: false, visual: 'wireframe' },
    { num: '05', title: 'BUILD THE\nMACHINE', desc: 'Software that runs\nthe business.', active: false, visual: 'dashboard' },
    { num: '06', title: 'MAKE WORK\nSMARTER', desc: 'Automation that\nsaves time.', active: false, visual: 'automation' },
    { num: '07', title: 'MAKE IDEAS\nMOVE', desc: 'Motion and 3D that\nbring stories to life.', active: false, visual: 'sphere' },
    { num: '08', title: 'SEE WHAT IT\nBECAME', desc: 'Ideas delivered.\nResults measured.', active: false, visual: 'chart' }
  ];

  const services = [
    { title: 'BRAND', sub: 'Logo Design', icon: 'brand' },
    { title: 'WEBSITE', sub: 'Design', icon: 'website' },
    { title: 'ERP', sub: 'Software', icon: 'erp' },
    { title: 'AI', sub: 'Automation', icon: 'ai' },
    { title: 'MOTION', sub: 'Graphics', icon: 'motion' },
    { title: '3D', sub: 'Modeling', icon: '3d' },
    { title: 'UI/UX', sub: 'Design', icon: 'uiux' }
  ];

  return (
    <section className="div2-section">
      <div className="div2-container">
        <img src="/assets/images/bg-pad.jpeg" alt="Desk with Clipboard" className="div2-bg-img" />

        <div className="div2-content-layer">
          {/* Header */}
          <div className="div2-header">
             <span className="div2-header-text">01 / ENTER THE STUDIO</span>
             <div className="div2-mustard-line"></div>
          </div>

          {/* Headline */}
          <h1 className="div2-headline">
             EVERY PROJECT<br/>STARTS AS A<br/><span className="div2-mustard-text">ROUGH NOTE.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="div2-subtext">
             Before the logo. Before the code.<br/>
             Before the final screen &mdash; there is an <span className="div2-underline">idea.</span>
          </p>

          {/* Metadata Row */}
          <div className="div2-metadata-row">
            <div className="div2-meta-col">
              <span className="div2-meta-label">PROJECT:</span>
              <span className="div2-meta-value" style={{fontFamily: "'Caveat', cursive", fontSize: "1.4em"}}>Unknown</span>
            </div>
            <div className="div2-meta-divider"></div>
            <div className="div2-meta-col">
              <span className="div2-meta-label">STATUS:</span>
              <span className="div2-meta-value" style={{fontFamily: "'Caveat', cursive", fontSize: "1.4em", color: "#c8942b"}}>In Progress</span>
            </div>
            <div className="div2-meta-divider"></div>
            <div className="div2-meta-col">
              <span className="div2-meta-label">VERSION:</span>
              <span className="div2-meta-value">07</span>
            </div>
            <div className="div2-meta-stamp-container">
              <div className="div2-stamp div2-stamp-progress">IN PROGRESS</div>
            </div>
          </div>

          {/* Annotations */}
          <div className="div2-anno-top-right">
            <svg viewBox="0 0 40 100" style={{ position: 'absolute', top: '-25px', left: '35px', width: '2vw', height: 'auto', zIndex: -1, filter: 'drop-shadow(1px 3px 2px rgba(0,0,0,0.4))', transform: 'rotate(12deg)' }}>
               <path d="M16 80 V20 A 8 8 0 0 1 32 20 V70 A 5 5 0 0 1 22 70 V30" fill="none" stroke="#d0d0d5" strokeWidth="4" strokeLinecap="round" />
               <path d="M16 80 V20 A 8 8 0 0 1 32 20 V70 A 5 5 0 0 1 22 70 V30" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
            </svg>
            <span className="div2-anno-text" style={{fontFamily: "'Caveat', cursive", left: '10px', top: '30px'}}>Still<br/>figuring<br/>it out...</span>
            <svg className="div2-curved-arrow" viewBox="0 0 50 50" style={{ left: '20px', marginTop: '105px' }}>
               <path d="M5 5 Q40 5, 35 40 M30 35 L35 40 L40 35" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="div2-coffee-ring">
            <svg viewBox="0 0 100 100" className="div2-coffee-ring-svg">
               <circle cx="50" cy="50" r="40" fill="none" stroke="#b08a68" strokeWidth="3" opacity="0.4"/>
               <circle cx="52" cy="48" r="42" fill="none" stroke="#b08a68" strokeWidth="2" opacity="0.3" strokeDasharray="5 2"/>
               <circle cx="48" cy="52" r="39" fill="none" stroke="#8a5e3a" strokeWidth="1.5" opacity="0.6"/>
            </svg>
          </div>

          {/* Main Video Panel */}
          <div className="div2-media-panel">
            <img src="/assets/images/vid-img.jpeg" alt="Main Project Video" className="div2-main-vid" />
            <div className="div2-video-ui">
              <div className="div2-video-controls">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M8 5v14l11-7z"/></svg>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white" style={{marginLeft: '10px'}}><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                <span className="div2-video-time">00:02 / 00:30</span>
                <div className="div2-video-spacer"></div>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white" style={{marginRight: '10px'}}><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              </div>
              <div className="div2-video-progress">
                 <div className="div2-vp-bar"></div>
              </div>
            </div>
          </div>

          <div className="div2-anno-left">
            <svg className="div2-curved-arrow" viewBox="0 0 40 40" style={{transform: "scaleX(1) rotate(-20deg)"}}>
               <path d="M5 35 Q10 5, 35 5 M25 2 L35 5 L30 15" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="div2-anno-text" style={{fontFamily: "'Caveat', cursive"}}>Watch<br/>what<br/>happens<br/>next.</span>
          </div>

          <div className="div2-anno-right">
             <span className="div2-anno-text" style={{fontFamily: "'Caveat', cursive"}}>Client feedback<br/>&rarr; incorporated</span>
          </div>

          {/* Services */}
          <div className="div2-services">
             {services.map((svc, i) => [
                <div className="div2-service-item" key={`item-${i}`}>
                  <div className="div2-service-icon-wrap">
                    {svc.icon === 'brand' && <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9m3.5 0L15 16" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    {svc.icon === 'website' && <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18"/><circle cx="7" cy="6" r="0.5" fill="#222"/><circle cx="10" cy="6" r="0.5" fill="#222"/><circle cx="13" cy="6" r="0.5" fill="#222"/></svg>}
                    {svc.icon === 'erp' && <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 16v-4M12 16v-8M17 16V9M3 16h18"/></svg>}
                    {svc.icon === 'ai' && <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5"><circle cx="12" cy="12" r="8" strokeDasharray="3 3"/><circle cx="12" cy="12" r="3"/><path d="M12 9v-2M12 17v-2M9 12H7M17 12h-2"/></svg>}
                    {svc.icon === 'motion' && <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5"><rect x="2" y="7" width="16" height="10" rx="2"/><path d="M18 10l4-2v8l-4-2"/><circle cx="6" cy="12" r="1.5" fill="#222"/><circle cx="14" cy="12" r="1.5" fill="#222"/></svg>}
                    {svc.icon === '3d' && <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>}
                    {svc.icon === 'uiux' && <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/><path d="M9 2h6"/></svg>}
                  </div>
                  <span className="div2-service-title">{svc.title}</span>
                  <span className="div2-service-sub">{svc.sub}</span>
                </div>,
                i < services.length - 1 && (
                  <div className="div2-service-separator" key={`sep-${i}`}></div>
                )
             ])}
          </div>

          {/* Footer */}
          <div className="div2-footer">
            <div className="div2-footer-scroll">SCROLL TO EXPLORE<br/>&darr;</div>
            <div className="div2-footer-stamps">
              <div className="div2-stamp div2-stamp-approved">APPROVED</div>
              <div className="div2-signature-wrap">
                 <svg viewBox="0 0 100 40" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 30 Q20 10, 25 15 T35 25 Q40 10, 45 20 T60 25 Q70 15, 80 20 T95 10"/>
                 </svg>
              </div>
            </div>
          </div>

          {/* Sticky Notes */}
          <div className="div2-sticky-tl">
             <img src="/assets/images/sticky-note-5-bg-clean.png" alt="Sticky Note" />
             <div className="div2-sticky-content">
               Start<br/>messy.<br/>Build<br/>
               <span style={{ position: 'relative', display: 'inline-block' }}>
                 great.
                 <svg viewBox="0 0 100 20" style={{ position: 'absolute', bottom: '-5px', left: 0, width: '100%', height: '10px' }}>
                    <path d="M5 10 Q50 15, 95 8" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
                 </svg>
               </span>
             </div>
          </div>

          <div className="div2-sticky-r">
             <img src="/assets/images/d-3-p-2-2.png" alt="Checklist Sticky Note" />
             <div className="div2-sticky-content">
                <div className="div2-sr-title">7 things.<br/>1 idea.</div>
                <div className="div2-sr-list">
                  {['Brand', 'Website', 'ERP', 'AI Automation', 'Motion', '3D', 'UI/UX'].map((item, i) => (
                     <div className="div2-sr-item" key={i}>
                        <span className="div2-sr-check">&#9745;</span> {item}
                     </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="div2-sticky-bl">
             <img src="/assets/images/l-1.png" alt="Sticky Note" />
             <div className="div2-sticky-content">
               Don't judge<br/>
               <span style={{ position: 'relative', display: 'inline-block' }}>
                 the first draft.
                 <svg viewBox="0 0 100 20" style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%', height: '10px' }}>
                    <path d="M2 12 Q50 16, 98 8" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
                 </svg>
               </span>
             </div>
          </div>

        </div>
      </div>

      {/* 8 Bottom Pads Row - Positioned physically below the main pad container */}
      <div className="div2-pads-row">
        {bottomPads.map((pad, i) => (
          <div className={`div2-mini-pad ${pad.active ? 'active' : ''}`} key={i}>
            <img src="/assets/images/small-pad.jpeg" alt={`Small Pad ${pad.num}`} className="div2-mini-pad-bg" />
            <div className="div2-mini-pad-content">
              <span className="div2-mp-num">{pad.num}</span>
              <span className="div2-mp-title">{pad.title}</span>
              {pad.desc && <span className="div2-mp-desc">{pad.desc}</span>}
              
              <div className="div2-mp-visual">
                {/* Visual approximations for each pad */}
                {pad.visual === 'door' && <svg viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1"><path d="M10 35 V10 H25 V35" /><path d="M25 10 L30 5 V30 L25 35" /><path d="M10 35 L15 30 V5 L10 10" /><circle cx="23" cy="22" r="1" fill="#333" /><path d="M25 15 L35 12" strokeDasharray="1 2" /><path d="M25 25 L35 28" strokeDasharray="1 2" /></svg>}
                {pad.visual === 'sketch' && <svg viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1"><rect x="10" y="10" width="8" height="8"/><rect x="22" y="10" width="8" height="8"/><rect x="16" y="22" width="8" height="8"/><path d="M14 18 L18 22 M26 18 L22 22"/></svg>}
                {pad.visual === 'r-logo' && <svg viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1"><rect x="8" y="8" width="24" height="24" strokeDasharray="2 2"/><path d="M14 30 V12 H22 Q26 12, 26 16 T22 20 H14 M20 20 L26 30" strokeWidth="2"/></svg>}
                {pad.visual === 'wireframe' && <svg viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1"><rect x="5" y="8" width="18" height="24"/><rect x="26" y="14" width="10" height="18" rx="1"/><path d="M5 12 H23 M26 16 H36"/></svg>}
                {pad.visual === 'dashboard' && <svg viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1"><rect x="4" y="6" width="32" height="26"/><rect x="6" y="10" width="8" height="18"/><rect x="16" y="10" width="18" height="8"/><rect x="16" y="20" width="8" height="8"/><rect x="26" y="20" width="8" height="8"/><circle cx="20" cy="24" r="2" fill="#333"/></svg>}
                {pad.visual === 'automation' && <svg viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1"><circle cx="20" cy="20" r="10" strokeDasharray="3 3"/><circle cx="20" cy="10" r="3"/><circle cx="11" cy="25" r="3"/><circle cx="29" cy="25" r="3"/><path d="M20 13 V17 M13 23 L16 20 M27 23 L24 20"/></svg>}
                {pad.visual === 'sphere' && <svg viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1"><circle cx="15" cy="15" r="8"/><ellipse cx="15" cy="15" rx="8" ry="3"/><ellipse cx="15" cy="15" rx="3" ry="8"/><circle cx="28" cy="28" r="5" strokeDasharray="2 2"/></svg>}
                {pad.visual === 'chart' && <svg viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1"><path d="M8 32 H32 M10 32 V22 H14 V32 M18 32 V15 H22 V32 M26 32 V8 H30 V32"/><path d="M8 20 Q18 10, 32 5" strokeWidth="1.5"/></svg>}
              </div>
            </div>
            {i < bottomPads.length - 1 && (
              <div className="div2-pad-connector">&rarr;</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
