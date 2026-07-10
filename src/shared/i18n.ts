// ---------------------------------------------------------------------------
// UI localization (ko / ja / en). One flat table of user-visible strings, each
// with a translation per locale. Tray labels, window titles and the credits /
// opacity windows all read from here; the pet's spoken dialogue is localized
// separately via assets/data/dialogue.<locale>.json.
// Shared between main and renderer — import with plain `import` (values, not
// just types), since the credits/opacity renderers call t() too.
// ---------------------------------------------------------------------------

export type Locale = 'ko' | 'ja' | 'en';

export const LOCALES: Locale[] = ['ko', 'ja', 'en'];

/** Native name of each language, for the language picker (always self-labeled). */
export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  ja: '日本語',
  en: 'English',
};

export function isLocale(v: unknown): v is Locale {
  return v === 'ko' || v === 'ja' || v === 'en';
}

// The `{v}` placeholder in updateNow / verLabel is replaced with the app version.
const UI = {
  speechToggle: { ko: '말풍선 켜기/끄기', ja: '吹き出しのオン/オフ', en: 'Toggle speech bubbles' },
  interactToggle: {
    ko: '윈도우와 상호작용 켜기/끄기',
    ja: 'ウィンドウとの相互作用のオン/オフ',
    en: 'Toggle window interaction',
  },
  behind: { ko: '윈도우 맨 뒤로', ja: 'ウィンドウの最背面へ', en: 'Send behind windows' },
  copies: { ko: '친구들 데려오기', ja: '仲間を連れてくる', en: 'Bring friends' },
  char_butter: { ko: '버터', ja: 'バター', en: 'Butter' },
  char_komi: { ko: '코미', ja: 'コミ', en: 'Komi' },
  recall: { ko: '실종된 애 불러오기', ja: '迷子を呼び戻す', en: 'Recall lost pet' },
  stay: { ko: '기다려!', ja: '待て！', en: 'Stay!' },
  size: { ko: '크기 조절', ja: 'サイズ調整', en: 'Adjust size' },
  opacity: { ko: '투명도 조절', ja: '透明度の調整', en: 'Adjust opacity' },
  opacityLabel: { ko: '투명도', ja: '透明度', en: 'Opacity' },
  autostart: { ko: '로그인 시 자동 실행', ja: 'ログイン時に自動起動', en: 'Launch at login' },
  betaUpdates: { ko: '테스트(베타) 업데이트 받기', ja: 'テスト(ベータ)版を受け取る', en: 'Get beta updates' },
  language: { ko: '언어', ja: '言語', en: 'Language' },
  credits: { ko: '만든 사람들', ja: '制作スタッフ', en: 'Credits' },
  patchnotes: { ko: '패치노트', ja: 'パッチノート', en: 'Patch notes' },
  patchnotesFull: { ko: 'itch.io에서 전체 보기', ja: 'itch.ioで全文を見る', en: 'Read full post on itch.io' },
  patchnotesLoading: { ko: '불러오는 중…', ja: '読み込み中…', en: 'Loading…' },
  patchnotesError: {
    ko: '패치노트를 불러올 수 없어요 (인터넷 연결을 확인해 주세요)',
    ja: 'パッチノートを読み込めませんでした（接続を確認してください）',
    en: "Couldn't load the patch notes (check your connection)",
  },
  hide: { ko: '숨기기', ja: '隠す', en: 'Hide' },
  quit: { ko: '종료 (Ctrl+Shift+Q)', ja: '終了 (Ctrl+Shift+Q)', en: 'Quit (Ctrl+Shift+Q)' },
  updateNow: {
    ko: '✨ 지금 업데이트 (v{v})',
    ja: '✨ 今すぐアップデート (v{v})',
    en: '✨ Update now (v{v})',
  },
  updateAnnounce: { ko: '업데이트가 있대요!', ja: 'アップデートがあるって！', en: 'There’s an update!' },
  // Credits window
  rolePlanDev: { ko: '기획 · 개발', ja: '企画・開発', en: 'Design · Dev' },
  roleGraphic: { ko: '그래픽', ja: 'グラフィック', en: 'Art' },
  feedback: { ko: '건의사항 및 버그 제보', ja: 'ご意見・バグ報告', en: 'Feedback & bug reports' },
  disclaimer: {
    ko: '본 프로젝트는 Trickcal: Revive의 2차 창작 프로젝트로,\n공식 가이드라인을 준수합니다.',
    ja: '本プロジェクトは『Trickcal: Revive』の二次創作であり、\n公式ガイドラインを遵守しています。',
    en: 'A non-commercial Trickcal: Revive fan project,\nin line with the official guidelines.',
  },
} as const;

export type UIKey = keyof typeof UI;

/** Look up a UI string for a locale (falls back to Korean if somehow missing). */
export function t(locale: Locale, key: UIKey): string {
  const entry = UI[key];
  return (entry[locale] ?? entry.ko) as string;
}
