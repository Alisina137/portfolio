import type { ReactNode } from 'react';
import type { ArticleBlock } from '@/lib/writing-core.mjs';
import { safeArticleHref } from '@/lib/writing-core.mjs';
import { WritingCode } from '@/components/writing-code';

/** React text escaping is deliberate: article Markdown never becomes raw HTML. */
function inline(text: string): ReactNode[] {
  const pattern = /(\[[^\]]+\]\([^\s)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const rendered: ReactNode[] = [];
  let from = 0; let i = 0;
  for (const match of text.matchAll(pattern)) {
    const token = match[0]; const index = match.index!;
    if (index > from) rendered.push(text.slice(from, index));
    const key = i++;
    if (token.startsWith('[')) {
      const parsed = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = parsed && safeArticleHref(parsed[2]);
      rendered.push(href ? <a key={key} href={href} {...(href.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{parsed![1]}{href.startsWith('https://') && <span className="sr-only"> (opens in a new tab)</span>}</a> : <span key={key}>{parsed?.[1] ?? token}</span>);
    } else if (token.startsWith('**')) rendered.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith('*')) rendered.push(<em key={key}>{token.slice(1, -1)}</em>);
    else rendered.push(<code key={key}>{token.slice(1, -1)}</code>);
    from = index + token.length;
  }
  if (from < text.length) rendered.push(text.slice(from));
  return rendered;
}

function highlighted(code: string, language: string) {
  if (!['ts', 'tsx', 'js', 'jsx', 'json', 'sql'].includes(language)) return code;
  const tokens: ReactNode[] = [];
  const regex = /(\/\/[^\n]*|--[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:export|import|from|const|let|var|function|return|if|else|new|type|interface|async|await|true|false|null|undefined|number|string|boolean|extends|default|select|where|insert|update|delete|create|table)\b|\b\d+(?:\.\d+)?\b)/gi;
  let from = 0; let i = 0;
  for (const match of code.matchAll(regex)) {
    const index = match.index!; const value = match[0];
    if (index > from) tokens.push(code.slice(from, index));
    const tone = value.startsWith('//') || value.startsWith('--') ? 'comment' : /^["'`]/.test(value) ? 'string' : /^\d/.test(value) ? 'number' : 'keyword';
    tokens.push(<span className={`syntax-${tone}`} key={i++}>{value}</span>);
    from = index + value.length;
  }
  if (from < code.length) tokens.push(code.slice(from));
  return tokens;
}
export function WritingBody({ blocks }: { blocks: ArticleBlock[] }) {
  return <div className="writing-prose">{blocks.map((block, index) => {
    switch (block.type) {
      case 'heading': return block.level === 2 ? <h2 id={block.id} key={index}>{inline(block.text)}</h2> : <h3 id={block.id} key={index}>{inline(block.text)}</h3>;
      case 'paragraph': return <p key={index}>{inline(block.text)}</p>;
      case 'quote': return <blockquote key={index}><p>{inline(block.text)}</p></blockquote>;
      case 'list': return <ul key={index}>{block.items.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>;
      case 'ordered': return <ol key={index}>{block.items.map((item, i) => <li key={i}>{inline(item)}</li>)}</ol>;
      case 'code': return <WritingCode key={index} code={block.text} language={block.language}>{highlighted(block.text, block.language)}</WritingCode>;
    }
  })}</div>;
}
