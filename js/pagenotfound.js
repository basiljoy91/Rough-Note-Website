/**
 * pagenotfound.js
 * JavaScript for the RoughNote 404 page.
 * Handles the "Back to Home" button and subtle interactive effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Redirect button logic
    const backHomeBtn = document.getElementById('backHomeBtn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add a small click animation effect before redirecting
            backHomeBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                window.location.href = '/'; // Adjust if index.html is at a different relative path
            }, 150);
        });
    }

    // Optional: Add subtle parallax or mousemove effect on the sticky notes and coffee stain
    // to give it a slightly more organic feel, but keep it minimal as requested.
    const notebookContainer = document.querySelector('.notebook-container');
    const topSticky = document.querySelector('.top-sticky');
    const bottomSticky = document.querySelector('.bottom-sticky');
    
    if (notebookContainer && topSticky && bottomSticky) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 100;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
            
            // Subtle rotation and movement based on mouse position
            notebookContainer.style.transform = `rotateY(${xAxis * 0.5}deg) rotateX(${yAxis * 0.5}deg)`;
            
            topSticky.style.transform = `translate(${xAxis}px, ${yAxis}px) rotate(8deg)`;
            bottomSticky.style.transform = `translate(${xAxis * -1}px, ${yAxis * -1}px) rotate(-5deg)`;
        });
        
        // Reset transform on mouse out of window
        document.addEventListener('mouseleave', () => {
            notebookContainer.style.transform = `rotateY(0deg) rotateX(0deg)`;
            topSticky.style.transform = `rotate(8deg)`;
            bottomSticky.style.transform = `rotate(-5deg)`;
        });
    }
});
