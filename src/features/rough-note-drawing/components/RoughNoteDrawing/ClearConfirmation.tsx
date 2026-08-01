import styles from './drawing-toolbar.module.css';

interface ClearConfirmationProps {
  open: boolean;
  onKeep: () => void;
  onClear: () => void;
}

export function ClearConfirmation({
  open,
  onKeep,
  onClear
}: ClearConfirmationProps) {
  if (!open) return null;
  return (
    <div
      className={styles.clearPopover}
      role="alertdialog"
      aria-labelledby="clear-rough-notes-title"
      aria-describedby="clear-rough-notes-description"
    >
      <strong id="clear-rough-notes-title">Clear your rough notes?</strong>
      <p id="clear-rough-notes-description">
        This removes all drawing from this page.
      </p>
      <div>
        <button type="button" onClick={onKeep}>
          Keep notes
        </button>
        <button type="button" className={styles.clearDanger} onClick={onClear}>
          Clear all
        </button>
      </div>
    </div>
  );
}
