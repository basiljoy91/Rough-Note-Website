import type { LucideIcon } from 'lucide-react';
import {
  Box,
  BrainCircuit,
  Brush,
  Camera,
  ChartNoAxesCombined,
  CheckSquare,
  CircleGauge,
  CodeXml,
  Component,
  FileCheck,
  FileSearch,
  Film,
  GitBranch,
  Headphones,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Monitor,
  Network,
  PackageCheck,
  Palette,
  PanelsTopLeft,
  PenTool,
  PencilRuler,
  Play,
  Rocket,
  Search,
  Settings,
  SlidersHorizontal,
  UploadCloud,
  Users,
  WandSparkles,
  Workflow,
} from 'lucide-react';

export interface JourneyStep {
  num: string;
  icon: LucideIcon;
  title: string;
  bullets: string[];
}

export interface JourneyData {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  stamp: string;
  topNote: string;
  sideNote: string;
  rightChecklist: string[];
  steps: JourneyStep[];
  stepLayout?: 'sheet' | 'cards';
  bottomKind?: 'cta' | 'board';
  bottomTitle: string;
  bottomItems: string[];
  bottomNote: string;
  bottomVisual: string;
  bottomDiagram: string;
  diagramIcon: LucideIcon;
}

export const brandJourneyData: JourneyData = {
  id: 'brand',
  title: 'Brand Identity',
  subtitle: 'We craft brands that tell your story, build trust, and leave a lasting impression.',
  accent: '#e87519',
  stamp: 'BRAND APPROVED',
  topNote: "We don’t follow a template. We follow your goals.",
  sideNote: 'You focus on your business. We handle the creative journey.',
  rightChecklist: ['Strategy first', 'Execution next', 'Impact always'],
  stepLayout: 'sheet',
  bottomKind: 'cta',
  bottomTitle: 'Every strong brand starts with',
  bottomItems: ['A clear story', 'A strong identity'],
  bottomNote: 'Your brand is your promise.',
  bottomVisual: '/assets/images/workspace-board/brand-identity.webp',
  bottomDiagram: 'Ready to build your brand identity?',
  diagramIcon: PenTool,
  steps: [
    { num: '01', icon: Users, title: 'Discovery', bullets: ['Understand your business', 'Goals & vision', 'Target audience'] },
    { num: '02', icon: Search, title: 'Research', bullets: ['Market study', 'Competitor analysis', 'Brand insights'] },
    { num: '03', icon: PencilRuler, title: 'Conceptualize', bullets: ['Creative direction', 'Mood boards', 'Logo concepts'] },
    { num: '04', icon: PenTool, title: 'Design', bullets: ['Logo refinement', 'Color palette', 'Typography'] },
    { num: '05', icon: Palette, title: 'Brand System', bullets: ['Brand guidelines', 'Identity elements', 'Usage rules'] },
    { num: '06', icon: PanelsTopLeft, title: 'Applications', bullets: ['Business cards', 'Stationery', 'Social media kit'] },
    { num: '07', icon: PackageCheck, title: 'Delivery', bullets: ['Final files', 'Source files', 'Brand book'] },
  ],
};

export const motionJourneyData: JourneyData = {
  id: 'motion',
  title: 'Motion Graphics',
  subtitle: 'From idea to animation — crafted with creativity, precision and emotion.',
  accent: '#e87519',
  stamp: 'STORY IN MOTION',
  topNote: 'Great stories aren’t made by accident. Every frame has a purpose.',
  sideNote: 'We don’t just create videos, we tell stories that move people.',
  rightChecklist: ['Story first', 'Frame by frame', 'Move people'],
  bottomKind: 'board',
  bottomTitle: 'Things we always keep in mind',
  bottomItems: ['Clear message', 'Emotional connection', 'Visual impact', 'Audience engagement'],
  bottomNote: 'Your story. Our creativity. Unforgettable impact.',
  bottomVisual: '/assets/images/video production.png',
  bottomDiagram: 'Lights, camera, emotion!',
  diagramIcon: Film,
  steps: [
    { num: '01', icon: Lightbulb, title: 'Creative Brief', bullets: ['Understand the goal', 'Target audience', 'Message & tone', 'Reference study'] },
    { num: '02', icon: FileSearch, title: 'Script & Concept', bullets: ['Story writing', 'Concept direction', 'Scene breakdown', 'Voice-over plan'] },
    { num: '03', icon: PanelsTopLeft, title: 'Storyboard', bullets: ['Visual storytelling', 'Scene planning', 'Camera angles', 'Client review'] },
    { num: '04', icon: Brush, title: 'Illustration & Design', bullets: ['Custom illustration', 'Character design', 'Asset creation', 'Visual style'] },
    { num: '05', icon: Play, title: 'Animation', bullets: ['2D/3D animation', 'Motion design', 'Transitions', 'Keyframe setup'] },
    { num: '06', icon: Headphones, title: 'Sound Design', bullets: ['Background music', 'Voice-over', 'Sound effects', 'Audio mixing'] },
    { num: '07', icon: Monitor, title: 'Final Render', bullets: ['High quality render', 'Version review', 'Revisions', 'Final export'] },
    { num: '08', icon: UploadCloud, title: 'Delivery', bullets: ['Final video files', 'Multiple formats', 'Social versions', 'Source files'] },
  ],
};

