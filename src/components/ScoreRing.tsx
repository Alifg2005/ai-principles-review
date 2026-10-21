import type { QuestionOutcome } from '../lib/quiz';

const SIZE = 220;
const R = 88;
const STROKE = 16;
const GAP_DEG = 3;

const OUTCOME_CLASS: Record<QuestionOutcome, string> = {
  correct: 'text-correct',
  incorrect: 'text-wrong',
  unanswered: 'text-line-strong',
};

function polar(angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: SIZE / 2 + R * Math.cos(rad), y: SIZE / 2 + R * Math.sin(rad) };
}

function arc(start: number, end: number) {
  const a = polar(start);
  const b = polar(end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${R} ${R} 0 ${large} 1 ${b.x} ${b.y}`;
}

/** One ring segment per question, coloured by outcome, with the percentage at its centre. */
export function ScoreRing({ outcomes, percentage }: { outcomes: readonly QuestionOutcome[]; percentage: number }) {
  const step = 360 / Math.max(outcomes.length, 1);
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full max-w-[15rem]" aria-hidden="true" focusable="false">
      {outcomes.map((outcome, i) => (
        <path
          key={i}
          d={arc(i * step + GAP_DEG / 2, (i + 1) * step - GAP_DEG / 2)}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className={`${OUTCOME_CLASS[outcome]} animate-[segment-in_420ms_var(--ease-out-soft)_both]`}
          style={{ animationDelay: `${i * 22}ms` }}
        />
      ))}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink font-display"
        fontSize="54"
      >
        {percentage}
        <tspan fontSize="26" dx="2">
          %
        </tspan>
      </text>
    </svg>
  );
}
