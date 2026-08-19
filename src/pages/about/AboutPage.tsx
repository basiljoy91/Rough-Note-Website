import html2canvas from 'html2canvas';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode
} from 'react';
import { flushSync } from 'react-dom';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { SketchFilters } from '../../shared/ui/SketchFilters';
import {
  clamp,
  drawPageCurl,
  easePageTurn,
  pageTurnDuration,
  type TurnDirection,
  type TurningCanvas
} from '../../shared/navigation/pageTurnPhysics';
import {
  isTransitionPreviewDocument,
  PAGE_TURN_SETTLED_EVENT
} from '../../shared/navigation/transitionState';
import {
  founderContent,
  founderCutoutSource,
  founderNarrative,
  type FounderKey
} from './founders-scene.manifest';
import './about-page.global.css';

const storyAssets = {
  classroom: '/assets/images/our-story/scene-classrooms.webp',
  design: '/assets/images/our-story/scene-design.webp',
  technology: '/assets/images/our-story/scene-technology.webp',
  founders: founderCutoutSource
} as const;

const storyPages = [
  { hash: '', label: 'Our Story cover', shortLabel: 'Cover' },
  { hash: '#chapter-one', label: 'Chapter 1: Two Dreamers, Two Paths', shortLabel: 'Chapter 1' },
  { hash: '#founders', label: 'Meet Our Story’s Main Characters', shortLabel: 'Founders' }
] as const;

const pageAssets: readonly (readonly string[])[] = [
  [],
  [storyAssets.classroom, storyAssets.design, storyAssets.technology],
  [storyAssets.founders]
];

function preloadPageAssets(pageIndex: number) {
  return Promise.all((pageAssets[pageIndex] ?? []).map((source) => new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = source;
    if (image.complete) resolve();
  })));
}

function PaperTape({ className = '' }: { className?: string }) {
  return <span className={`story-tape ${className}`} aria-hidden="true" />;
}

function PaperNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <aside className={`story-note ${className}`}>{children}</aside>;
}

function DoodleStar({ className = '' }: { className?: string }) {
  return <span className={`story-star ${className}`} aria-hidden="true">☆</span>;
}

function CoverPage() {
  return (
    <article className="story-page story-page--cover" data-page-index="0" aria-labelledby="story-cover-title">
      <div className="cover-page-stamp" aria-hidden="true">
        <span>ROUGH NOTE</span>
        <strong>No. 001</strong>
      </div>

      <div className="cover-margin-doodle" aria-hidden="true">
        <span>idea</span><i />
      </div>

      <div className="story-cover-copy">
        <span className="story-kicker">a collection of rough beginnings</span>
        <h1 id="story-cover-title" data-page-heading tabIndex={-1}>
          <span className="story-cover-title__ink">Our Story</span>
          <DoodleStar className="story-cover-title__star" />
        </h1>
        <span className="story-cover-underline" aria-hidden="true" />
        <p>
          Every great company<br />starts with an idea.<br />
          Ours started with <em>hundreds.</em>
        </p>
        <div className="story-chapter-label">
          <PaperTape />
          <span>Chapter 1</span>
        </div>
      </div>

      <div className="cover-pencil-sketch" aria-hidden="true">
        <span className="cover-pencil-sketch__bulb" />
        <span className="cover-pencil-sketch__arrow">↘</span>
        <small>start anywhere.</small>
      </div>

      <div className="cover-process-note" aria-hidden="true">
        <span>collect</span>
        <i>→</i>
        <span>connect</span>
        <i>→</i>
        <span>create</span>
      </div>

      <PaperNote className="cover-origin-note">
        <PaperTape />
        <small>rough thought #01</small>
        <strong>Small ideas<br />deserve room<br />to grow.</strong>
        <span>keep sketching ↗</span>
      </PaperNote>

      <div className="cover-story-trail" aria-hidden="true">
        <span><b>01</b> notice</span>
        <i>→</i>
        <span><b>02</b> sketch</span>
        <i>→</i>
        <span><b>03</b> shape</span>
      </div>

      <span className="cover-spark-cluster" aria-hidden="true">✦ · ✧</span>
      <span className="cover-paperclip" aria-hidden="true" />
      <span className="cover-coffee-ring" aria-hidden="true" />
    </article>
  );
}

