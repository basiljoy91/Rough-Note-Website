// Partners Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
  const partnersContainer = document.querySelector('.d2-partners');
  const prevBtn = document.querySelector('.d2-carousel-btn--prev');
  const nextBtn = document.querySelector('.d2-carousel-btn--next');

  if (!partnersContainer || !prevBtn || !nextBtn) return;

  // Scroll amount per click (one company card width + gap)
  const scrollAmount = 151; // One partner sticker (136px) plus its 15px gap.

  // Previous button functionality
  prevBtn.addEventListener('click', () => {
    partnersContainer.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });

  // Next button functionality
  nextBtn.addEventListener('click', () => {
    partnersContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });

  // Update button states based on scroll position
  const updateButtonStates = () => {
    const isAtStart = partnersContainer.scrollLeft === 0;
    const isAtEnd = partnersContainer.scrollLeft + partnersContainer.clientWidth >= partnersContainer.scrollWidth - 10;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
    
    prevBtn.style.opacity = isAtStart ? '0.5' : '1';
    nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
  };

  // Listen for scroll events
  partnersContainer.addEventListener('scroll', updateButtonStates);

  // Initialize button states
  updateButtonStates();
});