export const webDesignData: JourneyData = {
  id: 'web',
  title: 'Website Design',
  subtitle: 'We design user-focused websites that look beautiful, load fast, and convert visitors into customers.',
  accent: '#2c789a',
  stamp: 'USER APPROVED',
  topNote: 'Great websites aren’t built by chance. They’re planned with purpose.',
  sideNote: 'Focus on user experience, clarity, and conversions.',
  rightChecklist: ['Plan clearly', 'Design with intent', 'Convert visitors'],
  bottomKind: 'board',
  bottomTitle: 'What you’ll get',
  bottomItems: ['Modern responsive website', 'SEO optimized', 'Fast loading speed', 'CMS / admin panel', 'Security & performance', 'Ongoing support'],
  bottomNote: 'Great websites don’t happen by accident. They’re designed with intent.',
  bottomVisual: '/assets/images/workspace-board/website-redesign.webp',
  bottomDiagram: 'Clear, useful and conversion-ready.',
  diagramIcon: PanelsTopLeft,
  steps: [
    { num: '01', icon: Users, title: 'Discovery', bullets: ['Business goals', 'Target audience', 'Competitor review', 'Success metrics'] },
    { num: '02', icon: Network, title: 'Information Architecture', bullets: ['Sitemap creation', 'Page structure', 'Content planning', 'User-flow mapping'] },
    { num: '03', icon: PanelsTopLeft, title: 'Wireframing', bullets: ['Low-fidelity layouts', 'Page wireframes', 'Content placement', 'UX flow validation'] },
    { num: '04', icon: Brush, title: 'UI Design', bullets: ['Visual design', 'Color & typography', 'UI components', 'Responsive layouts'] },
    { num: '05', icon: Component, title: 'Prototype', bullets: ['Interactive prototype', 'User testing', 'Feedback collection', 'Design refinement'] },
    { num: '06', icon: CodeXml, title: 'Development', bullets: ['Clean coding', 'CMS integration', 'Responsive build', 'Speed optimization'] },
    { num: '07', icon: CheckSquare, title: 'Testing & QA', bullets: ['Functionality test', 'Cross-browser test', 'Mobile optimization', 'Bug fixing'] },
    { num: '08', icon: Rocket, title: 'Launch', bullets: ['Deployment', 'SEO setup', 'Analytics setup', 'Performance check'] },
  ],
};

