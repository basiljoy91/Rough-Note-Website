import { useState, useEffect, useRef } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import './ScheduleStep3Page.css';

// Reused SVG Assets
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

// New SVG Assets for Step 3
const SvgClockSketch = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="#2c2c2c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="clock-sketch">
    <circle cx="50" cy="50" r="40" strokeWidth="1.2" />
    <circle cx="50" cy="50" r="37" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 3" />
    {/* Ticks */}
    <path d="M 50 12 L 50 17 M 88 50 L 83 50 M 50 88 L 50 83 M 12 50 L 17 50" />
    <path d="M 69 16 L 66 21 M 84 31 L 79 34 M 84 69 L 79 66 M 69 84 L 66 79 M 31 84 L 34 79 M 16 69 L 21 66 M 16 31 L 21 34 M 31 16 L 34 21" strokeWidth="1" strokeOpacity="0.7" />
    {/* Hands */}
    <path d="M 50 50 L 62 38" strokeWidth="2.5" />
    <path d="M 50 50 L 42 70" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="3" fill="#2c2c2c" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="selected-check-icon">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconMonitor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mode-icon">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mode-icon">
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

const IconCalendarSmall = () => (
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

// Custom Dropdown Component
interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  label: string;
}

const CustomSelect = ({ value, options, onChange, label }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = options.indexOf(value);
      const newIndex = e.key === 'ArrowDown'
        ? (currentIndex + 1) % options.length
        : (currentIndex - 1 + options.length) % options.length;
      onChange(options[newIndex]);
    }
  };

  return (
    <div className="custom-select-container" ref={containerRef}>
      <div 
        className={`custom-select-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-label={label}
      >
        <span>{value}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="select-chevron">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div className="custom-select-dropdown" role="listbox">
          {options.map((opt) => (
            <div 
              key={opt}
              className={`custom-select-option ${opt === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={opt === value}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
      <div className="custom-select-label">{label}</div>
    </div>
  );
};

const getInitialSelectedDate = () => {
  const fallbackDate = 'Saturday, 08 August 2026';
  if (typeof window === 'undefined') return fallbackDate;

  const dateParam = new URLSearchParams(window.location.search).get('date');
  if (!dateParam) return fallbackDate;

  const [year, month, day] = dateParam.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return `${weekdays[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};


export function ScheduleStep3Page() {
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('30');
  const [ampm, setAmpm] = useState('AM');
  const [meetingMode, setMeetingMode] = useState<'online' | 'office'>('online');
  const [selectedDateFormatted] = useState(getInitialSelectedDate);

  const hoursOptions = Array.from({length: 12}, (_, i) => String(i + 1));
  const minutesOptions = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'));
  const ampmOptions = ['AM', 'PM'];

  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  searchParams.set('time', `${hour}:${minute} ${ampm}`);
  searchParams.set('mode', meetingMode);
  const continueUrl = `/html/schedule-step-4.html?${searchParams.toString()}`;

  return (
    <SiteLayout
      activeItem="contact"
      pageLabel="Step 3"
      pageTitle="Select a Time"
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
                    <span>3</span>
                    <SvgRedCircle />
                  </div>
                  <span>of 4</span>
                </div>
                
                <div className="step-heading-container">
                  <h1 className="step-heading">Select a Time</h1>
                  <SvgHeadingUnderline />
                </div>
                
                <p className="step-desc">
                  Choose your preferred time<br/>
                  and meeting mode.
                </p>
              </div>
              
              <div className="pencil-sketch-wrapper">
                <SvgClockSketch />
              </div>
              
              <p className="inspirational-text">
                Good conversations<br/>
                happen at the<br/>
                right time.
              </p>
            </div>
            
            {/* Right Column (Form Card for Time) */}
            <div className="form-column">
              <div className="form-card">
                <img src="/assets/images/c-s-m.png" alt="Form Card Background" className="form-card-bg" />
                
                
                <div className="form-content time-form-content">
                  
                  {/* Select Time */}
                  <div className="time-section">
                    <h3 className="section-title">Select Time</h3>
                    <div className="time-selectors-row">
                      <CustomSelect value={hour} options={hoursOptions} onChange={setHour} label="Hour" />
                      <div className="time-colon">:</div>
                      <CustomSelect value={minute} options={minutesOptions} onChange={setMinute} label="Minute" />
                      <div className="time-spacer"></div>
                      <CustomSelect value={ampm} options={ampmOptions} onChange={setAmpm} label="AM / PM" />
                    </div>
                  </div>

                  {/* Meeting Mode */}
                  <div className="mode-section">
                    <h3 className="section-title">Meeting Mode</h3>
                    <div className="mode-cards-row">
                      <div 
                        className={`mode-card ${meetingMode === 'online' ? 'selected' : ''}`}
                        onClick={() => setMeetingMode('online')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMeetingMode('online'); }}
                        tabIndex={0}
                        role="radio"
                        aria-checked={meetingMode === 'online'}
                      >
                        {meetingMode === 'online' && (
                          <div className="mode-check-badge">
                            <IconCheck />
                          </div>
                        )}
                        <IconMonitor />
                        <span className="mode-title">Online Meeting</span>
                        <span className="mode-subtitle">(Google Meet)</span>
                      </div>
                      
                      <div 
                        className={`mode-card ${meetingMode === 'office' ? 'selected' : ''}`}
                        onClick={() => setMeetingMode('office')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMeetingMode('office'); }}
                        tabIndex={0}
                        role="radio"
                        aria-checked={meetingMode === 'office'}
                      >
                        {meetingMode === 'office' && (
                          <div className="mode-check-badge">
                            <IconCheck />
                          </div>
                        )}
                        <IconBuilding />
                        <span className="mode-title">Office Visit</span>
                        <span className="mode-subtitle">(at Our Studio)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Schedule Summary */}
                  <div className="schedule-summary-section">
                    <h4 className="summary-title">Your Selected Schedule</h4>
                    
                    <div className="summary-item">
                      <IconCalendarSmall />
                      <span>{selectedDateFormatted}</span>
                    </div>
                    
                    <div className="summary-item">
                      <IconClock />
                      <span>{hour}:{minute} {ampm}</span>
                    </div>
                    
                    <div className="summary-item">
                      {meetingMode === 'online' ? <IconMonitor /> : <IconBuilding />}
                      <span>{meetingMode === 'online' ? 'Online Meeting (Google Meet)' : 'Office Visit (at Our Studio)'}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            
            {/* Page Navigation Buttons */}
            <div className="step-navigation">
              <button onClick={() => window.history.back()} className="back-button">
                &larr; Back
              </button>
              <a href={continueUrl} className="continue-button step-continue-btn">
                Continue &rarr;
              </a>
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
