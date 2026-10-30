import type { Block, TableData } from '../../lib/practiceSchema';

export function DataTable({ table, caption }: { table: TableData; caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-left text-sm">
        {caption && <caption className="eyebrow px-3 pt-3 pb-1 text-left">{caption}</caption>}
        <thead>
          <tr className="border-b border-line">
            {table.columns.map((c) => (
              <th key={c} scope="col" className="px-3 py-2 font-mono text-xs font-medium text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Renders answer and context content from data. */
export function Blocks({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="space-y-3 text-[0.95rem] leading-relaxed">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return <p key={i}>{block.text}</p>;
          case 'ul':
            return (
              <ul key={i} className="list-disc space-y-1 pl-5 marker:text-accent">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="list-decimal space-y-1 pl-5 marker:font-mono marker:text-xs marker:text-muted">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case 'formula':
            return (
              <p key={i} className="overflow-x-auto rounded-lg bg-surface-2 px-3 py-2 font-mono text-sm whitespace-pre">
                {block.text}
              </p>
            );
          case 'table':
            return <DataTable key={i} table={block.table} />;
        }
      })}
    </div>
  );
}
