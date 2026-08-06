const backHomeButton = document.querySelector<HTMLButtonElement>('#backHomeBtn');
const page = document.querySelector<HTMLElement>('.underlying-paper');
const topSticky = document.querySelector<HTMLElement>('.top-sticky');
const bottomSticky = document.querySelector<HTMLElement>('.bottom-sticky');

backHomeButton?.addEventListener('click', (event) => {
  event.preventDefault();
  backHomeButton.style.transform = 'scale(0.95)';

  window.setTimeout(() => {
    window.location.href = '/';
  }, 150);
});

if (page && topSticky && bottomSticky) {
  document.addEventListener('mousemove', (event) => {
    const xAxis = (window.innerWidth / 2 - event.pageX) / 100;
    const yAxis = (window.innerHeight / 2 - event.pageY) / 100;

    page.style.transform = `rotateY(${xAxis * 0.5}deg) rotateX(${yAxis * 0.5}deg)`;
    topSticky.style.transform = `translate(${xAxis}px, ${yAxis}px) rotate(8deg)`;
    bottomSticky.style.transform = `translate(${-xAxis}px, ${-yAxis}px) rotate(-5deg)`;
  });

  document.addEventListener('mouseleave', () => {
    page.style.transform = 'rotateY(0deg) rotateX(0deg)';
    topSticky.style.transform = 'rotate(8deg)';
    bottomSticky.style.transform = 'rotate(-5deg)';
  });
}
