export type FounderKey = 'kannan' | 'ganeish';
export type SceneBreakpoint = 'wideDesktop' | 'laptop' | 'tablet' | 'mobile';

export interface FounderProfileContent {
  bio: string;
  focusAreas: readonly string[];
  imageAlt: string;
  name: string;
  role: string;
}

export interface FounderSceneAsset {
  asset: string;
  decorative: boolean;
  interactive: boolean;
  layer: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  name: string;
  placement: Record<SceneBreakpoint, string>;
  rotation: string;
  scale: string;
  source: string;
}

export const founderCutoutSource = '/assets/images/our-story/founders-cutouts.webp';

export const founderContent: Record<FounderKey, FounderProfileContent> = {
  kannan: {
    bio: 'Kannan sees every problem as a system waiting to be improved. He enjoys breaking complex challenges into simple, scalable digital solutions through software, automation, and technology.',
    focusAreas: [
      'ERP Software',
      'Custom Software',
      'AI Automation',
      'System Architecture',
      'Web Development',
      'Business Solutions'
    ],
    imageAlt: 'Kannan B S, the Tech Architect, sketching beside his laptop.',
    name: 'Kannan B S',
    role: 'The Tech Architect'
  },
  ganeish: {
    bio: 'Ganeish sees every challenge as an opportunity to create meaningful experiences. His passion lies in branding, visual identity, user experience, and transforming rough ideas into designs that people remember.',
    focusAreas: [
      'Brand Identity',
      'UI/UX Design',
      'Website Design',
      'Motion Graphics',
      'Creative Direction',
      'Visual Storytelling'
    ],
    imageAlt: 'Ganeish Ratanam, the Design Thinker, smiling while sketching.',
    name: 'Ganeish Ratanam',
    role: 'The Design Thinker'
  }
};

export const founderNarrative = {
  first: 'One imagined what products could look like.',
  second: 'The other figured out how to build them.',
  close: 'Together, they became Rough Note.'
} as const;

/**
 * Composition manifest. CSS owns the exact breakpoint coordinates; this list
 * records the intentional layer, placement, scale, rotation, and semantics for
 * every visible asset group in the scene.
 */
