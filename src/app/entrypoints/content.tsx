import { SimplePage } from '../../pages/SimplePage';
import type { NavigationKey } from '../../shared/navigation/navigation.data';
import { renderPage } from './render';

const body = document.body;
const activeItem = (body.dataset.activeNav ?? 'home') as NavigationKey;

renderPage(
  <SimplePage
    activeItem={activeItem}
    anchor={body.dataset.pageAnchor ?? 'content-page'}
    description={
      body.dataset.pageDescription ??
      'This notebook page is being prepared. Explore the homepage for the complete studio story.'
    }
    eyebrow={body.dataset.pageEyebrow ?? 'Rough Note'}
    title={body.dataset.pageTitle ?? 'Notebook Page'}
  />
);