interface SceneFrameProps {
  alt: string;
  caption: ReactNode;
  image: string;
  items: string[];
  scene: string;
  shot: string;
  title: ReactNode;
  tone: 'coral' | 'mustard' | 'blue';
}

function SceneFrame({ alt, caption, image, items, scene, shot, title, tone }: SceneFrameProps) {
  return (
    <article className={`story-scene story-scene--${tone}`}>
      <header>
        <span>{scene}</span>
        <h3>{title}</h3>
        <small>{shot}</small>
      </header>
      <figure>
        <PaperTape className="story-tape--left" />
        <PaperTape className="story-tape--right" />
        <img src={image} alt={alt} loading="eager" decoding="async" width="1000" height="596" />
        <figcaption>{caption}</figcaption>
      </figure>
      <PaperNote className="story-scene__checklist">
        {items.map((item) => <span key={item}>☑ {item}</span>)}
      </PaperNote>
    </article>
  );
}

function ChapterPage() {
  return (
    <article className="story-page story-page--chapter" data-page-index="1" aria-labelledby="chapter-one-title">
      <header className="chapter-heading">
        <span className="chapter-heading__number">Storyboard 01</span>
        <h2 id="chapter-one-title" data-page-heading tabIndex={-1}>
          Chapter 1: Two Dreamers, Two Paths <DoodleStar />
        </h2>
        <p>Every journey begins with a page of ideas.</p>
      </header>

      <PaperNote className="chapter-thesis">
        <PaperTape />
        <strong>Two minds.</strong>
        <span>One future.</span>
        <DoodleStar />
      </PaperNote>

      <div className="story-scenes">
        <SceneFrame
          alt="Two anime-style students in a warm classroom, one sketching and one working beside a laptop."
          caption={<>Two different classrooms.<br />Different notebooks.<br /><strong>Same habit.</strong></>}
          image={storyAssets.classroom}
          items={['Idea', 'Dream', 'Passion']}
          scene="Scene 1"
          shot="Wide shot"
          title="Different Classrooms"
          tone="coral"
        />
        <SceneFrame
          alt="An anime-style designer sketching an interface amid wireframes and color swatches."
          caption={<>One saw the world through<br /><strong>design, brands, and experiences.</strong></>}
          image={storyAssets.design}
          items={['Sketch', 'Imagine', 'Create']}
          scene="Scene 2"
          shot="Medium shot"
          title={<>One Saw the World<br />Through Design</>}
          tone="mustard"
        />
        <SceneFrame
          alt="An anime-style technologist drawing beside code screens and system diagrams."
          caption={<>The other saw everything through<br /><strong>technology, systems, and logic.</strong></>}
          image={storyAssets.technology}
          items={['Logic', 'Build', 'Solve']}
          scene="Scene 3"
          shot="Medium shot"
          title={<>The Other Saw Everything<br />Through Technology</>}
          tone="blue"
        />
      </div>

      <footer className="chapter-footer" aria-hidden="true">
        <span>Storyboard 02</span>
        <i />
        <em>the paths begin to cross…</em>
      </footer>
    </article>
  );
}

