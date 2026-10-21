/**
 * A small, deterministic node-graph glyph seeded by the chapter number, so every
 * chapter (including future ones) gets a distinct motif with no manual artwork.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 120;
const H = 72;

export function ChapterMotif({ seed, className = '' }: { seed: number; className?: string }) {
  const rand = mulberry32(seed * 7919 + 13);
  const count = 6 + Math.floor(rand() * 3);
  const nodes = Array.from({ length: count }, (_, i) => ({
    x: 10 + ((W - 20) / (count - 1)) * i + (rand() - 0.5) * 8,
    y: 10 + rand() * (H - 20),
  }));
  const edges: [number, number][] = [];
  nodes.forEach((_, i) => {
    if (i + 1 < count) edges.push([i, i + 1]);
    if (i + 2 < count && rand() > 0.45) edges.push([i, i + 2]);
  });
  const hot = Math.floor(rand() * count);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1" className="text-line-strong">
        {edges.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={nodes[a]!.x} y1={nodes[a]!.y} x2={nodes[b]!.x} y2={nodes[b]!.y} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === hot ? 4.5 : 3}
          className={i === hot ? 'fill-accent' : 'fill-bg stroke-ink'}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
