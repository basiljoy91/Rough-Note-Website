document.addEventListener("DOMContentLoaded", () => {
    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    // Main Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Add visible class to trigger CSS transitions
                target.classList.add('visible');
                
                // Animate Marker Circles (SVG path drawing)
                const markerCircles = target.querySelectorAll('.marker-circle path');
                markerCircles.forEach((circle, index) => {
                    setTimeout(() => {
                        circle.style.strokeDashoffset = '0';
                    }, 400 + (index * 200));
                });

                // Animate Notebook Checkmarks
                if (target.classList.contains('reveal-notebook')) {
                    const checks = target.querySelectorAll('.check-svg path');
                    checks.forEach((check, index) => {
                        setTimeout(() => {
                            check.style.strokeDashoffset = '0';
                        }, 800 + (index * 150));
                    });
                }

                // Animate Timeline Items
                if (target.classList.contains('journey-container')) {
                    const timelineElements = target.querySelectorAll('.timeline-item, .timeline-arrow');
                    timelineElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0) rotate(0)';
                            
                            // Restore original rotation for mobile arrows if needed via CSS classes,
                            // but CSS handles the base transform.
                            // Here we just clear the inline transform to let CSS take over.
                            el.style.transform = ''; 
                        }, index * 150);
                    });
                }

                // Unobserve after animating once
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Select elements to observe
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll, .reveal-notebook, .journey-container');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });
});
