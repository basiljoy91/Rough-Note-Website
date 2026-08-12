import './our-work.global.css';
import '../../features/notebook-footer/notebook-footer-placeholder.global.css';
import { useRef, useState, useEffect } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { FooterPaper } from '../../features/notebook-footer/components/FooterPaper';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';
import { useScrollReveal } from '../../shared/hooks/useScrollReveal';
import { SketchFilters } from '../../shared/ui/SketchFilters';

export function OurWorkPage() {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);

  const [scale, setScale] = useState(1);
  const [isExpandedView, setIsExpandedView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setScale(1);
        return;
      }
      
      const availableWidth = window.innerWidth - 270 - 40; // 270px sidebar offset, 40px horizontal padding (20px each side)
      const availableHeight = window.innerHeight - 40;    // 40px vertical margins (20px each side)
      
      const scaleX = availableWidth / 2038; // Active content width boundary (450 left + 40 gap + 1800 * 0.86 moodboard active width)
      const scaleY = availableHeight / 1152; // Moodboard layout height
      
      // Select the smaller scale factor to fit both dimensions, cap at 1.0
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
      <SketchFilters />
      <SiteLayout
        activeItem="work"
        pageLabel="Page 05"
        pageTitle="Our Work"
      >
        <main
          ref={mainRef}
          className="ow-page-container"
          data-rough-anchor="work-main"
        >
          <div className="ow-content-scaler" style={{ transform: `translateY(-50%) scale(${scale})` }}>
            {/* LEFT COLUMN */}
            <div className="ow-left-col">
            <div className="ow-page-label">PAGE 05</div>
            
            <h1 className="ow-title">Our Work</h1>
            
            <div className="ow-subtitle-container">
              <p className="ow-subtitle">
                Some ideas stayed on paper.<br />
                These ones made it into the world.
              </p>
              {/* Double wavy underline */}
              <svg className="ow-wavy-underline" viewBox="0 0 320 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8 Q 80 2, 160 8 T 317 8" stroke="#1b1814" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M10 10 Q 90 6, 170 10 T 310 10" stroke="#1b1814" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>

            <p className="ow-body-text">
              From brands and digital experiences to
              ERP systems, AI automation, software and
              motion — here's a look at what we've turned
              from rough notes into real products.
            </p>

            {/* Checklist Note using new.png only */}
            <div className="ow-checklist-container">
              <div className="ow-checklist-wrapper">
                <img
                  src="/assets/images/new.png"
                  className="ow-checklist-img"
                  alt="Delivered, Tested, Approved, Out in the world checklist"
                />
                <div className="ow-checklist-overlay">
                  <div className="ow-checklist-items">
                    <div className="ow-checklist-item">✓ Delivered</div>
                    <div className="ow-checklist-item">✓ Tested</div>
                    <div className="ow-checklist-item">✓ Approved</div>
                    <div className="ow-checklist-item">✓ Out in the world</div>
                  </div>
                  {/* Hand-drawn Smile Icon */}
                  <div className="ow-checklist-smile">
                    <svg viewBox="0 0 50 50" width="36" height="36" fill="none" stroke="#2d261e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 25 10 A 15 15 0 1 1 24.9 10" />
                      <circle cx="20" cy="22" r="2" fill="#2d261e" />
                      <circle cx="30" cy="22" r="2" fill="#2d261e" stroke="none" />
                      <path d="M 18 30 Q 25 36, 32 30" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>


            {/* Open the archive */}
            <div className="ow-open-archive">
              <span className="ow-archive-arrow">↓</span> Open the archive
            </div>
          </div>

          {/* RIGHT COLUMN - MOOD BOARD */}
          <div className="ow-moodboard">
            {/* ==========================================
               DECORATIVE ELEMENTS (PINS, CLIPS, TAPE)
               ========================================== */}
            
            {/* Website Mockup Pin */}
            <svg className="ow-pin" style={{ top: '1.5%', left: '32.5%', width: '18px', height: '18px' }} viewBox="0 0 20 20">
              <circle cx="10" cy="8" r="6" fill="#111" />
              <circle cx="9" cy="7" r="2" fill="#fff" opacity="0.4" />
              <path d="M10 14 L10 19" stroke="#555" strokeWidth="1.5" />
            </svg>

            {/* Brand Strategy Sticky Pin */}
            <svg className="ow-pin" style={{ top: '2.5%', left: '57%', width: '14px', height: '14px' }} viewBox="0 0 20 20">
              <circle cx="10" cy="8" r="5" fill="#a43a3a" />
              <circle cx="9" cy="7" r="1.5" fill="#fff" opacity="0.4" />
              <path d="M10 13 L10 17" stroke="#444" strokeWidth="1.2" />
            </svg>

            {/* AI Workflow Top Tape */}
            <div className="ow-tape" style={{ top: '8%', left: '76%', width: '45px', height: '14px', transform: 'rotate(-4deg)' }} />
            
            {/* AI Workflow Side Tape */}
            <div className="ow-tape" style={{ top: '44%', left: '83%', width: '38px', height: '12px', transform: 'rotate(25deg)' }} />

            {/* AI Workflow Binder Clip */}
            <svg className="ow-paperclip" style={{ top: '7.5%', left: '71%', width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="none">
              <rect x="7" y="10" width="10" height="8" rx="1" fill="#444" />
              <path d="M9 10 V6 C9 4.5 10.5 3.5 12 3.5 C13.5 3.5 15 4.5 15 6 V10" stroke="#444" strokeWidth="1.5" fill="none" />
              <circle cx="12" cy="14" r="2" fill="#bbb" />
            </svg>

            {/* Website Wireframe Pin */}
            <svg className="ow-pin" style={{ top: '46%', left: '15%', width: '16px', height: '16px' }} viewBox="0 0 20 20">
              <circle cx="10" cy="8" r="5.5" fill="#bfa37a" />
              <circle cx="9" cy="7" r="1.8" fill="#fff" opacity="0.4" />
              <path d="M10 13.5 L10 18" stroke="#666" strokeWidth="1.5" />
            </svg>


            {/* ==========================================
               MOOD BOARD ITEMS
               ========================================== */}

            {/* 1. TOP-CENTER WEBSITE MOCKUP */}
            <div className="ow-paper ow-mockup-paper">
              <div className="ow-mockup-inner">
                <div className="ow-mockup-header">
                  <div className="ow-mockup-logo">ROUGH NOTE.</div>
                  <div className="ow-mockup-nav">
                    <span>work</span>
                    <span>about</span>
                    <span>studio</span>
                  </div>
                </div>
                <div className="ow-mockup-content">
                  <h2 className="ow-mockup-headline">crafting brands that speak.</h2>
                  
                  {/* Hero Artwork Sketch (Ceramic vase/bottle layout) */}
                  <div className="ow-mockup-hero">
                    <svg viewBox="0 0 200 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="200" height="115" fill="#fdfbf7" />
                      
                      {/* Shadow behind objects */}
                      <ellipse cx="120" cy="92" rx="42" ry="12" fill="#eae3d5" opacity="0.7" />
                      
                      {/* Table edge line */}
                      <line x1="15" y1="92" x2="185" y2="92" stroke="#d5ccba" strokeWidth="1.5" />
                      
                      {/* Minimalist Ceramic Bottle */}
                      <path d="M122 92 L122 56 Q122 47 127 45 L127 34 Q127 31 129 31 L135 31 Q137 31 137 34 L137 45 Q142 47 142 56 L142 92 Z" fill="#ebd9c3" stroke="#cca27c" strokeWidth="1" strokeLinejoin="round" />
                      
                      {/* Bottle Label */}
                      <rect x="126" y="58" width="12" height="16" fill="#fdfbf7" rx="0.5" stroke="#cca27c" strokeWidth="0.5" />
                      <line x1="128.5" y1="62" x2="135.5" y2="62" stroke="#cca27c" strokeWidth="0.5" />
                      <line x1="128.5" y1="65" x2="135.5" y2="65" stroke="#cca27c" strokeWidth="0.5" />
                      <circle cx="132" cy="70" r="1.5" fill="#c47e5a" />

                      {/* Small Ceramic Dish */}
                      <path d="M78 92 Q72 72 65 72 L105 72 Q98 72 92 92 Z" fill="#cfbfac" stroke="#b09f8a" strokeWidth="1" strokeLinejoin="round" />
                      <ellipse cx="85" cy="72" rx="20" ry="4" fill="#faf5ec" stroke="#b09f8a" strokeWidth="1" />

                      {/* Flat Tray in Background */}
                      <ellipse cx="108" cy="90" rx="14" ry="4" fill="#bda28c" stroke="#9e846f" strokeWidth="0.8" />
                      
                      {/* Little stones */}
                      <circle cx="116" cy="92" r="2.5" fill="#8c7765" />
                      <circle cx="112" cy="93" r="1.5" fill="#af9c8c" />
                    </svg>
                  </div>
                  
                  <div className="ow-mockup-footer">
                    <div className="ow-mockup-lines">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="ow-mockup-thumb"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BRAND STRATEGY STICKY NOTE */}
            <div className="ow-sticky ow-brand-sticky">
              <h3 className="ow-sticky-title">Brand Strategy</h3>
              <ul className="ow-sticky-list">
                <li>Research</li>
                <li>Identity</li>
                <li>Guidelines</li>
                <li>Applications</li>
              </ul>
            </div>

            {/* 3. BLACK ROUGH NOTE CARD */}
            <div className="ow-paper ow-black-card">
              <div className="ow-black-inner">
                <div className="ow-black-rn">RN</div>
                <div className="ow-black-tag">ROUGH NOTE</div>
              </div>
            </div>

            {/* 4. LOGO EXPLORATION PAPER */}
            <div className="ow-paper ow-logo-paper">
              <h3 className="ow-logo-title">Logo Exploration</h3>
              <div className="ow-logo-grid">
                {/* Logo 1 */}
                <div className="ow-logo-item">
                  <svg viewBox="0 0 30 30" fill="none">
                    <path d="M6 24 V6 H14 C17 6 19 8 19 11 C19 13.5 17 15 14 15 H6" stroke="#222" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M11 15 L22 24" stroke="#222" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span className="ow-logo-label">basic</span>
                </div>
                {/* Logo 2 */}
                <div className="ow-logo-item">
                  <svg viewBox="0 0 30 30" fill="none">
                    <circle cx="15" cy="15" r="10" stroke="#222" strokeWidth="1.2" strokeDasharray="3 2" />
                    <path d="M10 20 V10 H14 C16 10 17 11 17 12.5 C17 14 16 15 14 15 H10" stroke="#222" strokeWidth="1.5" />
                    <path d="M13 15 L19 20" stroke="#222" strokeWidth="1.5" />
                  </svg>
                  <span className="ow-logo-label">dynamic</span>
                </div>
                {/* Logo 3 */}
                <div className="ow-logo-item">
                  <svg viewBox="0 0 30 30" fill="none">
                    {/* Elegant handwritten script RN */}
                    <path d="M5 23 Q12 10 13 7 T11 9 Q10 11 12 17 T15 20 Q20 20 22 13" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="ow-logo-label">script</span>
                </div>
              </div>
            </div>

            {/* 5. AI WORKFLOW PAPER */}
            <div className="ow-paper ow-ai-workflow">
              <h3 className="ow-workflow-title">AI Workflow</h3>
              <div className="ow-workflow-steps">
                <div className="ow-workflow-step">Trigger</div>
                <div className="ow-workflow-arrow">↓</div>
                <div className="ow-workflow-step">Data Input</div>
                <div className="ow-workflow-arrow">↓</div>
                <div className="ow-workflow-step">AI Process</div>
                <div className="ow-workflow-arrow">↓</div>
                <div className="ow-workflow-step">Output</div>
                <div className="ow-workflow-arrow">↓</div>
                <div className="ow-workflow-step">Automation</div>
              </div>
              <div className="ow-workflow-footer">
                "Reduce manual work by 80%"
              </div>
            </div>

            {/* 6. WEBSITE WIREFRAME */}
            <div className="ow-paper ow-wireframe-paper">
              <h3 className="ow-wireframe-title">Website Wireframe</h3>
              <div className="ow-wireframe-grid">
                <div className="ow-wf-box ow-wf-header">HEADER</div>
                <div className="ow-wf-box ow-wf-hero">HERO SECTION</div>
                <div className="ow-wf-split">
                  <div className="ow-wf-box ow-wf-about">ABOUT US</div>
                  <div className="ow-wf-box ow-wf-services">OUR SERVICES</div>
                </div>
              </div>
            </div>

            {/* 7. USER JOURNEY NOTE */}
            <div className="ow-sticky ow-user-journey">
              <h3 className="ow-uj-title">User Journey</h3>
              <div className="ow-uj-steps">
                {/* 1. Search */}
                <div className="ow-uj-step">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <circle cx="10" cy="10" r="6" />
                    <line x1="21" y1="21" x2="15" y2="15" />
                  </svg>
                  <span className="ow-uj-label">Search</span>
                </div>
                <span className="ow-uj-arrow">→</span>
                
                {/* 2. Explore */}
                <div className="ow-uj-step">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16.2 7.8 L13.8 13.8 L7.8 16.2 L10.2 10.2 Z" />
                  </svg>
                  <span className="ow-uj-label">Explore</span>
                </div>
                <span className="ow-uj-arrow">→</span>
                
                {/* 3. Choose */}
                <div className="ow-uj-step">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12 v7 a2 2 0 0 1-2 2 H5 a2 2 0 0 1-2-2 V5 a2 2 0 0 1 2-2 h11" />
                  </svg>
                  <span className="ow-uj-label">Choose</span>
                </div>
                <span className="ow-uj-arrow">→</span>
                
                {/* 4. Order */}
                <div className="ow-uj-step">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span className="ow-uj-label">Order</span>
                </div>
                <span className="ow-uj-arrow">→</span>
                
                {/* 5. Receive */}
                <div className="ow-uj-step">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 16 V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span className="ow-uj-label">Receive</span>
                </div>
              </div>
            </div>

            {/* 8. ERP DASHBOARD PANEL */}
            <div className="ow-paper ow-erp-dashboard">
              <div className="ow-erp-inner">
                {/* Dashboard Sidebar */}
                <div className="ow-erp-sidebar">
                  <div className="ow-erp-logo"></div>
                  <div className="ow-erp-nav-item active"></div>
                  <div className="ow-erp-nav-item"></div>
                  <div className="ow-erp-nav-item"></div>
                  <div className="ow-erp-nav-item"></div>
                </div>
                
                {/* Dashboard Main Area */}
                <div className="ow-erp-main">
                  <div className="ow-erp-header">
                    <span>Main ERP Portal</span>
                    <span>Admin</span>
                  </div>
                  
                  {/* KPI Cards */}
                  <div className="ow-erp-grid">
                    <div className="ow-erp-card">
                      <div>Sales</div>
                      <div className="ow-erp-card-val">$24k</div>
                    </div>
                    <div className="ow-erp-card" style={{ borderColor: '#26c6da' }}>
                      <div>Stock</div>
                      <div className="ow-erp-card-val">842</div>
                    </div>
                    <div className="ow-erp-card" style={{ borderColor: '#ab47bc' }}>
                      <div>Orders</div>
                      <div className="ow-erp-card-val">198</div>
                    </div>
                  </div>
                  
                  {/* Charts */}
                  <div className="ow-erp-charts">
                    {/* Line Chart */}
                    <div className="ow-erp-chart-box">
                      <div style={{ fontSize: '8px', color: '#888' }}>Analytics</div>
                      <svg viewBox="0 0 60 25">
                        {/* Grid lines */}
                        <line x1="0" y1="5" x2="60" y2="5" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        <line x1="0" y1="15" x2="60" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        {/* Trend path */}
                        <path d="M0 20 Q 12 12, 24 16 T 48 6 T 60 10" fill="none" stroke="#00bfa5" strokeWidth="1" />
                        <path d="M0 20 Q 12 12, 24 16 T 48 6 T 60 10 L 60 25 L 0 25 Z" fill="rgba(0, 191, 165, 0.1)" />
                      </svg>
                    </div>
                    {/* Donut Chart */}
                    <div className="ow-erp-chart-box">
                      <svg viewBox="0 0 30 30">
                        <circle cx="15" cy="15" r="10" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="none" />
                        <circle cx="15" cy="15" r="10" stroke="#00bfa5" strokeWidth="2.5" strokeDasharray="45 100" strokeDashoffset="10" fill="none" strokeLinecap="round" />
                        <text x="15" y="17" fill="#fff" fontSize="6px" textAnchor="middle">72%</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. ERP SYSTEM STICKY NOTE */}
            <div className="ow-sticky ow-erp-sticky">
              <h3 className="ow-sticky-title">ERP System</h3>
              <ul className="ow-sticky-list">
                <li>Dashboard</li>
                <li>Inventory</li>
                <li>Sales</li>
                <li>Reports</li>
              </ul>
            </div>

            {/* 10. MOTION STORYBOARD */}
            <div className="ow-paper ow-storyboard">
              <h3 className="ow-sb-title">Motion Storyboard</h3>
              <div className="ow-sb-panels">
                {/* Scene 1 */}
                <div className="ow-sb-panel">
                  <div className="ow-sb-visual">
                    <svg viewBox="0 0 40 40">
                      {/* Bulb Sketch */}
                      <circle cx="20" cy="16" r="8" stroke="#333" strokeWidth="1.2" fill="none" />
                      <path d="M15 22 Q20 22 20 28 Q20 22 25 22" stroke="#333" strokeWidth="1.2" fill="none" />
                      <line x1="20" y1="8" x2="20" y2="4" stroke="#888" strokeWidth="1" />
                      <line x1="12" y1="12" x2="9" y2="9" stroke="#888" strokeWidth="1" />
                      <line x1="28" y1="12" x2="31" y2="9" stroke="#888" strokeWidth="1" />
                    </svg>
                  </div>
                  <div className="ow-sb-label">Scene 1: Idea</div>
                </div>
                
                {/* Scene 2 */}
                <div className="ow-sb-panel">
                  <div className="ow-sb-visual">
                    <svg viewBox="0 0 40 40">
                      {/* Gears Sketch */}
                      <circle cx="16" cy="18" r="6" stroke="#333" strokeWidth="1.2" fill="none" />
                      <circle cx="24" cy="24" r="5" stroke="#333" strokeWidth="1.2" fill="none" />
                      <path d="M16 12 L16 10 M16 26 L16 24 M10 18 L12 18 M22 18 L20 18" stroke="#333" strokeWidth="1" />
                      <path d="M24 19 L24 17 M24 31 L24 29 M19 24 L21 24 M29 24 L27 24" stroke="#333" strokeWidth="1" />
                    </svg>
                  </div>
                  <div className="ow-sb-label">Scene 2: Build</div>
                </div>
                
                {/* Scene 3 */}
                <div className="ow-sb-panel">
                  <div className="ow-sb-visual">
                    <svg viewBox="0 0 40 40">
                      {/* Rocket Launch Sketch */}
                      <path d="M20 6 Q25 15 25 26 H15 Q15 15 20 6 Z" stroke="#333" strokeWidth="1.2" fill="none" />
                      <path d="M15 26 L12 30 H28 L25 26" stroke="#333" strokeWidth="1.2" fill="none" />
                      {/* Fire thrust */}
                      <path d="M17 31 Q20 38 20 38 Q20 38 23 31" stroke="#c95b5b" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                  <div className="ow-sb-label">Scene 3: Launch</div>
                </div>
              </div>
            </div>

            {/* 11. PACKAGING CONCEPT */}
            <div className="ow-paper ow-packaging">
              <div className="ow-pk-left">
                <h3 className="ow-pk-title">Packaging Concept</h3>
                <ul className="ow-pk-list">
                  <li>Premium</li>
                  <li>Minimal</li>
                  <li>Sustainable</li>
                </ul>
              </div>
              <div className="ow-pk-right">
                {/* Isometric 3D box drawing */}
                <svg className="ow-box-sketch" viewBox="0 0 100 100" fill="none">
                  {/* Top Face */}
                  <path d="M50 20 L80 32 L50 44 L20 32 Z" stroke="#222" strokeWidth="1.2" strokeLinejoin="round" fill="#fafafa" />
                  
                  {/* Left Face */}
                  <path d="M20 32 L20 68 L50 82 L50 44 Z" stroke="#222" strokeWidth="1.2" strokeLinejoin="round" fill="#f4f4f4" />
                  
                  {/* Right Face */}
                  <path d="M80 32 L80 68 L50 82 L50 44 Z" stroke="#222" strokeWidth="1.2" strokeLinejoin="round" fill="#eaeaea" />
                  
                  {/* Minimal Cardboard/Packaging label line designs */}
                  <path d="M25 40 L45 50" stroke="#ccc" strokeWidth="0.8" />
                  <path d="M25 44 L45 54" stroke="#ccc" strokeWidth="0.8" />
                  <rect x="25" y="49" width="10" height="12" stroke="#bbb" strokeWidth="0.8" fill="none" />
                  
                  {/* Small leaf logo on the box face */}
                  <path d="M60 52 Q62 46 68 46 Q64 54 60 52" stroke="#728c6e" strokeWidth="1.2" fill="none" />
                  <path d="M60 52 L68 46" stroke="#728c6e" strokeWidth="0.8" />
                </svg>
              </div>
            </div>
          </div>
          </div>
        </main>
        
        {!isExpandedView ? (
          <>
        {/* ============================================================
            PART 2 — THE PROJECT ARCHIVE
            ============================================================ */}
        <section className="ow-archive-section">
          <div className="ow-archive-paper">
            <img src="/assets/images/bottom-left.png" className="ow-archive-bg" alt="" aria-hidden="true" />

            <div className="ow-archive-content">

              {/* TOP ROW: title LEFT, filters RIGHT — same horizontal band */}
              <div className="ow-archive-top-row">
                <div className="ow-archive-heading-group">
                  <h2 className="ow-archive-title">The Project Archive</h2>
                  <p className="ow-archive-subtitle">A few things we've been working on.</p>
                </div>

                <nav className="ow-archive-filters" aria-label="Project categories">
                  {['ALL', 'BRAND', 'WEB', 'SOFTWARE', 'AI', '3D', 'MOTION'].map((cat) => (
                    <button
                      key={cat}
                      className={`ow-filter-btn${cat === 'ALL' ? ' ow-filter-active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </div>

              {/* FIVE PROJECT CARDS */}
              <div className="ow-projects-row">

                {/* Card 1 – Alta Wear */}
                <article className="ow-proj-card">
                  <img src="/assets/images/c-s-m.png" className="ow-proj-card-bg" alt="" aria-hidden="true" />
                  <div className="ow-proj-card-inner">
                    <div className="ow-proj-img-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=480&q=80&auto=format&fit=crop"
                        alt="Alta Wear – Brand Identity"
                        className="ow-proj-img"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="ow-proj-info">
                      <div className="ow-proj-name-row">
                        <span className="ow-proj-name">Alta Wear</span>
                        <span className="ow-proj-year">2024</span>
                      </div>
                      <span className="ow-proj-category">Brand Identity</span>
                      <span className="ow-proj-status ow-status-approved">APPROVED ✓</span>
                    </div>
                  </div>
                </article>

                {/* Card 2 – Natura Skincare */}
                <article className="ow-proj-card">
                  <img src="/assets/images/c-s-m.png" className="ow-proj-card-bg" alt="" aria-hidden="true" />
                  <div className="ow-proj-card-inner">
                    <div className="ow-proj-img-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=480&q=80&auto=format&fit=crop"
                        alt="Natura Skincare – Packaging Design"
                        className="ow-proj-img"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="ow-proj-info">
                      <div className="ow-proj-name-row">
                        <span className="ow-proj-name">Natura Skincare</span>
                        <span className="ow-proj-year">2024</span>
                      </div>
                      <span className="ow-proj-category">Packaging Design</span>
                      <span className="ow-proj-status ow-status-delivered">DELIVERED ✓</span>
                    </div>
                  </div>
                </article>

                {/* Card 3 – Nova ERP (paper-clip accent) */}
                <article className="ow-proj-card ow-proj-card--clipped">
                  <svg className="ow-card-clip" viewBox="0 0 18 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3 C3.5 3 3.5 53 9 53 C14.5 53 14.5 10 9 10 C5.5 10 5.5 46 9 46" stroke="#999" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  </svg>
                  <img src="/assets/images/c-s-m.png" className="ow-proj-card-bg" alt="" aria-hidden="true" />
                  <div className="ow-proj-card-inner">
                    <div className="ow-proj-img-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&q=80&auto=format&fit=crop"
                        alt="Nova ERP – ERP Software"
                        className="ow-proj-img"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="ow-proj-info">
                      <div className="ow-proj-name-row">
                        <span className="ow-proj-name">Nova ERP</span>
                        <span className="ow-proj-year">2024</span>
                      </div>
                      <span className="ow-proj-category">ERP Software</span>
                      <span className="ow-proj-status ow-status-delivered">DELIVERED ✓</span>
                    </div>
                  </div>
                </article>

                {/* Card 4 – EazyHRM */}
                <article className="ow-proj-card">
                  <img src="/assets/images/c-s-m.png" className="ow-proj-card-bg" alt="" aria-hidden="true" />
                  <div className="ow-proj-card-inner">
                    <div className="ow-proj-img-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&q=80&auto=format&fit=crop"
                        alt="EazyHRM – HR Management System"
                        className="ow-proj-img"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="ow-proj-info">
                      <div className="ow-proj-name-row">
                        <span className="ow-proj-name">EazyHRM</span>
                        <span className="ow-proj-year">2024</span>
                      </div>
                      <span className="ow-proj-category">HR Management System</span>
                      <span className="ow-proj-status ow-status-approved">APPROVED ✓</span>
                    </div>
                  </div>
                </article>

                {/* Card 5 – FlowAI Agent */}
                <article className="ow-proj-card">
                  <img src="/assets/images/c-s-m.png" className="ow-proj-card-bg" alt="" aria-hidden="true" />
                  <div className="ow-proj-card-inner">
                    <div className="ow-proj-img-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=480&q=80&auto=format&fit=crop"
                        alt="FlowAI Agent – AI Automation"
                        className="ow-proj-img"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="ow-proj-info">
                      <div className="ow-proj-name-row">
                        <span className="ow-proj-name">FlowAI Agent</span>
                        <span className="ow-proj-year">2024</span>
                      </div>
                      <span className="ow-proj-category">AI Automation</span>
                      <span className="ow-proj-status ow-status-delivered">DELIVERED ✓</span>
                    </div>
                  </div>
                </article>

              </div>{/* /ow-projects-row */}

              {/* View More Projects */}
              <div className="ow-view-more-row">
                <button className="ow-view-more-btn" onClick={() => setIsExpandedView(true)}>
                  View More Projects &nbsp;→
                </button>
                <svg className="ow-view-more-underline" viewBox="0 0 200 6" fill="none">
                  <path d="M2 3 Q50 1, 100 3 T198 3" stroke="#1b1814" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

            </div>{/* /ow-archive-content */}
          </div>{/* /ow-archive-paper */}
        </section>

        {/* ============================================================
            PART 3 — PROJECT OF THE WEEK & CTA
            ============================================================ */}
        <section className="ow-part3-section">
          {/* Top Paper Section */}
          <div className="ow-p3-top-paper">
            <div className="ow-p3-top-inner">
              
              {/* LEFT: Project Info */}
              <div className="ow-p3-left-col">
                <span className="ow-p3-label">PROJECT OF THE WEEK</span>
                <h2 className="ow-p3-title">NOVA ERP SYSTEM</h2>
                <span className="ow-p3-subtitle">ERP Software</span>
                
                <p className="ow-p3-quote">
                  "Turning a complicated<br />
                  workflow into a simple,<br />
                  powerful system."
                </p>
                
                <button className="ow-p3-cta-btn">
                  Open Case Study &nbsp;→
                </button>
              </div>

              {/* CENTER: Project Image Frame */}
              <div className="ow-p3-center-col">
                <div className="ow-p3-photo-frame">
                  <div className="ow-p3-tape"></div>
                  <div className="ow-p3-photo-inner">
                    <img src="/assets/images/GR studio.png" alt="Nova ERP Dashboard" className="ow-p3-main-img" />
                  </div>
                </div>
              </div>

              {/* RIGHT: Information Items */}
              <div className="ow-p3-right-col">
                
                <div className="ow-p3-info-item">
                  <div className="ow-p3-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
                      <path d="M12 8v4l2 2" />
                      <path d="M18.36 5.64l1.42-1.42M5.64 5.64L4.22 4.22M18.36 18.36l1.42 1.42M5.64 18.36L4.22 19.78" />
                    </svg>
                  </div>
                  <div className="ow-p3-info-text">
                    <h4>The Challenge</h4>
                    <p>Manual processes, scattered<br />data and no real-time insights.</p>
                  </div>
                </div>

                <div className="ow-p3-info-item">
                  <div className="ow-p3-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 9v-2M12 17v-2M9 12H7M17 12h-2M10 10l-1.5-1.5M15.5 15.5L14 14M14 10l1.5-1.5M8.5 15.5L10 14" />
                    </svg>
                  </div>
                  <div className="ow-p3-info-text">
                    <h4>Our Thinking</h4>
                    <p>Centralized system with smart<br />automation and real-time data.</p>
                  </div>
                </div>

                <div className="ow-p3-info-item">
                  <div className="ow-p3-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <rect x="8" y="10" width="8" height="6" rx="1" />
                      <path d="M12 10V6M10 6h4M12 16v3" />
                    </svg>
                  </div>
                  <div className="ow-p3-info-text">
                    <h4>The Build</h4>
                    <p>ERP with modules for sales,<br />inventory, HR, finance & more.</p>
                  </div>
                </div>

                <div className="ow-p3-info-item">
                  <div className="ow-p3-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="ow-p3-info-text">
                    <h4>The Result</h4>
                    <p>70% faster operations and<br />complete business visibility.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Middle Row - 7 Small Papers */}
          <div className="ow-p3-middle-row">
            {/* Paperclip detail on the row */}
            <svg className="ow-p3-row-clip" viewBox="0 0 20 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 5 C4 5 4 55 10 55 C16 55 16 15 10 15 C6.5 15 6.5 47 10 47" stroke="#777" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>

            {[
              { title: "Brand\nIdentity", icon: <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />, count: "12" },
              { title: "Motion\nGraphics", icon: <><rect x="2" y="7" width="16" height="10" rx="2" /><path d="M18 10l4-2v8l-4-2" /><circle cx="6" cy="12" r="1.5" /><circle cx="14" cy="12" r="1.5" /></>, count: "8" },
              { title: "Website\nDesign", icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18" /><circle cx="6" cy="6" r="0.5" /><circle cx="9" cy="6" r="0.5" /><circle cx="12" cy="6" r="0.5" /></>, count: "24" },
              { title: "3D\nModeling", icon: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" /></>, count: "7" },
              { title: "ERP\nSoftware", icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 16v-4M12 16v-8M17 16V9M3 16h18" /></>, count: "6" },
              { title: "Custom\nSoftware", icon: <><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 6l-4 12" /></>, count: "11" },
              { title: "AI\nAutomation", icon: <><rect x="5" y="8" width="14" height="10" rx="2" /><path d="M12 4v4M9 4h6M7 13v.01M17 13v.01M12 15h.01" /></>, count: "9" }
            ].map((cat, i) => (
              <div className="ow-p3-small-paper" key={i}>
                <img src="/assets/images/d-2-2.png" className="ow-p3-small-paper-bg" alt="" aria-hidden="true" />
                <div className="ow-p3-sp-content">
                  <h3 className="ow-p3-sp-title">{cat.title}</h3>
                  <div className="ow-p3-sp-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {cat.icon}
                    </svg>
                  </div>
                  <span className="ow-p3-sp-count">{cat.count} Projects &nbsp;→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Black CTA */}
          <div className="ow-p3-bottom-cta">
            <div className="ow-p3-cta-content">
              
              <div className="ow-p3-cta-left">
                <h2 className="ow-p3-cta-title">Your project could be next.</h2>
                <p className="ow-p3-cta-desc">
                  We've shown you what we've built.<br />
                  Now tell us what's keeping you up at night.
                </p>
              </div>

              <div className="ow-p3-cta-center">
                <button className="ow-p3-drop-note-btn">
                  <div className="ow-p3-btn-tape"></div>
                  Drop Your Rough Note &nbsp;→
                </button>
              </div>

              <div className="ow-p3-cta-right">
                <button className="ow-p3-start-conv-btn">
                  Start a Conversation
                </button>
              </div>

            </div>
          </div>
        </section>
          </>
        ) : (
          <ExpandedProjectArchive onBack={() => setIsExpandedView(false)} />
        )}
        
        {/* FOOTER PAPER - consistent notebook layout */}
        <div id="rough-note-footer-root" className="notebook-footer-placeholder">
          <FooterPaper />
        </div>
      </SiteLayout>
      <RoughNoteDrawingFeature />
    </>
  );
}

// ============================================================================
// EXPANDED PROJECT ARCHIVE (PART 4 VIEW)
// ============================================================================
function ExpandedProjectArchive({ onBack }: { onBack: () => void }) {
  const projects = [
    { title: "Alta Wear", category: "Brand Identity", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=480&q=80&auto=format&fit=crop" },
    { title: "Natura Skincare", category: "Packaging Design", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=480&q=80&auto=format&fit=crop" },
    { title: "Nova ERP System", category: "ERP Software", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&q=80&auto=format&fit=crop" },
    { title: "Urban Arc House", category: "Website Design", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=480&q=80&auto=format&fit=crop" },
    { title: "FlowAI Agent", category: "AI Automation", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=480&q=80&auto=format&fit=crop" },
    { title: "Future of Energy", category: "Motion Graphics", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=480&q=80&auto=format&fit=crop" },
    { title: "Volt X Concept", category: "3D Modeling", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1531297121281-2c1b2c4c810d?w=480&q=80&auto=format&fit=crop" },
    { title: "EazyHRM", category: "HR Management System", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=480&q=80&auto=format&fit=crop" },
    { title: "TasteBite", category: "Restaurant Website", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=480&q=80&auto=format&fit=crop" },
    { title: "SalesTrack Pro", category: "CRM Software", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&q=80&auto=format&fit=crop" },
    { title: "Nectar Tea", category: "Packaging Design", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1596328315183-7d8b5849887e?w=480&q=80&auto=format&fit=crop" },
    { title: "AI Support Bot", category: "AI Chatbot Development", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=480&q=80&auto=format&fit=crop" }
  ];

  return (
    <section className="ow-expanded-archive-section">
      <div className="ow-ea-paper">
        {/* Paper texture background */}
        <img src="/assets/images/bottom-left.png" className="ow-ea-bg" alt="" aria-hidden="true" />
        
        <div className="ow-ea-content">
          {/* Top Filter Bar */}
          <div className="ow-ea-top-bar">
            <div className="ow-ea-filters">
              <button className="ow-ea-filter-btn active">ALL WORK</button>
              <button className="ow-ea-filter-btn">BRANDING</button>
              <button className="ow-ea-filter-btn">WEBSITE</button>
              <button className="ow-ea-filter-btn">SOFTWARE</button>
              <button className="ow-ea-filter-btn">ERP</button>
              <button className="ow-ea-filter-btn">AI AUTOMATION</button>
              <button className="ow-ea-filter-btn">3D MODELING</button>
              <button className="ow-ea-filter-btn">MOTION GRAPHICS</button>
            </div>
            
            <div className="ow-ea-sort">
              <span className="ow-ea-sort-label">Sort by:</span>
              <div className="ow-ea-dropdown">
                Latest
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          {/* 12 Project Grid */}
          <div className="ow-ea-grid">
            {projects.map((proj, idx) => (
              <article className="ow-ea-card" key={idx}>
                <img src="/assets/images/c-s-m.png" className="ow-ea-card-bg" alt="" aria-hidden="true" />
                <div className="ow-ea-card-inner">
                  <div className="ow-ea-img-wrap">
                    <img
                      src={proj.img}
                      alt={proj.title}
                      className="ow-ea-img"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="ow-ea-info">
                    <div className="ow-ea-name-row">
                      <span className="ow-ea-name">{proj.title}</span>
                      <span className="ow-ea-year">{proj.year}</span>
                    </div>
                    <span className="ow-ea-category">{proj.category}</span>
                    
                    <div className="ow-ea-bottom-row">
                      <svg className="ow-ea-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className={`ow-ea-status ${proj.statusClass}`}>{proj.status} {proj.status === 'APPROVED' || proj.status === 'DELIVERED' ? '✓' : ''}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Pagination & CTAs */}
          <div className="ow-ea-bottom-area">
            
            {/* Left Note */}
            <div className="ow-ea-bottom-left">
              <span className="ow-ea-bottom-note">More projects<br />coming soon!</span>
              <svg className="ow-ea-bottom-arrow" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 10 Q 20 5, 35 10 M30 5 L35 10 L30 15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Pagination */}
            <div className="ow-ea-pagination">
              <button className="ow-ea-page-btn" aria-label="Previous page">←</button>
              <button className="ow-ea-page-btn active">1</button>
              <button className="ow-ea-page-btn">2</button>
              <button className="ow-ea-page-btn">3</button>
              <button className="ow-ea-page-btn">4</button>
              <span className="ow-ea-page-ellipsis">...</span>
              <button className="ow-ea-page-btn">8</button>
              <button className="ow-ea-page-btn" aria-label="Next page">→</button>
            </div>

            {/* Right Torn Note */}
            <div className="ow-ea-bottom-right">
              <div className="ow-ea-torn-note">
                <div className="ow-ea-tape"></div>
                <div className="ow-ea-torn-content" onClick={onBack} style={{ cursor: 'pointer' }}>
                  Have a project in mind?<br />
                  <span className="ow-ea-link">Let's talk. &nbsp;→</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
