document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.workbook');
  if (!section) return;

  const pages = [
    { art: 'web', image: true },
    { art: 'brand', image: true },
    { art: 'poster', image: true },
    { art: 'logo', image: true },
    { art: 'motion', image: true },
    { art: 'video', image: true },
    { art: 'erp', image: true }
  ];
  let current = 0;
  const intros = section.querySelectorAll('.workbook__intro-item');
  const arts = section.querySelectorAll('.workbook__art');
  const stickies = section.querySelectorAll('.workbook__sticky-item');
  const dots = [...section.querySelectorAll('.workbook__dots button')];
  const paper = section.querySelector('.workbook__paper');

  function show(next) {
    current = (next + pages.length) % pages.length;
    const page = pages[current];
    paper.classList.remove('is-turning');
    void paper.offsetWidth;
    paper.classList.add('is-turning');
    window.setTimeout(() => {
      intros.forEach((intro, index) => intro.classList.toggle('is-visible', index === current));
      arts.forEach((art, index) => art.classList.toggle('is-visible', index === current));
      stickies.forEach((sticky, index) => sticky.classList.toggle('is-visible', index === current));

      section.classList.toggle('workbook--image-page', Boolean(page.image));
      dots.forEach((dot, index) => dot.classList.toggle('is-active', index === current));
      section.querySelector('.workbook__dots').setAttribute('aria-label', `Work page ${current + 1} of ${pages.length}`);
      
      const pageCountEl = section.querySelector('.workbook__page-count');
      if (pageCountEl) {
        pageCountEl.innerHTML = `Page 0${current + 1} <span>👉</span>`;
      }
      
      // Pause video when navigating away
      const vpVideo = document.getElementById('vp-video');
      if (vpVideo && page.art !== 'video') {
        vpVideo.pause();
      }


      // Manually trigger animations on d5 elements if they exist
      const activeIntro = intros[current];
      if(activeIntro) {
        activeIntro.classList.remove('visible');
        void activeIntro.offsetWidth;
        activeIntro.classList.add('visible');
      }
      const activeArt = arts[current];
      if(activeArt) {
        activeArt.classList.remove('visible');
        void activeArt.offsetWidth;
        activeArt.classList.add('visible');
      }
      
    }, 285);
  }
  
  const nextBtn = section.querySelector('.workbook__arrow--next');
  if(nextBtn) nextBtn.addEventListener('click', () => show(current + 1));
  
  const prevBtn = section.querySelector('.workbook__arrow--prev');
  if(prevBtn) prevBtn.addEventListener('click', () => show(current - 1));
  
  dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
  section.addEventListener('keydown', event => { if (event.key === 'ArrowRight') show(current + 1); if (event.key === 'ArrowLeft') show(current - 1); });
  
  arts[0].classList.add('is-visible');
  intros[0].classList.add('is-visible');
  stickies[0].classList.add('is-visible');
  section.classList.add('workbook--image-page');
  
  // Apply initial visible class for d5 animations
  setTimeout(() => {
    intros.forEach(i => i.classList.add('visible'));
    arts.forEach(a => a.classList.add('visible'));
  }, 100);

  // Pause video when section scrolls out of view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        const vpVideo = document.getElementById('vp-video');
        if (vpVideo) vpVideo.pause();
      }
    });
  }, { threshold: 0.1 });
  observer.observe(section);
});
