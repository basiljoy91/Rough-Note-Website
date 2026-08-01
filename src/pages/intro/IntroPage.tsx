import { useEffect } from 'react';
import markup from './markup.html?raw';
import { Preloader } from './preloader';
import './intro-page.global.css';

export function IntroPage() {
  useEffect(() => {
    const preloader = new Preloader();
    preloader.playIntro();

    return () => {
      preloader.masterTimeline?.kill();
      preloader.cameraDrift?.kill();
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
