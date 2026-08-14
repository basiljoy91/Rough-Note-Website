import { useState } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import './ScheduleStep1Page.css';

// SVG Assets
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

const SvgPencilHolder = () => (
  <svg viewBox="0 0 100 120" fill="none" stroke="#2c2c2c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="pencil-holder-sketch">
    {/* Pencils and ruler in cup */}
    <path d="M 30 50 L 25 10 M 25 10 L 22 15 M 25 10 L 28 15" />
    <path d="M 45 50 L 40 15 M 40 15 L 37 20 M 40 15 L 43 20" />
    <path d="M 55 50 L 50 25 L 60 25 Z" />
    <path d="M 70 50 L 65 5 L 75 5 Z" />
    {/* Ruler markings */}
    <path d="M 68 15 L 72 15 M 68 25 L 72 25 M 68 35 L 72 35 M 68 45 L 72 45" strokeWidth="1" />
    
    {/* Cup base */}
    <path d="M 20 50 C 20 90, 25 100, 50 100 C 75 100, 80 90, 80 50" />
    <path d="M 20 50 C 40 55, 60 55, 80 50 C 60 45, 40 45, 20 50" />
    
    {/* Cup handle */}
    <path d="M 80 65 C 95 65, 95 85, 80 85" />
    
    {/* Shadow line under cup */}
    <path d="M 10 100 Q 50 102 90 100" strokeWidth="1" opacity="0.5" />
  </svg>
);

const IconPerson = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
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

const getInitialParam = (key: string) => {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get(key) ?? '';
};

export function ScheduleStep1Page() {
  const [name, setName] = useState(() => getInitialParam('name'));
  const [email, setEmail] = useState(() => getInitialParam('email'));
  const [phone, setPhone] = useState(() => getInitialParam('phone'));
  const [company, setCompany] = useState(() => getInitialParam('company'));

  const searchParams = new URLSearchParams();
  if (name.trim()) searchParams.set('name', name.trim());
  if (email.trim()) searchParams.set('email', email.trim());
  if (phone.trim()) searchParams.set('phone', phone.trim());
  if (company.trim()) searchParams.set('company', company.trim());

  const queryString = searchParams.toString();
  const continueUrl = `/html/schedule-step-2.html${queryString ? '?' + queryString : ''}`;

  return (
    <SiteLayout
      activeItem="contact"
      pageLabel="Step 1"
      pageTitle="Schedule a Meeting"
    >
      <div className="schedule-step-wrapper">
        <div className="notebook-container">
          <img src="/assets/images/notebook-paper.jpeg" alt="Notebook Background" className="notebook-bg" />
          
          <div className="notebook-content">
            
            {/* Left Column (Information) */}
            <div className="info-column">
              <div className="top-info-block">
                <div className="step-indicator">
                  <span>Step</span>
                  <div className="step-circle">
                    <span>1</span>
                    <SvgRedCircle />
                  </div>
                  <span>of 4</span>
                </div>
                
                <div className="step-heading-container">
                  <h1 className="step-heading">Fill in Your Details</h1>
                  <SvgHeadingUnderline />
                </div>
                
                <p className="step-desc">
                  Let's get to know you before<br/>
                  we schedule your meeting.
                </p>
              </div>
              
              <div className="pencil-sketch-wrapper">
                <SvgPencilHolder />
              </div>
              
              <p className="inspirational-text">
                Great ideas<br/>
                start with<br/>
                a simple<br/>
                conversation.
              </p>
              
              <div className="respect-time-sticky">
                <img src="/assets/images/sticky-note-6-bg-clean.png" alt="Blue Sticky Note" className="sticky-note-bg" />
                <div className="sticky-text">
                  We respect<br/>
                  your <span className="underline-blue">time.<svg viewBox="0 0 100 10" preserveAspectRatio="none" className="blue-underline-svg"><path d="M0,5 Q50,8 100,2" stroke="#5a7a9a" strokeWidth="2.5" fill="none"/></svg></span>
                </div>
              </div>
            </div>
            
            {/* Right Column (Form) */}
            <div className="form-column">
              <div className="form-card">
                <img src="/assets/images/c-s-m.png" alt="Form Card Background" className="form-card-bg" />
               
                
                <div className="form-content">
                  
                  <div className="input-group">
                    <div className="input-label">
                      <IconPerson />
                      <label>Full Name</label>
                    </div>
                    <input type="text" placeholder="Enter your full name" className="notebook-input" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  
                  <div className="input-group">
                    <div className="input-label">
                      <IconMail />
                      <label>Email Address</label>
                    </div>
                    <input type="email" placeholder="Enter your email address" className="notebook-input" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  
                  <div className="input-group">
                    <div className="input-label">
                      <IconPhone />
                      <label>Phone Number (Optional)</label>
                    </div>
                    <input type="tel" placeholder="Enter your phone number" className="notebook-input" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  
                  <div className="input-group">
                    <div className="input-label">
                      <IconBuilding />
                      <label>Company Name (Optional)</label>
                    </div>
                    <input type="text" placeholder="Enter your company name" className="notebook-input" value={company} onChange={e => setCompany(e.target.value)} />
                  </div>
                  
                  <a href={continueUrl} className="continue-button" style={{textDecoration: 'none'}} data-notebook-turn>
                    Continue &rarr;
                  </a>
                  
                </div>
              </div>
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
    </SiteLayout>
  );
}
