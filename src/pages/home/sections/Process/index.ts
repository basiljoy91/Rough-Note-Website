import markup from './markup.html?raw';
import { interactiveIdeaBulbMarkup } from '../../../../shared/ui/InteractiveIdeaBulb';
import './process.css';

export const processMarkup = markup.replace(
  '__INTERACTIVE_IDEA_BULB__',
  interactiveIdeaBulbMarkup('d6-lightbulb')
);