function useFounderSceneMotion(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || isTransitionPreviewDocument()) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollRoot = root.closest<HTMLElement>('.story-book__page');
    let panels: HTMLElement[] = [];
    let frame = 0;
    let scrollRange = 0;
    let scrollFrame = 0;
    let resizeObserver: ResizeObserver | undefined;
    let observer: IntersectionObserver | undefined;
    let started = false;
    let sceneVisible = true;

    const activeSceneSelector = window.matchMedia('(max-width: 767px)').matches
      ? '.character-scene--mobile'
      : window.matchMedia('(max-width: 1023px)').matches
        ? '.character-scene--tablet'
        : '.character-scene--desktop';
    const activeScene = root.querySelector<HTMLElement>(activeSceneSelector);
    if (!activeScene) return;
    panels = Array.from(activeScene.querySelectorAll<HTMLElement>('[data-story-panel]'));

    const updateScrollProgress = () => {
      if (!scrollRoot || !sceneVisible || document.visibilityState === 'hidden') return;
      const progress = scrollRange > 0 ? Math.min(1, scrollRoot.scrollTop / scrollRange) : 0;
      root.style.setProperty('--character-scroll-progress', progress.toFixed(3));
    };

    const measureScrollRange = () => {
      if (!scrollRoot) return;
      scrollRange = Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
      updateScrollProgress();
    };

    const onSceneScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateScrollProgress();
      });
    };

    const startScene = () => {
      if (started) return;
      started = true;
      frame = window.requestAnimationFrame(() => root.classList.add('is-scene-ready'));

      if (reducedMotion || !('IntersectionObserver' in window)) {
        panels.forEach((panel) => panel.classList.add('is-visible'));
        return;
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      }, { root: scrollRoot, rootMargin: '0px', threshold: 0.04 });

      panels.forEach((panel) => observer?.observe(panel));
      if (scrollRoot) {
        measureScrollRange();
        scrollRoot.addEventListener('scroll', onSceneScroll, { passive: true });
        if ('ResizeObserver' in window) {
          resizeObserver = new ResizeObserver(measureScrollRange);
          resizeObserver.observe(scrollRoot);
          resizeObserver.observe(activeScene);
        }
      }
    };

    const visibilityObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
          sceneVisible = entry?.isIntersecting ?? true;
          if (sceneVisible) onSceneScroll();
        }, { root: scrollRoot, threshold: 0.01 })
      : undefined;
    visibilityObserver?.observe(activeScene);

    const waitingForRouteHandoff = document.documentElement.dataset.pageTurnArrival === 'pending';
    if (waitingForRouteHandoff) {
      window.addEventListener(PAGE_TURN_SETTLED_EVENT, startScene, { once: true });
    } else {
      startScene();
    }

    return () => {
      window.removeEventListener(PAGE_TURN_SETTLED_EVENT, startScene);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(scrollFrame);
      scrollRoot?.removeEventListener('scroll', onSceneScroll);
      resizeObserver?.disconnect();
      observer?.disconnect();
      visibilityObserver?.disconnect();
      root.classList.remove('is-scene-ready');
      root.style.removeProperty('--character-scroll-progress');
    };
  }, [rootRef]);
}

function FounderCutout({ founder, className = '' }: { founder: FounderKey; className?: string }) {
  const profile = founderContent[founder];
  return (
    <figure className={`character-cutout character-cutout--${founder} ${className}`}>
      <img
        src={founderCutoutSource}
        alt={profile.imageAlt}
        loading="eager"
        decoding="async"
        width="1536"
        height="1024"
      />
    </figure>
  );
}

function FounderHeading({ founder }: { founder: FounderKey }) {
  const profile = founderContent[founder];
  return (
    <header className={`character-founder-heading character-founder-heading--${founder}`}>
      <span className="character-founder-heading__doodle" aria-hidden="true">{founder === 'kannan' ? '♕' : '☆'}</span>
      <h3>{profile.name}</h3>
      <span className="character-founder-heading__underline" aria-hidden="true" />
      <p>{profile.role}</p>
    </header>
  );
}

function FocusAreasNote({ founder, className = '' }: { founder: FounderKey; className?: string }) {
  const profile = founderContent[founder];
  return (
    <aside className={`character-focus-note character-focus-note--${founder} ${className}`} tabIndex={0}>
      <span className="character-pushpin" aria-hidden="true" />
      <h4>Focus Areas</h4>
      <ul>
        {profile.focusAreas.map((area) => (
          <li key={area}><span aria-hidden="true">{founder === 'kannan' ? '</>' : '☆'}</span>{area}</li>
        ))}
      </ul>
    </aside>
  );
}

