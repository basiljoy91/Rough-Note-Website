document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('div-5');
  if (!section) return;

  const page1 = section.querySelector('.d5-page-1');
  const page2 = section.querySelector('.d5-page-2');
  const prevBtn = section.querySelector('.d5-prev-btn');
  const nextBtn = section.querySelector('.d5-next-btn');
  const dots = section.querySelectorAll('.d5-dot');

  const page3 = section.querySelector('.d5-page-3');
  let currentPage = 1;

  if (!page1 || !page2 || !prevBtn || !nextBtn) return;

  function switchPage(targetPage) {
    if (targetPage === 1) {
      page2.classList.remove('active');
      if (page3) page3.classList.remove('active');
      page1.classList.add('active');
      dots[0].classList.add('active');
      dots[1].classList.remove('active');
      if (dots[2]) dots[2].classList.remove('active');
    } else if (targetPage === 2) {
      page1.classList.remove('active');
      if (page3) page3.classList.remove('active');
      page2.classList.add('active');
      dots[0].classList.remove('active');
      dots[1].classList.add('active');
      if (dots[2]) dots[2].classList.remove('active');
    } else if (targetPage === 3 && page3) {
      page1.classList.remove('active');
      page2.classList.remove('active');
      page3.classList.add('active');
      dots[0].classList.remove('active');
      dots[1].classList.remove('active');
      if (dots[2]) dots[2].classList.add('active');
    }

    currentPage = targetPage;

    // Replay animations
    section.classList.remove('visible');
    void section.offsetWidth;
    section.classList.add('visible');
  }

  nextBtn.addEventListener('click', () => {
    if (currentPage < 3 && page3) {
      switchPage(currentPage + 1);
    } else if (currentPage < 2) {
      switchPage(currentPage + 1);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      switchPage(currentPage - 1);
    }
  });
});
