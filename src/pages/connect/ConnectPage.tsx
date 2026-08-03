import { SiteLayout } from '../../app/layouts/SiteLayout';
import './ConnectPage.css';

// Icons
import phoneIcon from '../../assets/icons/contact.svg';
import locationIcon from '../../assets/icons/house.svg'; // fallback since location is missing, or we can use inline SVG

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sticky-icon-svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sticky-icon-svg">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const SvgCoffeeCup = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="svg-coffee-cup">
    <defs>
      <radialGradient id="coffeeGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3d2314"/>
        <stop offset="70%" stopColor="#221008"/>
        <stop offset="100%" stopColor="#110804"/>
      </radialGradient>
      <linearGradient id="cupShading" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fcfaf3"/>
        <stop offset="30%" stopColor="#fffcf5"/>
        <stop offset="70%" stopColor="#e8dec6"/>
        <stop offset="100%" stopColor="#d1c5a9"/>
      </linearGradient>
      <radialGradient id="saucerShading" cx="50%" cy="50%" r="50%">
        <stop offset="60%" stopColor="#fffaf0"/>
        <stop offset="95%" stopColor="#d1c5a9"/>
        <stop offset="100%" stopColor="#bfae8e"/>
      </radialGradient>
      <filter id="handDrawn" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>

    {/* Shadow */}
    <ellipse cx="95" cy="165" rx="75" ry="15" fill="rgba(0,0,0,0.12)" filter="url(#handDrawn)" />

    <g filter="url(#handDrawn)">
      {/* Saucer */}
      <ellipse cx="100" cy="155" rx="70" ry="20" fill="url(#saucerShading)" stroke="#332a24" strokeWidth="1.5" />
      <path d="M 50 155 Q 100 170 150 155" fill="none" stroke="#aa9d85" strokeWidth="1" opacity="0.6"/>

      {/* Handle */}
      <path d="M 140 100 C 180 90, 180 140, 135 140" fill="none" stroke="#fffcf5" strokeWidth="12" strokeLinecap="round" />
      <path d="M 140 100 C 180 90, 180 140, 135 140" fill="none" stroke="#332a24" strokeWidth="1.5" strokeLinecap="round" />

      {/* Cup Body */}
      <path d="M 55 90 C 55 160, 75 155, 100 155 C 125 155, 145 160, 145 90 Z" fill="url(#cupShading)" stroke="#332a24" strokeWidth="1.5" strokeLinejoin="round" />
      
      {/* Texture speckles */}
      <circle cx="70" cy="110" r="0.6" fill="#888" opacity="0.5"/>
      <circle cx="120" cy="125" r="0.8" fill="#777" opacity="0.4"/>
      <circle cx="95" cy="135" r="0.6" fill="#999" opacity="0.6"/>
      <circle cx="130" cy="105" r="0.5" fill="#666" opacity="0.5"/>
      <circle cx="85" cy="140" r="0.7" fill="#888" opacity="0.4"/>
      <circle cx="110" cy="115" r="0.6" fill="#555" opacity="0.4"/>

      {/* Cup Rim Outer */}
      <ellipse cx="100" cy="90" rx="45" ry="15" fill="#fffcf5" stroke="#332a24" strokeWidth="1.5" />

      {/* Coffee Liquid */}
      <ellipse cx="100" cy="92" rx="40" ry="12" fill="url(#coffeeGradient)" />
      
      {/* Liquid reflection */}
      <ellipse cx="115" cy="90" rx="15" ry="3" fill="#ffffff" opacity="0.15" transform="rotate(-15 115 90)" />
      <ellipse cx="80" cy="95" rx="5" ry="1.5" fill="#ffffff" opacity="0.1" transform="rotate(-10 80 95)" />

      {/* Cup Rim Inner border */}
      <ellipse cx="100" cy="92" rx="40" ry="12" fill="none" stroke="#5a4030" strokeWidth="1" opacity="0.5" />
    </g>

    {/* Steam Trails */}
    <g stroke="#ffffff" fill="none" strokeWidth="3" strokeLinecap="round" className="steam-group">
      <path className="steam-trail steam-1" d="M 85 85 C 50 45 120 25 75 -25" />
      <path className="steam-trail steam-2" d="M 100 85 C 145 45 60 15 120 -30" />
      <path className="steam-trail steam-3" d="M 115 85 C 80 40 150 10 100 -35" />
      <path className="steam-trail steam-4" d="M 90 85 C 130 45 55 15 105 -25" />
      <path className="steam-trail steam-5" d="M 110 85 C 65 50 145 20 90 -30" />
      <path className="steam-trail steam-6" d="M 95 85 C 135 55 70 25 115 -20" />
    </g>
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

