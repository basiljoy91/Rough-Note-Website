import { DRAWING_COLORS } from '../../constants';
import { CheckIcon } from './DrawingIcons';
import styles from './drawing-toolbar.module.css';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function ColorPicker({
  selectedColor,
  onSelect
}: ColorPickerProps) {
  return (
    <div className={styles.colorPicker} role="radiogroup" aria-label="Drawing colour">
      {DRAWING_COLORS.map((color) => {
        const selected = color.value === selectedColor;
        return (
          <button
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={color.name}
            data-tooltip={color.name}
            className={styles.colorSwatch}
            style={{ '--swatch-color': color.value } as React.CSSProperties}
            onClick={() => onSelect(color.value)}
            key={color.value}
          >
            {selected && <CheckIcon className={styles.swatchCheck} />}
          </button>
        );
      })}
    </div>
  );
}
