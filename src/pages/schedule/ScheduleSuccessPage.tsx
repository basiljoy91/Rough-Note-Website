import { SiteLayout } from '../../app/layouts/SiteLayout';
import './ScheduleSuccessPage.css';

// SVG Confetti
const SvgConfetti = () => (
  <svg viewBox="0 0 200 100" className="confetti-layer" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Yellow */}
    <circle cx="10" cy="20" r="2" fill="#ffd700" />
    <circle cx="180" cy="80" r="1.5" fill="#ffd700" />
    <path d="M 40 40 L 45 45" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" />
    
    {/* Blue */}
    <rect x="160" y="20" width="3" height="3" fill="#4a90e2" transform="rotate(45 160 20)" />
    <circle cx="50" cy="80" r="2" fill="#4a90e2" />
    <path d="M 20 60 L 25 65" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" />
    
    {/* Green */}
    <polygon points="120,10 125,15 115,15" fill="#50c878" />
    <circle cx="140" cy="60" r="1.5" fill="#50c878" />
    <path d="M 180 40 L 175 45" stroke="#50c878" strokeWidth="2" strokeLinecap="round" />
    
    {/* Orange */}
    <circle cx="100" cy="25" r="2" fill="#ff8c00" />
    <rect x="30" y="30" width="3" height="3" fill="#ff8c00" transform="rotate(15 30 30)" />
    
    {/* Red */}
    <polygon points="80,90 85,85 90,90" fill="#d45b5b" />
    <circle cx="190" cy="15" r="2" fill="#d45b5b" />
    <path d="M 60 20 L 65 25" stroke="#d45b5b" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SketchCoffeeCup = () => (
  <svg viewBox="0 0 120 100" fill="none" stroke="#2c2c2c" strokeLinecap="round" strokeLinejoin="round" className="sketch-coffee-cup">
    {/* Saucer */}
    <ellipse cx="50" cy="80" rx="35" ry="10" strokeWidth="1.5" />
    <path d="M 25 83 Q 50 92 75 83" strokeWidth="1" />
    <path d="M 20 80 Q 50 95 80 80" strokeWidth="0.8" opacity="0.6" />

    {/* Cup Handle */}
    <path d="M 75 48 C 95 45, 95 68, 70 68" strokeWidth="1.5" />
    
    {/* Cup Body */}
    <path d="M 20 45 C 20 80, 35 80, 50 80 C 65 80, 80 80, 80 45" strokeWidth="1.5" />
    
    {/* Shading/hatching on cup */}
    <path d="M 28 65 L 34 75 M 34 68 L 40 77 M 40 70 L 46 78 M 46 71 L 52 79 M 66 70 L 60 78 M 72 65 L 66 75" strokeWidth="0.8" opacity="0.6" />

    {/* Cup Rim */}
    <ellipse cx="50" cy="45" rx="30" ry="8" strokeWidth="1.5" />
    {/* Coffee liquid surface line */}
    <ellipse cx="50" cy="46" rx="25" ry="5" strokeWidth="1" opacity="0.8" />
    
    {/* Steam */}
    <path d="M 38 35 C 30 25, 45 15, 38 5" strokeWidth="1.5" />
    <path d="M 55 35 C 65 25, 45 15, 55 5" strokeWidth="1.5" />
    <path d="M 46 32 C 40 22, 55 12, 48 2" strokeWidth="1" opacity="0.8" />

    {/* Small red heart beside the cup */}
    <g transform="rotate(15 96 60)">
      <path d="M 105 55 A 4 4 0 0 0 97 55 L 96 56 L 95 55 A 4 4 0 0 0 87 55 A 4 4 0 0 0 87 63 L 96 72 L 105 63 A 4 4 0 0 0 105 55 Z" stroke="#d45b5b" strokeWidth="1.5" />
    </g>
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="summary-icon">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="summary-icon">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M 8 14 h.01 M 12 14 h.01 M 16 14 h.01 M 8 18 h.01 M 12 18 h.01 M 16 18 h.01" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="summary-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconMonitor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="summary-icon">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const getInitialMeetingData = () => {
  const defaults = {
    date: 'Saturday, 08 August 2026',
    time: '10:30 AM',
    mode: 'online'
  };

  if (typeof window === 'undefined') return defaults;

  const params = new URLSearchParams(window.location.search);
  return {
    date: params.get('date') || defaults.date,
    time: params.get('time') || defaults.time,
    mode: params.get('mode') || defaults.mode
  };
};

export function ScheduleSuccessPage() {
  const meetingData = getInitialMeetingData();

  const modeText = meetingData.mode === 'online' ? (
    <>Online Meeting<br/>(Google Meet)</>
  ) : (
    <>Office Visit<br/>(Our Studio)</>
  );

  return (
    <SiteLayout
      activeItem="contact"
      pageLabel="Success"
      pageTitle="Meeting Confirmed"
    >
      <div className="schedule-step-wrapper">
        <div className="notebook-container-wide">
          <div className="notebook-bg-split">
            <div className="notebook-bg-left"></div>
            <div className="notebook-bg-right"></div>
          </div>
          
          <div className="notebook-inner-content">
            <img src="/assets/images/notebook-paper.jpeg" alt="Invisible" className="notebook-bg-invisible" />
            
            <div className="notebook-content">
              
              <div className="success-content-wrapper">
                {/* Confetti */}
                <SvgConfetti />
                
                {/* Header */}
                <div className="success-header">
                  <h1 className="success-title">
                    <span role="img" aria-label="Party Popper">🎉</span> See You Soon!
                  </h1>
                  <h2 className="success-subtitle">
                    Your meeting is officially booked.
                    <svg viewBox="0 0 200 10" preserveAspectRatio="none" className="green-underline">
                      <path d="M 5 5 Q 100 8 195 5" stroke="#1f8b4c" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    </svg>
                  </h2>
                </div>
                
                {/* Body Text */}
                <div className="success-body-text">
                  <p>This isn't just another meeting—it's the beginning of understanding your vision.</p>
                  <p>Whether we're meeting online or over coffee, we'll take the time to understand your ideas, discuss your business goals, explore the challenges you're facing, and identify opportunities to build something meaningful together.</p>
                  <p>We're looking forward to the conversation and to helping turn your rough note into a clear strategy and a successful product.</p>
                  <p className="bold-closing">See you at your scheduled time.</p>
                </div>
                
                {/* Meeting Summary Card */}
                <div className="meeting-summary-card">
                  <h3 className="summary-card-title">Your Meeting Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <IconCalendar />
                      <div className="summary-text">
                        {meetingData.date.split(', ')[0]},<br />
                        {meetingData.date.split(', ')[1]}
                      </div>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-item">
                      <IconClock />
                      <div className="summary-text single-line">{meetingData.time}</div>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-item">
                      {meetingData.mode === 'online' ? <IconMonitor /> : <IconBuilding />}
                      <div className="summary-text">{modeText}</div>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-item">
                      <IconClock />
                      <div className="summary-text single-line">30 Minutes</div>
                    </div>
                  </div>
                </div>
                
                {/* Back to Home Button */}
                <div className="success-action-container">
                  <a href="/html/index.html" className="back-home-btn" data-notebook-turn>
                    <IconHome /> Back to Home
                  </a>
                </div>
              </div>
              
              {/* Decorative Absolute Elements */}
              <div className="yellow-sticky-note">
                <img src="/assets/images/sticky-note-5-bg-clean.png" alt="Sticky Note" className="yellow-sticky-bg" />
                <div className="yellow-sticky-content">
                  <p>
                    Every great<br/>
                    product starts<br/>
                    with a<br/>
                    <span className="underline-container">
                      conversation.
                      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="conversation-underline">
                        <path d="M 5 5 Q 50 8 95 5" stroke="#2c2c2c" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="coffee-cup-wrapper">
                <SketchCoffeeCup />
              </div>
              
              <div className="bottom-right-doodle">
                <p>
                  Let's build<br/>
                  something<br/>
                  great together!
                </p>
                <svg viewBox="0 0 24 24" fill="none" stroke="#d45b5b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="doodle-heart">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              
              {/* Notebook Footer */}
              <div className="notebook-footer">
                <div className="footer-tab">
                  <span>Rough</span>
                  <span>Note</span>
                </div>
                <div className="footer-text">
                  Every great product starts as a rough note.
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
