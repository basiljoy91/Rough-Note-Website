import { RoughNoteDrawing } from './components/RoughNoteDrawing/RoughNoteDrawing';
import './drawing-cursors.global.css';

export function RoughNoteDrawingFeature() {
  if (window.ROUGH_NOTE_FEATURE_FLAGS?.roughPencil === false) {
    return null;
  }

  return <RoughNoteDrawing />;
}
