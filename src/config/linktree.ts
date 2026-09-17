export type IconName =
  | "dorms-community"
  | "naver-blog"
  | "instagram"
  | "kakao-chat"
  | "kakao-group"
  | "download"
  | "manual"
  | "privacy"
  | "school"
  | "docs"
  | "contact"
  | "magazine"
  | "code"
  | "game";

export type Thumb =
  | { kind: "image"; src: string; alt: string }
  | { kind: "icon"; icon: IconName };

export type LinkItem = {
  name: string;
  description?: string;
  href: string;
  thumb?: Thumb;
};

export type LinkCard =
  | {
      kind: "group";
      id: string;
      number: string;
      name: string;
      description: string;
      thumb: Thumb;
      items: LinkItem[];
    }
  | {
      kind: "link";
      id: string;
      number: string;
      name: string;
      description: string;
      href: string;
      thumb: Thumb;
    };

export const profile = {
  teacherName: "도쌤",
  title: "DoRms 교사 도쌤",
  introTitle: "DoRms 교사 도쌤",
  introDescription: "웹앱으로 신나는 학교를 만들어보고 싶은 도쌤의 링크트리",
  catalogTitle: "DoRms 도쌤",
  catalogDescription: "수업 웹앱, 학급 운영 도구, 연수 자료를 한곳에 모았습니다."
};

