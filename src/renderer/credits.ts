// Credits window renderer: localizes the static markup from the ?loc= query that
// main passes on load. Elements carry data-i18n / data-i18n-title attributes whose
// value is a key into the shared UI string table.
import { t, isLocale, type Locale, type UIKey } from '../shared/i18n';

const rawLoc = new URLSearchParams(location.search).get('loc');
const loc: Locale = isLocale(rawLoc) ? rawLoc : 'ko';

document.documentElement.lang = loc;
document.title = t(loc, 'credits');

for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-i18n]'))) {
  el.textContent = t(loc, el.dataset.i18n as UIKey);
}
for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-i18n-title]'))) {
  el.title = t(loc, el.dataset.i18nTitle as UIKey);
}
