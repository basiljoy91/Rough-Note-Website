import styles from './drawing-toolbar.module.css';

interface DrawingCanvasProps {
  committedCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  eraserPreviewRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
}

export function DrawingCanvas({
  committedCanvasRef,
  activeCanvasRef,
  eraserPreviewRef,
  visible
}: DrawingCanvasProps) {
  return (
    <>
      <canvas
        ref={committedCanvasRef}
        className={styles.drawingCanvas}
        data-drawing-canvas="committed"
        aria-hidden="true"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      />
      <canvas
        ref={activeCanvasRef}
        className={styles.drawingCanvas}
        data-drawing-canvas="active"
        aria-hidden="true"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      />
      <div
        ref={eraserPreviewRef}
        className={styles.eraserPreview}
        aria-hidden="true"
        hidden
      />
    </>
  );
}
