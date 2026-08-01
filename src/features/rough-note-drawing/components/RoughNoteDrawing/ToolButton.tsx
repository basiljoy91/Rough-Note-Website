import type { DrawingTool } from '../../types/drawing';
import {
  EraserIcon,
  HighlighterIcon,
  PenIcon,
  PencilIcon
} from './DrawingIcons';
import styles from './drawing-toolbar.module.css';

interface ToolButtonProps {
  tool: DrawingTool;
  selected: boolean;
  onSelect: (tool: DrawingTool) => void;
}

const toolContent = {
  pencil: { label: 'Pencil', Icon: PencilIcon },
  pen: { label: 'Pen', Icon: PenIcon },
  highlighter: { label: 'Highlighter', Icon: HighlighterIcon },
  eraser: { label: 'Eraser', Icon: EraserIcon }
} as const;

export function ToolButton({
  tool,
  selected,
  onSelect
}: ToolButtonProps) {
  const { label, Icon } = toolContent[tool];
  return (
    <button
      type="button"
      className={styles.toolButton}
      aria-label={`Use ${label.toLowerCase()}`}
      aria-pressed={selected}
      data-tooltip={label}
      onClick={() => onSelect(tool)}
    >
      <Icon className={styles.toolIcon} />
      <span>{label}</span>
      {selected && <span className={styles.selectedToolMark} aria-hidden="true" />}
    </button>
  );
}
