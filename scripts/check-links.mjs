// Checks src/config/linktree.ts against the repo rules. Run: npm run check
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { cards } from "../src/config/linktree.ts";

// Apps made by other teachers that only credit Dossam as a collaborator.
const EXCLUDED_APP_IDS = [
  "0d294a5a-001e-41db-ab65-b659d988f0be",
  "6573d388-b61c-42aa-8d16-1a662ef93bc0"
];

const first = cards[0];
assert.equal(first.kind, "group", "첫 카드는 묶음이어야 함");
assert.equal(first.name, "도름스 커뮤니티 나의 활동", "첫 묶음 이름은 고정");
assert.equal(first.thumb.kind === "image" && first.thumb.src, "/assets/dorms-community.png", "첫 묶음 대표 이미지는 고정");

const groups = cards.filter((card) => card.kind === "group");
const items = groups.flatMap((group) => group.items);
const ids = new Set();

for (const group of groups) {
  assert.ok(group.shortName?.trim(), `shortName 없음: ${group.id}`);
  if (group.emblem) assert.ok(existsSync(`public${group.emblem}`), `표장 파일 없음: public${group.emblem}`);
}

for (const item of items) {
  assert.match(item.id ?? "", /^[a-z0-9]+(-[a-z0-9]+)*$/, `id 형식 오류: ${item.name}`);
  assert.ok(!ids.has(item.id), `id 중복: ${item.id}`);
  ids.add(item.id);
  assert.ok(item.tag?.trim(), `tag 없음: ${item.id}`);
  for (const excluded of EXCLUDED_APP_IDS) assert.ok(!item.href.includes(excluded), `제외 앱 포함: ${item.name}`);
  if (item.cover) {
    for (const size of [480, 960]) {
      const file = `public${item.cover}-${size}.webp`;
      assert.ok(existsSync(file), `그림 파일 없음: ${file}`);
    }
  }
}

assert.ok(!JSON.stringify(cards).includes("—"), "긴 줄표 문자는 쓰지 않음");
console.log(`ok: 묶음 ${groups.length}개, 링크 ${items.length}개`);
