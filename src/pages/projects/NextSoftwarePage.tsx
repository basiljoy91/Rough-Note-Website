import './next-software-page.global.css';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { RoughNoteDrawingFeature } from '../../features/rough-note-drawing/RoughNoteDrawingFeature';
import { isTransitionPreviewDocument } from '../../shared/navigation/transitionState';

gsap.registerPlugin(MotionPathPlugin);

export function NextSoftwarePage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [flightComplete, setFlightComplete] = useState(false);

  const flyPlane = useCallback(() => {
    const scene = sceneRef.current;
    const plane = planeRef.current;
    if (!scene || !plane) return;

    const width = scene.clientWidth;
    const height = scene.clientHeight;
    const compact = width < 620;

    gsap.killTweensOf(plane);
    setFlightComplete(false);
    gsap.set(plane, {
      autoAlpha: 1,
      rotation: -13,
      scale: compact ? 0.72 : 0.94,
      x: compact ? -82 : -130,
      y: height * (compact ? 0.7 : 0.68)
    });

    gsap.to(plane, {
      duration: compact ? 4.35 : 5.15,
      ease: 'power1.inOut',
      motionPath: {
        autoRotate: true,
        curviness: 1.55,
        path: compact
          ? [
              { x: width * 0.08, y: height * 0.42 },
              { x: width * 0.38, y: height * 0.55 },
              { x: width * 0.62, y: height * 0.29 },
              { x: width * 0.86, y: height * 0.42 },
              { x: width + 95, y: height * 0.13 }
            ]
          : [
              { x: width * 0.12, y: height * 0.3 },
              { x: width * 0.35, y: height * 0.53 },
              { x: width * 0.58, y: height * 0.2 },
              { x: width * 0.78, y: height * 0.36 },
              { x: width + 150, y: height * 0.08 }
            ]
      },
      onComplete: () => setFlightComplete(true)
    });
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const plane = planeRef.current;
    if (!scene || !plane) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || isTransitionPreviewDocument()) {
      gsap.set(plane, {
        autoAlpha: 1,
        rotation: -10,
        scale: scene.clientWidth < 620 ? 0.72 : 0.94,
        x: scene.clientWidth * 0.76,
        y: scene.clientHeight * 0.16
      });
      const announceFrame = window.requestAnimationFrame(() => {
        setFlightComplete(true);
      });
      return () => window.cancelAnimationFrame(announceFrame);
    }

    const launch = gsap.delayedCall(0.45, flyPlane);
    return () => {
      launch.kill();
      gsap.killTweensOf(plane);
    };
  }, [flyPlane]);

  return (
    <>
      <SiteLayout
        activeItem="next"
        mobileCtaLabel="Share Your Next Idea"
        pageLabel="Page 07"
        pageTitle="Coming Soon"
      >
        <main
          className={`next-software${flightComplete ? ' next-software--landed' : ''}`}
          data-rough-anchor="next-software"
          aria-labelledby="next-software-title"
        >
          <div className="next-software__scene" ref={sceneRef}>
            <div className="next-software__sun" aria-hidden="true">
              <span />
            </div>

            <div className="next-software__cloud next-software__cloud--one" aria-hidden="true"><i /><i /><i /></div>
            <div className="next-software__cloud next-software__cloud--two" aria-hidden="true"><i /><i /><i /></div>
            <div className="next-software__cloud next-software__cloud--three" aria-hidden="true"><i /><i /><i /></div>

            <div className="next-software__flight-path" aria-hidden="true">
              <span className="next-software__dash next-software__dash--one" />
              <span className="next-software__dash next-software__dash--two" />
              <span className="next-software__dash next-software__dash--three" />
              <span className="next-software__go-note">ready... set... go!</span>
            </div>

            <div className="next-software__plane" ref={planeRef} aria-hidden="true">
              <span className="next-software__plane-top" />
              <span className="next-software__plane-bottom" />
              <span className="next-software__plane-fold" />
            </div>

            <span className="next-software__whoosh" aria-hidden="true">whoosh!</span>

            <section className="next-software__note">
              <span className="next-software__tape" aria-hidden="true" />
              <span className="next-software__pin" aria-hidden="true" />
              <p className="next-software__eyebrow">NEXT SOFTWARE · FLIGHT 01</p>
              <h1 id="next-software-title">
                Coming <em>Soon!</em>
              </h1>
              <p className="next-software__intro">
                We&apos;re folding the final corners of something smart,
                useful and delightfully simple.
              </p>
              <div className="next-software__status" aria-label="Currently in the workshop">
                <span className="next-software__status-dot" aria-hidden="true" />
                Currently in the workshop
                <span className="next-software__dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
              <div className="next-software__actions">
                <button type="button" onClick={flyPlane}>
                  <span aria-hidden="true">↻</span> Fly it again
                </button>
                <a href="/html/contact.html">
                  Share your rough note <span aria-hidden="true">→</span>
                </a>
              </div>
            </section>

            <aside className="next-software__route-note" aria-label="Flight plan">
              <span aria-hidden="true" />
              <strong>Flight plan</strong>
              <p>rough idea</p>
              <i aria-hidden="true">↓</i>
              <p>smart build</p>
              <i aria-hidden="true">↓</i>
              <p>ready for takeoff</p>
            </aside>

            <aside className="next-software__secret-note">
              <strong>TOP SECRET</strong>
              <span>shhh... the next big idea is still sketching itself.</span>
            </aside>

            <p className="next-software__arrival" aria-live="polite">
              {flightComplete
                ? 'The paper plane has taken off. More is coming soon.'
                : 'Paper plane taking off.'}
            </p>
          </div>
        </main>
      </SiteLayout>
      <RoughNoteDrawingFeature />
    </>
  );
}