export const threeDModelingData: JourneyData = {
  id: '3d',
  title: '3D Modeling',
  subtitle: 'From concept to photorealistic renders, we create 3D models that bring your ideas to life.',
  accent: '#d08c25',
  stamp: 'RENDER APPROVED',
  topNote: 'We don’t just create models, we create experiences.',
  sideNote: 'Precision. Creativity. Realism. That’s our promise.',
  rightChecklist: ['Model precisely', 'Light naturally', 'Render beautifully'],
  bottomKind: 'board',
  bottomTitle: 'What you’ll get',
  bottomItems: ['High quality 3D models', 'Photorealistic renders', 'Multiple angles & variations', 'Ready for marketing & production', 'Fast revisions'],
  bottomNote: 'Great products deserve great visuals.',
  bottomVisual: '/assets/images/workspace-board/product-visualization.webp',
  bottomDiagram: 'Clean geometry. Realistic materials. Perfect lighting.',
  diagramIcon: Box,
  steps: [
    { num: '01', icon: FileSearch, title: 'Concept & Brief', bullets: ['Understand goals', 'Reference collection', 'Concept sketches', 'Style exploration'] },
    { num: '02', icon: Box, title: '3D Modeling', bullets: ['High-poly modeling', 'Accurate topology', 'Proportions & scale', 'Scene blocking'] },
    { num: '03', icon: Layers, title: 'UV Mapping', bullets: ['UV unwrapping', 'Texel optimization', 'Seam management', 'UV layout'] },
    { num: '04', icon: SlidersHorizontal, title: 'Texturing', bullets: ['PBR materials', 'Color & roughness', 'Normal maps', 'Texture baking'] },
    { num: '05', icon: Lightbulb, title: 'Lighting', bullets: ['Studio setup', 'Light composition', 'Shadows & mood', 'Realistic ambience'] },
    { num: '06', icon: Camera, title: 'Rendering', bullets: ['High quality render', 'Multi-pass rendering', 'Denoising', 'Angle variations'] },
    { num: '07', icon: WandSparkles, title: 'Post Processing', bullets: ['Color correction', 'Glare & effects', 'Background cleanup', 'Final touches'] },
    { num: '08', icon: PackageCheck, title: 'Delivery', bullets: ['Final 3D files', 'High-res renders', 'Source files', 'Usage rights'] },
  ],
};

export const erpSoftwareData: JourneyData = {
  id: 'erp',
  title: 'ERP Software',
  subtitle: 'We design and develop ERP solutions that streamline processes, connect departments, and deliver real-time insights.',
  accent: '#6f932b',
  stamp: 'PROCESS APPROVED',
  topNote: 'We build ERP systems that fit your business like a glove.',
  sideNote: 'Every business has a unique workflow. We build ERP around it.',
  rightChecklist: ['Plan', 'Execute', 'Optimize'],
  bottomKind: 'board',
  bottomTitle: 'What you’ll get',
  bottomItems: ['Centralized dashboard', 'Inventory management', 'Sales & CRM', 'Purchase management', 'HR & payroll', 'Reports & analytics'],
  bottomNote: 'One system. One source of truth. Endless possibilities.',
  bottomVisual: '/assets/images/workspace-board/erp-dashboard.webp',
  bottomDiagram: 'Sales, inventory, purchase, finance and HR — connected.',
  diagramIcon: Workflow,
  steps: [
    { num: '01', icon: Users, title: 'Business Analysis', bullets: ['Understand business goals', 'Process study', 'Pain points', 'Requirements'] },
    { num: '02', icon: Network, title: 'Department Mapping', bullets: ['Map departments', 'Define roles & access', 'Data-flow analysis', 'Process alignment'] },
    { num: '03', icon: GitBranch, title: 'Workflow Design', bullets: ['Process automation', 'Workflow diagrams', 'Approval flows', 'Rule definitions'] },
    { num: '04', icon: LayoutDashboard, title: 'Module Planning', bullets: ['Module selection', 'Feature planning', 'Data structure', 'Integration points'] },
    { num: '05', icon: CodeXml, title: 'Development', bullets: ['Custom development', 'Module integration', 'Database setup', 'API connections'] },
    { num: '06', icon: CheckSquare, title: 'Testing', bullets: ['Functionality test', 'User acceptance test', 'Performance test', 'Security test'] },
    { num: '07', icon: Megaphone, title: 'Training', bullets: ['User training', 'Documentation', 'Role-based training', 'Process walkthrough'] },
    { num: '08', icon: Rocket, title: 'Deployment', bullets: ['Go-live setup', 'Data migration', 'System monitoring', 'Ongoing support'] },
  ],
};

