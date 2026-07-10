// Fetches the itch.io devlog for the in-app patch-notes viewer:
//   - fetchDevlogList(): the RSS feed → [{ title, link, date }] (newest first)
//   - fetchDevlogPost(url): that post's page → the full HTML body (sanitized)
// All fetching happens in the main process (no renderer network / CSP change). The
// dev's own devlog is semi-trusted, but we still strip scripts/handlers and the
// viewer's CSP blocks scripts, so the rendered notes can't execute anything.
import type { DevlogItem } from '../shared/types';

const RSS_URL = 'https://oinoon-man.itch.io/desktop-butter/devlog.rss';
const ORIGIN = 'https://oinoon-man.itch.io/';
const UA = 'DesktopButter-app';

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function tagText(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`, 'i'));
  return m ? m[1].trim() : '';
}

export async function fetchDevlogList(): Promise<DevlogItem[]> {
  const res = await fetch(RSS_URL, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`devlog RSS HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => ({
    title: decodeEntities(tagText(m[1], 'title')),
    link: tagText(m[1], 'link'),
    date: tagText(m[1], 'pubDate'),
  }));
}

// Pull the inner HTML of itch's `.post_body` div, counting nested <div>s so we stop
// at the matching close rather than the first one.
function extractPostBody(html: string): string | null {
  const at = html.search(/class="[^"]*\bpost_body\b[^"]*"/);
  if (at < 0) return null;
  const start = html.indexOf('>', at) + 1;
  let depth = 1;
  let i = start;
  while (i < html.length && depth > 0) {
    const open = html.indexOf('<div', i);
    const close = html.indexOf('</div>', i);
    if (close < 0) break;
    if (open >= 0 && open < close) {
      depth++;
      i = open + 4;
    } else {
      depth--;
      if (depth === 0) return html.slice(start, close);
      i = close + 6;
    }
  }
  return null;
}

function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export async function fetchDevlogPost(url: string): Promise<string> {
  if (!url.startsWith(ORIGIN)) throw new Error('refusing non-itch.io url');
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`devlog post HTTP ${res.status}`);
  const body = extractPostBody(await res.text());
  return body ? sanitize(body) : '';
}