const SvgChennaiMap = () => (
  <svg viewBox="0 0 400 300" className="chennai-map-svg">
    <defs>
      <filter id="ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    
    <g filter="url(#ink-bleed)" opacity="0.85">
      {/* Coastline / Water (Bay of Bengal on the right) */}
      <path d="M 300 -20 Q 330 100 290 200 T 260 320 L 420 320 L 420 -20 Z" fill="#b0c4c4" opacity="0.5" />
      
      {/* Marina Beach label along the coast */}
      <text x="310" y="150" transform="rotate(-70 310 150)" fontSize="13" fill="#586f6f" style={{fontFamily: 'Patrick Hand, cursive'}}>Marina Beach</text>
      
      {/* Land Area Roads (muted grayish brown) */}
      <g stroke="#d5ccba" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 0 50 L 120 70 L 180 30" />
        <path d="M 50 -10 L 80 150 L 100 250 L 80 320" />
        <path d="M 120 70 L 250 80 L 290 120" />
        <path d="M 180 30 L 250 80 L 240 160 L 260 220 L 260 320" />
        <path d="M -10 160 L 140 180 L 240 160" />
        <path d="M -10 250 L 100 250 L 180 200 L 260 220" />
        <path d="M 100 250 L 150 320" />
      </g>
      <g stroke="#c0b5a3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Main arterial road */}
        <path d="M -10 20 Q 150 100 280 150" />
        <path d="M 120 -20 Q 150 150 200 320" />
      </g>

      {/* Areas / Labels */}
      <g fontSize="14" fill="#4a433a" style={{fontFamily: 'Patrick Hand, cursive', fontWeight: 'bold'}}>
        <text x="40" y="60">Anna Nagar</text>
        <text x="135" y="110">Nungambakkam</text>
        <text x="210" y="135">T. Nagar</text>
        <text x="90" y="210">Guindy</text>
        <text x="40" y="270">Velachery</text>
        <text x="190" y="230">Adyar</text>
        <text x="220" y="270">Besant Nagar</text>
      </g>

      {/* Main Chennai Location Pin & Text */}
      <g transform="translate(180, 80)">
        <path d="M 0 0 C -12 -15 -18 -25 -18 -35 C -18 -45 -10 -53 0 -53 C 10 -53 18 -45 18 -35 C 18 -25 12 -15 0 0 Z" fill="#2c2c2c" />
        <circle cx="0" cy="-35" r="6" fill="#fcfaf3" />
        <text x="22" y="-30" fontSize="18" fill="#1a1a1a" style={{fontFamily: 'Patrick Hand, cursive', fontWeight: 'bold'}}>Chennai</text>
      </g>
    </g>
  </svg>
);