function SceneTitle() {
  return (
    <header className="character-title" aria-hidden="true">
      <span>Meet Our Story’s</span>
      <strong>Main Characters</strong>
      <i />
      <p>and the Founders</p>
      <b>☆</b>
    </header>
  );
}

function NarrativeNote({ className = '' }: { className?: string }) {
  return (
    <aside className={`character-narrative ${className}`}>
      <PaperTape />
      <p>{founderNarrative.first}</p>
      <i />
      <p>{founderNarrative.second}</p>
      <strong>Together,<br />they became <em>Rough Note.</em></strong>
    </aside>
  );
}

function CodeCard({ className = '' }: { className?: string }) {
  return (
    <div className={`character-code-card character-research-card ${className}`} tabIndex={0}>
      <code>function solve(problem)&#123;<br />&nbsp; think();<br />&nbsp; plan();<br />&nbsp; build();<br />&nbsp; optimize();<br />&nbsp; return solution;<br />&#125;</code>
      <small>systems become simple when the thinking is clear.</small>
    </div>
  );
}

function ApiDiagram({ className = '' }: { className?: string }) {
  return (
    <div className={`character-api-sheet character-sketch-sheet ${className}`} aria-hidden="true">
      <span className="character-cloud">API</span>
      <i /><i /><i />
      <b>ERP</b><b>AI</b><b>WEB</b>
    </div>
  );
}

function WireframeSheet({ className = '' }: { className?: string }) {
  return (
    <div className={`character-wireframe character-sketch-sheet ${className}`} aria-hidden="true">
      <span /><span /><span /><span /><span /><span />
    </div>
  );
}

function LogoStudies({ className = '' }: { className?: string }) {
  return (
    <div className={`character-logo-studies character-research-card ${className}`} tabIndex={0}>
      <small>LOGO IDEAS</small>
      <div aria-hidden="true"><b>R</b><b>R</b><b>R</b><b>R</b><b>R</b><b>R</b></div>
      <em>six sketches. one memorable mark.</em>
    </div>
  );
}

function ColorSwatches({ className = '' }: { className?: string }) {
  return (
    <div className={`character-swatches ${className}`} aria-hidden="true">
      <i /><i /><i /><i /><i />
    </div>
  );
}

function ProcessNote({ kind, className = '' }: { kind: 'build' | 'ideas'; className?: string }) {
  return kind === 'build' ? (
    <aside className={`character-process-note character-process-note--build ${className}`}>BUILD<br />· AUTOMATE<br />· SCALE<br />IMPACT</aside>
  ) : (
    <aside className={`character-process-note character-process-note--ideas ${className}`}>ideas<br />→ sketches<br />→ design<br />→ impact</aside>
  );
}

function SceneDeskProps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`character-desk-props${compact ? ' character-desk-props--compact' : ''}`} aria-hidden="true">
      <span className="character-camera"><i /><b /></span>
      <span className="character-notebook"><i /><i /><i /></span>
      <span className="character-color-sheet"><i /><i /><i /><i /><i /><i /></span>
      <span className="character-tablet"><i /><b /></span>
      <span className="character-logo-papers"><i>R</i><i>R</i><i>R</i></span>
      <span className="character-books"><i>LOGO DESIGN</i><i>BRANDING</i><i>DESIGN OF EVERYDAY THINGS</i></span>
      <span className="character-pen-cup"><i /><i /><i /><i /><i /></span>
    </div>
  );
}

function BrandCard({ className = '' }: { className?: string }) {
  return (
    <a className={`character-brand-card ${className}`} href="/html/contact.html" data-page-turn aria-label="Continue the story with Rough Note">
      <span aria-hidden="true">♕</span>
      <strong>Rough Note</strong>
      <i />
      <p>Ideas. Designed. Built. For Impact.</p>
      <b aria-hidden="true" />
    </a>
  );
}

