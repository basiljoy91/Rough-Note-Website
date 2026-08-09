import markup from './markup.html?raw';
import coffeeRn from '../../../../assets/illustrations/coffee-rn.svg';
import { coffeeSteamMarkup } from '../../../../shared/ui/CoffeeSteam';
import './about-studio.css';

export const aboutStudioMarkup = markup
  .replace('__COFFEE_RN__', coffeeRn)
  .replace('__CONTACT_COFFEE_STEAM__', coffeeSteamMarkup('d3-steam-cloud'));
