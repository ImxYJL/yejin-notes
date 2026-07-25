# Architecture

> 이 문서는 **프로젝트의 상세 구조**(스택 / 폴더 구조 / 주요 모듈 역할 / 데이터 흐름)를 담는다.
> **중요한 구조 변경 시 이 문서도 함께 최신화**한다.
> "왜 이렇게 설계했는가"(의도)는 루트 `CLAUDE.md`의 _설계 의도_ 섹션을 참고.

## 1. 스택

| 영역            | 기술                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| 프레임워크      | Next.js 16 (App Router, React 19, React Compiler)                             |
| 언어            | TypeScript                                                                    |
| 백엔드/DB       | Supabase (Postgres + Auth + Storage, RLS 기반 접근 제어)                      |
| 서버 상태       | TanStack React Query v5                                                       |
| 클라이언트 상태 | Zustand (theme / layout / toast)                                              |
| HTTP            | axios (인스턴스 + 인터셉터)                                                   |
| 마크다운        | react-markdown + remark(gfm, breaks) + rehype(pretty-code, highlight) + shiki |
| 스타일          | Tailwind CSS v4 (+ typography), clsx / tailwind-merge                         |
| 인증            | Supabase Auth (Google OAuth)                                                  |
| 패키지 매니저   | Yarn (berry, `.yarnrc.yml`)                                                   |

**명령어**: `yarn dev` (개발) · `yarn build` · `yarn start` · `yarn lint` · `yarn reset` (`.next` 삭제 후 재빌드)

## 2. 폴더 구조 (`src/`)

```
src/
├── middleware.ts          # 어드민 경로 인증 가드 (Supabase 세션 검사)
├── app/                   # Next.js App Router
│   ├── (viewer)/          # 공개 뷰어 라우트 그룹
│   │   ├── [categorySlug]/posts/            # 목록 + 페이지네이션(/page/[page])
│   │   ├── [categorySlug]/posts/[id]/       # 포스트 상세
│   │   └── components/{server,client}/      # 뷰어 전용 컴포넌트
│   ├── (admin)/           # 어드민 라우트 그룹
│   │   └── admin/
│   │       ├── [categorySlug]/posts/        # 어드민 목록/상세(비공개 포함)
│   │       └── edit/[[...id]]/              # 글 작성·수정 에디터 (신규/수정 겸용)
│   ├── login/             # 로그인 페이지
│   ├── auth/callback/     # OAuth 콜백 (code → session 교환)
│   └── api/               # Route Handlers (BFF 계층)
│       ├── posts/         # 공개 포스트 조회
│       ├── admin/posts/   # 어드민 CRUD + drafts(임시저장)
│       └── auth/me/       # 현재 사용자 정보
├── apis/                  # 클라이언트 → /api 호출 함수 (axios 래핑)
├── queries/               # React Query 훅 (apis 소비) + queryKey
├── services/              # 서버 전용 비즈니스 로직 (Supabase 직접 접근, 'server-only')
├── libs/                  # 외부 라이브러리 클라이언트 설정 (supabase / axios / tanstack)
├── components/            # 공용 컴포넌트 (common / markdown / editor)
├── hooks/                 # 클라이언트 훅 (autoSave, scrollSync, device 등)
├── store/                 # Zustand 스토어 (theme / layout / toast)
├── constants/             # 경로/카테고리/캐시키/시스템 상수
├── utils/                 # 순수 유틸 + providers + 스타일/마크다운 헬퍼
└── types/                 # 도메인 타입 (blog / auth / file / page / error)
```

## 3. 주요 모듈 역할

### 계층 구조 (요청 흐름의 뼈대)

- **`services/`** — 서버 전용. `import 'server-only'`로 클라이언트 번들 유입 차단. Supabase에 직접 쿼리하고 도메인 로직/권한 검사(`validateAdmin`)/캐시 무효화를 수행. Route Handler와 서버 컴포넌트가 소비.
- **`app/api/`** — Route Handler(BFF). `services`를 호출하고 `{ success, data }` 형태로 응답을 표준화. 에러는 `handleRouteError`로 일괄 처리.
- **`apis/`** — 클라이언트에서 `/api`를 호출하는 얇은 함수. `axiosInstance` 사용, 응답의 `data.data`를 언랩.
- **`queries/`** — `apis`를 감싼 React Query 훅. 캐싱/`staleTime`/`placeholderData` 관리.

### 인증/권한

- **`middleware.ts`** — `/admin`, `/api/admin` 경로에 대해 Supabase 세션·어드민 이메일 검사. 페이지는 `/login` 리다이렉트, API는 401 반환.
- **`services/authService.ts`** — `getAuthUser` / `checkIsAdmin` / `validateAuth` / `validateAdmin`. 어드민 판별은 `user.email === ADMIN_EMAIL`.
- **`libs/supabase/`** — `server.ts`(SSR, 쿠키 기반, RLS `auth.uid()`), `client.ts`(anon, 공개 데이터용).

### 캐싱

- 공개 조회는 `unstable_cache` + 태그(`NEXT_CACHE_TAG`)로 캐시. 쓰기(발행/수정/삭제) 시 `revalidateTag`로 해당 포스트·카테고리·인접 글(prev/next) 캐시를 무효화.

### 에디터 & 임시저장