function DesktopFoundersScene() {
  return (
    <section className="character-scene character-scene--desktop" aria-label="Founders editorial spread">
      <div className="character-scene__paper" aria-hidden="true" />
      <div className="character-scene__light" aria-hidden="true" />
      <div className="character-scene__desk" aria-hidden="true" />

      <SceneTitle />
      <FounderHeading founder="kannan" />
      <FounderHeading founder="ganeish" />

      <p className="character-bio character-bio--kannan">{founderContent.kannan.bio}</p>
      <p className="character-bio character-bio--ganeish">{founderContent.ganeish.bio}</p>

      <ApiDiagram className="character-api-sheet--desktop" />
      <CodeCard className="character-code-card--desktop" />
      <WireframeSheet className="character-wireframe--left" />
      <WireframeSheet className="character-wireframe--right" />
      <LogoStudies className="character-logo-studies--desktop" />
      <ColorSwatches className="character-swatches--desktop" />
      <NarrativeNote className="character-narrative--desktop" />
      <span className="character-connection-arrow" aria-hidden="true">⌄</span>

      <FounderCutout founder="kannan" className="character-cutout--desktop" />
      <FounderCutout founder="ganeish" className="character-cutout--desktop" />
      <FocusAreasNote founder="kannan" />
      <FocusAreasNote founder="ganeish" />
      <ProcessNote kind="build" />
      <ProcessNote kind="ideas" />

      <SceneDeskProps />
      <BrandCard />
    </section>
  );
}

function TabletFounderPanel({ founder }: { founder: FounderKey }) {
  return (
    <section className={`character-tablet-founder character-tablet-founder--${founder}`} data-story-panel>
      <FounderHeading founder={founder} />
      <p className="character-bio">{founderContent[founder].bio}</p>
      {founder === 'kannan' ? <CodeCard /> : <LogoStudies />}
      {founder === 'kannan' ? <ApiDiagram /> : <ColorSwatches />}
      <FounderCutout founder={founder} />
      <FocusAreasNote founder={founder} />
    </section>
  );
}

function TabletFoundersScene() {
  return (
    <section className="character-scene character-scene--tablet" aria-label="Founders vertical editorial spread">
      <div className="character-tablet-title" data-story-panel><SceneTitle /></div>
      <TabletFounderPanel founder="kannan" />
      <div className="character-tablet-bridge" data-story-panel><NarrativeNote /><span aria-hidden="true">↘</span></div>
      <TabletFounderPanel founder="ganeish" />
      <div className="character-tablet-finale" data-story-panel><SceneDeskProps compact /><BrandCard /></div>
    </section>
  );
}

function MobileFounderIntro({ founder }: { founder: FounderKey }) {
  return (
    <section className={`character-mobile-panel character-mobile-panel--intro character-mobile-panel--${founder}`} data-story-panel>
      <FounderHeading founder={founder} />
      <p className="character-bio">{founderContent[founder].bio}</p>
      <FounderCutout founder={founder} />
    </section>
  );
}

function MobileFounderFocus({ founder }: { founder: FounderKey }) {
  return (
    <section className={`character-mobile-panel character-mobile-panel--focus character-mobile-panel--${founder}`} data-story-panel>
      {founder === 'kannan' ? <><CodeCard /><ApiDiagram /></> : <><LogoStudies /><ColorSwatches /></>}
      <FocusAreasNote founder={founder} />
      <ProcessNote kind={founder === 'kannan' ? 'build' : 'ideas'} />
    </section>
  );
}

