# 쇼룸 링크트리 그림 지시서 (아스트라용)

도쌤 링크트리(`showroom` 브랜치)의 카드 그림 17장을 만든다. 코드는 Claude가 따로 맡는다.

## 할 일

1. 아래 **공통 화풍** 문장을 모든 프롬프트 앞에 붙여 그림을 만든다.
2. 1번(`gamma-grand-prix`)을 먼저 만들어 사용자에게 보여 주고 화풍 확인을 받는다.
3. 확인되면 1번 그림을 기준 이미지로 함께 넣어 나머지 16장을 같은 화풍으로 만든다.
4. 결과는 저장소 루트의 `art-raw/` 폴더에 PNG로, 표의 파일 이름 그대로 저장한다.

지킬 것:
- `art-raw/` 밖의 파일은 만들거나 고치지 않는다.
- git 명령과 패키지 설치는 하지 않는다.
- 변환(WebP)과 커밋은 Claude가 한다.

## 화풍 확정 (2026-10-03)

1번 `gamma-grand-prix.png`로 화풍을 확정했다. 나머지 그림은 이 그림을 기준 이미지로 넣되 아래를 지킨다.

- 따라 할 것은 화풍뿐이다: 둥근 남색 받침대와 금테, 왼쪽 위 금빛 조명, 남색 별 배경, 점토·장난감 재질, 카메라 높이와 각도. 1번에 나온 물체(떠다니는 행성, 시계, 서킷)는 그 장면에만 쓰고 다른 그림에 넣지 않는다.
- 장면마다 주인공 하나가 분명해야 한다. 주요 소품은 3~5개로 줄이고, 작은 구슬이나 행성을 흩뿌려 채우지 않는다. 폰에서는 카드 폭이 160px라 작은 것이 많으면 지저분해 보인다.
- 받침대 전체가 보이고, 피사체가 그림 높이의 70% 안팎을 차지하게 1번과 비슷한 크기로 맞춘다.

## 크기

- 카드 16장: 4:5 세로, 최소 1200x1500 (가능하면 1600x2000).
- 배경 1장: 16:9 가로, 최소 2400x1350.
- 피사체는 가운데에 두고 사방에 10% 정도 여백을 둔다. 카드가 작게 잘려도 주인공이 보이도록.

## 공통 화풍 (영어 그대로 붙임)

```text
Isometric 3D miniature diorama, handcrafted clay and painted-resin toy look, soft rounded shapes, tilt-shift macro photography with shallow depth of field. The diorama sits on a small round pedestal in the center, displayed like a museum exhibit at night: deep navy seamless background (#0C0F24) with a faint starry gradient, a warm golden spotlight from the upper left, gentle lilac rim light, soft contact shadows. Palette: deep navy, warm gold (#F2C879), lilac (#A9B8E8), with soft pastel accents (rose #E7C6DC, mint #CFE0D6, sky #9BB4D4). Clean, cute, premium, consistent lighting. No text, no letters, no numbers, no logos, no watermark.
```

## 금지

- 글자, 숫자, 로고, 워터마크. 들어가면 다시 만든다.
- 실존 인물이나 실제 학생 얼굴. 사람은 작고 단순한 장난감 피규어로만.
- 다른 서비스의 로고나 캐릭터.
- 다른 사이트(예: AI EDU Showroom)의 그림을 참고하거나 따라 그리기.

## 항목별 장면

