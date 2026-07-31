import type { ToolbarPosition } from '../../types/drawing';
import { PencilIcon } from './DrawingIcons';
import styles from './drawing-toolbar.module.css';

interface CollapsedPencilTabProps {
  onExpand: () => void;
  position?: ToolbarPosition | null;
  mobile?: boolean;
}

export function CollapsedPencilTab({
  onExpand,
  position,
  mobile = false
}: CollapsedPencilTabProps) {
  const positionStyle = position
    ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
    : undefined;
  return (
    <button
      type="button"
      className={`${styles.pencilDisk} ${mobile ? styles.pencilDiskMobile : ''}`}
      style={positionStyle}
      aria-label="Expand tools"
      data-tooltip="Expand tools"
      data-drawing-exclusion
      onClick={onExpand}
    >
      <span className={styles.diskSeams} aria-hidden="true" />
      <PencilIcon className={styles.diskPencil} />
    </button>
  );
}
