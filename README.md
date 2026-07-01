# Hoppe — Desktop Pet

자유롭게 돌아다니고 창과 상호작용하는 데스크탑 펫. 랜덤 말풍선 대사 포함.

> **2차 창작 / 비영리 고지**
> 본 프로젝트는 **트릭컬 리바이브 (Trickcal: Chibi Go)** 의 캐릭터 컨셉을 사용하는 **비영리 팬 프로젝트**입니다.
> 원작의 저작권은 각 권리자에게 있으며, 본 프로젝트의 그래픽 리소스는 직접 제작합니다.
> 캐릭터 디자인·대사는 원작 컨셉을 참고하며, 상업적 목적으로 사용하지 않습니다.

---

## 기술 스택

- **Electron** — 투명 / 최상단 / 클릭 통과 데스크탑 창
- **TypeScript** + **esbuild** — 번들링
- 애니메이션: 프로토타입은 프레임 시퀀스 → 완성본은 Adobe Animate (HTML5 Canvas / CreateJS)

## 개발

```bash
npm install          # 최초 1회 (electron 다운로드 포함)
npm start            # 빌드 후 실행
npm run debug        # DevTools를 띄운 채 실행
npm run dev          # 파일 변경 시 자동 리빌드 (watch)
npm run typecheck    # 타입 검사만
npm run pack         # 패키징 (release/win-unpacked/Hoppe.exe — 설치 없이 실행)
npm run dist:win     # 설치본(NSIS) + 포터블 빌드 (release/*.exe)
```

## 자동 업데이트 (electron-updater)

설치본(**NSIS**)은 실행 중 GitHub Releases를 확인해 새 버전을 **백그라운드로 내려받고**, 앱을
종료할 때 조용히 설치합니다. 새 버전이 준비되면 **펫이 "업데이트가 있대요!" 라고 알리고**,
트레이에 **"✨ 지금 업데이트"** 항목이 생겨 즉시 재시작·설치할 수 있어요. (포터블 exe는 설치
과정이 없어 자동 업데이트 대상이 아니며, `npm start` 개발 실행에서도 비활성입니다.)

**배포처 설정 (실제 동작에 필수):**

1. 공개 GitHub 저장소를 만들고 `package.json`의 `build.publish.owner`를 그 계정명으로 교체
   (현재 `REPLACE_WITH_GITHUB_OWNER`, `repo`는 `desktop-hoppe`).
2. `package.json`의 `version`을 올린다 (SemVer; 1.0.0 이전은 개발 단계).
3. `GH_TOKEN` 환경변수(repo 권한 PAT)를 설정하고 `npx electron-builder --win --publish always`
   로 빌드+릴리스 업로드. 그러면 설치된 앱들이 다음 체크 때 새 버전을 받습니다.

- **트레이 아이콘:** (업데이트 준비 시 ✨ 지금 업데이트) · 말풍선 on/off · 창 위 올라타기 on/off · 펫 수(1–4) · **대사 편집…** · 로그인 시 자동 실행 · 종료
- **대사 편집:** 트레이 → 대사 편집 창에서 상황별로 한 줄에 하나씩 입력·저장 → 실행 중 펫에 즉시 반영 (`%APPDATA%\desktop-hoppe\dialogue.json`)
- **이동:** 펫을 마우스로 잡아서 드래그 (걷거나 날아가는 중에도 잡힘)
- **창 위 올라타기:** 펫을 브라우저·앱 창 위로 던지면 상단 모서리에 앉고, 창을 옮기면 따라 이동
- **종료:** `Ctrl+Shift+Q` 또는 펫 우클릭 → Quit
- 펫의 투명한 영역은 클릭이 뒤 창으로 통과됩니다.

## 마일스톤

- [x] **M0** — 투명·최상단·클릭통과 창 + 픽셀 히트테스트 + 드래그
- [x] **M1** — 상태머신(idle/walk/drag/fall/land) + 중력/던지기 물리 + 프레임 애니메이션 재생기 + assets 파이프라인
- [x] **M2** — 행동 스케줄러(+수면) + 말풍선 UI + 상황별 대사 풀
- [x] **M3** — Win32 창 감지(koffi FFI) → 창 위 올라타기·걷기·타고 이동 (Shimeji식)
- [~] **M4 (라벨 대기)** — Adobe Animate → CreateJS 로더 구현·검증 완료(테스트 export의 단일 루프를 전 상태에 적용). 상태별 라벨 재생은 라벨 포함 export 대기 · 아트 규격: [ARTIST_GUIDE.md](assets/animate/ARTIST_GUIDE.md)
- [x] **M5** — 트레이 설정(말풍선·올라타기·펫 수·자동시작) + 멀티 펫 + electron-builder 패키징
- [~] **M6 (배포처 대기)** — electron-updater 자동 업데이트(GitHub Releases) + 펫 대사·트레이 알림. 코드 완료, `build.publish.owner`에 실제 저장소만 연결하면 동작

## 폴더 구조

```
src/
  shared/     main↔renderer 공유 타입
  main/       Electron 메인
    sim.ts       시뮬레이션/물리/상태머신 (+창 위 올라타기)
    windows.ts   Win32 창 감지 (koffi FFI)
    settings.ts  설정 저장 (userData/settings.json)
    main.ts      창·트레이·멀티 펫·IPC
  renderer/   뷰: anim/(프레임·플레이스홀더·CreateJS) · speech/(말풍선)
scripts/
  build.mjs   esbuild 빌드 (assets → dist 복사 포함)
assets/
  prototype/  프레임 스프라이트 + manifest.json
  animate/    Adobe Animate → CreateJS 산출물 + ARTIST_GUIDE.md
  vendor/     createjs.min.js (런타임)
  data/       dialogue.json (대사 풀)
release/      electron-builder 패키징 산출물 (빌드 시 생성)
```