export const foundersSceneManifest: readonly FounderSceneAsset[] = [
  {
    asset: 'Aged cream presentation board, worn edges, paper grain, warm top-left light',
    decorative: true,
    interactive: false,
    layer: 1,
    name: 'base-paper-board',
    placement: { wideDesktop: 'full 3:2 board', laptop: 'full tighter board', tablet: 'full vertical board', mobile: 'continuous panel paper' },
    rotation: '-0.15deg',
    scale: '100%',
    source: 'CSS texture using the project paper texture'
  },
  {
    asset: 'Shared dark wooden work surface',
    decorative: true,
    interactive: false,
    layer: 1,
    name: 'foreground-desk-base',
    placement: { wideDesktop: 'bottom 24%', laptop: 'bottom 22%', tablet: 'inside founder panels', mobile: 'finale panel' },
    rotation: '0deg',
    scale: '100% width',
    source: 'CSS wood grain and lighting'
  },
  {
    asset: 'API flowchart and technical diagram sheets',
    decorative: true,
    interactive: false,
    layer: 2,
    name: 'technical-diagrams',
    placement: { wideDesktop: 'upper-left center', laptop: 'upper-left center', tablet: 'Kannan panel background', mobile: 'Kannan technical panel' },
    rotation: '-1deg / 2deg',
    scale: 'small research sheets',
    source: 'Semantic HTML and CSS linework'
  },
  {
    asset: 'Code card',
    decorative: false,
    interactive: true,
    layer: 2,
    name: 'code-card',
    placement: { wideDesktop: 'behind Kannan head', laptop: 'behind Kannan shoulder', tablet: 'Kannan panel upper-right', mobile: 'Kannan technical panel' },
    rotation: '-2deg',
    scale: 'medium',
    source: 'Accessible HTML code fragment'
  },
  {
    asset: 'Interface wireframes and product sketch sheets',
    decorative: true,
    interactive: false,
    layer: 2,
    name: 'interface-wireframes',
    placement: { wideDesktop: 'left-center and right-center', laptop: 'behind both shoulders', tablet: 'founder panel backgrounds', mobile: 'technical/design support panels' },
    rotation: '1deg / -2deg',
    scale: 'small paper sheets',
    source: 'CSS wireframe drawings'
  },
  {
    asset: 'Rough Note logo explorations',
    decorative: false,
    interactive: true,
    layer: 2,
    name: 'logo-explorations',
    placement: { wideDesktop: 'upper-right center', laptop: 'behind Ganeish shoulder', tablet: 'Ganeish panel upper-left', mobile: 'Ganeish design panel' },
    rotation: '1.5deg',
    scale: 'medium',
    source: 'Accessible HTML and CSS sketch marks'
  },
  {
    asset: 'Muted design color swatches',
    decorative: true,
    interactive: false,
    layer: 2,
    name: 'color-swatches',
    placement: { wideDesktop: 'above Ganeish head', laptop: 'near center-right', tablet: 'Ganeish panel', mobile: 'Ganeish design panel' },
    rotation: '3deg',
    scale: 'small strip',
    source: 'CSS color chips'
  },
  {
    asset: 'Names, roles, biographies, title, underlines, crowns, stars and pins',
    decorative: false,
    interactive: false,
    layer: 3,
    name: 'founder-information',
    placement: { wideDesktop: 'reference-aligned top and side columns', laptop: 'protected upper zones', tablet: 'panel headers', mobile: 'panel headers and copy blocks' },
    rotation: 'within ±1.5deg',
    scale: 'responsive readable type',
    source: 'Semantic HTML with CSS ink strokes'
  },
  {
    asset: 'Compact torn-paper narrative note and connection arrow',
    decorative: false,
    interactive: false,
    layer: 3,
    name: 'central-narrative',
    placement: { wideDesktop: 'narrow center column', laptop: 'compact center', tablet: 'between founder panels', mobile: 'panel 4' },
    rotation: '-0.6deg',
    scale: 'compact',
    source: 'Semantic HTML and CSS linework'
  },
  {
    asset: 'Kannan B S transparent identity cutout',
    decorative: false,
    interactive: false,
    layer: 4,
    name: 'kannan-cutout',
    placement: { wideDesktop: 'dominant lower-left', laptop: 'dominant lower-left', tablet: 'Kannan storyboard panel', mobile: 'panel 2' },
    rotation: '0deg',
    scale: 'reference-dominant',
    source: founderCutoutSource
  },
  {
    asset: 'Ganeish Ratanam transparent identity cutout',
    decorative: false,
    interactive: false,
    layer: 4,
    name: 'ganeish-cutout',
    placement: { wideDesktop: 'dominant lower-right', laptop: 'dominant lower-right', tablet: 'Ganeish storyboard panel', mobile: 'panel 5' },
    rotation: '0deg',
    scale: 'reference-dominant',
    source: founderCutoutSource
  },
  {
    asset: 'Blue and mustard Focus Areas notes',
    decorative: false,
    interactive: true,
    layer: 5,
    name: 'focus-notes',
    placement: { wideDesktop: 'outer portrait overlaps below faces', laptop: 'outer lower portrait zones', tablet: 'beside/under each portrait', mobile: 'panels 3 and 6' },
    rotation: '-2deg / 1.5deg',
    scale: 'supporting',
    source: 'Semantic HTML paper notes'
  },
  {
    asset: 'Build / Automate / Scale / Impact and Ideas → sketches → design → impact notes',
    decorative: false,
    interactive: false,
    layer: 5,
    name: 'process-notes',
    placement: { wideDesktop: 'beside central workspace', laptop: 'inside protected gaps', tablet: 'panel footnotes', mobile: 'support panels' },
    rotation: '2deg / -1deg',
    scale: 'small',
    source: 'HTML sticky notes'
  },
  {
    asset: 'Camera, open notebook, color sheet and laptop workspace',
    decorative: true,
    interactive: false,
    layer: 6,
    name: 'kannan-foreground',
    placement: { wideDesktop: 'lower-left desk', laptop: 'simplified lower-left desk', tablet: 'Kannan panel foreground', mobile: 'shared finale' },
    rotation: 'varied within ±4deg',
    scale: 'foreground dominant',
    source: 'Cutout laptop plus CSS camera, notebook and paper props'
  },
  {
    asset: 'Tablet, pens, books, logo printouts and pencil container',
    decorative: true,
    interactive: false,
    layer: 6,
    name: 'ganeish-foreground',
    placement: { wideDesktop: 'lower-right desk', laptop: 'simplified lower-right desk', tablet: 'Ganeish panel foreground', mobile: 'shared finale' },
    rotation: 'varied within ±4deg',
    scale: 'foreground dominant',
    source: 'Cutout hands plus CSS tablet, books and paper props'
  },
  {
    asset: 'Large torn-paper Rough Note brand card with crown and paper clip',
    decorative: false,
    interactive: true,
    layer: 7,
    name: 'rough-note-brand-card',
    placement: { wideDesktop: 'bottom-center on desk', laptop: 'bottom-center', tablet: 'closing card', mobile: 'panel 7' },
    rotation: '-0.5deg',
    scale: 'prominent',
    source: 'Semantic link styled as torn paper'
  },
  {
    asset: 'Ink wipes, moving contact shadows, light wash and parallax atmosphere',
    decorative: true,
    interactive: false,
    layer: 8,
    name: 'storyboard-atmosphere',
    placement: { wideDesktop: 'whole scene', laptop: 'whole scene', tablet: 'panel reveals', mobile: 'panel reveals' },
    rotation: 'none',
    scale: 'scene-wide',
    source: 'CSS animations and IntersectionObserver state'
  }
] as const;
