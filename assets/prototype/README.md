# 프로토타입 프레임 아트 규격 (M1 파이프라인)

여기에 그린 프레임을 넣으면 앱이 플레이스홀더 대신 실제 그림을 재생합니다.
`manifest.json`에 클립을 등록하는 즉시 반영됩니다 (앱 재시작 시 로드).

## 규격 (권장 기본값)

| 항목 | 값 |
|---|---|
| 캔버스 크기(1프레임) | **300 × 300 px** (창 크기와 동일, 투명 배경 PNG) |
| 앵커(기준점) | **발밑 중앙** — 캐릭터가 프레임 하단에 서도록 그리면 바닥 정렬이 맞음 |
| FPS | 8 ~ 12 (클립별로 지정) |
| 파일명 | `<클립>_00.png`, `<클립>_01.png` … (0부터, 2자리) |

> 실제 스프라이트가 없는 클립은 자동으로 플레이스홀더로 대체됩니다. 그래서
> `idle`만 먼저 그려 넣고 나머지는 나중에 채우는 식의 **점진적 작업**이 가능합니다.

## 클립 목록 (상태머신과 1:1)

| 클립 | 언제 | loop | 프레임 수(권장) |
|---|---|---|---|
| `idle` | 가만히 있을 때 | true | 2 ~ 4 |
| `walk` | 이동 | true | 4 ~ 8 |
| `drag` | 마우스로 잡혔을 때 | true | 1 ~ 2 |
| `fall` | 던져져 낙하 중 | true | 1 ~ 2 |
| `land` | 착지 순간(짧게) | false | 2 ~ 3 |
| `sleep` | 잘 때 | true | 2 ~ 4 |

## 폴더 구조 예시

```
assets/prototype/
  manifest.json
  idle/  idle_00.png  idle_01.png
  walk/  walk_00.png … walk_05.png
  drag/  drag_00.png
  fall/  fall_00.png
  land/  land_00.png  land_01.png  land_02.png
```

## manifest.json 예시

`frames` 경로는 `assets/prototype/` 기준 상대경로입니다.

```json
{
  "clips": {
    "idle": { "fps": 8,  "loop": true,  "frames": ["idle/idle_00.png", "idle/idle_01.png"] },
    "walk": { "fps": 12, "loop": true,  "frames": ["walk/walk_00.png", "walk/walk_01.png", "walk/walk_02.png", "walk/walk_03.png"] },
    "drag": { "fps": 6,  "loop": true,  "frames": ["drag/drag_00.png"] },
    "fall": { "fps": 6,  "loop": true,  "frames": ["fall/fall_00.png"] },
    "land": { "fps": 12, "loop": false, "frames": ["land/land_00.png", "land/land_01.png", "land/land_02.png"] },
    "sleep": { "fps": 4, "loop": true,  "frames": ["sleep/sleep_00.png", "sleep/sleep_01.png"] }
  }
}
```

좌우 이동은 코드가 자동으로 좌우 반전(mirror)하므로 **오른쪽 방향 기준으로만** 그리면 됩니다.
