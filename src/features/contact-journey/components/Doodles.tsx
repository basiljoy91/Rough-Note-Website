import type { SVGProps } from 'react';

const shared = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

type DoodleProps = SVGProps<SVGSVGElement>;

export function BulbDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 64 78" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="2.15">
        <path d="M22 49c-1-8-10-12-9-24C14 10 28 4 39 10c13 7 14 22 4 32-4 4-5 7-6 10" />
        <path d="M23 51c6 2 9 2 15 0M23 57c5 2 10 2 14 0M26 63c3 2 6 2 9 0" />
        <path d="M23 31c4 0 4 9 7 18M39 30c-5 1-5 10-8 19M27 30c3-3 6-3 10 0" />
        <path d="M7 12 1 7M29 5V0M51 10l6-6M55 27l8-1M7 31l-7 2" />
      </g>
    </svg>
  );
}

export function StarDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 54 54" aria-hidden="true" {...props}>
      <path
        {...shared}
        strokeWidth="2"
        d="m28 4 4 17 16-5-12 12 13 10-17-4-4 17-4-17-17 6 12-12L6 18l18 4Z"
      />
      <path {...shared} strokeWidth="1.1" d="m25 8 2 15m7-1 10-3M35 31l10 6M22 34l-10 4" />
    </svg>
  );
}

export function HeartDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 40 38" aria-hidden="true" {...props}>
      <path
        {...shared}
        strokeWidth="2.2"
        d="M20 34S4 24 4 12C4 4 15 2 20 10 26 1 36 5 36 12c0 11-16 22-16 22Z"
      />
    </svg>
  );
}

export function SmileDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 50 50" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="2">
        <path d="M45 24c0 13-8 22-20 22S4 37 5 24C6 12 13 5 25 5s20 8 20 19Z" />
        <path d="M16 20v1M34 20v1M15 29c6 7 14 8 21-1" />
      </g>
    </svg>
  );
}

export function ArrowDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 90 100" aria-hidden="true" {...props}>
      <path
        {...shared}
        strokeWidth="2.2"
        d="M11 7c20 12 37 32 44 59M43 56l13 14 7-19"
      />
    </svg>
  );
}

export function PaperPlaneDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 82 62" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="2.15">
        <path d="m5 16 70-12-26 51-12-25Z" />
        <path d="M5 16 37 30 75 4M37 30l7 23" />
      </g>
    </svg>
  );
}

export function PencilDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="2">
        <path d="m8 48 5-15L42 4l13 12-29 29Z" />
        <path d="m13 33 13 12M37 9l13 12M8 48l9-3-6-6Z" />
        <path d="m42 4 5-2 10 9-2 5" />
      </g>
    </svg>
  );
}

export function CloudUploadDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 82 62" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="2.2">
        <path d="M24 50H13C2 49 2 33 13 30c-1-13 15-21 24-12 6-10 23-4 22 8 16-2 20 23 3 24H49" />
        <path d="M37 57V33m0 0-9 9m9-9 9 9" />
      </g>
    </svg>
  );
}

export function LockDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 48 58" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="2.2">
        <path d="M13 25V15C13-1 36-1 36 15v10M17 24V15c0-10 15-10 15 0v9" />
        <path d="M7 24c10-2 23-2 34 0l-1 30c-11 2-22 2-33 0Z" />
        <path d="M24 35c-4 0-4 6-1 7l-1 6h5l-1-6c3-2 2-7-2-7Z" />
      </g>
    </svg>
  );
}

export function FieldIcon({
  kind,
  ...props
}: DoodleProps & { kind: 'person' | 'mail' | 'phone' | 'globe' }) {
  if (kind === 'person') {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
        <g {...shared} strokeWidth="1.7">
          <circle cx="14" cy="8" r="5" />
          <path d="M5 25c0-8 3-11 9-11s9 3 9 11" />
        </g>
      </svg>
    );
  }
  if (kind === 'mail') {
    return (
      <svg viewBox="0 0 30 24" aria-hidden="true" {...props}>
        <g {...shared} strokeWidth="1.7">
          <rect x="2" y="3" width="26" height="18" />
          <path d="m3 5 12 9L27 5" />
        </g>
      </svg>
    );
  }
  if (kind === 'phone') {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
        <path
          {...shared}
          strokeWidth="1.8"
          d="M7 3 3 7c2 9 9 16 18 18l4-5-7-5-3 4c-4-2-7-5-8-8l4-3Z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="1.6">
        <circle cx="14" cy="14" r="12" />
        <path d="M2 14h24M14 2c7 7 7 17 0 24M14 2c-7 7-7 17 0 24" />
      </g>
    </svg>
  );
}

export function CheckDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="2">
        <path d="M3 3c7-1 15-1 22 0l-1 22c-8 1-14 1-21 0Z" />
        <path d="m7 13 5 6L22 8" />
      </g>
    </svg>
  );
}

export function CalendarDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="1.6">
        <path d="M4 7h22v19H4zM4 12h22M9 3v7M21 3v7" />
        <path d="M9 17h2M15 17h2M21 17h2M9 22h2M15 22h2" />
      </g>
    </svg>
  );
}

export function ClockDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="1.7">
        <circle cx="15" cy="15" r="12" />
        <path d="M15 7v9l6 3" />
      </g>
    </svg>
  );
}

export function BriefcaseDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 32 28" aria-hidden="true" {...props}>
      <g {...shared} strokeWidth="1.6">
        <path d="M3 8h26v17H3zM11 8V3h10v5M3 15c8 4 18 4 26 0M15 14h3v4h-3z" />
      </g>
    </svg>
  );
}
