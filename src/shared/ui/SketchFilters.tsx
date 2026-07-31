export function SketchFilters() {
  return (
    <svg className="svg-filters" aria-hidden="true">
      <filter id="sketch-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves={3}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={3}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id="sketch-filter-small">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.08"
          numOctaves={2}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={1.5}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
