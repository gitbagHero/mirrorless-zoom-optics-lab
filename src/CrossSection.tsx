import { GROUPS, LENSES } from "./optics/elements";
import type { LensElement } from "./optics/elements";
import { surfaceSag } from "./optics/model";
import type { PositionedSurface } from "./optics/model";
import { STOP } from "./optics/prescription";

interface CrossSectionProps {
  surfaces: readonly PositionedSurface[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function sampleFace(surface: PositionedSurface, start: number, end: number): string[] {
  const segments = 72;
  return Array.from({ length: segments + 1 }, (_, index) => {
    const height = start + (end - start) * index / segments;
    return `${(surface.z + surfaceSag(surface, height)).toFixed(3)} ${height.toFixed(3)}`;
  });
}

function elementPath(lens: LensElement, surfaces: readonly PositionedSurface[]) {
  const front = sampleFace(surfaces[lens.front - 1], -lens.drawRadius, lens.drawRadius);
  const back = sampleFace(surfaces[lens.back - 1], lens.drawRadius, -lens.drawRadius);
  return `M ${[...front, ...back].join(" L ")} Z`;
}

export function CrossSection({ surfaces, selectedId, onSelect }: CrossSectionProps) {
  const objectSide = surfaces[0].z - 12;
  const stopZ = surfaces[STOP - 1].z;
  const barrelFront = objectSide + 4;
  const active = LENSES.find((lens) => lens.id === selectedId) ?? LENSES[0];
  const activeZ = (surfaces[active.front - 1].z + surfaces[active.back - 1].z) / 2;
  const activeRim = active.drawRadius;

  return (
    <div className="diagram-scroll" tabIndex={0} aria-label="镜头剖面，可横向滚动">
      <svg
        className="cross-section"
        viewBox={`${objectSide} -43 ${12 - objectSide} 87`}
        role="group"
        aria-labelledby="diagram-title diagram-description"
      >
        <title id="diagram-title">19 片镜片的广角侧剖面</title>
        <desc id="diagram-description">物方在左，像面在右。可点击镜片，或使用图下方的镜片编号选择。</desc>
        <defs>
          <pattern id="optical-grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 H 0 V 5" fill="none" className="grid-stroke" />
          </pattern>
          <linearGradient id="barrel-shading" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#252a30" />
            <stop offset="1" stopColor="#181d23" />
          </linearGradient>
        </defs>
        <rect x={objectSide} y={-43} width={12 - objectSide} height={87} fill="url(#optical-grid)" />

        {[-1, 1].map((side) => (
          <g transform={`scale(1 ${side})`} key={side} aria-hidden="true">
            <path
              className="barrel"
              d={`M ${barrelFront} 20 V 31 H ${barrelFront + 3} V 34 H -111
                L -107 30 H -30 L -25 28 H -12 V 25 H -8 V 18 H -12 V 22 H -27
                L -31 25 H -108 L -112 27 H ${barrelFront + 4} V 20 Z`}
              fill="url(#barrel-shading)"
            />
            <path className="barrel-detail" d={`M ${barrelFront + 6} 31.9 H -115 M -104 27.8 H -34 M -25 25.1 H -13`} />
            <path className="stop" d={`M ${stopZ - 0.8} 22 H ${stopZ + 0.8} V 12 L ${stopZ} 8.3 L ${stopZ - 0.8} 12 Z`} />
          </g>
        ))}

        <path className="optic-axis" d={`M ${objectSide + 1} 0 H 7`} aria-hidden="true" />
        <path className="sensor" d="M 0 -19 V 19 M -0.9 -19 H 0.9 M -0.9 19 H 0.9" aria-hidden="true" />
        <text className="diagram-text" x={objectSide + 3} y={-37}>物方</text>
        <text className="diagram-text" x={stopZ} y={-33.8} textAnchor="middle">光阑</text>
        <text className="diagram-text sensor-label" x={0} y={-23} textAnchor="middle">像面</text>

        {LENSES.map((lens) => (
          <path
            key={lens.id}
            d={elementPath(lens, surfaces)}
            className={`glass glass--${lens.kind}${lens.id === selectedId ? " glass--selected" : ""}`}
            onClick={() => onSelect(lens.id)}
            data-lens={lens.id}
            aria-hidden="true"
          />
        ))}
        <path className="selection-leader" d={`M ${activeZ} ${-activeRim - 0.7} V ${-activeRim - 4.1}`} />
        <text className="diagram-text selection-label" x={activeZ} y={-activeRim - 5} textAnchor="middle">
          {active.id}
        </text>
        {GROUPS.map((group) => {
          const lenses = LENSES.filter((lens) => lens.group === group.id);
          const left = surfaces[lenses[0].front - 1].z;
          const right = surfaces[lenses[lenses.length - 1].back - 1].z;
          const className = active.group === group.id ? "group-marker group-marker--active" : "group-marker";
          return (
            <g key={group.id} className={className} aria-hidden="true">
              <path d={`M ${left} 35 V 36.8 H ${right} V 35`} />
              <text x={(left + right) / 2} y={41.1} textAnchor="middle">{group.id}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
