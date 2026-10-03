# 쇼룸 3D 소품 지시서 (Meshy용)

첫 화면 3D 조형물과 묶음 표장에 올릴 작은 소품 6개를 Meshy로 만든다. 받침대, 행성, 금빛 나선 궤도, 조명, 회전 렌더는 Claude가 Blender에서 맡는다.

## 할 일

1. 아래 표의 소품을 Meshy로 만든다. 텍스트로 바로 만들어도 되고, 아스트라가 그린 소품 단독 그림을 넣으면(Image to 3D) 카드 그림과 화풍이 더 잘 맞는다.
2. GLB 파일로 내려받아 저장소 루트의 `art-raw/3d/` 폴더에 표의 파일 이름 그대로 저장한다. 이 폴더는 git에서 제외된다.
3. 다 넣으면 Claude에게 알린다. 일부만 넣어도 된다(없는 소품은 Blender 기본 도형으로 대신한다).

## Meshy 설정

- 스타일: 귀엽고 둥근 점토·장난감 느낌(stylized / cartoon). 사실적인 질감은 피한다.
- 텍스처: 켬(가능하면 PBR).
- 면 수: 3만~5만 이하.
- 내려받기 형식: GLB.
- 글자, 숫자, 로고는 넣지 않는다.

## 소품 목록

| # | 파일 이름 | 쓰는 곳 | 프롬프트 (영어 그대로) |
|---|---|---|---|
| 1 | `flask.glb` | 조형물 궤도, 02 묶음 표장 | A small round-bottom glass flask with glowing mint liquid and a cork stopper, cute stylized miniature, smooth clay toy look |
| 2 | `telescope.glb` | 조형물 궤도 | A tiny brass telescope on a short tripod, cute stylized miniature, rounded toy shapes, gold and navy |
| 3 | `rocket.glb` | 조형물 궤도 | A cute small rocket with round porthole windows and three fins, pastel lilac and gold, stylized clay toy |
| 4 | `books.glb` | 조형물 궤도 | A stack of three small books with rounded edges and blank covers, pastel rose, mint and sky blue, stylized miniature |
| 5 | `sprout.glb` | 조형물 궤도, 03 묶음 표장 | A small glowing seed with two round leaves sprouting from it, cute stylized clay toy, soft mint green |
| 6 | `race-car.glb` | 조형물 궤도 | A tiny rounded race car with a bubble cockpit, pastel sky blue with gold trim, cute stylized toy |

## 확인

- `art-raw/3d/`에 파일 이름이 표와 같은지.
- 모델에 글자나 로고가 없는지.
- 한 소품이 여러 조각으로 흩어져 있지 않은지(하나의 물체로 내려받기).
