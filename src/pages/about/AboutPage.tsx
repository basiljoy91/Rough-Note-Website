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
import './about-page.global.css';

const storyAssets = {
  classroom: '/assets/images/our-story/scene-classrooms.webp',
  design: '/assets/images/our-story/scene-design.webp',
  technology: '/assets/images/our-story/scene-technology.webp',
  kannan: '/assets/images/our-story/kannan-bs.webp',
  ganeish: '/assets/images/our-story/ganeish-ratanam.webp'
} as const;

const storyPages = [
  { hash: '', label: 'Our Story cover', shortLabel: 'Cover' },
  { hash: '#chapter-one', label: 'Chapter 1: Two Dreamers, Two Paths', shortLabel: 'Chapter 1' },
  { hash: '#founders', label: 'Meet Our Story’s Main Characters', shortLabel: 'Founders' }
] as const;

const pageAssets: readonly (readonly string[])[] = [
  [],
  [storyAssets.classroom, storyAssets.design, storyAssets.technology],
  [storyAssets.kannan, storyAssets.ganeish]
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

interface FounderProfileProps {
  bio: string;
  className: string;
  focusAreas: string[];
  image: string;
  imageAlt: string;
  name: string;
  role: string;
}

function FounderProfile({ bio, className, focusAreas, image, imageAlt, name, role }: FounderProfileProps) {
  return (
    <article className={`story-founder ${className}`}>
      <header className="story-founder__heading">
        <span aria-hidden="true">♕</span>
        <h3>{name}</h3>
        <p>{role}</p>
      </header>

      <p className="story-founder__bio">{bio}</p>

      <figure className="story-founder__portrait">
        <img src={image} alt={imageAlt} loading="eager" decoding="async" width="1080" height="990" />
      </figure>

      <PaperNote className="story-founder__focus">
        <span className="story-pin" aria-hidden="true" />
        <h4>Focus Areas</h4>
        <ul>
          {focusAreas.map((area) => <li key={area}>{area}</li>)}
        </ul>
      </PaperNote>
    </article>
  );
}

function FoundersPage() {
  return (
    <article className="story-page story-page--founders" data-page-index="2" aria-labelledby="founders-title">
      <header className="founders-heading">
        <span>Meet Our Story’s</span>
        <h2 id="founders-title" data-page-heading tabIndex={-1}>Main Characters</h2>
        <p>and the Founders</p>
      </header>

      <div className="founders-grid">
        <FounderProfile
          bio="Kannan sees every problem as a system waiting to be improved. He enjoys breaking complex challenges into simple, scalable digital solutions through software, automation, and technology."
          className="story-founder--tech"
          focusAreas={['ERP Software', 'Custom Software', 'AI Automation', 'System Architecture', 'Web Development', 'Business Solutions']}
          image={storyAssets.kannan}
          imageAlt="Anime-style portrait of Kannan B S sketching beside his laptop."
          name="Kannan B S"
          role="The Tech Architect"
        />

        <PaperNote className="founders-narrative">
          <PaperTape />
          <p>One imagined what products could look like.</p>
          <i />
          <p>The other figured out how to build them.</p>
          <strong>Together, they became <em>Rough Note.</em></strong>
        </PaperNote>

        <FounderProfile
          bio="Ganeish sees every challenge as an opportunity to create meaningful experiences. His passion lies in branding, visual identity, user experience, and transforming rough ideas into designs that people remember."
          className="story-founder--design"
          focusAreas={['Brand Identity', 'UI/UX Design', 'Website Design', 'Motion Graphics', 'Creative Direction', 'Visual Storytelling']}
          image={storyAssets.ganeish}
          imageAlt="Anime-style portrait of Ganeish Ratanam smiling while sketching an interface."
          name="Ganeish Ratanam"
          role="The Design Thinker"
        />
      </div>

      <footer className="story-signature">
        <span aria-hidden="true">♕</span>
        <strong>Rough Note</strong>
        <i />
        <p>Ideas. Designed. Built. For Impact.</p>
      </footer>
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
  const pageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef(0);
  const routeCommittedRef = useRef(false);
  const pointerStartRef = useRef<number | null>(null);
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
    const onPopState = () => turnToRef.current(pageIndexFromLocation(), 'none');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') turnToRef.current(pageIndex + 1);
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') turnToRef.current(pageIndex - 1);
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
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
    <main className="our-story-page" data-rough-anchor="about-page">
      <div className="story-entry-glow" aria-hidden="true" />
      <div className="story-desk-objects" aria-hidden="true">
        <span className="desk-leaves"><i /><i /><i /></span>
        <span className="desk-note"><b>ideas</b><DoodleStar /></span>
        <span className="desk-pencil desk-pencil--one" />
        <span className="desk-pencil desk-pencil--two" />
        <span className="desk-sketch">rough<br />notes<br />↗</span>
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
