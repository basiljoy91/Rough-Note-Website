import {
  forwardRef,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes
} from 'react';
import type { ContactAccent, ContactStepNumber } from '../types';
import styles from '../rough-note-contact.module.css';

export function StepLabel({
  step,
  accent
}: {
  step: ContactStepNumber;
  accent: ContactAccent;
}) {
  return (
    <div className={`${styles.stepLabel} ${styles[accent]}`} aria-hidden="true">
      STEP {String(step).padStart(2, '0')}
    </div>
  );
}

export function HandDrawnUnderline({
  accent
}: {
  accent: ContactAccent | 'orange' | 'graphite';
}) {
  return (
    <svg
      className={`${styles.handUnderline} ${styles[accent]}`}
      viewBox="0 0 240 18"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M3 10C45 8 85 13 126 9c40-4 73 3 111-1" />
      <path d="M11 13c56-1 109 1 165-2 20-1 38 1 56-1" />
    </svg>
  );
}

export function TapeStrip({ className = '' }: { className?: string }) {
  return <span className={`${styles.tapeStrip} ${className}`} aria-hidden="true" />;
}

export function StickyNote({
  tone,
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLElement> & {
  tone: ContactAccent;
  children: ReactNode;
}) {
  return (
    <aside
      className={`${styles.stickyNote} ${styles[tone]} ${className}`}
      {...props}
    >
      <TapeStrip />
      {children}
    </aside>
  );
}

export function PaperPanel({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${styles.paperPanel} ${className}`}>{children}</div>;
}

export const PaperButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    tone: 'orange' | ContactAccent;
    icon?: ReactNode;
  }
>(function PaperButton({ tone, icon, children, className = '', ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.paperButton} ${styles[tone]} ${className}`}
      data-drawing-exclusion
      {...props}
    >
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
});

interface FieldFrameProps {
  label: ReactNode;
  help?: string;
  error?: string;
  fieldId: string;
  children: ReactNode;
  icon?: ReactNode;
  required?: boolean;
  className?: string;
}

function FieldFrame({
  label,
  help,
  error,
  fieldId,
  children,
  icon,
  required,
  className = ''
}: FieldFrameProps) {
  return (
    <div
      className={`${styles.field} ${error ? styles.fieldInvalid : ''} ${className}`}
    >
      <label htmlFor={fieldId}>
        {icon}
        <span>{label}</span>
        {required && <em aria-hidden="true">*</em>}
      </label>
      {children}
      {help && !error && (
        <p id={`${fieldId}-help`} className={styles.fieldHelp}>
          {help}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} className={styles.fieldError} role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
}

interface PaperInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  help?: string;
  icon?: ReactNode;
}

export const PaperInput = forwardRef<HTMLInputElement, PaperInputProps>(
  function PaperInput(
    { label, error, help, icon, id: suppliedId, required, className, ...props },
    ref
  ) {
    const generatedId = useId();
    const id = suppliedId || generatedId;
    return (
      <FieldFrame
        label={label}
        fieldId={id}
        error={error}
        help={help}
        icon={icon}
        required={required}
        className={className}
      >
        <input
          {...props}
          id={id}
          ref={ref}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : help ? `${id}-help` : undefined
          }
          data-drawing-exclusion
        />
      </FieldFrame>
    );
  }
);

interface PaperSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  placeholder: string;
  options: readonly string[];
  error?: string;
  icon?: ReactNode;
}

export const PaperSelect = forwardRef<HTMLSelectElement, PaperSelectProps>(
  function PaperSelect(
    {
      label,
      placeholder,
      options,
      error,
      icon,
      id: suppliedId,
      required,
      className,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const id = suppliedId || generatedId;
    return (
      <FieldFrame
        label={label}
        fieldId={id}
        error={error}
        icon={icon}
        required={required}
        className={className}
      >
        <select
          {...props}
          id={id}
          ref={ref}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          data-drawing-exclusion
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldFrame>
    );
  }
);

interface PaperTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: ReactNode;
  error?: string;
  help?: string;
}

export const PaperTextarea = forwardRef<
  HTMLTextAreaElement,
  PaperTextareaProps
>(function PaperTextarea(
  {
    label,
    error,
    help,
    id: suppliedId,
    required,
    className,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return (
    <FieldFrame
      label={label}
      fieldId={id}
      error={error}
      help={help}
      required={required}
      className={className}
    >
      <textarea
        {...props}
        id={id}
        ref={ref}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : help ? `${id}-help` : undefined}
        data-drawing-exclusion
      />
    </FieldFrame>
  );
});

export function BackButton({
  children = '← Back',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={styles.backButton}
      data-drawing-exclusion
      {...props}
    >
      {children}
    </button>
  );
}
