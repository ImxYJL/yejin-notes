# CLAUDE.md

## 개요

— 개인 블로그/아카이브. 카테고리별(`dev`/`reading`/`life`) 마크다운 문서를 뷰어로 보여주고, 어드민(단일 관리자)이 작성·수정·임시저장·발행한다.

- 스택: Next.js 16(App Router) + Supabase + React Query + Zustand + Tailwind
- **상세 구조는 `docs/architecture.md`를 먼저 읽을 것** (폴더 구조 / 모듈 역할 / 데이터 흐름)

### 명령어

- 패키지 매니저는 **yarn**(berry)이다. `npm`/`pnpm`은 쓰지 않는다.
- 표준 스크립트(`dev`/`build`/`start`/`lint`)는 `package.json`을 참고한다.
- 테스트 명령은 없다 (테스트 미도입 — `docs/architecture.md` §7).

## 코딩 규칙

- **구조 변경 시 문서 최신화**: 폴더 구조, 계층(services/apis/queries), 데이터 흐름, 주요
  모듈 역할에 영향을 주는 변경을 하면 **반드시 `docs/architecture.md`도 함께 업데이트한다**.
- **계층 경계를 지킨다**:
  - 서버 전용 로직은 `import 'server-only'`를 유지한다.
  - 클라이언트는 Supabase에 직접 접근하지 않는다. `apis/` → `app/api/` → `services/` 흐름을 따른다.
  - React Query 훅은 `queries/`에 두고, 그 안에서 `apis/`를 소비한다.
- **권한 검사**: 비공개 글 조회, 글 수정·삭제 등 어드민 전용 서버 로직은 진입부에서
  `validateAdmin()`을 호출한다. 어드민 경로 보호는 `middleware.ts`가 담당한다.
- **캐시 무효화**: 포스트 쓰기(발행/수정/삭제) 시 관련 `revalidateTag`(해당 글·카테고리·인접 글)를
  누락 없이 호출한다. 캐시 키/태그는 `constants/blog.tsx`의 `NEXT_CACHE_KEY` / `NEXT_CACHE_TAG`를 사용한다.
- **경로/엔드포인트**는 하드코딩하지 말고 `constants/paths.ts`(`PAGE_PATH`, `API_ENDPOINT`)를 사용한다.
- **API 응답 형식**은 `{ success, data }`로 통일하고, 에러는 `handleRouteError` / `AppError`로 처리한다.
- 스타일: Prettier(`.prettierrc`) + Tailwind 클래스 정렬 플러그인, ESLint(`eslint.config.mjs`)를 따른다.

## 설계 의도

> "왜 이렇게 했는가"를 적는 곳. 코드만 봐선 알 수 없는 결정을 기록한다.

- **services 계층을 API Route와 분리한 이유**:
  API Route는 조립을 담당하고, services 계층은 순수 백엔드 로직을 담당한다. 서버 컴포넌트와 Route Handler가 같은 `services` 함수를 공유해 로직 중복을 막기도 한다.
- **공개 조회에 `unstable_cache` + 태그 무효화를 쓴 이유**: 공개 글은 SSG 페이지로 빌드하므로, 데이터 수정 시 추가 빌드 없이 최신화하기 위해서다.
- **임시저장을 별도 테이블이 아닌 `posts.draft_data`(JSON)에 둔 이유**: 임시저장 데이터를 버전별·수정 이력 등과 함께 복잡하게 쓰지 않고, 단순하게 글 상태의 일부로 남겨두기 위해 단일 테이블에서 컬럼으로 관리한다.
- **axios(`apis/`)는 클라이언트 전용**: 서버 컴포넌트/Route Handler는 `/api`를 거치지 않고 `services/`를 직접 호출한다.
- **어드민 판별을 role이 아닌 `ADMIN_EMAIL` 비교로 한 이유**: 개인용 블로그라 어드민 유저를 role로 구분할 필요 없이, 이메일을 하드코딩하면 되기 때문이다.
- **페이지네이션을 쿼리(`?page=`)가 아닌 경로(`/posts/page/[page]`)로 둔 이유**:
  path 파라미터라야 `generateStaticParams`로 페이지별 정적 페이지(SSG)를 미리 구울 수 있기 때문이다.
  경로 기반이라 URL이 깔끔·예측 가능하고, 정적 페이지라 CDN 캐싱에도 그대로 얹힌다.
  (WordPress의 `/page/N/` 등 여러 블로그·뉴스 서비스가 쓰는 관례이며, 그 관례의 근거가 위와 같다.)
- **1페이지에 `/page/1` 경로를 두지 않는 이유(SEO 정규화)**:
  1페이지 목록이 `/posts`와 `/posts/page/1` 두 URL로 중복 노출되는 것을 막고, 첫 페이지를 하나의
  canonical 진입 URL(`/posts`)로 통일해 링크·공유·검색 유입을 한 곳에 모으기 위해서다.
  그래서 정적 생성은 2페이지부터(`i + 2`) 하고, `/posts/page/1` 접근은 `/posts`로 redirect한다.

## 참고

- 상세 구조 / 데이터 흐름: `docs/architecture.md`
- 환경 변수: `docs/architecture.md`
