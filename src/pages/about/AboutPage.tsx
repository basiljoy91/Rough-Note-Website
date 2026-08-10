import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { SketchFilters } from '../../shared/ui/SketchFilters';
import './about-page.global.css';

const storyAssets = {
  cover: '/assets/images/our-story/opening-cover.webp',
  classroom: '/assets/images/our-story/scene-classrooms.webp',
  design: '/assets/images/our-story/scene-design.webp',
  technology: '/assets/images/our-story/scene-technology.webp',
  kannan: '/assets/images/our-story/kannan-bs.webp',
  ganeish: '/assets/images/our-story/ganeish-ratanam.webp'
} as const;

interface TapeProps {
  className?: string;
}

function Tape({ className = '' }: TapeProps) {
  return <span className={`story-tape ${className}`} aria-hidden="true" />;
}

function PaperClip({ className = '' }: TapeProps) {
  return <span className={`story-paperclip ${className}`} aria-hidden="true" />;
}

interface StickyNoteProps {
  children: ReactNode;
  className?: string;
}

function StickyNote({ children, className = '' }: StickyNoteProps) {
  return <aside className={`story-sticky ${className}`}>{children}</aside>;
}

interface StoryFrameProps {
  alt: string;
  caption: ReactNode;
  checklist: string[];
  image: string;
  scene: string;
  shot: string;
  title: ReactNode;
  tone: 'coral' | 'mustard' | 'blue';
}

function StoryFrame({
  alt,
  caption,
  checklist,
  image,
  scene,
  shot,
  title,
  tone
}: StoryFrameProps) {
  return (
    <article className={`story-frame story-frame--${tone}`} data-story-frame>
      <div className="story-frame__heading">
        <span className="story-frame__scene">{scene}</span>
        <h3>{title}</h3>
        <span className="story-frame__shot">{shot}</span>
      </div>

      <figure className="story-frame__picture">
        <Tape className="story-tape--left" />
        <Tape className="story-tape--right" />
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          width="1000"
          height="596"
        />
        <figcaption className="torn-caption">
          {caption}
          <span className="caption-star" aria-hidden="true">☆</span>
        </figcaption>
      </figure>

      <StickyNote className="story-frame__checklist">
        {checklist.map((item) => (
          <span key={item}>☑ {item}</span>
        ))}
      </StickyNote>
    </article>
  );
}

interface FounderProfileProps {
  alt: string;
  bio: string;
  className: string;
  focusAreas: string[];
  image: string;
  name: string;
  role: string;
}