export const customSoftwareData: JourneyData = {
  id: 'custom',
  title: 'Custom Software',
  subtitle: 'From concept to scalable solution — we build custom software that grows with your business.',
  accent: '#7952b3',
  stamp: 'CODE QUALITY APPROVED',
  topNote: 'We build custom software tailored to your business — not the other way around.',
  sideNote: 'Your idea. Our code. Endless possibilities.',
  rightChecklist: ['Plan', 'Design', 'Develop', 'Deliver'],
  bottomKind: 'board',
  bottomTitle: 'What you’ll get',
  bottomItems: ['Custom solution', 'Scalable architecture', 'Clean & secure code', 'High performance', 'Admin dashboard', 'API integrations'],
  bottomNote: 'We don’t just write code. We solve business problems.',
  bottomVisual: '/assets/images/pixelHive.png',
  bottomDiagram: 'A secure architecture shaped around your workflow.',
  diagramIcon: GitBranch,
  steps: [
    { num: '01', icon: Lightbulb, title: 'Requirements', bullets: ['Understand goals', 'Gather requirements', 'Define scope', 'Identify key features'] },
    { num: '02', icon: Network, title: 'Architecture', bullets: ['System architecture', 'Technology stack', 'Database design', 'API planning'] },
    { num: '03', icon: PanelsTopLeft, title: 'UI/UX Design', bullets: ['User flow', 'Wireframes', 'UI design', 'Interactive prototype'] },
    { num: '04', icon: CodeXml, title: 'Development', bullets: ['Clean coding', 'Feature development', 'API integration', 'Version control'] },
    { num: '05', icon: CheckSquare, title: 'Testing', bullets: ['Functional testing', 'Performance testing', 'Security testing', 'Bug fixing'] },
    { num: '06', icon: UploadCloud, title: 'Deployment', bullets: ['Server setup', 'CI/CD pipeline', 'Staging testing', 'Production deploy'] },
    { num: '07', icon: CircleGauge, title: 'Monitoring', bullets: ['Performance monitoring', 'Error tracking', 'User analytics', 'System alerts'] },
    { num: '08', icon: Headphones, title: 'Support & Scale', bullets: ['Ongoing support', 'Feature updates', 'Scalability planning', 'Continuous improvement'] },
  ],
};

export const aiAutomationData: JourneyData = {
  id: 'ai',
  title: 'AI Automation',
  subtitle: 'We use AI and automation to eliminate repetitive tasks, improve accuracy, and save hours of manual work.',
  accent: '#8e57c4',
  stamp: 'AUTOMATION APPROVED',
  topNote: 'We automate workflows. You accelerate growth.',
  sideNote: 'Smart automation for real results. Faster workflows. Smarter teams.',
  rightChecklist: ['Analyze', 'Automate', 'Optimize', 'Scale'],
  bottomKind: 'board',
  bottomTitle: 'What you’ll get',
  bottomItems: ['AI-powered automation', 'Reduced manual work', 'Improved accuracy', 'Faster response time', 'Cost savings', 'Real-time insights'],
  bottomNote: 'Let AI handle the busy work, so your team can do their best work.',
  bottomVisual: '/assets/images/workspace-board/ai-workflow.webp',
  bottomDiagram: 'Data sources → AI engine → automation → apps & tools.',
  diagramIcon: BrainCircuit,
  steps: [
    { num: '01', icon: Search, title: 'Problem Discovery', bullets: ['Identify repetitive tasks', 'Evaluate business impact', 'Understand pain points', 'Define automation goals'] },
    { num: '02', icon: Workflow, title: 'Workflow Analysis', bullets: ['Map current workflow', 'Find bottlenecks', 'Document processes', 'Prioritize opportunities'] },
    { num: '03', icon: BrainCircuit, title: 'AI Opportunity Mapping', bullets: ['Spot automation areas', 'Choose the right AI tools', 'Define data needs', 'Plan integration points'] },
    { num: '04', icon: Component, title: 'Solution Design', bullets: ['Design automation flow', 'Build prompt logic', 'Plan user interactions', 'Define success metrics'] },
    { num: '05', icon: Settings, title: 'Build & Integration', bullets: ['Develop automation', 'Integrate with tools', 'Connect APIs & data', 'Configure workflows'] },
    { num: '06', icon: FileCheck, title: 'Testing & Validation', bullets: ['Test all scenarios', 'Validate accuracy', 'Check edge cases', 'Improve performance'] },
    { num: '07', icon: ChartNoAxesCombined, title: 'Deployment', bullets: ['Deploy automation', 'User training', 'Documentation', 'Go-live support'] },
    { num: '08', icon: CircleGauge, title: 'Optimize & Scale', bullets: ['Monitor performance', 'Analyze results', 'Optimize workflows', 'Scale automation'] },
  ],
};

export const journeyDataById: Record<string, JourneyData> = {
  brand: brandJourneyData,
  motion: motionJourneyData,
  web: webDesignData,
  '3d': threeDModelingData,
  erp: erpSoftwareData,
  custom: customSoftwareData,
  ai: aiAutomationData,
};

export const fallbackJourneyData = (id: string, title: string): JourneyData => {
  void id;
  void title;
  return brandJourneyData;
};
