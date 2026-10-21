/**
 * Original editorial "figure": a small layered network annotated like a plate in
 * a scientific journal. Pure SVG, coloured entirely through theme tokens.
 */
const LAYERS = [3, 5, 4, 2];
const WIDTH = 360;
const HEIGHT = 260;
const X = [44, 140, 236, 316];
/** Indices of the highlighted node in each layer: one path through the network. */
const PATH = [1, 3, 1, 0];

function nodeY(count: number, i: number) {
  const span = 180;
  const top = (HEIGHT - 40 - span) / 2 + 10;
  return count === 1 ? HEIGHT / 2 : top + (span / (count - 1)) * i;
}

export function NeuralFigure() {
  const nodes = LAYERS.map((count, layer) =>
    Array.from({ length: count }, (_, i) => ({ x: X[layer]!, y: nodeY(count, i) })),
  );
  const edges: { x1: number; y1: number; x2: number; y2: number; hot: boolean }[] = [];
  for (let l = 0; l < nodes.length - 1; l++) {
    nodes[l]!.forEach((a, i) =>
      nodes[l + 1]!.forEach((b, j) =>
        edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, hot: PATH[l] === i && PATH[l + 1] === j }),
      ),
    );
  }

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-labelledby="fig-title">
      <title id="fig-title">Diagram of a small layered network mapping percepts to an action</title>
      <g className="text-line-strong" stroke="currentColor" strokeWidth="0.75">
        {edges
          .filter((e) => !e.hot)
          .map((e, i) => (
            <line key={i} {...e} opacity="0.55" />
          ))}
      </g>
      <g className="text-accent" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {edges
          .filter((e) => e.hot)
          .map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
          ))}
      </g>
      {nodes.map((layer, l) =>
        layer.map((n, i) => {
          const hot = PATH[l] === i;
          return (
            <circle
              key={`${l}-${i}`}
              cx={n.x}
              cy={n.y}
              r={hot ? 6.5 : 5}
              className={hot ? 'fill-accent stroke-accent' : 'fill-surface stroke-ink'}
              strokeWidth="1.25"
            />
          );
        }),
      )}
      <g className="fill-muted font-mono" fontSize="8.5" letterSpacing="1.2">
        <text x={X[0]} y={HEIGHT - 14} textAnchor="middle">PERCEPTS</text>
        <text x={(X[1]! + X[2]!) / 2} y={HEIGHT - 14} textAnchor="middle">KNOWLEDGE · INFERENCE</text>
        <text x={X[3]} y={HEIGHT - 14} textAnchor="middle">ACTION</text>
      </g>
      <g className="text-line-strong" stroke="currentColor" strokeWidth="0.75">
        <line x1="20" y1={HEIGHT - 30} x2={WIDTH - 20} y2={HEIGHT - 30} />
        {X.map((x) => (
          <line key={x} x1={x} y1={HEIGHT - 33} x2={x} y2={HEIGHT - 27} />
        ))}
      </g>
    </svg>
  );
}