| # | 파일 이름 | 링크 | 장면 (공통 화풍 뒤에 붙임) |
|---|---|---|---|
| 1 | `gamma-grand-prix.png` | 감마 그랑프리 | A tiny racing circuit floating in space around a glowing planet, a small rounded race car speeding with streaks of light behind it, little clocks along the track stretching slightly to hint at time dilation. |
| 2 | `dokipedia.png` | 도키피디아 웹북 | A miniature bookshelf of ten colorful books, one book open with glowing pages floating out of it, a tiny laptop beside it with a soft screen glow. |
| 3 | `antigravity-harness.png` | 안티그래비티 교사용 하네스 패키지 | A small open toolbox kit with a laptop floating above it, held steady by soft safety harness straps, a plain shield-shaped emblem and tiny gears hovering around. |
| 4 | `escape-kit.png` | 교과 방탈출 제작 키트 | A crafting workbench with a miniature escape-room box under construction: tiny padlocks, keys, blank puzzle cards, a rolled blueprint and small craft tools. |
| 5 | `vibe-training-1.png` | 바이브코딩 연수자료 1차시 | A tiny teacher figure at a desk with a laptop, wearing a small explorer backpack with a compass, colorful building blocks floating out of the screen, a cozy first-step feeling. |
| 6 | `vibe-training-2.png` | 바이브코딩 연수자료 2차시 | A small workshop table where a tiny teacher figure and a cute round robot assemble classroom tools from building blocks: a small quiz board, a timer and a bar chart. |
| 7 | `double-slit.png` | 이중 슬릿 바코드 게임 | A miniature optics lab: a tiny laser sends a beam through a plate with two slits, projecting a striped interference pattern that looks like a barcode onto a small screen. |
| 8 | `quantum-escape.png` | 퀀텀 이스케이프: 라플라스의 실험실 | A vintage miniature physics laboratory room with a locked round door, a large atom model with orbiting electrons, brass instruments and a balance scale. |
| 9 | `quantum-escape-2.png` | 퀀텀 이스케이프 II: 세컨드 오빗 | A miniature space station shown in cutaway with three connected rooms: a swinging pendulum, a spring launcher and a ramp with a rolling ball, a small orbit ring around the station. |
| 10 | `science-legacy.png` | 사이언스 레거시: 세 개의 유산 | A miniature museum with three small halls side by side: a fossil dig site with an ichthyosaur skeleton in a seaside cliff, a laboratory with flasks, and a futuristic round council chamber with a glowing globe. |
| 11 | `dossam-lab.png` | 도쌤Lab 통합 과학 탐구 시뮬레이터 | A long miniature lab bench crowded with tiny experiments: an inclined plane with a cart, beakers with colorful liquids, magnets with iron filings and a small solar system model, all softly glowing like interactive exhibits. |
| 12 | `eco-inquiry.png` | EcoInquiry 환경 탐구 도우미 | A tiny riverside town with trees and houses, two small student figures taking a water sample and looking through a magnifying glass, a measuring stick standing in the river. |
| 13 | `stargazing-class.png` | 별헤는 교실 | A miniature classroom with an open dome ceiling showing a starry sky with glowing constellation lines, a small telescope, tiny student figures pointing upward. |
| 14 | `spirit-summon.png` | 1인1역 정령 소환 | A cozy miniature classroom garden: small desks with seed pots, glowing seeds sprouting into cute little forest spirits made of leaves and light, a tiny blank quest board. |
| 15 | `edufine-draft.png` | 에듀파인 품의 도우미 | A miniature office desk: a small scanner reading a paper sheet, pages flowing into a neat glowing spreadsheet grid on a tiny monitor, a friendly little robot assistant stamping a document. |
| 16 | `today-mood.png` | 오늘의 기분 | A miniature classroom with a large screen showing floating colorful blank speech bubbles and a cloud of blank word tiles, tiny student figures holding phones toward an abstract square pattern. |
| 17 | `hero-bg.png` | 첫 화면 배경 (16:9) | A wide panoramic view of a miniature night science museum hall: rows of small glowing display pedestals with tiny exhibits (planet, atom, telescope, beaker), a domed ceiling full of stars, golden spotlights, a large dark empty area in the center for a title, very soft and slightly blurred. |

도쌤 프로필 카드는 기존 DoRms 대표 이미지를 쓰므로 만들지 않는다.

## 끝내기 전 확인

- `art-raw/`에 위 17개 파일 이름이 정확히 있는지.
- 17장 모두 조명 방향, 남색 바탕, 둥근 받침대가 같은 화풍인지.
- 글자나 숫자가 들어간 그림이 없는지.
