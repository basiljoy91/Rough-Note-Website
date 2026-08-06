import { useEffect } from 'react';
import { SiteLayout } from '../layouts/SiteLayout';
import '../../../css/pagenotfound.css';
import { renderPage } from './render';

const template = document.querySelector<HTMLTemplateElement>(
  '#not-found-template'
);

if (!template) {
  throw new Error('Page-not-found template was not found.');
}

const notFoundMarkup = template.innerHTML;
template.remove();

function NotFoundPage() {
  useEffect(() => {
    const backHomeButton =
      document.querySelector<HTMLButtonElement>('#backHomeBtn');
    const page = document.querySelector<HTMLElement>('.underlying-paper');
    const topSticky = document.querySelector<HTMLElement>('.top-sticky');
    const bottomSticky = document.querySelector<HTMLElement>('.bottom-sticky');
    let redirectTimer: number | undefined;

    const returnHome = (event: MouseEvent) => {
      event.preventDefault();
      if (!backHomeButton) return;

      backHomeButton.style.transform = 'scale(0.95)';
      redirectTimer = window.setTimeout(() => {
        window.location.href = '/html/index.html?animated=true';
      }, 150);
    };

    const movePaper = (event: MouseEvent) => {
      if (!page || !topSticky || !bottomSticky) return;

      const xAxis = (window.innerWidth / 2 - event.pageX) / 100;
      const yAxis = (window.innerHeight / 2 - event.pageY) / 100;

      page.style.transform = `rotateY(${xAxis * 0.5}deg) rotateX(${yAxis * 0.5}deg)`;
      topSticky.style.transform = `translate(${xAxis}px, ${yAxis}px) rotate(8deg)`;
      bottomSticky.style.transform = `translate(${-xAxis}px, ${-yAxis}px) rotate(-5deg)`;
    };

    const resetPaper = () => {
      if (!page || !topSticky || !bottomSticky) return;

      page.style.transform = 'rotateY(0deg) rotateX(0deg)';
      topSticky.style.transform = 'rotate(8deg)';
      bottomSticky.style.transform = 'rotate(-5deg)';
    };

    backHomeButton?.addEventListener('click', returnHome);
    document.addEventListener('mousemove', movePaper);
    document.addEventListener('mouseleave', resetPaper);

    return () => {
      backHomeButton?.removeEventListener('click', returnHome);
      document.removeEventListener('mousemove', movePaper);
      document.removeEventListener('mouseleave', resetPaper);
      if (redirectTimer !== undefined) window.clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <SiteLayout
      activeItem="home"
      pageLabel="404"
      pageTitle="Page Not Found"
    >
      <div
        className="not-found-page"
        dangerouslySetInnerHTML={{ __html: notFoundMarkup }}
      />
    </SiteLayout>
  );
}

renderPage(<NotFoundPage />);
