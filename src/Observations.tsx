import { useId } from "react";
import { GROUPS, LENSES } from "./optics/elements";
import type { PositionedSurface } from "./optics/model";
import type { measureSpot, TracedRay } from "./optics/rays";
import { SENSOR_WIDTH, ZOOM_MINIMUM } from "./optics/zoom";

const groupFronts = GROUPS.map((group) => ({ ...group, lens: LENSES.find((lens) => lens.group === group.id)! }));

export function GroupMotion({
  surfaces, wideSurfaces, selectedGroup, onSelect,
}: {
  surfaces: readonly PositionedSurface[];
  wideSurfaces: readonly PositionedSurface[];
  selectedGroup: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="panel motion-panel" aria-labelledby="motion-heading">
      <h2 id="motion-heading">镜组位移</h2>
      <p className="observation-caption">以广角端为基准，像面固定</p>
      <div className="motion-list">
        {groupFronts.map((group) => {
          const surfaceIndex = group.lens.front - 1;
          const shift = surfaces[surfaceIndex].z - wideSurfaces[surfaceIndex].z;
          const direction = Math.abs(shift) < 0.005 ? "基准位置" : shift < 0 ? "向物方" : "向像方";
          return (
            <button
              type="button"
              key={group.id}
              aria-pressed={selectedGroup === group.id}
              aria-label={`查看 ${group.id} 镜组`}
              onClick={() => onSelect(group.lens.id)}
            >
              <span className="motion-group">{group.id}</span>
              <span>{direction}</span>
              <strong>{Math.abs(shift).toFixed(2)} <small>mm</small></strong>
            </button>
          );
        })}
      </div>
      <p className="observation-caption">G3、光阑与 G5 同位移联动。</p>
    </section>
  );
}

export function SpotPanel({
  rays, spot, offAxis,
}: {
  rays: readonly TracedRay[];
  spot: ReturnType<typeof measureSpot>;
  offAxis: boolean;
}) {
  const { hits, centroid, rms, width } = spot;
  const atStop = rays.filter((ray) => ray.end === "stop").length;
  const other = rays.length - hits.length - atStop;
  const center = centroid ?? 0;
  const halfRange = Math.max(0.05, ...hits.map((hit) => 1.2 * Math.abs(hit - center)));
  const marks = [-1, -0.5, 0, 0.5, 1];
  const x = (height: number) => 180 + (height - center) / halfRange * 153;

  return (
    <section className="panel observation-panel" aria-labelledby="spot-heading">
      <div className="observation-heading">
        <div><h2 id="spot-heading">像面光斑</h2><p>剖面方向的几何落点</p></div>
        <strong className="focal-reading">{rms === null ? "—" : (rms * 1000).toFixed(1)} <span>µm RMS</span></strong>
      </div>
      <div className="spot-plot">
        <svg viewBox="0 0 360 96" role="img" aria-label={`剖面上 ${hits.length} 个像面落点`}>
          <path d="M27 43H333" className="spot-axis" />
          {marks.map((mark) => (
            <g key={mark} className="spot-tick">
              <path d={`M${180 + mark * 153} 20V64`} />
              <text x={180 + mark * 153} y="78" textAnchor="middle">
                {(center + mark * halfRange).toFixed(2)}
              </text>
            </g>
          ))}
          {hits.map((hit, index) => (
            <circle className={offAxis ? "spot-hit spot-hit--off-axis" : "spot-hit"} key={index} cx={x(hit)} cy="43" r="2.1" />
          ))}
          <text className="plot-units" x="351" y="91" textAnchor="end">mm</text>
        </svg>
      </div>
      <dl className="observation-metrics">
        <div><dt>到达像面</dt><dd>{hits.length} / {rays.length}</dd></div>
        <div><dt>光阑截止</dt><dd>{atStop}</dd></div>
        <div><dt>其余中止</dt><dd>{other}</dd></div>
        <div><dt>光斑宽度</dt><dd>{width === null ? "—" : `${(width * 1000).toFixed(1)} µm`}</dd></div>
      </dl>
      {centroid === null && <p className="observation-caption">这束光未到达像面。</p>}
    </section>
  );
}

const targetPositions = [
  [64, 43], [296, 43], [64, 167], [296, 167],
] as const;

export function TargetPanel({ focalLength, diagonalAngle, rms }: { focalLength: number; diagonalAngle: number; rms: number | null }) {
  const id = useId();
  const scale = focalLength / ZOOM_MINIMUM;
  const blur = Math.min(9, (rms ?? 0) * 360 / SENSOR_WIDTH);

  return (
    <section className="panel observation-panel" aria-labelledby="chart-heading">
      <div className="observation-heading">
        <div><h2 id="chart-heading">教学测试图</h2><p>按视角取景，按几何光斑模拟模糊</p></div>
        <strong className="focal-reading">{diagonalAngle.toFixed(1)}° <span>估算对角</span></strong>
      </div>
      <figure className="target-figure">
        <svg viewBox="0 0 360 210" role="img" aria-label="随焦距取景的黑白测试图">
          <defs>
            <pattern id={`${id}-grid`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0H0V10" fill="none" stroke="#798078" strokeWidth=".25" />
            </pattern>
            <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={blur} />
            </filter>
          </defs>
          <rect width="360" height="210" fill="#e7e8dd" />
          {rms !== null && (
            <g filter={blur > 0.02 ? `url(#${id}-blur)` : undefined}>
              <g transform={`translate(180 105) scale(${scale}) translate(-180 -105)`}>
                <rect width="360" height="210" fill={`url(#${id}-grid)`} />
                <rect x="12" y="12" width="336" height="186" fill="none" stroke="#293027" strokeWidth="1.5" />
                {targetPositions.map(([tx, ty]) => (
                  <g key={`${tx}-${ty}`} transform={`translate(${tx} ${ty})`} fill="#282d26">
                    <circle r="17" fill="none" stroke="#282d26" />
                    <circle r="9" fill="none" stroke="#282d26" />
                    <path d="M-21 0H21M0-21V21" stroke="#282d26" strokeWidth=".8" />
                  </g>
                ))}
                <g transform="translate(180 105)" fill="#171c16">
                  <circle r="35" fill="#f4f5ed" stroke="#272d25" strokeWidth="1" />
                  {Array.from({ length: 16 }, (_, index) => (
                    <path key={index} transform={`rotate(${index * 22.5})`} d="M0 0L29 0L28.44 5.66Z" />
                  ))}
                  <circle r="7" fill="none" stroke="#6a7167" strokeWidth=".4" />
                </g>
                <path d="M125 54H235M125 156H235" stroke="#596258" strokeDasharray="2 3" strokeWidth=".6" />
                <text x="180" y="173" textAnchor="middle" fill="#343d34" fontSize="8" fontFamily="monospace">OPTICAL TARGET</text>
              </g>
            </g>
          )}
        </svg>
        <figcaption>{rms === null ? "当前没有像面落点" : `取景倍率 ${scale.toFixed(2)}×（相对广角端）`}</figcaption>
      </figure>
    </section>
  );
}
