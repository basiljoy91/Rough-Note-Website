import { forwardRef, type HTMLAttributes } from 'react';
import styles from '../rough-note-contact.module.css';

export const PaperTransitionStage = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function PaperTransitionStage({ className = '', children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`${styles.transitionStage} ${className}`}
      data-transition-stage
      {...props}
    >
      {children}
    </div>
  );
});
