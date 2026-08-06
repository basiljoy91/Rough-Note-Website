import { useState, useEffect } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import './ScheduleStep4Page.css';

// SVGs
const SvgRedCircle = () => (
  <svg viewBox="0 0 50 50" fill="none" stroke="#d45b5b" strokeWidth="2.5" className="red-circle-sketch">
    <path d="M 25 5 C 40 5, 45 20, 45 25 C 45 35, 35 45, 25 45 C 10 45, 5 35, 5 25 C 5 10, 20 8, 30 7" strokeLinecap="round" />
  </svg>
);

const SvgHeadingUnderline = () => (
  <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="heading-underline-sketch">
    <path d="M 5 15 Q 150 5, 250 15 T 395 10" stroke="#3c3c3c" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const SvgHandshakeSketch = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="#2c2c2c" strokeLinecap="round" strokeLinejoin="round" className="handshake-sketch" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
    {/* Thin internal details / shading */}
    <g strokeWidth="1" opacity="0.8">
      {/* Sleeve folds left */}
      <path d="M 5 55 C 10 60, 15 65, 18 63" />
      <path d="M 2 70 C 8 72, 12 75, 15 78" />
      {/* Sleeve folds right */}
      <path d="M 95 55 C 90 60, 85 65, 82 63" />
      <path d="M 98 70 C 92 72, 88 75, 85 78" />
      {/* Cuff buttons */}
      <circle cx="25" cy="71" r="1.5" fill="#2c2c2c" />
      <circle cx="75" cy="71" r="1.5" fill="#2c2c2c" />
      {/* Thumb joint crease */}
      <path d="M 47 45 C 49 46, 50 48, 49 50" />
      {/* Shading under the grip */}
      <path d="M 35 83 L 38 86 M 40 85 L 43 88 M 45 86 L 48 89 M 50 86 L 53 89" strokeWidth="0.8" />
    </g>

    {/* Primary Outlines */}
    <g strokeWidth="2">
      {/* Left Sleeve & Cuff */}
      <path d="M 20 85 L 30 87 L 35 57 L 25 55" />
      <path d="M 0 80 L 20 85 M 0 50 L 25 55" />
      
      {/* Right Sleeve & Cuff */}
      <path d="M 80 85 L 70 87 L 65 57 L 75 55" />
      <path d="M 100 80 L 80 85 M 100 50 L 75 55" />

      {/* Left Hand Body (Background) */}
      <path d="M 35 57 C 40 56, 43 54, 46 51" />
      <path d="M 30 87 C 35 88, 39 86, 43 83" />

      {/* Left Thumb (Background) */}
      <path d="M 44 42 C 48 35, 52 28, 57 26 C 61 24, 64 28, 62 32 C 58 38, 56 42, 53 46" />

      {/* Right Hand Body (Foreground) */}
      <path d="M 65 57 C 55 57, 45 59, 40 60" />
      <path d="M 52 83 C 60 81, 65 85, 70 87" />

      {/* Right Fingers */}
      <path d="M 40 60 C 33 65, 33 70, 35 74 C 38 77, 43 76, 45 74" />
      <path d="M 39 63 C 33 68, 33 74, 36 78 C 39 81, 44 80, 46 78" />
      <path d="M 41 66 C 36 72, 36 77, 39 81 C 42 84, 47 83, 49 81" />
      <path d="M 44 69 C 40 74, 40 79, 43 83 C 46 86, 50 85, 52 83" />

      {/* Right Thumb */}
      <path d="M 55 58 C 50 45, 45 35, 40 32 C 36 30, 34 33, 35 37 C 39 43, 45 52, 50 56" />
    </g>
  </svg>
);

const IconPerson = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M 8 14 h.01 M 12 14 h.01 M 16 14 h.01 M 8 18 h.01 M 12 18 h.01 M 16 18 h.01" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconDuration = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <path d="M12 2v20"></path>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const IconMonitor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const IconLightbulb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="confirm-icon">
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.53.9 2.94 2.5 3.5.76.76 1.23 1.52 1.41 2.5"></path>
  </svg>
);

const IconCheckGreen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon-green">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const IconCalendarBtn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M9 16l2 2 4-4"></path>
  </svg>
);

const SvgCurvedArrow = () => (
  <svg viewBox="0 0 50 50" fill="none" stroke="#2c2c2c" strokeWidth="1.5" className="arrow-sketch" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10,10 Q25,30 40,40" />
    <path d="M30,40 L40,40 L40,30" />
  </svg>
);

const SvgPaperClip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#2c2c2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="paper-clip">
    <path d="M13.5 13.5l4.5-4.5a3.5 3.5 0 0 0-5-5l-8 8a2.5 2.5 0 0 0 3.5 3.5l7-7a1.5 1.5 0 0 0-2-2l-6 6"></path>
  </svg>
);