function MobileFoundersScene() {
  return (
    <section className="character-scene character-scene--mobile" aria-label="Founders anime storyboard">
      <section className="character-mobile-panel character-mobile-panel--title" data-story-panel><SceneTitle /></section>
      <MobileFounderIntro founder="kannan" />
      <MobileFounderFocus founder="kannan" />
      <section className="character-mobile-panel character-mobile-panel--narrative" data-story-panel><NarrativeNote /></section>
      <MobileFounderIntro founder="ganeish" />
      <MobileFounderFocus founder="ganeish" />
      <section className="character-mobile-panel character-mobile-panel--finale" data-story-panel><SceneDeskProps compact /><BrandCard /></section>
    </section>
  );
}

function FoundersPage() {
  const sceneRef = useRef<HTMLElement>(null);
  useFounderSceneMotion(sceneRef);

  return (
    <article ref={sceneRef} className="story-page story-page--founders" data-page-index="2" aria-labelledby="founders-title">
      <h2 id="founders-title" className="character-scene__semantic-title" data-page-heading tabIndex={-1}>
        Main Characters
      </h2>
      <DesktopFoundersScene />
      <TabletFoundersScene />
      <MobileFoundersScene />
    </article>
  );
}

function CurrentStoryPage({ index }: { index: number }) {
  if (index === 1) return <ChapterPage />;
  if (index === 2) return <FoundersPage />;
  return <CoverPage />;
}

function pageIndexFromLocation() {
  const pageIndex = storyPages.findIndex((page) => page.hash === window.location.hash);
  return pageIndex < 0 ? 0 : pageIndex;
}

