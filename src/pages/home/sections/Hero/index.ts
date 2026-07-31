import markup from './markup.html?raw';
import workspaceBoardMarkup from './workspace-board.html?raw';
import './hero.css';
import './workspace-board.css';
import './torn-buttons.css';

export const heroMarkup = markup.replace('__WORKSPACE_BOARD__', workspaceBoardMarkup);