function FounderProfile({
  alt,
  bio,
  className,
  focusAreas,
  image,
  name,
  role
}: FounderProfileProps) {
  return (
    <article className={`founder-profile ${className}`} data-founder>
      <header className="founder-profile__header">
        <span className="founder-crown" aria-hidden="true">♕</span>
        <h3>{name}</h3>
        <p>{role}</p>
      </header>

      <p className="founder-profile__bio">{bio}</p>

      <figure className="founder-profile__portrait">
        <Tape />
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          width="1080"
          height="990"
        />
      </figure>

      <aside className="founder-focus">
        <PaperClip />
        <h4>Focus Areas</h4>
        <ul>
          {focusAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </aside>
    </article>
  );
}

function OpeningCover() {
  return (
    <section className="story-cover" aria-labelledby="our-story-title">
      <div className="story-curtain" aria-hidden="true" />
      <h1 id="our-story-title" className="story-visually-hidden">Our Story</h1>
      <p className="story-visually-hidden">
        Every great company starts with an idea. Ours started with hundreds.
      </p>

      <div className="story-cover__stage" data-cover-stage>
        <img
          className="story-cover__photo"
          data-cover-photo
          src={storyAssets.cover}
          alt="A cream spiral-bound sketchbook on a warmly lit wooden desk. The page reads: Our Story. Every great company starts with an idea. Ours started with hundreds. Chapter 1."
          width="1600"
          height="962"
          fetchPriority="high"
          decoding="sync"
        />
        <span className="cover-underline" aria-hidden="true" />
        <span className="cover-ink-star" aria-hidden="true">☆</span>
        <span className="cover-sunbeam" aria-hidden="true" />
      </div>

      <div className="story-cover__mobile-copy" aria-hidden="true">
        <span className="mobile-cover-star">☆</span>
        <strong>Our Story</strong>
        <span className="mobile-cover-underline" />
        <p>
          Every great company<br />starts with an idea.<br />
          Ours started with <em>hundreds.</em>
        </p>
        <span className="mobile-chapter-tab">Chapter 1</span>
      </div>

      <a className="story-scroll-cue" href="#chapter-one" aria-label="Continue to chapter one">
        <span>Turn the page</span>
        <i aria-hidden="true">↓</i>
      </a>
    </section>
  );
}

function StoryboardChapter() {
  return (
    <section className="storyboard-section" id="chapter-one" aria-labelledby="chapter-one-title">
      <div className="storyboard-sheet" data-storyboard-sheet>
        <span className="story-spiral" aria-hidden="true" />
        <PaperClip className="storyboard-paperclip" />

        <header className="storyboard-heading" data-storyboard-heading>
          <p>Storyboard 01</p>
          <h2 id="chapter-one-title">Chapter 1: Two Dreamers, Two Paths <span aria-hidden="true">☆</span></h2>
          <span>Every journey begins with a page of ideas.</span>
        </header>

        <StickyNote className="storyboard-thesis">
          <strong>Two minds.</strong>
          <span>One future.</span>
          <i aria-hidden="true">☆</i>
        </StickyNote>

        <div className="storyboard-track" data-storyboard-track>
          <StoryFrame
            alt="Two anime-style students in different sides of a warm classroom, one sketching and the other coding."
            caption={<>Two different classrooms.<br />Different notebooks.<br /><strong>Same habit.</strong></>}
            checklist={['Idea', 'Dream', 'Passion']}
            image={storyAssets.classroom}
            scene="Scene 1"
            shot="Wide shot"
            title="Different Classrooms"
            tone="coral"
          />
          <StoryFrame
            alt="An anime-style design student sketching interfaces beside brand marks, wireframes, and color swatches."
            caption={<>One saw the world through<br /><strong>design, brands, and experiences.</strong></>}
            checklist={['Sketch', 'Imagine', 'Create']}
            image={storyAssets.design}
            scene="Scene 2"
            shot="Medium shot"
            title={<>One Saw the World<br />Through Design</>}
            tone="mustard"
          />
          <StoryFrame
            alt="An anime-style technology student working beside code screens, system diagrams, and an AI model sketch."
            caption={<>The other saw everything<br />through <strong>technology, systems, and logic.</strong></>}
            checklist={['Logic', 'Build', 'Solve']}
            image={storyAssets.technology}
            scene="Scene 3"
            shot="Medium shot"
            title={<>The Other Saw Everything<br />Through Technology</>}
            tone="blue"
          />
        </div>

        <footer className="storyboard-footer" aria-hidden="true">
          <span>Storyboard 02</span>
          <i />
          <span>the paths begin to cross…</span>
        </footer>
      </div>
    </section>
  );
}

function FoundersChapter() {
  return (
    <section className="founders-section" id="founders" aria-labelledby="founders-title">
      <div className="founder-spread" data-founder-spread>
        <span className="founder-spread__pin founder-spread__pin--left" aria-hidden="true" />
        <span className="founder-spread__pin founder-spread__pin--right" aria-hidden="true" />

        <header className="founders-heading" data-founders-heading>
          <span>Meet Our Story’s</span>
          <h2 id="founders-title">Main Characters</h2>
          <p>and the Founders</p>
        </header>

        <div className="founder-layout">
          <FounderProfile
            alt="Illustrated portrait of Kannan B S at a desk, drawing in a notebook beside a laptop and software planning notes."
            bio="Kannan sees every problem as a system waiting to be improved. He enjoys breaking complex challenges into simple, scalable digital solutions through software, automation, and technology."
            className="founder-profile--tech"
            focusAreas={[
              'ERP Software',
              'Custom Software',
              'AI Automation',
              'System Architecture',
              'Web Development',
              'Business Solutions'
            ]}
            image={storyAssets.kannan}
            name="Kannan B S"
            role="The Tech Architect"
          />

          <aside className="founder-story-note" data-narrative-note>
            <Tape />
            <PaperClip />
            <p>One imagined<br />what products<br />could look like.</p>
            <span />
            <p>The other figured out<br />how to build them.</p>
            <strong>Together,<br />they became<br /><em>Rough Note.</em></strong>
            <i className="founder-arrow" aria-hidden="true" />
          </aside>

          <FounderProfile
            alt="Illustrated portrait of Ganeish Ratanam smiling at a desk while sketching an interface beside branding books and design notes."
            bio="Ganeish sees every challenge as an opportunity to create meaningful experiences. His passion lies in branding, visual identity, user experience, and transforming rough ideas into designs that people remember."
            className="founder-profile--design"
            focusAreas={[
              'Brand Identity',
              'UI/UX Design',
              'Website Design',
              'Motion Graphics',
              'Creative Direction',
              'Visual Storytelling'
            ]}
            image={storyAssets.ganeish}
            name="Ganeish Ratanam"
            role="The Design Thinker"
          />
        </div>

        <aside className="tech-code-note" data-tech-note aria-label="Kannan's build philosophy">
          <code>
            function solve(problem)&#123;<br />
            &nbsp;&nbsp;think();<br />
            &nbsp;&nbsp;plan();<br />
            &nbsp;&nbsp;build();<br />
            &nbsp;&nbsp;optimize();<br />
            &nbsp;&nbsp;return solution;<br />
            &#125;
          </code>
        </aside>

        <aside className="design-swatches" data-design-note aria-label="Ganeish's color palette">
          <span /><span /><span /><span /><span />
        </aside>

        <aside className="impact-note" data-design-note>
          ideas → sketches<br />→ design<br />→ impact
        </aside>

        <footer className="rough-note-signature" data-signature>
          <PaperClip />
          <span className="signature-crown" aria-hidden="true">♕</span>
          <strong>Rough Note</strong>
          <i />
          <p>Ideas. Designed. Built. For Impact.</p>
        </footer>
      </div>
    </section>
  );
}

function useStoryMotion(rootRef: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      root.classList.add('story-reduced-motion');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
      intro
        .to('.story-curtain', { autoAlpha: 0, duration: 1.05 })
        .from('[data-cover-stage]', { scale: 1.045, duration: 1.8 }, 0.18)
        .from('.cover-underline', { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, 0.72)
        .from('.cover-ink-star', { autoAlpha: 0, rotate: -20, scale: 0.2, duration: 0.5, ease: 'back.out(2)' }, 1.15)
        .from('.story-scroll-cue', { autoAlpha: 0, y: 12, duration: 0.55 }, 1.35);

      gsap.to('[data-cover-photo]', {
        scale: 1.075,
        yPercent: 2.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.story-cover',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      });

      gsap.from('[data-storyboard-sheet]', {
        rotateY: -9,
        xPercent: 10,
        transformOrigin: 'left center',
        autoAlpha: 0,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.storyboard-section',
          start: 'top 78%'
        }
      });

      gsap.from('[data-storyboard-heading]', {
        y: 22,
        autoAlpha: 0,
        duration: 0.65,
        scrollTrigger: {
          trigger: '[data-storyboard-heading]',
          start: 'top 82%'
        }
      });

      gsap.from('[data-story-frame]', {
        y: 62,
        rotate: (index) => [-2.5, 1.4, -1.6][index] ?? 0,
        scale: 0.94,
        autoAlpha: 0,
        stagger: 0.18,
        duration: 0.78,
        ease: 'back.out(1.35)',
        scrollTrigger: {
          trigger: '[data-storyboard-track]',
          start: 'top 76%'
        }
      });

      gsap.from('[data-founders-heading]', {
        clipPath: 'inset(0 50% 0 50%)',
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '[data-founders-heading]',
          start: 'top 82%'
        }
      });

      gsap.from('[data-founder] .founder-profile__portrait', {
        clipPath: 'inset(100% 0 0 0)',
        y: 90,
        stagger: 0.18,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.founder-layout',
          start: 'top 72%'
        }
      });

      gsap.from('[data-narrative-note]', {
        y: -45,
        rotate: -4,
        scale: 0.88,
        autoAlpha: 0,
        duration: 0.82,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: '[data-narrative-note]',
          start: 'top 78%'
        }
      });

      gsap.from('[data-tech-note], [data-design-note]', {
        y: 28,
        rotate: (index) => index % 2 === 0 ? -4 : 4,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.62,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.founder-layout',
          start: 'center 76%'
        }
      });

      gsap.from('[data-signature]', {
        y: 38,
        scale: 0.92,
        rotate: 2,
        autoAlpha: 0,
        duration: 0.75,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '[data-signature]',
          start: 'top 90%'
        }
      });

      media.add('(min-width: 901px)', () => {
        gsap.fromTo('[data-storyboard-track]', { xPercent: 2.5 }, {
          xPercent: -2.5,
          ease: 'none',
          scrollTrigger: {
            trigger: '.storyboard-section',
            start: 'top 55%',
            end: 'bottom 45%',
            scrub: 0.8
          }
        });

        gsap.to('[data-tech-note]', {
          yPercent: -13,
          ease: 'none',
          scrollTrigger: {
            trigger: '.founders-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9
          }
        });

        gsap.to('[data-design-note]', {
          yPercent: 11,
          ease: 'none',
          scrollTrigger: {
            trigger: '.founders-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9
          }
        });
      });
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, [rootRef]);
}

export function AboutPage() {
  const mainRef = useRef<HTMLElement>(null);
  useStoryMotion(mainRef);

  return (
    <>
      <SketchFilters />
      <SiteLayout activeItem="about" pageLabel="Page 02" pageTitle="Our Story">
        <main ref={mainRef} className="our-story-page" data-rough-anchor="about-page">
          <OpeningCover />
          <StoryboardChapter />
          <FoundersChapter />
        </main>
      </SiteLayout>
    </>
  );
}