export const cards: LinkCard[] = [
  {
    kind: "group",
    id: "dorms-activity",
    number: "01",
    name: "도름스 커뮤니티 나의 활동",
    description: "DoRms에서 나누고 있는 나의 활동을 모아두는 곳",
    thumb: { kind: "image", src: "/assets/dorms-community.png", alt: "DoRms community" },
    items: [
      {
        name: "도쌤 프로필 (내 글·내 앱 모아보기)",
        description: "DoRms에 쓴 글과 만든 앱을 한곳에서 모아보는 프로필 페이지",
        href: "https://dorms.school/u/f7fed535-6427-460a-b339-2a5f58bb89a8",
        thumb: { kind: "image", src: "/assets/dorms-community.png", alt: "DoRms community" }
      },
      {
        name: "도키피디아 웹북 (대백과 통합본)",
        description: "교사를 위한 AI·바이브코딩 대백과 열 권을 주소 하나로 모은 최신판",
        href: "https://dorms.school/apps/59f229d0-9f18-41e1-a708-4b73d83ab6c2",
        thumb: { kind: "icon", icon: "magazine" }
      },
      {
        name: "안티그래비티 교사용 하네스 패키지",
        description: "교사 인증 회원 전용, 안티그래비티용 교사 하네스 패키지",
        href: "https://dorms.school/board/p/016814f4-d12d-4846-8c02-d5cb648880cb",
        thumb: { kind: "icon", icon: "download" }
      },
      {
        name: "교과 방탈출 제작 키트",
        description: "교과 내용으로 방탈출 게임을 직접 만들 수 있는 제작 키트",
        href: "https://dorms.school/board/p/5ad32362-79ef-4c3f-96c5-a76a1c5216d1",
        thumb: { kind: "icon", icon: "game" }
      },
      {
        name: "바이브코딩 연수자료 1차시",
        description: "비개발자 선생님을 위한 바이브코딩 생존 가이드",
        href: "https://dorms.school/board/p/ae132e96-b4ee-472f-beb9-9a9f7266c3ff",
        thumb: { kind: "icon", icon: "manual" }
      },
      {
        name: "바이브코딩 연수자료 2차시",
        description: "AI와 함께 교실 도구를 만드는 실전 가이드",
        href: "https://dorms.school/board/p/ed888c63-1ffe-4a23-b3db-7888b8666e20",
        thumb: { kind: "icon", icon: "docs" }
      }
    ]
  },
  {
    kind: "group",
    id: "science-apps",
    number: "02",
    name: "수업에서 바로 쓰는 과학 웹앱",
    description: "설치 없이 링크 하나로 여는 과학 수업용 웹앱",
    thumb: { kind: "icon", icon: "game" },
    // DoRms에서 다른 제작자가 올리고 도쌤이 "함께 만든"으로만 표시된 앱은 넣지 않는다.
    // 예: "세포 이스케이프: 항상성 붕괴"(apps/0d294a5a-...), "딱! 이만큼-생활 연구소 방탈출"(apps/6573d388-...)
    items: [
      {
        name: "이중 슬릿 바코드 게임",
        description: "파장과 슬릿 간격을 바꿔가며 간섭무늬를 익히는 물리 게임",
        href: "https://dorms.school/apps/bf93ec92-e7ba-48a6-b9a1-836d6d1597f3",
        thumb: { kind: "icon", icon: "game" }
      },
      {
        name: "퀀텀 이스케이프: 라플라스의 실험실",
        description: "원자모형부터 역학적 평형까지 5막으로 푸는 물리 방탈출",
        href: "https://dorms.school/apps/0ce4cb41-88d0-4878-8ed7-f154ab3df50c",
        thumb: { kind: "icon", icon: "game" }
      },
      {
        name: "퀀텀 이스케이프 II: 세컨드 오빗",
        description: "역학과 에너지를 주제로 3개 방, 15개 장치를 푸는 물리 방탈출",
        href: "https://dorms.school/apps/602d7eb5-a18f-4b87-bdb8-8e8b56fedcbb?cat=%EA%B5%90%EA%B3%BC%C2%B7%EC%88%98%EC%97%85",
        thumb: { kind: "icon", icon: "game" }
      },
      {
        name: "사이언스 레거시: 세 개의 유산",
        description: "애닝의 발굴장부터 미래 심의회까지, 3개 관·10개 장치로 푸는 통합과학2 방탈출",
        href: "https://dorms.school/apps/ee717e6f-2621-4b1f-860a-7e4c5b80fcc7",
        thumb: { kind: "icon", icon: "game" }
      },
      {
        name: "도쌤Lab 역학과 에너지 탐구 시뮬레이터",
        description: "실험 기구 없이 링크 하나로 조작하고 기록하는 역학과 에너지 탐구활동 15종",
        href: "https://dorms.school/apps/e87b31ed-c1f7-4704-90c4-9f24b8795b59",
        thumb: { kind: "icon", icon: "school" }
      },
      {
        name: "EcoInquiry 환경 탐구 도우미",
        description: "우리 지역 특성에 맞는 환경 탐구 주제와 가설을 1분 만에",
        href: "https://dorms.school/apps/c071e6b8-52d1-419b-81c6-4f09405c2975",
        thumb: { kind: "icon", icon: "school" }
      },
      {
        name: "별헤는 교실",
        description: "관측 위치와 날짜로 실제 밤하늘을 재현하는 천체관측 수업 플래네타리움",
        href: "https://dorms.school/apps/7892e65a-1cdd-4424-ab12-c2f0fa14101c?cat=%EA%B5%90%EA%B3%BC%C2%B7%EC%88%98%EC%97%85&sort=hot&layout=card",
        thumb: { kind: "icon", icon: "game" }
      }
    ]
  },
  {
    kind: "group",
    id: "classroom-tools",
    number: "03",
    name: "학급 운영과 업무 도우미",
    description: "교실 운영과 행정 업무의 손을 덜어주는 도구",
    thumb: { kind: "icon", icon: "school" },
    items: [
      {
        name: "1인1역 정령 소환",
        description: "1인1역을 해내면 씨앗을 모아 정령을 소환하는 학급 보상 시스템",
        href: "https://dorms.school/apps/8fa612f1-50df-41ce-89a6-4856106b47c7",
        thumb: { kind: "icon", icon: "school" }
      },
      {
        name: "에듀파인 품의 도우미",
        description: "견적서 캡처를 AI가 읽어 품의서와 품목 엑셀을 자동으로",
        href: "https://dorms.school/apps/b83026b7-f061-4f1a-944e-2b2c3b5e834d",
        thumb: { kind: "icon", icon: "manual" }
      },
      {
        name: "오늘의 기분",
        description: "QR 한 번으로 퀴즈·찬반 토론·워드클라우드 응답을 화면에 실시간으로 모으는 도구",
        href: "https://dorms.school/apps/80dcc2aa-0fe7-472f-acc9-b39f08f8ac29",
        thumb: { kind: "icon", icon: "school" }
      }
    ]
  },
  {
    kind: "link",
    id: "instagram",
    number: "04",
    name: "인스타그램",
    description: "만드는 과정과 소식을 짧게 남기는 곳",
    href: "https://www.instagram.com/dossam_lab",
    thumb: { kind: "icon", icon: "instagram" }
  },
  {
    kind: "link",
    id: "contact",
    number: "05",
    name: "연락처",
    description: "dossamlab@gmail.com",
    href: "mailto:dossamlab@gmail.com",
    thumb: { kind: "icon", icon: "contact" }
  }
];
