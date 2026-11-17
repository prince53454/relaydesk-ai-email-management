import { Fragment } from "react";

function renderInline(text, keyPrefix) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={key}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={key} className="rounded bg-slate-200/70 px-1">{part.slice(1, -1)}</code>;
    return <Fragment key={key}>{part}</Fragment>;
  });
}

function MarkdownMessage({ content }) {
  const blocks = String(content || "").trim().split(/\n\s*\n/).filter(Boolean);
  return <div className="space-y-2">{blocks.map((block, blockIndex) => {
    const lines = block.split("\n");
    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      return <ul key={blockIndex} className="list-disc pl-4 space-y-1">{lines.map((line, lineIndex) =>
        <li key={lineIndex}>{renderInline(line.replace(/^\s*[-*]\s+/, ""), `${blockIndex}-${lineIndex}`)}</li>
      )}</ul>;
    }
    if (lines.length === 1 && /^#{1,3}\s/.test(lines[0])) {
      return <p key={blockIndex} className="font-semibold">{renderInline(lines[0].replace(/^#{1,3}\s+/, ""), `${blockIndex}-heading`)}</p>;
    }
    return <p key={blockIndex}>{lines.map((line, lineIndex) => <Fragment key={lineIndex}>{renderInline(line, `${blockIndex}-${lineIndex}`)}{lineIndex < lines.length - 1 && <br />}</Fragment>)}</p>;
  })}</div>;
}

export { MarkdownMessage };
