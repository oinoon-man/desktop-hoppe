// In-app patch-notes viewer. Main fetches the itch.io devlog (list + full post body);
// this renders the version list and the selected post. Links open in the browser.
import { t, isLocale, type Locale } from '../shared/i18n';
import type { DevlogItem } from '../shared/types';

interface PatchAPI {
  list: () => Promise<DevlogItem[]>;
  post: (url: string) => Promise<string>;
  openExternal: (url: string) => void;
}
const api = (window as unknown as { patchnotesAPI?: PatchAPI }).patchnotesAPI;

const loc: Locale = (() => {
  const p = new URLSearchParams(location.search).get('loc');
  return isLocale(p) ? p : 'ko';
})();
document.documentElement.lang = loc;

const listEl = document.getElementById('list') as HTMLElement;
const mainEl = document.getElementById('main') as HTMLElement;

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
}
function fmtDate(s: string): string {
  const d = new Date(s);
  return Number.isNaN(+d) ? '' : d.toLocaleDateString(loc);
}
// Every link (list "read full", or links inside the notes) opens in the browser.
function wireLinks(root: HTMLElement): void {
  root.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (href && /^https?:/i.test(href)) api?.openExternal(href);
    }),
  );
}

async function loadPost(item: DevlogItem, btn: HTMLElement): Promise<void> {
  listEl.querySelectorAll('button').forEach((b) => b.classList.remove('sel'));
  btn.classList.add('sel');
  mainEl.innerHTML = `<div class="status">${t(loc, 'patchnotesLoading')}</div>`;
  let body = '';
  try {
    body = await api!.post(item.link);
  } catch {
    /* fall through to the error/link footer below */
  }
  const inner = body || `<p class="status">${t(loc, 'patchnotesError')}</p>`;
  mainEl.innerHTML =
    `<h1>${esc(item.title)}</h1><div id="content">${inner}</div>` +
    `<div class="foot"><a href="${esc(item.link)}">${t(loc, 'patchnotesFull')} ↗</a></div>`;
  wireLinks(mainEl);
}

async function init(): Promise<void> {
  if (!api) {
    mainEl.innerHTML = `<div class="status">${t(loc, 'patchnotesError')}</div>`;
    return;
  }
  try {
    const items = await api.list();
    listEl.innerHTML = '';
    if (items.length === 0) {
      mainEl.innerHTML = `<div class="status">${t(loc, 'patchnotesError')}</div>`;
      return;
    }
    items.forEach((it, i) => {
      const b = document.createElement('button');
      b.innerHTML = `${esc(it.title)}<span class="date">${fmtDate(it.date)}</span>`;
      b.addEventListener('click', () => void loadPost(it, b));
      listEl.appendChild(b);
      if (i === 0) void loadPost(it, b); // auto-open the newest
    });
  } catch {
    listEl.innerHTML = '';
    mainEl.innerHTML = `<div class="status">${t(loc, 'patchnotesError')}</div>`;
  }
}

void init();
