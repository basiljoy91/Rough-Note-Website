export const howWeWorkMarkup = `
<section class="how-we-work" aria-labelledby="how-we-work-title">
  <div class="how-we-work__inner">
    
    <!-- Page 07 tag -->
    <div class="hww-page-tag">
      <div class="paper-clip paper-clip--silver"></div>
      <span>Page 07</span>
    </div>

    <!-- Top Right Sticky Note -->
    <div class="hww-sticky hww-sticky--top-right">
      <img src="/assets/images/sticky-note-5-bg-clean.png" class="hww-sticky__bg" alt="" aria-hidden="true" />
      
      <div class="hww-sticky__content">
        <p>Two paths.<br/>One goal.<br/>Your success.</p>
        <svg class="hww-smiley-doodle" viewBox="0 0 24 24"><path d="M7 14s1.5 2 5 2 5-2 5-2 M9 9h.01 M15 9h.01" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
    </div>

    <!-- Header Section -->
    <div class="hww-header">
      <h1 id="how-we-work-title" class="hww-title">How Would You Like<br/>to Work With Us?</h1>
      <svg class="hww-title-underline" viewBox="0 0 500 15" preserveAspectRatio="none"><path d="M5 5 Q 250 10 495 5 M10 10 Q 250 15 490 10" fill="none" stroke="#e6de0e" stroke-width="3" stroke-linecap="round"/></svg>
      
      <p class="hww-subtitle">
        Every business is unique. That's why we give you<br/>
        the freedom to <span class="hww-marker-highlight">choose<span class="hww-marker-bg"></span></span> what works best for you.
      </p>
    </div>

    <!-- Main Columns Area -->
    <div class="hww-columns-wrapper">
      
      <!-- Left Column: Choose Your Plan -->
      <div class="hww-column hww-column--choose">
        <div class="hww-column__header">
          <span class="hww-tape hww-tape--green"></span>
          <svg class="hww-icon-small" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><polyline points="8 14 12 18 16 14"/></svg>
          <h2>CHOOSE YOUR PLAN</h2>
        </div>
        
        <p class="hww-column__desc">
          Pick the services you need.<br/>
          We'll build exactly what your business requires.
        </p>

        <!-- Service Grid 3x4 -->
        <div class="hww-service-grid">
          <!-- 1. Brand Identity -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span>Brand Identity<br/>& Logo</span>
          </div>
          <!-- 2. Website Design -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="8" x2="8" y1="13" y2="17"/><line x1="16" x2="16" y1="13" y2="17"/></svg>
            <span>Website Design<br/>& Development</span>
          </div>
          <!-- 3. E-Commerce -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>E-Commerce<br/>Solutions</span>
          </div>
          <!-- 4. Mobile App -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            <span>Mobile App<br/>Development</span>
          </div>
          <!-- 5. ERP -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2" ry="2"/><path d="M4 12h16"/><path d="M12 4v16"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>
            <span>ERP Software<br/>Solutions</span>
          </div>
          <!-- 6. AI & Auto -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M7.5 7.5l3 3"/><path d="M16.5 7.5l-3 3"/><path d="M7.5 16.5l3-3"/><path d="M16.5 16.5l-3-3"/></svg>
            <span>AI & Automation<br/>Solutions</span>
          </div>
          <!-- 7. UI/UX -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><circle cx="12" cy="10" r="3"/><path d="M7 20c0-2.5 5-2.5 5-2.5s5 0 5 2.5"/></svg>
            <span>UI/UX Design</span>
          </div>
          <!-- 8. 3D Modeling -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M21 7v10l-9 5v-10l9-5z"/><path d="M3 7v10l9 5v-10L3 7z"/></svg>
            <span>3D Modeling<br/>& Rendering</span>
          </div>
          <!-- 9. Digital Marketing -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 17v-4"/><path d="M12 17v-8"/><path d="M17 17V7"/><path d="M7 11l5-5 5 5"/></svg>
            <span>Digital Marketing<br/>& SEO</span>
          </div>
          <!-- 10. Graphic Design -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.7-.4-1 0-.9.7-1.5 1.5-1.5h2.5c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z"/></svg>
            <span>Graphic Design<br/>& Branding</span>
          </div>
          <!-- 11. Motion Graphics -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><polygon points="10 9 15 12 10 15 10 9"/></svg>
            <span>Motion Graphics<br/>& Animation</span>
          </div>
          <!-- 12. Custom Software -->
          <div class="hww-service-item">
            <svg class="hww-service-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Custom Software<br/>Development</span>
          </div>
        </div>

        <div class="hww-green-note">
          <span class="hww-check-icon">✓</span>
          <span class="hww-note-text">Tell us what you need, and we'll take care of the rest.</span>
          <div class="hww-green-note-bg"></div>
        </div>

        <button class="hww-btn hww-btn--outline">
          Build My Custom Plan ➔
        </button>
      </div>

      <!-- Center OR Divider -->
      <div class="hww-divider">
        <div class="hww-divider-circle">
          <span>OR</span>
          <svg class="hww-rough-circle" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#333" stroke-width="1.5" stroke-dasharray="8,2"/></svg>
        </div>
        <!-- Left Arrow -->
        <svg class="hww-divider-arrow-left" viewBox="0 0 50 20">
          <path d="M40 10 L10 10 M15 5 L10 10 L15 15" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3,3"/>
        </svg>
        <!-- Right Arrow -->
        <svg class="hww-divider-arrow-right" viewBox="0 0 50 20">
          <path d="M10 10 L40 10 M35 5 L40 10 L35 15" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3,3"/>
        </svg>
        <!-- Radiating Lines -->
        <svg class="hww-radiating-lines" viewBox="0 0 160 160">
          <line x1="80" y1="20" x2="80" y2="5" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="105" y1="25" x2="115" y2="15" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="125" y1="50" x2="140" y2="40" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="105" y1="135" x2="115" y2="145" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="80" y1="140" x2="80" y2="155" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="55" y1="135" x2="45" y2="145" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="35" y1="50" x2="20" y2="40" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="55" y1="25" x2="45" y2="15" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- Right Column: Let Us Plan -->
      <div class="hww-column hww-column--plan">
        <!-- Recommended Badge -->
        <div class="hww-badge">
          RECOMMENDED<br/>BY MOST CLIENTS
          <div class="hww-badge-stars">
            <svg viewBox="0 0 24 24" fill="#333"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg viewBox="0 0 24 24" fill="#333"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg viewBox="0 0 24 24" fill="#333"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>

        <div class="hww-column__header">
          <span class="hww-tape hww-tape--yellow"></span>
          <svg class="hww-icon-small" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <h2>LET US PLAN FOR YOU</h2>
        </div>
        
        <p class="hww-column__desc">
          Not sure where to start?<br/>
          We'll understand your business and suggest the<br/>right solution for maximum impact.
        </p>

        <!-- 4 Step Process -->
        <div class="hww-steps">
          
          <div class="hww-step">
            <div class="hww-step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><rect x="14" y="6" width="10" height="6" rx="2"/><path d="M16 9h6"/></svg></div>
            <div class="hww-step__content">
              <h3>1. Discover & Understand</h3>
              <p>We learn about your business, goals,<br/>and current challenges.</p>
            </div>
          </div>
          <svg class="hww-step-divider" viewBox="0 0 200 5" preserveAspectRatio="none"><path d="M0 2 L200 2" stroke="#333" stroke-width="1" stroke-dasharray="4,4" opacity="0.3"/></svg>

          <div class="hww-step">
            <div class="hww-step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3a2 2 0 0 0 2 2h4"/><path d="M18 9v3a2 2 0 0 1-2 2h-4"/></svg></div>
            <div class="hww-step__content">
              <h3>2. Plan & Recommend</h3>
              <p>We create a tailored strategy and recommend<br/>the best services for you.</p>
            </div>
          </div>
          <svg class="hww-step-divider" viewBox="0 0 200 5" preserveAspectRatio="none"><path d="M0 2 L200 2" stroke="#333" stroke-width="1" stroke-dasharray="4,4" opacity="0.3"/></svg>

          <div class="hww-step">
            <div class="hww-step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
            <div class="hww-step__content">
              <h3>3. Proposal & Roadmap</h3>
              <p>You receive a clear plan, timeline, and<br/>transparent quote.</p>
            </div>
          </div>
          <svg class="hww-step-divider" viewBox="0 0 200 5" preserveAspectRatio="none"><path d="M0 2 L200 2" stroke="#333" stroke-width="1" stroke-dasharray="4,4" opacity="0.3"/></svg>

          <div class="hww-step">
            <div class="hww-step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></div>
            <div class="hww-step__content">
              <h3>4. Build & Deliver</h3>
              <p>We execute the plan and deliver results<br/>that drive your business forward.</p>
            </div>
          </div>

        </div>

        <button class="hww-btn hww-btn--solid">
          Let Us Plan For You ➔
        </button>
      </div>

    </div>

    <!-- Bottom Decoration Area -->
    <div class="hww-bottom-area">
      <!-- Bottom Left Sticky -->
      <div class="hww-sticky hww-sticky--bottom-left">
        <img src="/assets/images/sticky-note-philosophy-bg-clean.png" class="hww-sticky__bg" alt="" aria-hidden="true" />
        
        <div class="hww-sticky__content hww-sticky__content--list">
          <ul class="hww-checklist">
            <li><span>✓</span> Flexible</li>
            <li><span>✓</span> Transparent</li>
            <li><span>✓</span> Result Driven</li>
            <li><span>✓</span> Always You First</li>
          </ul>
          <svg class="hww-heart-doodle" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>

      <!-- Bottom Center Torn Paper -->
      <div class="hww-center-note">
        <img src="/assets/images/d-2-1.png" class="hww-center-note__bg" alt="" aria-hidden="true" />
        <div class="hww-center-note__content">
          <svg class="hww-bulb-icon" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          <p>
            Whether you choose your plan or let us plan for you,
            one thing stays the same &mdash; <span class="hww-marker-highlight">our commitment to your success.<span class="hww-marker-bg hww-marker-bg--yellow"></span></span>
          </p>
        </div>
      </div>

      <!-- Bottom Right Pinned Note -->
      <div class="hww-pinned-note">
        <img src="/assets/images/d-2-2.png" class="hww-pinned-note__bg" alt="" aria-hidden="true" />
        <div class="hww-push-pin"></div>
        <div class="hww-pinned-note__content">
          <p>Flexible.Simple.<br/>Built Around You.</p>
          <svg class="hww-heart-doodle-small" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>

      <!-- Right Side Objects -->
      <img src="/assets/images/pencil-left.png" class="hww-right-pencil" alt="" aria-hidden="true" />
      <div class="hww-paper-clip hww-paper-clip--1"></div>
      <div class="hww-paper-clip hww-paper-clip--2"></div>
    </div>

  </div>
</section>
`;
