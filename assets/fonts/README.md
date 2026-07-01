# UI 폰트 — 원스토어 ONE 모바일POP

말풍선/플레이스홀더에 쓰는 폰트입니다. 아래 파일을 이 폴더에 넣으면 자동 적용됩니다
(넣기 전에는 시스템 한글 폰트로 폴백). 수정 후 `npm start`로 재실행하면 반영됩니다.

## 폰트

- **이름:** 원스토어 ONE 모바일POP (ONE Mobile POP) — ㈜원스토어 제공
- **라이선스:** 개인·기업 **상업적 사용 무료**. 단, 폰트 파일 자체의 **판매·수정·재배포는 금지**.
  → 앱에 **동봉하여 공개 배포**하는 경우엔 "임베딩/번들 배포 허용" 여부를 배포 전 확인 권장.
- **다운로드:** [눈누(noonnu)](https://noonnu.cc/font_page/676) · [원스토어 글꼴](https://www.onestorecorp.com/sv/fordev_font/)

## 넣는 법

받은 OTF/TTF를 **`one-mobile-pop`** 이름으로 저장(우선순위 woff2 → otf → ttf):

```
assets/fonts/
  one-mobile-pop.otf     (원스토어 제공 OTF를 이 이름으로)
  one-mobile-pop.ttf     (또는 TTF)
  one-mobile-pop.woff2   (선택 — 가장 가벼움; otf/ttf를 변환해 두면 로딩이 빠름)
```

- CSP에 `font-src 'self'` 를 열어 두어 로컬 폰트 로드가 허용됩니다.
- 다른 파일명을 쓰려면 `src/renderer/index.html` 의 `@font-face` 경로만 바꾸면 됩니다.
