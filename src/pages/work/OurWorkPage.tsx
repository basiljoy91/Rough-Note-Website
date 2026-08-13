import './our-work.global.css';
import '../../features/notebook-footer/notebook-footer-placeholder.global.css';
import { useRef, useState, useEffect } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { FooterPaper } from '../../features/notebook-footer/components/FooterPaper';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';
import { useScrollReveal } from '../../shared/hooks/useScrollReveal';
import { SketchFilters } from '../../shared/ui/SketchFilters';
import coffeeImg from '../../assets/illustrations/coffee-rn.svg';

export function OurWorkPage() {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);

  const [scale, setScale] = useState(1);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [part2Filter, setPart2Filter] = useState('ALL');

  const part2Projects = [
    { title: "Alta Wear", category: "Brand Identity", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=480&q=80&auto=format&fit=crop", isDefaultPart2: true },
    { title: "Natura Skincare", category: "Packaging Design", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=480&q=80&auto=format&fit=crop", isDefaultPart2: true },
    { title: "Nova ERP", category: "ERP Software", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&q=80&auto=format&fit=crop", clipped: true, isDefaultPart2: true },
    { title: "EazyHRM", category: "HR Management System", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=480&q=80&auto=format&fit=crop", isDefaultPart2: true },
    { title: "FlowAI Agent", category: "AI Automation", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=480&q=80&auto=format&fit=crop", isDefaultPart2: true },
    
    /* Additional projects included to satisfy WEB, 3D, and MOTION filter categories using existing data */
    { title: "Urban Arc House", category: "Website Design", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=480&q=80&auto=format&fit=crop" },
    { title: "TasteBite", category: "Restaurant Website", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=480&q=80&auto=format&fit=crop" },
    { title: "Volt X Concept", category: "3D Modeling", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&q=80&auto=format&fit=crop" },
    { title: "Future of Energy", category: "Motion Graphics", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=480&q=80&auto=format&fit=crop" }
  ];

  const filteredPart2Projects = part2Projects.filter(p => {
    if (part2Filter === 'ALL') return p.isDefaultPart2;
    const cat = p.category.toUpperCase();
    if (part2Filter === 'BRAND') return cat.includes('BRAND') || cat.includes('PACKAGING');
    if (part2Filter === 'WEB') return cat.includes('WEB');
    if (part2Filter === 'SOFTWARE') return cat.includes('SOFTWARE') || cat.includes('SYSTEM') || cat.includes('MANAGEMENT');
    if (part2Filter === 'ERP') return cat.includes('ERP');
    if (part2Filter === 'AI') return cat.includes('AI ');
    if (part2Filter === '3D') return cat.includes('3D');
    if (part2Filter === 'MOTION') return cat.includes('MOTION');
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setScale(1);
        return;
      }
      
      const availableWidth = window.innerWidth - 270 - 40; // 270px sidebar offset, 40px horizontal padding (20px each side)
      const availableHeight = window.innerHeight - 40;    // 40px vertical margins (20px each side)
      const scaleX = availableWidth / 2050; // Active content width boundary (compressed for larger scale)
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
              motion &mdash; here's a look at what we've turned
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
                    <div className="ow-checklist-item">{'\u2713'} Delivered</div>
                    <div className="ow-checklist-item">{'\u2713'} Tested</div>
                    <div className="ow-checklist-item">{'\u2713'} Approved</div>
                    <div className="ow-checklist-item">{'\u2713'} Out in the world</div>
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
              <span className="ow-archive-arrow">&darr;</span> Open the archive
            </div>
          </div>

          {/* RIGHT COLUMN - MOOD BOARD */}
          <div className="ow-moodboard">
            {/* ==========================================
               DECORATIVE ELEMENTS (PINS, CLIPS, TAPE)
               ========================================== */}
            
            {/* Website Mockup Pin */}
            <svg className="ow-pin" style={{ top: '1.5%', left: '32.5%', width: '64px', height: '64px' }} viewBox="0 0 20 20">
              <circle cx="10" cy="8" r="6" fill="#111" />
              <circle cx="9" cy="7" r="2" fill="#fff" opacity="0.4" />
              <path d="M10 14 L10 19" stroke="#555" strokeWidth="1.5" />
            </svg>

            {/* Brand Strategy Sticky Pin */}
            <svg className="ow-pin" style={{ top: '2.5%', left: '57%', width: '56px', height: '56px' }} viewBox="0 0 20 20">
              <circle cx="10" cy="8" r="5" fill="#a43a3a" />
              <circle cx="9" cy="7" r="1.5" fill="#fff" opacity="0.4" />
              <path d="M10 13 L10 17" stroke="#444" strokeWidth="1.2" />
            </svg>

            {/* AI Workflow Top Tape */}
            <div className="ow-tape" style={{ top: '8%', left: '76%', width: '160px', height: '48px', transform: 'rotate(-4deg)' }} />
            
            {/* AI Workflow Side Tape */}
            <div className="ow-tape" style={{ top: '44%', left: '83%', width: '140px', height: '40px', transform: 'rotate(25deg)' }} />

            {/* AI Workflow Binder Clip */}
            <svg className="ow-paperclip" style={{ top: '7.5%', left: '71%', width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="none">
              <rect x="7" y="10" width="10" height="8" rx="1" fill="#444" />
              <path d="M9 10 V6 C9 4.5 10.5 3.5 12 3.5 C13.5 3.5 15 4.5 15 6 V10" stroke="#444" strokeWidth="1.5" fill="none" />
              <circle cx="12" cy="14" r="2" fill="#bbb" />
            </svg>

            {/* Website Wireframe Pin */}
            <svg className="ow-pin" style={{ top: 'calc(46% + 50px)', left: '15%', width: '60px', height: '60px' }} viewBox="0 0 20 20">
              <circle cx="10" cy="8" r="5.5" fill="#bfa37a" />
              <circle cx="9" cy="7" r="1.8" fill="#fff" opacity="0.4" />
              <path d="M10 13.5 L10 18" stroke="#666" strokeWidth="1.5" />
            </svg>

            {/* Coffee Cup - Top Right */}
            <div className="ow-coffee-cup">
              <img src={coffeeImg} alt="Coffee Cup" />
            </div>

            {/* Pencil - Bottom Right */}
            <div className="ow-pencil-decoration">
              <img src="/assets/images/pencil-left.png" alt="Pencil" />
            </div>


            {/* ==========================================
               MOOD BOARD ITEMS
               ========================================== */}

            {/* 1. TOP-CENTER WEBSITE MOCKUP */}
            <div className="ow-paper ow-mockup-paper" style={{ padding: '28px' }}>
                <img 
                  src="/assets/images/crafting-brands-mockup.png" 
                  alt="Crafting Brands Website Mockup" 
                  style={{ 
                    display: 'block',
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 1000 1000\' preserveAspectRatio=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'imgMask\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.08\' numOctaves=\'5\' result=\'noise\'/%3E%3CfeDisplacementMap in=\'SourceGraphic\' in2=\'noise\' scale=\'15\' xChannelSelector=\'R\' yChannelSelector=\'G\'/%3E%3C/filter%3E%3Cpath d=\'M15,15 L985,15 L985,985 L15,985 Z\' filter=\'url(%23imgMask)\' fill=\'black\'/%3E%3C/svg%3E")',
                    maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 1000 1000\' preserveAspectRatio=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'imgMask\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.08\' numOctaves=\'5\' result=\'noise\'/%3E%3CfeDisplacementMap in=\'SourceGraphic\' in2=\'noise\' scale=\'15\' xChannelSelector=\'R\' yChannelSelector=\'G\'/%3E%3C/filter%3E%3Cpath d=\'M15,15 L985,15 L985,985 L15,985 Z\' filter=\'url(%23imgMask)\' fill=\'black\'/%3E%3C/svg%3E")'
                  }} 
                />
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
                <div className="ow-workflow-arrow">&darr;</div>
                <div className="ow-workflow-step">Data Input</div>
                <div className="ow-workflow-arrow">&darr;</div>
                <div className="ow-workflow-step">AI Process</div>
                <div className="ow-workflow-arrow">&darr;</div>
                <div className="ow-workflow-step">Output</div>
                <div className="ow-workflow-arrow">&darr;</div>
                <div className="ow-workflow-step">Automation</div>
              </div>
              <div className="ow-workflow-footer">
                "Reduce manual work by 80%"
              </div>
            </div>

            {/* 6. WEBSITE WIREFRAME */}
            <div className="ow-paper ow-wireframe-paper">
              <h3 className="ow-wireframe-title">Website Wireframe</h3>
              <div className="ow-wireframe-grid" style={{ padding: 0, marginTop: '15px' }}>
                <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {/* Hand-drawn Browser Window */}
                  <path d="M5 8 Q 100 4, 195 8 L 196 230 Q 100 234, 4 232 Z" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(255,255,255,0.4)" />
                  <path d="M5 22 Q 100 18, 195 22" stroke="#333" strokeWidth="1.5" />
                  <circle cx="15" cy="14" r="2.5" fill="#333" />
                  <circle cx="25" cy="14" r="2.5" fill="#333" />
                  <circle cx="35" cy="14" r="2.5" fill="#333" />
                  
                  {/* Header */}
                  <path d="M15 32 Q 100 30, 185 34 L 183 50 Q 100 48, 17 50 Z" stroke="#444" strokeWidth="1.2" />
                  <text x="75" y="45" fontSize="12" fill="#333" stroke="none" fontFamily="Caveat, cursive">HEADER</text>
                  <path d="M140 40 Q 150 38, 160 42" stroke="#666" strokeWidth="1" />
                  <path d="M165 40 Q 170 38, 175 42" stroke="#666" strokeWidth="1" />
                  
                  {/* Hero Section */}
                  <path d="M15 60 Q 100 58, 185 62 L 183 130 Q 100 134, 17 128 Z" stroke="#444" strokeWidth="1.2" />
                  <path d="M15 60 Q 100 95, 183 130" stroke="#999" strokeWidth="1" />
                  <path d="M185 62 Q 100 95, 17 128" stroke="#999" strokeWidth="1" />
                  <rect x="65" y="85" width="70" height="20" fill="rgba(255,255,255,0.8)" />
                  <text x="68" y="99" fontSize="12" fill="#333" stroke="none" fontFamily="Caveat, cursive">HERO SECTION</text>

                  {/* Split Sections */}
                  <path d="M15 140 Q 55 138, 95 142 L 93 200 Q 55 198, 17 200 Z" stroke="#444" strokeWidth="1.2" />
                  <text x="35" y="160" fontSize="11" fill="#333" stroke="none" fontFamily="Caveat, cursive">ABOUT US</text>
                  <path d="M25 170 Q 55 168, 85 172" stroke="#777" strokeWidth="1" />
                  <path d="M22 178 Q 55 176, 88 180" stroke="#777" strokeWidth="1" />
                  <path d="M28 186 Q 45 184, 65 188" stroke="#777" strokeWidth="1" />
                  
                  <path d="M105 140 Q 145 138, 185 142 L 183 200 Q 145 198, 107 200 Z" stroke="#444" strokeWidth="1.2" />
                  <text x="115" y="160" fontSize="11" fill="#333" stroke="none" fontFamily="Caveat, cursive">OUR SERVICES</text>
                  <path d="M115 170 Q 135 168, 155 172" stroke="#777" strokeWidth="1" />
                  <path d="M112 178 Q 145 176, 178 180" stroke="#777" strokeWidth="1" />
                  <path d="M118 186 Q 135 184, 155 188" stroke="#777" strokeWidth="1" />
                </svg>
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
                <span className="ow-uj-arrow">&rarr;</span>
                
                {/* 2. Explore */}
                <div className="ow-uj-step">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16.2 7.8 L13.8 13.8 L7.8 16.2 L10.2 10.2 Z" />
                  </svg>
                  <span className="ow-uj-label">Explore</span>
                </div>
                <span className="ow-uj-arrow">&rarr;</span>
                
                {/* 3. Choose */}
                <div className="ow-uj-step">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12 v7 a2 2 0 0 1-2 2 H5 a2 2 0 0 1-2-2 V5 a2 2 0 0 1 2-2 h11" />
                  </svg>
                  <span className="ow-uj-label">Choose</span>
                </div>
                <span className="ow-uj-arrow">&rarr;</span>
                
                {/* 4. Order */}
                <div className="ow-uj-step">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span className="ow-uj-label">Order</span>
                </div>
                <span className="ow-uj-arrow">&rarr;</span>
                
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
                    <svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 2 L58 3 L57 48 L3 47 Z" fill="rgba(255,255,255,0.5)" stroke="#444" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M15 15 L25 5 L45 5 L55 15 L55 35 L45 45 L25 45 L15 35 Z" stroke="#ddd" strokeWidth="1" fill="none" />
                      <circle cx="25" cy="22" r="8" stroke="#333" strokeWidth="1.5" fill="none" />
                      <line x1="30" y1="28" x2="38" y2="36" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M25 10 L25 6 M37 22 L41 22 M13 22 L9 22" stroke="#666" strokeWidth="1" />
                    </svg>
                  </div>
                  <div className="ow-sb-label">Scene 1<br/>Idea</div>
                </div>
                
                {/* Scene 2 */}
                <div className="ow-sb-panel">
                  <div className="ow-sb-visual">
                    <svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3 L58 2 L59 47 L4 48 Z" fill="rgba(255,255,255,0.5)" stroke="#444" strokeWidth="1.2" strokeLinejoin="round" />
                      <circle cx="30" cy="25" r="12" stroke="#333" strokeWidth="1.5" fill="none" />
                      <path d="M30 18 L35 30 L25 30 Z" stroke="#333" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                      <circle cx="30" cy="15" r="3" fill="#333" />
                      <path d="M10 25 Q30 5 50 25" stroke="#999" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                    </svg>
                  </div>
                  <div className="ow-sb-label">Scene 2<br/>Build</div>
                </div>
                
                {/* Scene 3 */}
                <div className="ow-sb-panel">
                  <div className="ow-sb-visual">
                    <svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 2 L57 4 L58 48 L2 49 Z" fill="rgba(255,255,255,0.5)" stroke="#444" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M10 40 L30 10 L50 40 Z" stroke="#333" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                      <circle cx="30" cy="28" r="8" stroke="#333" strokeWidth="1.2" fill="none" />
                      <path d="M27 24 L35 28 L27 32 Z" fill="#333" />
                  <path d="M30 10 L30 5 M20 18 L15 15 M40 18 L45 15" stroke="#666" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="ow-sb-label">Scene 3<br/>Launch</div>
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
                  {/* Realistic 3D Packaging Prototype */}
                  <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                    <img 
                      src="/assets/images/JSB Packaging.png" 
                      alt="3D Packaging Concept" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        mixBlendMode: 'multiply',
                        filter: 'drop-shadow(0 15px 12px rgba(60,40,20,0.15)) drop-shadow(0 4px 4px rgba(0,0,0,0.08))',
                        transform: 'scale(1.1) translateY(-5px)'
                      }} 
                    />
                  </div>
                </div>
            </div>
          </div>
          </div>
        </main>
        
        {!isExpandedView ? (
          <>
        {/* ============================================================
            PART 2 &mdash; THE PROJECT ARCHIVE
            ============================================================ */}
        <section className="ow-archive-section">
          <div className="ow-archive-paper">
            <img src="/assets/images/bottom-left.png" className="ow-archive-bg" alt="" aria-hidden="true" />

            <div className="ow-archive-content">

              {/* TOP ROW: title LEFT, filters RIGHT - same horizontal band */}
              <div className="ow-archive-top-row">
                <div className="ow-archive-heading-group">
                  <h2 className="ow-archive-title">The Project Archive</h2>
                  <p className="ow-archive-subtitle">A few things we've been working on.</p>
                </div>

                <nav className="ow-archive-filters" aria-label="Project categories">
                  {['ALL', 'BRAND', 'WEB', 'SOFTWARE', 'AI', '3D', 'MOTION'].map((cat) => (
                    <button
                      key={cat}
                      className={`ow-filter-btn${part2Filter === cat ? ' ow-filter-active' : ''}`}
                      onClick={() => setPart2Filter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </div>

              {/* PROJECT CARDS */}
              <div className="ow-projects-row">
                {filteredPart2Projects.map((proj, idx) => (
                  <article className={`ow-proj-card ${proj.clipped ? 'ow-proj-card--clipped' : ''}`} key={idx}>
                    {proj.clipped && (
                      <svg className="ow-card-clip" viewBox="0 0 18 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3 C3.5 3 3.5 53 9 53 C14.5 53 14.5 10 9 10 C5.5 10 5.5 46 9 46" stroke="#999" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                      </svg>
                    )}
                    <img src="/assets/images/c-s-m.png" className="ow-proj-card-bg" alt="" aria-hidden="true" />
                    <div className="ow-proj-card-inner">
                      <div className="ow-proj-img-wrap">
                        <img
                          src={proj.img}
                          alt={`${proj.title} &mdash; ${proj.category}`}
                          className="ow-proj-img"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="ow-proj-info">
                        <div className="ow-proj-name-row">
                          <span className="ow-proj-name">{proj.title}</span>
                          <span className="ow-proj-year">{proj.year}</span>
                        </div>
                        <span className="ow-proj-category">{proj.category}</span>
                        <span className={`ow-proj-status ${proj.statusClass}`}>{proj.status} {proj.status === 'APPROVED' || proj.status === 'DELIVERED' ? '\u2713' : ''}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>{/* /ow-projects-row */}

              {/* View More Projects */}
              <div className="ow-view-more-row">
                  <button className="ow-view-more-btn" onClick={() => setIsExpandedView(true)}>
                    View More Projects &nbsp;&rarr;
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
                  <span className="ow-p3-label" style={{ position: 'relative', display: 'inline-block' }}>
                    PROJECT OF THE WEEK
                    <svg style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%', height: '6px' }} viewBox="0 0 100 6" fill="none" preserveAspectRatio="none">
                      <path d="M2 3 Q25 1, 50 3 T98 3" stroke="#1b1814" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <h2 className="ow-p3-title">NOVA ERP SYSTEM</h2>
                  <span className="ow-p3-subtitle" style={{ position: 'relative', display: 'inline-block' }}>
                    ERP Software
                    <svg style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%', height: '5px' }} viewBox="0 0 100 5" fill="none" preserveAspectRatio="none">
                      <path d="M2 2 Q25 1, 50 2 T98 3" stroke="#1b1814" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                
                <p className="ow-p3-quote">
                  "Turning a complicated<br />
                  workflow into a simple,<br />
                  powerful system."
                </p>
                                <button className="ow-p3-cta-btn">
                    Open Case Study &nbsp;&rarr;
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
                  <span className="ow-p3-sp-count">{cat.count} Projects &nbsp;&rarr;</span>
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
                <button className="ow-p3-drop-note-btn" onClick={() => window.location.href = '/html/contact.html'}>
                  <div className="ow-p3-btn-tape-left"></div><div className="ow-p3-btn-tape-right"></div>
                  Drop Your Rough Note &nbsp;&rarr;
                  </button>
              </div>

              <div className="ow-p3-cta-right">
                <button className="ow-p3-start-conv-btn" onClick={() => window.location.href = '/html/connect.html'}>
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
  const [activeFilter, setActiveFilter] = useState('ALL WORK');
  const [sortBy, setSortBy] = useState('Latest');
  
  const projects = [
    { title: "Alta Wear", category: "Brand Identity", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=480&q=80&auto=format&fit=crop" },
    { title: "Natura Skincare", category: "Packaging Design", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=480&q=80&auto=format&fit=crop" },
    { title: "Nova ERP System", category: "ERP Software", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&q=80&auto=format&fit=crop" },
    { title: "Urban Arc House", category: "Website Design", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=480&q=80&auto=format&fit=crop" },
    { title: "FlowAI Agent", category: "AI Automation", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=480&q=80&auto=format&fit=crop" },
    { title: "Future of Energy", category: "Motion Graphics", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=480&q=80&auto=format&fit=crop" },
    { title: "Volt X Concept", category: "3D Modeling", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&q=80&auto=format&fit=crop" },
    { title: "EazyHRM", category: "HR Management System", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=480&q=80&auto=format&fit=crop" },
    { title: "TasteBite", category: "Restaurant Website", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=480&q=80&auto=format&fit=crop" },
    { title: "SalesTrack Pro", category: "CRM Software", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&q=80&auto=format&fit=crop" },
    { title: "Nectar Tea", category: "Packaging Design", year: "2024", status: "APPROVED", statusClass: "ow-status-approved", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=480&q=80&auto=format&fit=crop" },
    { title: "AI Support Bot", category: "AI Chatbot Development", year: "2024", status: "DELIVERED", statusClass: "ow-status-delivered", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&q=80&auto=format&fit=crop" }
  ];

  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'ALL WORK') return true;
    const cat = p.category.toUpperCase();
    if (activeFilter === 'BRANDING') return cat.includes('BRAND') || cat.includes('PACKAGING');
    if (activeFilter === 'WEBSITE') return cat.includes('WEBSITE');
    if (activeFilter === 'SOFTWARE') return cat.includes('SOFTWARE') || cat.includes('SYSTEM') || cat.includes('MANAGEMENT');
    if (activeFilter === 'ERP') return cat.includes('ERP');
    if (activeFilter === 'AI AUTOMATION') return cat.includes('AI');
    if (activeFilter === '3D MODELING') return cat.includes('3D');
    if (activeFilter === 'MOTION GRAPHICS') return cat.includes('MOTION');
    return false;
  }).sort((a, b) => {
    if (sortBy === 'Latest') {
      return b.year.localeCompare(a.year); // Sort descending by year for "Latest"
    }
    return 0;
  });

  const filters = ['ALL WORK', 'BRANDING', 'WEBSITE', 'SOFTWARE', 'ERP', 'AI AUTOMATION', '3D MODELING', 'MOTION GRAPHICS'];

  return (
    <section className="ow-expanded-archive-section">
      <div className="ow-ea-paper">
        {/* Paper texture background */}
        <img src="/assets/images/bottom-left.png" className="ow-ea-bg" alt="" aria-hidden="true" />
        
        <div className="ow-ea-content">
          {/* Top Filter Bar */}
          <div className="ow-ea-top-bar">
            <div className="ow-ea-filters">
              {filters.map(f => (
                <button 
                  key={f}
                  className={`ow-ea-filter-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <div className="ow-ea-sort">
              <span className="ow-ea-sort-label">Sort by:</span>
              <div 
                className="ow-ea-dropdown" 
                onClick={() => setSortBy(sortBy === 'Latest' ? 'Oldest' : 'Latest')}
              >
                {sortBy}
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          {/* 12 Project Grid */}
          <div className="ow-ea-grid">
            {filteredProjects.map((proj, idx) => (
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
                      <span className={`ow-ea-status ${proj.statusClass}`}>{proj.status} {proj.status === 'APPROVED' || proj.status === 'DELIVERED' ? '\u2713' : ''}</span>
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
              <button className="ow-ea-page-btn" aria-label="Previous page">← </button>
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
                    <span className="ow-ea-link">Let's talk. &nbsp;&rarr;</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