export function ConnectPage() {
  return (
    <SiteLayout
      activeItem="contact"
      pageLabel="Page 09"
      pageTitle="Let's Connect"
    >
      <div className="connect-page-wrapper">
        <div className="notebook-spread">
          
          {/* Top Left Text */}
          <div className="page-header">
            <span className="page-number">Page 09</span>
            <svg className="star-icon" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Main Heading */}
          <div className="main-heading-container">
            <h1 className="main-heading">Let's Connect</h1>
            <svg className="heading-underline" viewBox="0 0 400 20" preserveAspectRatio="none">
              <path d="M5,15 Q200,5 395,15" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Description */}
          <div className="description-container">
            <p>Got an idea, a project, or just want to say hello?</p>
            <p>
              We'd <span className="love-word">love<svg className="love-circle" viewBox="0 0 100 40" preserveAspectRatio="none"><ellipse cx="50" cy="20" rx="45" ry="15" stroke="#d45b5b" strokeWidth="3" fill="none"/></svg><svg className="love-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M10,5 Q50,0 90,8" stroke="#d45b5b" strokeWidth="3" fill="none"/></svg></span> to hear from you.
              <svg className="heart-icon" viewBox="0 0 24 24" fill="none" stroke="#d45b5b" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </p>
          </div>

          {/* Coffee Cup */}
          <div className="coffee-cup-container">
            <SvgCoffeeCup />
          </div>

          {/* Blue Sticky Note */}
          <div className="sticky-philosophy">
            {/* <img src="/assets/images/masking tape.png" alt="" className="tape top-tape" /> */}
            <div className="sticky-bg" style={{backgroundImage: 'url("/assets/images/sticky-note-philosophy-bg-clean.png")'}}>
              <div className="sticky-content">
                <p>Good ideas<br/>start with a<br/><span className="underline-red">conversation.</span></p>
                <svg className="smile-icon" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                  <path d="M9 9h.01M15 9h.01M8 15a5 5 0 0 0 8 0" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Call Us Sticky */}
          <div className="sticky-call">
            {/* <img src="/assets/images/binder-clip.png" alt="" className="paper-clip" /> */}
            <div className="sticky-bg" style={{backgroundImage: 'url("/assets/images/sticky-note-2-bg-clean.png")'}}>
              <div className="sticky-content">
                <div className="sticky-title">
                  <img src={phoneIcon} alt="" className="sticky-icon" />
                  <h2>Call Us</h2>
                  <div className="yellow-highlight"></div>
                </div>
                <p className="contact-detail">+91 98765 43210</p>
                <div className="dashed-divider"></div>
                <p className="business-hours">
                  Mon &ndash; Sat<br/>
                  9:00 AM &ndash; 8:00 PM
                </p>
                <p className="business-hours">
                  Sunday &ndash; <span className="underline-red">Closed</span>
                </p>
              </div>
            </div>
          </div>

          {/* Email Us Sticky */}
          <div className="sticky-email">
            <div className="push-pin">
              <div className="pin-head"></div>
              <div className="pin-shadow"></div>
            </div>
            <div className="sticky-bg" style={{backgroundImage: 'url("/assets/images/sticky-note-3-bg-clean.png")'}}>
              <div className="sticky-content">
                <div className="sticky-title">
                  <EmailIcon />
                  <h2>Email Us</h2>
                  <div className="blue-highlight"></div>
                </div>
                <p className="contact-detail">hello@roughnote.in</p>
                <div className="dashed-divider"></div>
                <p className="reply-text">
                  We usually reply<br/>
                  within <span className="circle-red">24</span> working<br/>
                  hours.
                </p>
                <svg className="paper-plane" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Coffee Meeting Card */}
          <div className="sticky-coffee-meeting">
            <div className="sticky-bg" style={{backgroundImage: 'url("/assets/images/c-3.png")'}}>
              <div className="sticky-content">
                <div className="meeting-sketch">
                  <SketchCoffeeCup />
                </div>
                <div className="meeting-header">
                  <svg className="peach-highlight-svg" viewBox="0 0 350 70" overflow="visible" preserveAspectRatio="none">
                    <defs>
                      <filter id="highlighter-brush" x="-20%" y="-50%" width="140%" height="200%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
                      </filter>
                    </defs>
                    <path d="M 5 35 Q 175 30 340 35" stroke="#ffaa77" strokeWidth="50" strokeLinecap="round" fill="none" opacity="1.0" filter="url(#highlighter-brush)" />
                  </svg>
                  <h2>Let's Have a Coffee</h2>
                </div>
                <p className="meeting-desc">
                  Let's meet over coffee
                  (virtual or real)
                  and talk about
                  your next idea.
                </p>
                <button className="schedule-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="calendar-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Schedule a Meeting &rarr;
                </button>
                <div className="meeting-footer">
                  <svg className="curved-arrow" viewBox="0 0 50 50" fill="none" stroke="#d45b5b" strokeWidth="2">
                    <path d="M10,40 Q25,20 40,10" strokeLinecap="round" />
                    <path d="M30,10 L40,10 L40,20" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="footer-text">Pick a time that works for you.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left Margin */}
          <div className="bottom-margin-text">
            <p>Ideas<br/>become<br/>plans.</p>
            <br/>
            <p>Plans<br/>become<br/>products.</p>
            <svg className="star-icon-small" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Unified Bottom Studio Section */}
          <div className="bottom-studio-wrapper" style={{backgroundImage: 'url("/assets/images/bottom-left.png")'}}>
            <div className="studio-info-col">
              <div className="sticky-title">
                <LocationIcon />
                <h2>Our Studio</h2>
                <div className="yellow-highlight"></div>
              </div>
              <p className="contact-detail">
                Chennai,
                Tamil Nadu,
                India
              </p>
              <div className="dashed-divider"></div>
              <p className="studio-desc">
                We're always happy to meet<br/>
                in person. Let's <span className="underline-red">create</span> something<br/>
                meaningful together.
              </p>
              <svg className="smile-icon-small" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                <path d="M9 9h.01M15 9h.01M8 15a5 5 0 0 0 8 0" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="studio-map-col">
              <SvgChennaiMap />
              
              {/* Get Directions */}
              <a 
                href="https://www.google.com/maps/place/Chennai,+Tamil+Nadu,+India" 
                target="_blank" 
                rel="noopener noreferrer"
                className="get-directions"
                aria-label="Get directions to our Chennai studio on Google Maps"
              >
                <img src="/assets/images/masking tape.png" alt="" className="tape directions-tape" />
                <div className="directions-content">
                  <LocationIcon />
                  <span>Get Directions &rarr;</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Decorative Pencil */}
        <img src="/assets/images/pencil-left.png" alt="" className="decorative-pencil-right" />
      </div>
    </SiteLayout>
  );
}
