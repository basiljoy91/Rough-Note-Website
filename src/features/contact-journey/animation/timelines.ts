import { gsap } from 'gsap';

const OPEN_EASE = 'power3.out';
const SETTLE_EASE = 'back.out(1.12)';

function timelinePromise(timeline: gsap.core.Timeline): Promise<void> {
  return new Promise((resolve) => {
    timeline.eventCallback('onComplete', resolve);
  });
}

export function prefersReducedContactMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function unfoldChallengePaper(
  root: HTMLElement,
  reducedMotion = prefersReducedContactMotion()
): Promise<void> {
  const stage = root.querySelector<HTMLElement>('[data-paper-ball]');
  if (!stage) return Promise.resolve();
  const realisticBall = stage.querySelector<HTMLElement>('[data-realistic-ball]');
  const facetStage = stage.querySelector<HTMLElement>('[data-facet-stage]');

  if (facetStage) {
    gsap.set(facetStage, { opacity: 0 });
  }

  const facets = Array.from(
    stage.querySelectorAll<HTMLElement>('[data-paper-facet]')
  );
  const surrounding = root.querySelectorAll<HTMLElement>(
    '[data-step-one-surrounding], [class*="noPressureNote"], [class*="ideaExplanation"]'
  );
  const arrows = root.querySelectorAll<HTMLElement>('[class*="ballArrow"]');
  const stamp = stage.querySelector<HTMLElement>('[data-rn-stamp]');
  const formImpression =
    stage.querySelector<HTMLElement>('[data-unfold-content]');
  const crumpleShards = stage.querySelectorAll<HTMLElement>(
    '[data-crumple-shard]'
  );
  const availableWidth = Math.min(
    780,
    Math.max(300, document.documentElement.clientWidth - 80)
  );
  const availableHeight = Math.min(590, availableWidth * 0.74);

  if (reducedMotion) {
    const timeline = gsap.timeline();
    timeline
      .to(surrounding, { opacity: 0, duration: 0.08 })
      .to(stage, {
        width: availableWidth,
        height: availableHeight,
        borderRadius: '2%',
        scale: 1,
        duration: 0.14,
        ease: 'power1.out'
      });
    if (formImpression) {
      timeline.to(formImpression, { opacity: 0.34, duration: 0.06 }, 0.12);
    }
    timeline.to(crumpleShards, { opacity: 0, duration: 0.06 }, 0.08);
    if (realisticBall && facetStage) {
      timeline
        .to(realisticBall, { opacity: 0, duration: 0.08 }, 0)
        .to(facetStage, { opacity: 1, duration: 0.08 }, 0);
    } else if (facetStage) {
      timeline.set(facetStage, { opacity: 1 }, 0);
    }
    return timelinePromise(timeline);
  }

  const timeline = gsap.timeline();

  if (realisticBall && facetStage) {
    timeline
      .to(realisticBall, { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, 0.32)
      .to(facetStage, { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 0.32);
  } else if (facetStage) {
    timeline.set(facetStage, { opacity: 1 }, 0);
  }

  timeline
    .to(surrounding, {
      autoAlpha: 0,
      x: (index) => (index % 2 === 0 ? -28 : 28),
      duration: 0.35,
      stagger: 0.035,
      ease: 'power2.in'
    }, 0)
    .to(
      arrows,
      {
        strokeDashoffset: 120,
        autoAlpha: 0,
        duration: 0.34,
        stagger: 0.04,
        ease: 'power1.in'
      },
      0.04
    )
    .to(
      stage,
      {
        y: -24,
        rotate: 8,
        rotateX: -7,
        rotateY: 12,
        scale: 1.08,
        transformPerspective: 1200,
        duration: 0.42,
        ease: 'power2.out'
      },
      0.15
    )
    .to(stage, {
      width: availableWidth,
      height: availableHeight,
      borderRadius: '2%',
      rotate: 0,
      rotateX: 0,
      rotateY: 0,
      y: -30,
      duration: 1.6,
      ease: OPEN_EASE
    }, 0.42);

  if (facetStage) {
    timeline.to(
      facetStage,
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.45,
        ease: OPEN_EASE
      },
      0.42
    );
  }

  facets.forEach((facet, index) => {
    timeline.fromTo(
      facet,
      {
        transform: facet.style.getPropertyValue('--facet-initial-transform'),
        filter: `drop-shadow(0 8px 6px rgb(61 43 23 / ${
          0.18 + (index % 4) * 0.03
        }))`
      },
      {
        transform: facet.style.getPropertyValue('--facet-final-transform'),
        filter: 'drop-shadow(0 1px 1px rgb(61 43 23 / 8%))',
        duration: 1.05,
        ease: OPEN_EASE
      },
      0.42 + (index % 5) * 0.12
    );
  });

  timeline.to(
    crumpleShards,
    {
      opacity: 0,
      scale: 1.08,
      duration: 0.62,
      stagger: 0.025,
      ease: 'power2.in'
    },
    0.62
  );

  if (stamp) {
    timeline.fromTo(
      stamp,
      { scale: 0.72, rotate: -16 },
      { scale: 1, rotate: -2, duration: 1.35, ease: OPEN_EASE },
      0.62
    );
  }

  if (formImpression) {
    timeline.to(
      formImpression,
      { opacity: 0.38, duration: 0.48, ease: 'power1.out' },
      1.72
    );
  }

  timeline
    .to(stage, {
      y: 0,
      scale: 1.015,
      duration: 0.32,
      ease: SETTLE_EASE
    }, 2.1)
    .to(stage, { scale: 1, duration: 0.22, ease: 'power1.out' }, 2.36);

  return timelinePromise(timeline);
}

export function foldChallengeIntoContact(
  root: HTMLElement,
  reducedMotion = prefersReducedContactMotion()
): Promise<void> {
  const form = root.querySelector<HTMLElement>('[data-step-two-form]');
  if (!form) return Promise.resolve();
  const fields = form.querySelectorAll<HTMLElement>(
    'select, textarea, [class*="uploadComposition"], [class*="supportedFiles"]'
  );
  const leftFold = form.querySelector<HTMLElement>('[data-fold-edge="left"]');
  const rightFold = form.querySelector<HTMLElement>('[data-fold-edge="right"]');
  const topFold = form.querySelector<HTMLElement>('[data-fold-edge="top"]');
  const bottomFold = form.querySelector<HTMLElement>('[data-fold-edge="bottom"]');
  const foldThickness =
    form.querySelector<HTMLElement>('[data-fold-thickness]');
  const creases = form.querySelector<HTMLElement>('[class*="formCreases"]');

  if (reducedMotion) {
    const timeline = gsap.timeline();
    timeline.to(form, { opacity: 0, scale: 0.97, duration: 0.18 });
    return timelinePromise(timeline);
  }

  const timeline = gsap.timeline();
  timeline
    .to(fields, {
      color: '#17130f',
      duration: 0.18,
      stagger: 0.025
    })
    .to(creases, { opacity: 0.7, duration: 0.2 }, 0.1)
    .set([leftFold, rightFold, topFold, bottomFold], {
      autoAlpha: 1,
      transformPerspective: 1200
    }, 0.18)
    .to(
      leftFold,
      {
        rotateY: -72,
        x: '18%',
        duration: 0.54,
        ease: 'power2.inOut'
      },
      0.2
    )
    .to(
      rightFold,
      {
        rotateY: 74,
        x: '-18%',
        duration: 0.58,
        ease: 'power2.inOut'
      },
      0.24
    )
    .to(
      topFold,
      {
        rotateX: 70,
        y: '12%',
        duration: 0.47,
        ease: 'power2.inOut'
      },
      0.52
    )
    .to(
      bottomFold,
      {
        rotateX: -68,
        y: '-12%',
        duration: 0.5,
        ease: 'power2.inOut'
      },
      0.57
    )
    .to(foldThickness, { opacity: 0.82, duration: 0.2 }, 0.64)
    .to(form, {
      '--fold-shadow': '0 18px 28px rgb(45 30 17 / 24%)',
      clipPath: 'polygon(12% 0, 88% 0, 91% 100%, 9% 100%)',
      scaleX: 0.88,
      rotateY: 8,
      duration: 0.52,
      ease: 'power2.inOut'
    }, 0.42)
    .to(form, {
      clipPath:
        'polygon(18% 0, 82% 0, 85% 8%, 83% 18%, 87% 29%, 84% 42%, 88% 54%, 84% 68%, 87% 82%, 82% 100%, 15% 100%, 12% 86%, 16% 71%, 12% 57%, 16% 43%, 12% 29%, 15% 14%)',
      scaleX: 0.72,
      rotateY: -5,
      rotateZ: -1.2,
      duration: 0.78,
      ease: OPEN_EASE
    }, 0.84)
    .to(form, {
      y: 18,
      scale: 0.76,
      opacity: 0,
      duration: 0.48,
      ease: 'power2.in'
    }, 1.42);
  return timelinePromise(timeline);
}

export function sealContactEnvelope(
  root: HTMLElement,
  reducedMotion = prefersReducedContactMotion()
): Promise<void> {
  const formPaper = root.querySelector<HTMLElement>('[data-torn-form-paper]');
  const envelope = root.querySelector<HTMLElement>('[data-envelope-preview]');
  if (!formPaper || !envelope) return Promise.resolve();

  const back = envelope.querySelector<HTMLElement>('[data-envelope-back]');
  const left = envelope.querySelector<HTMLElement>('[data-envelope-left]');
  const right = envelope.querySelector<HTMLElement>('[data-envelope-right]');
  const bottom = envelope.querySelector<HTMLElement>('[data-envelope-bottom]');
  const flap = envelope.querySelector<HTMLElement>('[data-envelope-flap]');
  const string = envelope.querySelector<HTMLElement>('[data-string-wrap]');
  const stringHorizontal = envelope.querySelector<HTMLElement>(
    '[class*="stringHorizontal"]'
  );
  const stringVertical = envelope.querySelector<HTMLElement>(
    '[class*="stringVertical"]'
  );
  const wax = envelope.querySelector<HTMLElement>('[data-wax-seal]');
  const waxImpression =
    envelope.querySelector<HTMLElement>('[data-wax-impression]');
  const sealPress = envelope.querySelector<HTMLElement>('[data-seal-press]');
  const received = envelope.querySelector<HTMLElement>('[data-received-stamp]');

  if (reducedMotion) {
    const timeline = gsap.timeline();
    timeline
      .to(formPaper, { opacity: 0, scale: 0.92, duration: 0.12 })
      .to(envelope, { autoAlpha: 1, scale: 1, duration: 0.12 });
    return timelinePromise(timeline);
  }

  gsap.set(envelope, { autoAlpha: 1 });
  gsap.set([back, left, right, bottom, flap], { transformPerspective: 1200 });
  gsap.set(string, { opacity: 0, scale: 0.85 });
  gsap.set(stringHorizontal, { scaleX: 0, transformOrigin: '0 50%' });
  gsap.set(stringVertical, { scaleY: 0, transformOrigin: '50% 0' });
  gsap.set(wax, { opacity: 0, scale: 0.08 });
  gsap.set(waxImpression, { opacity: 0 });
  gsap.set(sealPress, { opacity: 0, y: -72, scale: 1.08 });
  gsap.set(received, { opacity: 0, scale: 1.6, rotate: -11 });

  const timeline = gsap.timeline();
  timeline
    .to(formPaper, {
      y: -26,
      rotateX: -4,
      duration: 0.35,
      ease: 'power2.out'
    })
    .to(formPaper, {
      scaleY: 0.58,
      y: 28,
      transformOrigin: '50% 100%',
      duration: 0.45,
      ease: 'power2.inOut'
    })
    .to(formPaper, {
      scaleX: 0.54,
      opacity: 0,
      duration: 0.42,
      ease: 'power2.in'
    })
    .fromTo(back, { rotateX: 82 }, { rotateX: 0, duration: 0.34 }, 0.74)
    .fromTo(left, { rotateY: -82 }, { rotateY: 0, duration: 0.42 }, 0.9)
    .fromTo(right, { rotateY: 82 }, { rotateY: 0, duration: 0.42 }, 1.02)
    .fromTo(bottom, { rotateX: 78 }, { rotateX: 0, duration: 0.42 }, 1.12)
    .fromTo(flap, { rotateX: -92 }, { rotateX: 0, duration: 0.52, ease: 'power2.inOut' }, 1.32)
    .to(string, { opacity: 1, scale: 1, duration: 0.18 }, 1.7)
    .to(stringHorizontal, { scaleX: 1, duration: 0.28, ease: 'power2.out' }, 1.72)
    .to(stringVertical, { scaleY: 1, duration: 0.31, ease: 'power2.out' }, 1.86)
    .to(
      wax,
      {
        opacity: 1,
        scale: 0.72,
        duration: 0.18,
        ease: 'power2.out'
      },
      2.04
    )
    .to(wax, { scale: 1.12, duration: 0.24, ease: 'power2.out' }, 2.18)
    .to(
      sealPress,
      {
        opacity: 1,
        y: -18,
        scale: 1,
        duration: 0.26,
        ease: 'power2.in'
      },
      2.08
    )
    .to(
      sealPress,
      {
        y: 0,
        scale: 0.94,
        duration: 0.16,
        ease: 'power2.in'
      },
      2.31
    )
    .to(wax, { scale: 1, duration: 0.2, ease: SETTLE_EASE }, 2.34)
    .to(waxImpression, { opacity: 0.9, duration: 0.12 }, 2.38)
    .to(
      sealPress,
      {
        y: -78,
        opacity: 0,
        scale: 1.04,
        duration: 0.32,
        ease: 'power2.out'
      },
      2.5
    )
    .to(
      received,
      {
        opacity: 0.85,
        scale: 1,
        rotate: -9,
        duration: 0.26,
        ease: 'power3.out'
      },
      2.72
    );
  return timelinePromise(timeline);
}

export function reversePaperStep(
  root: HTMLElement,
  reducedMotion = prefersReducedContactMotion()
): Promise<void> {
  const shell = root.querySelector<HTMLElement>('[data-step]');
  if (!shell) return Promise.resolve();
  const timeline = gsap.timeline();
  timeline.to(shell, {
    opacity: 0,
    scale: reducedMotion ? 0.99 : 0.96,
    rotateY: reducedMotion ? 0 : -4,
    duration: reducedMotion ? 0.12 : 0.34,
    ease: 'power2.in'
  });
  return timelinePromise(timeline);
}
