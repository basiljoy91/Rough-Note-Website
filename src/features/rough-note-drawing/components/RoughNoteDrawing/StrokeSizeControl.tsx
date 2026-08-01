import { TOOL_SIZE_RANGES } from '../../constants';
import type { DrawingTool } from '../../types/drawing';
import styles from './drawing-toolbar.module.css';

interface StrokeSizeControlProps {
  tool: DrawingTool;
  size: number;
  onChange: (size: number) => void;
}

export function StrokeSizeControl({
  tool,
  size,
  onChange
}: StrokeSizeControlProps) {
  const range = TOOL_SIZE_RANGES[tool];
  return (
    <label className={styles.sizeControl}>
      <output aria-live="polite">{size} px</output>
      <input
        type="range"
        min={range.min}
        max={range.max}
        value={size}
        step={1}
        aria-label="Stroke width"
        aria-valuemin={range.min}
        aria-valuemax={range.max}
        aria-valuenow={size}
        aria-valuetext={`${size} pixels`}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}