export function StoryBook() {
  const [pageIndex, setPageIndex] = useState(pageIndexFromLocation);
  const [isTurning, setIsTurning] = useState(false);
  const [arrivedViaPageTurn] = useState(
    () => isTransitionPreviewDocument() ||
      document.documentElement.dataset.pageTurnArrival === 'pending'
  );
  const pageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef(0);
  const routeCommittedRef = useRef(false);
  const pointerStartRef = useRef<number | null>(null);
  const wheelGestureRef = useRef({
    accumulatedDelta: 0,
    direction: 0,
    lockedUntil: 0,
    resetTimer: 0
  });
  const turnToRef = useRef<(target: number, historyMode?: 'push' | 'none') => void>(() => undefined);

  const commitRoute = useCallback((target: number, mode: 'push' | 'none') => {
    if (mode === 'none' || routeCommittedRef.current) return;
    const nextUrl = new URL(window.location.href);
    nextUrl.hash = storyPages[target].hash;
    window.history.pushState({ ...window.history.state, storyPage: target }, '', nextUrl);
    routeCommittedRef.current = true;
  }, []);

  const finishTurn = useCallback((turning?: TurningCanvas) => {
    window.cancelAnimationFrame(animationRef.current);
    turning?.element.remove();
    turning?.front.remove();
    setIsTurning(false);
    bookRef.current?.removeAttribute('aria-busy');
  }, []);

  const turnTo = useCallback(async (target: number, historyMode: 'push' | 'none' = 'push') => {
    if (
      isTurning ||
      bookRef.current?.hasAttribute('aria-busy') ||
      target === pageIndex ||
      target < 0 ||
      target >= storyPages.length
    ) return;

    const sourcePage = pageRef.current;
    const book = bookRef.current;
    const direction: TurnDirection = target > pageIndex ? 'next' : 'previous';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    routeCommittedRef.current = false;
    setIsTurning(true);
    book?.setAttribute('aria-busy', 'true');

    if (reducedMotion || !sourcePage || !book) {
      flushSync(() => setPageIndex(target));
      commitRoute(target, historyMode);
      finishTurn();
      requestAnimationFrame(() => {
        pageRef.current?.querySelector<HTMLElement>('[data-page-heading]')?.focus({ preventScroll: true });
        const storyRoot = bookRef.current?.closest<HTMLElement>('.our-story-page');
        if (storyRoot) storyRoot.scrollTop = 0;
      });
      return;
    }

    try {
      await Promise.all([document.fonts.ready, preloadPageAssets(target)]);
      const rect = sourcePage.getBoundingClientRect();
      const pixelRatio = Math.min(1.4, Math.max(1, window.devicePixelRatio || 1));
      const source = await html2canvas(sourcePage, {
        backgroundColor: null,
        height: rect.height,
        logging: false,
        removeContainer: true,
        scale: pixelRatio,
        useCORS: true,
        width: rect.width
      });

      const canvas = document.createElement('canvas');
      const front = sourcePage.cloneNode(true) as HTMLElement;
      canvas.className = 'story-turn-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.width = source.width;
      canvas.height = source.height;
      front.classList.add('story-turn-front');
      front.setAttribute('aria-hidden', 'true');
      front.setAttribute('inert', '');
      front.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
      book.append(canvas, front);

      const turning = { element: canvas, front, source } satisfies TurningCanvas;
      drawPageCurl(turning, 0, direction);
      flushSync(() => setPageIndex(target));

      const start = performance.now();
      const step = (timestamp: number) => {
        const progress = clamp((timestamp - start) / pageTurnDuration, 0, 1);
        drawPageCurl(turning, easePageTurn(progress), direction);
        if (progress >= 0.52) commitRoute(target, historyMode);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
          return;
        }

        commitRoute(target, historyMode);
        finishTurn(turning);
        const page = pageRef.current;
        if (page) page.scrollTop = 0;
        requestAnimationFrame(() => {
          page?.querySelector<HTMLElement>('[data-page-heading]')?.focus({ preventScroll: true });
          const storyRoot = bookRef.current?.closest<HTMLElement>('.our-story-page');
          if (storyRoot) storyRoot.scrollTop = 0;
        });
      };

      animationRef.current = requestAnimationFrame(step);
    } catch (error) {
      if (book) {
        book.dataset.turnError = error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error);
      }
      flushSync(() => setPageIndex(target));
      commitRoute(target, historyMode);
      finishTurn();
    }
  }, [commitRoute, finishTurn, isTurning, pageIndex]);

  useLayoutEffect(() => {
    turnToRef.current = turnTo;
  }, [turnTo]);

  useEffect(() => {
    const wheelGesture = wheelGestureRef.current;
    const onPopState = () => turnToRef.current(pageIndexFromLocation(), 'none');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') turnToRef.current(pageIndex + 1);
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') turnToRef.current(pageIndex - 1);
    };
    const onWheel = (event: WheelEvent) => {
      const rawDelta = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? event.deltaY * 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? event.deltaY * window.innerHeight
          : event.deltaY;

      if (Math.abs(rawDelta) < 0.5 || Math.abs(event.deltaX) > Math.abs(rawDelta)) return;

      const direction = rawDelta > 0 ? 1 : -1;
      const storyPage = pageRef.current;
      const scrollEpsilon = 3;
      const pageCanScroll = storyPage && (
        direction > 0
          ? storyPage.scrollTop + storyPage.clientHeight < storyPage.scrollHeight - scrollEpsilon
          : storyPage.scrollTop > scrollEpsilon
      );

      // Founders and compact layouts have deliberately scrollable paper. Let
      // that content move first, then turn the sheet at its physical edge.
      if (pageCanScroll) {
        wheelGesture.accumulatedDelta = 0;
        wheelGesture.direction = 0;
        return;
      }

      const target = pageIndex + direction;
      if (target < 0 || target >= storyPages.length) return;

      event.preventDefault();
      const now = performance.now();
      if (now < wheelGesture.lockedUntil || bookRef.current?.hasAttribute('aria-busy')) return;

      if (wheelGesture.direction !== direction) wheelGesture.accumulatedDelta = 0;
      wheelGesture.direction = direction;
      wheelGesture.accumulatedDelta += rawDelta;
      window.clearTimeout(wheelGesture.resetTimer);
      wheelGesture.resetTimer = window.setTimeout(() => {
        wheelGesture.accumulatedDelta = 0;
        wheelGesture.direction = 0;
      }, 180);

      // A small accumulation threshold distinguishes an intentional scroll
      // from trackpad noise. The lock absorbs the gesture's inertial tail.
      if (Math.abs(wheelGesture.accumulatedDelta) < 72) return;
      wheelGesture.accumulatedDelta = 0;
      wheelGesture.direction = 0;
      wheelGesture.lockedUntil = now + pageTurnDuration + 240;
      turnToRef.current(target);
    };

    const storyRoot = bookRef.current?.closest<HTMLElement>('.our-story-page');
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);
    storyRoot?.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
      storyRoot?.removeEventListener('wheel', onWheel);
      window.clearTimeout(wheelGesture.resetTimer);
      window.cancelAnimationFrame(animationRef.current);
    };
  }, [pageIndex]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') pointerStartRef.current = event.clientX;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current == null) return;
    const distance = event.clientX - pointerStartRef.current;
    pointerStartRef.current = null;
    if (Math.abs(distance) < 56) return;
    turnTo(pageIndex + (distance < 0 ? 1 : -1));
  };

  return (
    <main
      className={`our-story-page${arrivedViaPageTurn ? ' our-story-page--route-arrival' : ''}`}
      data-rough-anchor="about-page"
    >
      <div className="story-entry-glow" aria-hidden="true" />
      <div className="story-desk-objects" aria-hidden="true">
        <span className="desk-leaves"><i /><i /><i /></span>
        <img
          className="desk-coffee-plant"
          src="/assets/images/workspace-board/coffee-plant-props.webp"
          alt=""
        />
        <span className="desk-note"><b>ideas</b><DoodleStar /></span>
        <span className="desk-pencil desk-pencil--one" />
        <span className="desk-pencil desk-pencil--two" />
        <span className="desk-sketch">rough<br />notes<br />↗</span>
        <span className="desk-ruler"><i /><i /><i /><i /><i /></span>
        <span className="desk-paperclip desk-paperclip--one" />
        <span className="desk-paperclip desk-paperclip--two" />
        <span className="desk-eraser" />
        <span className="desk-coffee-ring" />
      </div>

      <section className="story-book-stage" aria-label="Rough Note storybook">
        <div
          ref={bookRef}
          className={`story-book story-book--page-${pageIndex}${isTurning ? ' is-turning' : ''}`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <span className="story-book__page-stack" aria-hidden="true" />
          <span className="story-book__binding" aria-hidden="true" />
          <div ref={pageRef} className="story-book__page" role="region" aria-label={storyPages[pageIndex].label}>
            <CurrentStoryPage index={pageIndex} />
          </div>

          <button
            className="story-turn-control story-turn-control--previous"
            type="button"
            onClick={() => turnTo(pageIndex - 1)}
            disabled={isTurning || pageIndex === 0}
            aria-label={pageIndex > 0 ? `Turn back to ${storyPages[pageIndex - 1].shortLabel}` : 'This is the first page'}
          >
            <span aria-hidden="true">←</span>
            <em>turn back</em>
          </button>

          <button
            className="story-turn-control story-turn-control--next"
            type="button"
            onClick={() => turnTo(pageIndex + 1)}
            disabled={isTurning || pageIndex === storyPages.length - 1}
            aria-label={pageIndex < storyPages.length - 1 ? `Turn to ${storyPages[pageIndex + 1].shortLabel}` : 'This is the final page'}
          >
            <em>{pageIndex === 0 ? 'turn to chapter 1' : 'turn the page'}</em>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <nav className="story-pagination" aria-label="Story pages">
          {storyPages.map((page, index) => (
            <button
              key={page.label}
              type="button"
              onClick={() => turnTo(index)}
              disabled={isTurning}
              aria-label={`Go to ${page.label}`}
              aria-current={index === pageIndex ? 'page' : undefined}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}

export function AboutPage() {
  return (
    <>
      <SketchFilters />
      <SiteLayout activeItem="about" pageLabel="Page 02" pageTitle="Our Story">
        <StoryBook />
      </SiteLayout>
    </>
  );
}
