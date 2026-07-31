import { gsap } from 'gsap';

export class Preloader {
    constructor() {
        this.preloaderEl = document.getElementById('preloader');
        this.bodyEl = document.body;
        
        // Ensure scrolling is prevented immediately on init
        this.lockScroll();
        this.resolveLogo();
    }

    resolveLogo() {
        const logoImg = document.getElementById('notebook-logo');
        if (!logoImg) return;

        // Use the single correct asset directly to prevent 404 errors
        logoImg.src = '/assets/logo/RoughNote.jpeg';
        logoImg.style.mixBlendMode = 'screen';
    }

    lockScroll() {
        this.bodyEl.classList.add('no-scroll');
    }

    unlockScroll() {
        this.bodyEl.classList.remove('no-scroll');
    }

    hide() {
        if (!this.preloaderEl) return;
        this.preloaderEl.style.opacity = '0';
        this.preloaderEl.style.visibility = 'hidden';
        this.unlockScroll();

        // Clean up infinite background animations to prevent memory leaks
        if (this.cameraDrift) {
            this.cameraDrift.kill();
            this.cameraDrift = null;
        }
    }

    playIntro() {
        if (typeof gsap === 'undefined') return;

        // Prevent memory leaks by killing existing timelines before recreation
        if (this.masterTimeline) this.masterTimeline.kill();
        if (this.cameraDrift) this.cameraDrift.kill();

        this.masterTimeline = gsap.timeline();
        const tl = this.masterTimeline;

        // 0.0s: Setup completely black screen and hidden objects
        gsap.set(this.preloaderEl, { backgroundColor: '#000000' });
        
        // Optimizing by enabling hardware acceleration on the most heavily animated elements
        gsap.set('.preloader__scene, .preloader__notebook, .notebook__cover, .desk__surface', { 
            willChange: 'transform, opacity' 
        });

        // Setup clean, static fully visible initial states for the 2-second hold
        gsap.set('.desk__surface', { opacity: 1 });
        gsap.set('.desk__shadow-layer', { opacity: 1 });
        gsap.set('.desk-item', { opacity: 1 }); // Kept static
        gsap.set('.preloader__notebook', { opacity: 1, y: 0, z: 0 }); // Fully visible hero shot
        gsap.set('.notebook__logo', { opacity: 0.85 });
        
        // Setup initial parallax depths based on logical distance (static)
        gsap.set('.desk-item--coffee', { z: -5 });
        gsap.set('.desk-item--paper-1, .desk-item--paper-2', { z: -35 });

        // Extremely subtle cinematic camera drift starts ONLY after the 2-second hold
        this.cameraDrift = gsap.to('.preloader__scene', {
            x: -12,
            y: 8,
            rotationZ: 0.5,
            rotationX: 1.5,
            rotationY: -2,
            duration: 8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2.0
        });

        // ========================================================
        // 1. CINEMATIC CAMERA DOLLY-IN (Duration: 2.0s)
        // ========================================================
        
        // Exact 2-second completely static hold for the premium hero shot
        const dollyStart = 2.0; 

        // Animate ONLY the scene and the notebook. Smooth cinematic ease.
        tl.to('.preloader__scene', { scale: 1.38, x: '2vw', y: '12vh', rotationX: 2, rotationZ: 1, duration: 2.0, ease: "power2.inOut" }, dollyStart);
        tl.to('.preloader__notebook', { rotationZ: 0, z: 40, duration: 2.0, ease: "power2.inOut" }, dollyStart);

        // ========================================================
        // 2. REALISTIC NOTEBOOK OPENING (Duration: 2.5s)
        // ========================================================

        // Starts seamlessly as the camera settles
        const openStart = 4.0;

        tl.to('.notebook__cover', { rotationY: -175, duration: 2.5, ease: "power3.inOut" }, openStart);
        tl.to('.cover-cast-shadow', { scaleX: 0, opacity: 0, duration: 2.5, ease: "power3.inOut" }, openStart);
        tl.to('.preloader__scene', { scale: "+=0.04", duration: 2.5, ease: "power3.inOut" }, openStart);

        // ========================================================
        // 3. INTO THE HOMEPAGE TRANSITION (Duration: 2.0s)
        // ========================================================

        // Starts 150ms after the HOME title finishes fading in (6.5s start + 0.35s fade + 0.15s pause = 7.0s)
        const diveStart = 7.0;

        tl.to('.preloader__scene', { 
            scale: 15, 
            x: '-35vw', 
            y: '5vh', 
            rotationX: 0, 
            rotationZ: 0, 
            duration: 2.0, 
            ease: "sine.inOut"
        }, diveStart);
        tl.to('.page__ruled-lines', { opacity: 0, duration: 1.0, ease: "power2.inOut" }, diveStart + 0.5);

        // 4. HOMEPAGE REVEAL (Duration: 0.5s)
        tl.to(this.preloaderEl, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                this.hide();
                document.body.classList.remove('no-scroll');
                
                // Seamlessly transition to Muskan's homepage
                // Using replace() prevents the back button from replaying the animation
                window.location.replace('./html/index.html?animated=true');
            }
        }, diveStart + 1.5);


    }
}
