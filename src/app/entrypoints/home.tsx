import { HomePage } from '../../pages/home/HomePage';
import { renderPage } from './render';

const introCompleted = new URLSearchParams(window.location.search).has(
  'animated'
);

if (!introCompleted) {
  window.location.replace('/');
} else {
  renderPage(<HomePage />);
}
