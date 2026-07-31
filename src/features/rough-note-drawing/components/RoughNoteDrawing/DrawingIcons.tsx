import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const commonProps: IconProps = {
  viewBox: '0 0 40 40',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.15,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
};

export function PencilIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="m7.2 31.8 4.1-10.2L27.9 5.3c1.1-1.1 2.7-1 3.8.1l2.9 2.9c1 1 .9 2.6-.2 3.7L17.8 28.4 7.2 31.8Z" />
      <path d="m11.3 21.6 6.5 6.8M27.3 6l6.4 6.3M14 19l6.6 6.7M8 31l4.7-1.5" />
      <path d="M25.7 8.4 29 11.7" opacity=".48" />
    </svg>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M8 31.5 11.8 22 28 5.8l5.9 5.9-16.2 16.2L8 31.5Z" />
      <path d="m11.8 22 5.9 5.9M28 5.8l5.9 5.9M8 31.5l5.4-2" />
      <path d="m16.1 23.8 14-14" opacity=".5" />
    </svg>
  );
}

export function HighlighterIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="m7.1 31.5 4.2-8.5L25.9 8.4l6.3 6.3-14.5 14.6-10.6 2.2Z" />
      <path d="m11.3 23 6.4 6.3M25.9 8.4l3-3 6.3 6.3-3 3M7.2 31.5h12.1" />
      <path d="m15.3 21.1 10.5-10.5" opacity=".45" />
    </svg>
  );
}

export function EraserIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M5.7 25.4 21.8 7.2a3 3 0 0 1 4.2-.3l7.4 6.5a3 3 0 0 1 .2 4.2L20.7 32.2H11l-5-4.4a1.7 1.7 0 0 1-.3-2.4Z" />
      <path d="m15.8 14 12.4 11M10.8 32.2h20.9" />
      <path d="m18.5 11 12.3 10.9" opacity=".42" />
    </svg>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M16.4 13.2 10 18.5l6.4 5.2" />
      <path d="M10.8 18.5h9.6c6.1 0 9.4 4.3 8.8 10.4" />
      <path d="M11.1 19.4h9.2c4.7 0 7.5 3 7.7 7.2" opacity=".42" />
    </svg>
  );
}

export function RedoIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="m23.6 13.2 6.4 5.3-6.4 5.2" />
      <path d="M29.2 18.5h-9.6c-6.1 0-9.4 4.3-8.8 10.4" />
      <path d="M28.9 19.4h-9.2c-4.7 0-7.5 3-7.7 7.2" opacity=".42" />
    </svg>
  );
}

export function HiddenEyeIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M5.4 20s5.1-7.3 14.6-7.3c9.4 0 14.6 7.3 14.6 7.3s-5.2 7.4-14.6 7.4C10.5 27.4 5.4 20 5.4 20Z" />
      <circle cx="20" cy="20" r="4.5" />
      <path d="M7 32.5h2.3M14.5 33h2.2M22.1 32.5h2.2M7.2 7.4l25.5 25.2" />
    </svg>
  );
}

export function VisibleEyeIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M5.4 20s5.1-7.3 14.6-7.3c9.4 0 14.6 7.3 14.6 7.3s-5.2 7.4-14.6 7.4C10.5 27.4 5.4 20 5.4 20Z" />
      <circle cx="20" cy="20" r="4.5" />
      <circle cx="20" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <path d="M7 32.5h2.3M14.5 33h2.2M22.1 32.5h2.2" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M11.4 13.1h17.2l-1.4 20H12.8l-1.4-20ZM8.8 10.1h22.4M16.1 9.7l1-4h6l1 4" />
      <path d="M17.1 17.3v11.2M22.9 17.3v11.2" />
      <path d="M12.5 14h15" opacity=".4" />
    </svg>
  );
}

export function CollapseIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="m15.2 8.5 11.3 11.3-11.3 11.4" />
      <path d="m16.4 8.5 11 11.3-11 11.4" opacity=".4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m4.2 10.4 3.7 3.8 7.9-8.3" />
      <path d="m4.5 11 3.4 3.4" opacity=".5" />
    </svg>
  );
}
