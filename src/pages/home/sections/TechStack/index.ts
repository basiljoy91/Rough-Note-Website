import markup from './markup.html?raw';
import { coffeeSteamMarkup } from '../../../../shared/ui/CoffeeSteam';
import './tech-stack.css';

export const techStackMarkup = markup.replace(
  '__CONTACT_COFFEE_STEAM__',
  coffeeSteamMarkup('tech-stack__coffee-steam')
);
