import React, { useRef } from 'react';
import './why-rough-note.css';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';

export const WhyRoughNote: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section className="why-rough-note" ref={sectionRef}>
      {/* Header Section */}
      <div className="wrn-header">
        <div className="wrn-page-num">
          Page 04
          <svg className="wrn-underline-orange" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 5 Q 50 0 100 8" />
          </svg>
        </div>

        <div className="wrn-title-area">
          <div className="wrn-title-deco-left">
            <div className="wrn-lightbulb-wrapper">
              <svg className="wrn-lightbulb" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18h6m-5 3h4m-7-9a5 5 0 1110 0c0 1.66-1.34 3-3 4.5v1.5H9V16.5C7.34 15 6 13.66 6 12z" />
                <path d="M12 2v2m4.95-1.05l-1.41 1.41M19 12h2M16.95 19.05l-1.41-1.41M2 12h2M5.05 4.95l1.41 1.41" stroke="#e65100" />
              </svg>
              <div className="wrn-ideas-text">
                Ideas<br/>become<br/>impact.
                <svg className="wrn-ideas-arrow" viewBox="0 0 50 50">
                  <path d="M5,5 Q25,25 45,45" fill="none" stroke="#000" strokeWidth="1.5" />
                  <path d="M35,45 L45,45 L45,35" fill="none" stroke="#000" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="wrn-title">Why Rough Note?</h2>

          <svg className="wrn-title-underline" viewBox="0 0 300 20" preserveAspectRatio="none">
            <path d="M10 10 Q 150 0 290 15" fill="none" stroke="#e65100" strokeWidth="3" />
          </svg>
        </div>

        <div className="wrn-subtitle">
          <p>Every project starts with a rough note, but what makes it successful<br/>is the way it's explored, challenged, and refined.</p>
          <p>
            Here's what <span className="wrn-underline-black-wrapper">you can<svg className="wrn-underline-black" viewBox="0 0 100 15" preserveAspectRatio="none"><path d="M5 10 Q 50 5 95 12" fill="none" stroke="#000" strokeWidth="2" /></svg></span> expect when you work with us.
          </p>
        </div>
      </div>

      {/* Top Right Sticky */}
      <div className="wrn-top-sticky">
        <div className="wrn-client-success">
          Client<br/>Success
          <svg className="wrn-success-arrow" viewBox="0 0 30 40">
            <path d="M5 5 Q 10 30 25 35" fill="none" stroke="#000" strokeWidth="1.5" />
            <path d="M15 35 L25 35 L25,25" fill="none" stroke="#000" strokeWidth="1.5" />
          </svg>
          <svg className="wrn-success-heart" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="1.5">
            <path d="M20.8 4.6a5.5 5.5 0 00-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 00-7.8 7.8l1 1 7.9 7.9 7.9-7.9 1-1a5.5 5.5 0 000-7.8z" />
          </svg>
        </div>
        <div className="wrn-sticky-note-wrapper">
          <img src="/assets/images/sticky-note-5-bg-clean.png" alt="Sticky Note" className="wrn-sticky-bg" />
          <div className="wrn-sticky-content">
            We don't just<br/>build products.<br/>We help shape<br/>ideas into<br/>businesses.
            <div className="wrn-sticky-star">⭐</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="wrn-cards-grid">
        {/* Card 01 */}
        <div className="wrn-card">
          <img src="/assets/images/c-s-m.png" alt="Card Background" className="wrn-card-bg" />
          <div className="wrn-card-content">
            <div className="wrn-card-num">01</div>
            <div className="wrn-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M14 10l7-7m0 0h-4m4 0v4"/></svg>
            </div>
            <h3 className="wrn-card-title">
              <span className="wrn-title-inner">
                Business Before Design
                <svg className="wrn-card-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 8" stroke="#e65100" fill="none" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h3>
            <p className="wrn-card-body">We begin by understanding your business goals, users, and challenges before creating anything.</p>
            <div className="wrn-card-sticky blue">
              Solve the<br/>problem first.
              <span className="wrn-card-star">☆</span>
            </div>
          </div>
        </div>

        {/* Card 02 */}
        <div className="wrn-card">
          <img src="/assets/images/c-s-m.png" alt="Card Background" className="wrn-card-bg" />
          <div className="wrn-card-content">
            <div className="wrn-card-num">02</div>
            <div className="wrn-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            </div>
            <h3 className="wrn-card-title">
              <span className="wrn-title-inner">
                Strategy-Driven Thinking
                <svg className="wrn-card-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 8" stroke="#e65100" fill="none" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h3>
            <p className="wrn-card-body">Every logo, website, AI workflow, or software solution is backed by research and planning—not assumptions.</p>
            <div className="wrn-stamp red">
              RESEARCH<br/>COMPLETE <span className="wrn-stamp-check">✓</span>
            </div>
          </div>
        </div>

        {/* Card 03 */}
        <div className="wrn-card">
          <img src="/assets/images/c-s-m.png" alt="Card Background" className="wrn-card-bg" />
          <div className="wrn-card-content">
            <div className="wrn-card-num">03</div>
            <div className="wrn-attachment wrn-push-pin"></div>
            <div className="wrn-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <h3 className="wrn-card-title">
              <span className="wrn-title-inner">
                One Creative Partner
                <svg className="wrn-card-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 8" stroke="#e65100" fill="none" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h3>
            <p className="wrn-card-body">Branding, websites, ERP, AI automation, motion graphics, and custom software—all under one creative studio.</p>
            <div className="wrn-card-sticky yellow">
              Everything<br/>connects.
              <span className="wrn-card-link-icon">🔗</span>
            </div>
          </div>
        </div>

        {/* Card 04 */}
        <div className="wrn-card">
          <img src="/assets/images/c-s-m.png" alt="Card Background" className="wrn-card-bg" />
          <div className="wrn-card-content">
            <div className="wrn-card-num">04</div>
            <div className="wrn-attachment wrn-paper-clip"></div>
            <div className="wrn-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <h3 className="wrn-card-title">
              <span className="wrn-title-inner">
                Built Around Your Business
                <svg className="wrn-card-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 8" stroke="#e65100" fill="none" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h3>
            <p className="wrn-card-body">We don't force templates onto your business. Every solution is designed around your workflow and objectives.</p>
            <div className="wrn-card-sticky green">
              No one-size-<br/>fits-all.
            </div>
          </div>
        </div>

        {/* Card 05 */}
        <div className="wrn-card">
          <img src="/assets/images/c-s-m.png" alt="Card Background" className="wrn-card-bg" />
          <div className="wrn-card-content">
            <div className="wrn-card-num">05</div>
            <div className="wrn-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
            <h3 className="wrn-card-title">
              <span className="wrn-title-inner">
                Transparent Collaboration
                <svg className="wrn-card-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 8" stroke="#e65100" fill="none" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h3>
            <p className="wrn-card-body">You'll always know what we're building, why we're building it, and what comes next.</p>
            <div className="wrn-card-sticky white wrn-sticker-checklist">
              <div className="wrn-attachment wrn-paper-clip"></div>
              <div className="wrn-checklist">
                <div>✓ Weekly updates</div>
                <div>✓ Client reviews</div>
                <div>✓ Clear milestones</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 06 */}
        <div className="wrn-card">
          <img src="/assets/images/c-s-m.png" alt="Card Background" className="wrn-card-bg" />
          <div className="wrn-card-content">
            <div className="wrn-card-num">06</div>
            <div className="wrn-attachment wrn-push-pin"></div>
            <div className="wrn-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
            <h3 className="wrn-card-title">
              <span className="wrn-title-inner">
                Quality Without Compromise
                <svg className="wrn-card-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 8" stroke="#e65100" fill="none" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h3>
            <p className="wrn-card-body">From the first sketch to launch, every detail is reviewed, refined, and tested.</p>
            <div className="wrn-stamp blue">
              APPROVED <span className="wrn-stamp-check">✓</span>
            </div>
          </div>
        </div>

        {/* Card 07 */}
        <div className="wrn-card">
          <img src="/assets/images/c-s-m.png" alt="Card Background" className="wrn-card-bg" />
          <div className="wrn-card-content">
            <div className="wrn-card-num">07</div>
            <div className="wrn-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <h3 className="wrn-card-title">
              <span className="wrn-title-inner">
                Long-Term Partnership
                <svg className="wrn-card-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 8" stroke="#e65100" fill="none" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h3>
            <p className="wrn-card-body">Launch isn't the finish line. We continue improving, supporting, and helping your product grow.</p>
            <div className="wrn-card-sticky pink">
              Version 2<br/>starts here.
              <svg className="wrn-sticky-graph" viewBox="0 0 20 15" fill="none" stroke="#000" strokeWidth="1.5">
                <path d="M2 13 L8 8 L12 10 L18 2" />
                <path d="M14 2 L18 2 L18 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="wrn-footer">
        <div className="wrn-footer-paper-wrapper">
          <img src="/assets/images/d-2-1.png" alt="Long Paper" className="wrn-footer-paper-bg" />

          {/* Left Decorations */}
          <div className="wrn-attachment wrn-paper-clip wrn-footer-clip"></div>
          <div className="wrn-footer-star">☆</div>

          <div className="wrn-footer-content">
            <p className="wrn-footer-text">
              We don't just build products.<br/>
              We help shape ideas into businesses <span className="wrn-underline-orange-wrapper">people remember.
                <svg className="wrn-footer-underline" viewBox="0 0 150 15" preserveAspectRatio="none">
                  <path d="M5 10 Q 75 0 145 12" fill="none" stroke="#e65100" strokeWidth="3" />
                </svg>
              </span>
            </p>
          </div>

          {/* Right Decorations */}
          <img src="/assets/images/pencil-right.png" alt="Pencil" className="wrn-footer-pencil" />
          <svg className="wrn-footer-heart" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="1.5">
            <path d="M20.8 4.6a5.5 5.5 0 00-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 00-7.8 7.8l1 1 7.9 7.9 7.9-7.9 1-1a5.5 5.5 0 000-7.8z" />
          </svg>
        </div>

        <div className="wrn-footer-together">
          Together,<br/>We Grow.
          <svg className="wrn-together-arrow" viewBox="0 0 30 30">
            <path d="M25 5 Q 10 15 5 25" fill="none" stroke="#000" strokeWidth="1.5" />
            <path d="M15 25 L5 25 L5 15" fill="none" stroke="#000" strokeWidth="1.5" />
          </svg>
          <div className="wrn-together-star">☆</div>
        </div>
      </div>
    </section>
  );
};