export function ScheduleStep4Page() {
  const [meetingData, setMeetingData] = useState({
    name: 'Not Provided',
    email: 'Not Provided',
    phone: 'Not Provided',
    company: 'Not Provided',
    date: 'Saturday, 08 August 2026',
    time: '10:30 AM',
    mode: 'online'
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    setMeetingData(prev => ({
      name: params.get('name') || 'Not Provided',
      email: params.get('email') || 'Not Provided',
      phone: params.get('phone') || 'Not Provided',
      company: params.get('company') || 'Not Provided',
      date: params.get('date') || prev.date,
      time: params.get('time') || prev.time,
      mode: params.get('mode') || prev.mode
    }));
  }, []);

  const handleConfirm = () => {
    window.location.href = '/html/schedule-success.html' + window.location.search;
  };

  const modeText = meetingData.mode === 'online' ? 'Online Meeting\n(Google Meet)' : 'Office Visit\n(at Our Studio)';

  return (
    <SiteLayout
      activeItem="contact"
      pageLabel="Step 4"
      pageTitle="Confirm Your Meeting"
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
            
            {/* Left Column (Information) */}
            <div className="info-column">
              <div className="top-info-block">
                <div className="step-indicator">
                  <span>Step</span>
                  <div className="step-circle">
                    <span>4</span>
                    <SvgRedCircle />
                  </div>
                  <span>of 4</span>
                </div>
                
                <div className="step-heading-container">
                  <h1 className="step-heading">Confirm Your Meeting</h1>
                  <SvgHeadingUnderline />
                </div>
                
                <p className="step-desc">
                  Please review your details<br/>
                  before confirming.
                </p>
              </div>
              
              <div className="handshake-sketch-wrapper">
                <SvgHandshakeSketch />
              </div>
              
              <p className="inspirational-text">
                Almost there!<br/>
                Let's make it<br/>
                official.
              </p>
            </div>
            
            {/* Right Column (Confirmation Card) */}
            <div className="form-column">
              <div className="form-card">
                <img src="/assets/images/c-s-m.png" alt="Form Card Background" className="form-card-bg" />
                
                <div className="blue-sticky-note">
                  {/* <SvgPaperClip /> */}
                  <img src="/assets/images/sticky-note-1-bg-clean.png" alt="Sticky Note" className="blue-sticky-bg" />
                  <div className="blue-sticky-content">
                    We value your<br/>
                    time and<br/>
                    ideas.
                  </div>
                </div>

                <div className="confirmation-content">
                  
                  <div className="confirmation-columns">
                    {/* Column 1 */}
                    <div className="confirm-column">
                      <h3 className="confirm-section-title">
                        <IconPerson /> Your Information
                      </h3>
                      
                      <div className="confirm-item">
                        <IconPerson />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Name</div>
                          <div className="confirm-item-value">{meetingData.name || 'Not Provided'}</div>
                        </div>
                      </div>
                      
                      <div className="confirm-item">
                        <IconMail />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Email</div>
                          <div className="confirm-item-value confirm-item-email">{meetingData.email || 'Not Provided'}</div>
                        </div>
                      </div>
                      
                      <div className="confirm-item">
                        <IconPhone />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Phone</div>
                          <div className="confirm-item-value nowrap">{meetingData.phone || 'Not Provided'}</div>
                        </div>
                      </div>
                      
                      <div className="confirm-item">
                        <IconBuilding />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Company</div>
                          <div className="confirm-item-value">{meetingData.company || 'Not Provided'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="confirm-column">
                      <h3 className="confirm-section-title">
                        <IconCalendar /> Meeting Schedule
                      </h3>
                      
                      <div className="confirm-item">
                        <IconCalendar />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Date</div>
                          <div className="confirm-item-value nowrap">{meetingData.date}</div>
                        </div>
                      </div>
                      
                      <div className="confirm-item">
                        <IconClock />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Time</div>
                          <div className="confirm-item-value nowrap">{meetingData.time}</div>
                        </div>
                      </div>
                      
                      <div className="confirm-item">
                        <IconClock />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Duration</div>
                          <div className="confirm-item-value nowrap">30 Minutes</div>
                        </div>
                      </div>
                      
                      <div className="confirm-item">
                        <IconGlobe />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Time Zone</div>
                          <div className="confirm-item-value nowrap">IST (GMT +5:30)</div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="confirm-column">
                      <h3 className="confirm-section-title">
                        <IconClipboard /> Meeting Details
                      </h3>
                      
                      <div className="confirm-item">
                        <IconTarget />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Meeting Type</div>
                          <div className="confirm-item-value-small">Free Strategy Consultation</div>
                        </div>
                      </div>
                      
                      <div className="confirm-item">
                        {meetingData.mode === 'online' ? <IconMonitor /> : <IconBuilding />}
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Meeting Mode</div>
                          <div className="confirm-item-value-small">
                            {meetingData.mode === 'online' ? 'Online Meeting (Google Meet)' : 'Office Visit (at Our Studio)'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="confirm-item">
                        <IconLightbulb />
                        <div className="confirm-item-text">
                          <div className="confirm-item-label">Purpose</div>
                          <div className="confirm-item-value-small">Business Discussion &<br/>Product Strategy</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Before You Confirm */}
                  <div className="before-confirm-section">
                    <h3 className="before-confirm-title">Before You Confirm</h3>
                    <div className="checklist-grid">
                      <div className="checklist-item">
                        <IconCheckGreen /> Confirmation email will be sent.
                      </div>
                      <div className="checklist-item">
                        <IconCheckGreen /> Meeting link will be shared after confirmation.
                      </div>
                      <div className="checklist-item">
                        <IconCheckGreen /> Calendar invitation included.
                      </div>
                      <div className="checklist-item">
                        <IconCheckGreen /> You can reschedule if needed.
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            
            <SvgCurvedArrow />

            {/* Page Navigation Buttons */}
            <div className="step-navigation">
              <button onClick={() => window.history.back()} className="back-button">
                &larr; Back
              </button>
              <button onClick={handleConfirm} className="step-confirm-btn">
                <IconCalendarBtn /> Confirm My Meeting
              </button>
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