- `app/(admin)/admin/edit/[[...id]]/` — 신규/수정 겸용 에디터.
- **임시저장**: `posts` 테이블의 `draft_data`(JSON) 컬럼에 저장. 발행 시 `draft_data`를 `null`로 비움. 에디터 로드 시 `draft_data`가 있으면 우선 사용(`mapEditorPostResponse`).
- `hooks/useAutoSave.ts` — debounce 자동 임시저장.
- `hooks/useScrollSync.ts` — 에디터/프리뷰 스크롤 동기화.

### 도메인

- 카테고리: `dev` / `reading` / `life` (`CATEGORY_KEYS`, `CATEGORY_MAP`).
- 포스트 플래그: `is_published`(발행), `is_private`(비공개). 공개 목록은 둘 다 만족하는 글만 노출.

## 4. 데이터 흐름

### 공개 포스트 조회 (읽기)

경로가 둘로 나뉜다. **서버 컴포넌트는 `services/`를 직접 호출**하고(axios/api 안 거침),
**클라이언트 훅만 axios → api 를 경유**한다.

```
[서버 컴포넌트 · SSG/SSR]  posts/page.tsx
  → services/postService.getPublicPosts (unstable_cache)
  → libs/supabase/client (anon, RLS: 공개 글만) → Postgres

[클라이언트]  usePublicPosts (React Query)
  → apis/posts (axios) → app/api/posts (Route Handler)
  → services/postService.getPublicPosts (unstable_cache)
  → libs/supabase/client (anon) → Postgres
```

### 어드민 쓰기 (발행/수정)

```
에디터 폼 → apis/posts.savePostApi → app/api/admin/posts (Route Handler)
  → services/postService.publishPost
      ├─ validateAdmin() (authService)
      ├─ upsert into posts (draft_data = null)
      └─ revalidateTag(post / categoryPosts / posts / 인접 글)
  → libs/supabase/server (SSR, 쿠키+RLS auth.uid())
```

### 인증 (로그인)

```
/login → Google OAuth → /auth/callback (route.ts)
  → authService.exchangeCode (code → session, 쿠키에 저장)
  → 이후 요청은 middleware 가 쿠키 세션 검사
```

## 5. 환경 변수

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase 접속
- `ADMIN_EMAIL` — 어드민 판별 기준 이메일
- `NEXT_PUBLIC_CLIENT_API_ORIGIN` — 클라이언트측 axios base (기본 `/api`). axios는 클라이언트 전용이며, 서버는 `services/`를 직접 호출한다.

## 6. DB 스키마 & RLS

Supabase(Postgres). 테이블 2개(`posts`, `categories`)이며 접근 제어는 RLS로 한다.

### `posts`

| 컬럼                            | 타입        | 비고                                      |
| ------------------------------- | ----------- | ----------------------------------------- |
| `id`                            | uuid        | PK, `gen_random_uuid()`                   |
| `title` / `summary` / `content` | text        | NOT NULL                                  |
| `category_id`                   | uuid        | FK → `categories.id`, `ON DELETE CASCADE` |
| `user_id`                       | uuid        | FK → `auth.users.id`, 기본값 `auth.uid()` |
| `tags`                          | text[]      | 기본 `'{}'`                               |
| `is_published` / `is_private`   | boolean     | 기본 `false`                              |
| `thumbnail_url`                 | text        | nullable                                  |
| `draft_data`                    | jsonb       | 임시저장 스냅샷. 발행 시 `null`로 비움    |
| `created_at` / `updated_at`     | timestamptz | 기본 `now()`                              |

- 트리거 `update_posts_changetimestamp`: UPDATE 시 `updated_at` 자동 갱신(`update_changetimestamp_column()`).

### `categories`

| 컬럼         | 타입    | 비고                                      |
| ------------ | ------- | ----------------------------------------- |
| `id`         | uuid    | PK                                        |
| `slug`       | text    | UNIQUE                                    |
| `name`       | text    | NOT NULL                                  |
| `is_private` | boolean | 기본 `false`                              |
| `user_id`    | uuid    | FK → `auth.users.id`, 기본값 `auth.uid()` |

### RLS 정책

| 테이블       | 정책                              | 명령   | 조건                                                                                 |
| ------------ | --------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| `posts`      | Owner has full access             | ALL    | `auth.uid() = user_id`                                                               |
| `posts`      | Viewable posts by category status | SELECT | `(is_published AND NOT is_private AND 소속 카테고리도 공개) OR auth.uid() = user_id` |
| `categories` | Owner manage categories           | ALL    | `auth.uid() = user_id`                                                               |
| `categories` | Viewable categories               | SELECT | `NOT is_private OR auth.uid() = user_id`                                             |

**핵심**: 공개 SELECT는 "글이 발행+비공개아님 **그리고** 카테고리도 공개"를 모두 만족해야 노출된다.
소유자(`auth.uid() = user_id`)는 이 조건과 무관하게 전체 접근한다.
서비스 코드의 공개 목록 쿼리도 같은 조건(`is_published = true`, `is_private = false`,
`categories!inner`로 공개 카테고리만)을 명시적으로 수행한다. RLS가 최종 방어선이지만,
페이지네이션 `count`를 정확히 맞추고 코드만 봐도 노출 규칙이 드러나도록 같은 조건을 코드에도 둔 것이다.

## 7. 테스트

- **테스트 코드 없음** (테스트 프레임워크 미설치). 검증은 `yarn build`(타입/빌드) + 개발 서버 수동 확인으로 한다.

## 8. 루트 디렉터리 참고

- `.agents/skills/` — Vercel/React best-practices 스킬 번들(외부 설치본). 앱 소스 아님.
- `.claude/settings.local.json` — Claude Code 로컬 설정(자동 생성). 앱 소스 아님.
