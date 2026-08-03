import { useState, KeyboardEvent } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import './ScheduleStep2Page.css';

// SVG Assets from Step 1
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

// New Sketch for Step 2
const SvgCalendarSketch = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="#2c2c2c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="calendar-sketch">
    {/* Spirals */}
    <path d="M 20 20 C 20 10, 25 10, 25 20 C 25 30, 20 30, 20 20" />
    <path d="M 40 22 C 40 12, 45 12, 45 22 C 45 32, 40 32, 40 22" />
    <path d="M 60 24 C 60 14, 65 14, 65 24 C 65 34, 60 34, 60 24" />
    <path d="M 80 26 C 80 16, 85 16, 85 26 C 85 36, 80 36, 80 26" />
    
    {/* Outline */}
    <path d="M 12 25 L 88 32 L 85 85 L 10 78 Z" />
    
    {/* Header separator */}
    <path d="M 12 45 L 87 52" />
    
    {/* Grid / Dots */}
    <rect x="22" y="55" width="8" height="8" rx="1" />
    <rect x="42" y="57" width="8" height="8" rx="1" />
    <rect x="62" y="59" width="8" height="8" rx="1" />
    
    <rect x="21" y="68" width="8" height="8" rx="1" />
    <rect x="41" y="70" width="8" height="8" rx="1" />
    <rect x="61" y="72" width="8" height="8" rx="1" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="selected-date-svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M 8 14 h.01 M 12 14 h.01 M 16 14 h.01 M 8 18 h.01 M 12 18 h.01 M 16 18 h.01" />
  </svg>
);

export function ScheduleStep2Page() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Default August 2026
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 7, 8)); // Default 8 Aug 2026
  
  const today = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0, Sunday = 6
  };
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOffset = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  
  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  
  const handleDateSelect = (year: number, month: number, day: number) => {
    setSelectedDate(new Date(year, month, day));
    if (month !== currentMonth) {
      setCurrentDate(new Date(year, month, 1));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, year: number, month: number, day: number) => {
    let newDate = new Date(year, month, day);
    if (e.key === 'ArrowRight') newDate.setDate(day + 1);
    else if (e.key === 'ArrowLeft') newDate.setDate(day - 1);
    else if (e.key === 'ArrowDown') newDate.setDate(day + 7);
    else if (e.key === 'ArrowUp') newDate.setDate(day - 7);
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDateSelect(year, month, day);
      return;
    } else return;
    
    e.preventDefault();
    handleDateSelect(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
  };
  
  const calendarDays = [];
  
  // Previous month overflow
  for (let i = 0; i < firstDayOffset; i++) {
    calendarDays.push({
      day: daysInPrevMonth - firstDayOffset + i + 1,
      month: currentMonth - 1,
      year: currentYear,
      isCurrentMonth: false
    });
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true
    });
  }
  
  // Next month overflow
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      month: currentMonth + 1,
      year: currentYear,
      isCurrentMonth: false
    });
  }

  const formattedSelectedDate = `${weekdays[selectedDate.getDay()]}, ${selectedDate.getDate().toString().padStart(2, '0')} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  const formattedSelectedUrlParam = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  return (
    <SiteLayout
      activeItem=""
      pageLabel="Step 2"
      pageTitle="Select a Date"
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
                    <span>2</span>
                    <SvgRedCircle />
                  </div>
                  <span>of 4</span>
                </div>
                
                <div className="step-heading-container">
                  <h1 className="step-heading">Select a Date</h1>
                  <SvgHeadingUnderline />
                </div>
                
                <p className="step-desc">
                  Choose the date that works<br/>
                  best for you.
                </p>
              </div>
              
              <div className="pencil-sketch-wrapper">
                <SvgCalendarSketch />
              </div>
              
              <p className="inspirational-text">
                Plan today,<br/>
                build tomorrow.
              </p>
            </div>
            
            {/* Right Column (Form Card for Calendar) */}
            <div className="form-column">
              <div className="form-card">
                <img src="/assets/images/c-s-m.png" alt="Form Card Background" className="form-card-bg" />
               
                
                <div className="form-content calendar-form-content">
                  
                  {/* Custom HTML/CSS Calendar */}
                  <div className="notebook-calendar">
                    <div className="calendar-header">
                      <button className="cal-nav-btn" onClick={handlePrevMonth} aria-label="Previous month">&lsaquo;</button>
                      <div className="cal-month-year" aria-live="polite">{monthNames[currentMonth]} {currentYear}</div>
                      <button className="cal-nav-btn" onClick={handleNextMonth} aria-label="Next month">&rsaquo;</button>
                    </div>
                    
                    <div className="calendar-grid">
                      <div className="cal-weekday">MON</div>
                      <div className="cal-weekday">TUE</div>
                      <div className="cal-weekday">WED</div>
                      <div className="cal-weekday">THU</div>
                      <div className="cal-weekday">FRI</div>
                      <div className="cal-weekday">SAT</div>
                      <div className="cal-weekday">SUN</div>
                      
                      {calendarDays.map((d, idx) => {
                        const isSelected = selectedDate.getDate() === d.day && selectedDate.getMonth() === (d.month + 12) % 12 && selectedDate.getFullYear() === (d.month < 0 ? d.year - 1 : d.month > 11 ? d.year + 1 : d.year);
                        const isToday = today.getDate() === d.day && today.getMonth() === (d.month + 12) % 12 && today.getFullYear() === (d.month < 0 ? d.year - 1 : d.month > 11 ? d.year + 1 : d.year);
                        
                        let classes = "cal-date";
                        if (!d.isCurrentMonth) classes += " cal-date-muted";
                        if (isSelected) classes += " cal-date-selected";
                        if (isToday && !isSelected) classes += " cal-date-today";
                        
                        return (
                          <div 
                            key={idx} 
                            className={classes} 
                            onClick={() => handleDateSelect(d.year, d.month, d.day)}
                            onKeyDown={(e) => handleKeyDown(e, d.year, d.month, d.day)}
                            tabIndex={d.isCurrentMonth || isSelected ? 0 : -1}
                            role="button"
                            aria-pressed={isSelected}
                            aria-label={`${d.day} ${monthNames[(d.month + 12) % 12]} ${d.month < 0 ? d.year - 1 : d.month > 11 ? d.year + 1 : d.year}`}
                          >
                            {d.day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Selected Date Section */}
                  <div className="selected-date-section">
                    <IconCalendar />
                    <div className="selected-date-details">
                      <span className="selected-date-label">Selected Date</span>
                      <span className="selected-date-value" aria-live="polite">{formattedSelectedDate}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            
            {/* Page Navigation Buttons */}
            <div className="step-navigation">
              <a href="/html/schedule-step-1.html" className="back-button">
                &larr; Back
              </a>
              <a href={`/html/schedule-step-3.html?date=${formattedSelectedUrlParam}`} className="continue-button step-continue-btn">
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
