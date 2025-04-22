# LangChain을 활용한 기업 내부 지식 베이스 챗봇

기업의 내부 문서와 지식을 효율적으로 관리하고 검색할 수 있는 AI 기반 챗봇 시스템입니다. LangChain과 Next.js를 활용하여 구축된 이 시스템은 사용자 친화적인 인터페이스와 강력한 검색 기능을 제공합니다.

## 🚀 주요 기능

- 실시간 문서 검색 및 응답 생성
- 마크다운 기반 지식 베이스 관리
- 컨텍스트 기반 정확한 응답
- 모던한 채팅 인터페이스
- 벡터 기반 시맨틱 검색

## 🛠 기술 스택

### 핵심 기술

- **Next.js** (v15.2.4) - 서버 사이드 렌더링 및 API 라우트
- **LangChain** (v0.3.23) - LLM 애플리케이션 프레임워크
- **@langchain/core** (v0.3.45) - LangChain 핵심 기능
- **@langchain/openai** (v0.5.6) - OpenAI 통합

### 프론트엔드

- **React** (v19.0.0)
- **TailwindCSS** (v4.1.4)
- **TypeScript** (v5)

## 📁 프로젝트 구조

```text
project/
├── app/
│   ├── api/
│   │   └── knowledge/
│   │       └── route.ts      # API 엔드포인트
│   ├── components/
│   │   └── Chat.tsx         # 채팅 인터페이스
│   ├── layout.tsx           # 레이아웃 구성
│   └── page.tsx             # 메인 페이지
├── data/
│   └── knowledge.md         # 지식 베이스
└── config/
    └── next.config.js       # Next.js 설정
```

## 💡 주요 구현 사항

### 1. 문서 처리 파이프라인

- RecursiveCharacterTextSplitter로 문서 분할
- MemoryVectorStore를 통한 벡터 데이터 저장
- OpenAIEmbeddings로 텍스트 임베딩

### 2. 질의응답 시스템

- ChatPromptTemplate 기반 프롬프트 관리
- ChatOpenAI 모델 통합
- RunnableSequence를 통한 체인 구성

### 3. 사용자 인터페이스

- 실시간 채팅 인터페이스
- 로딩 상태 표시
- 반응형 디자인
- 최적화된 스크롤 처리

## 🔒 보안 및 설정

### 환경 변수 설정

```env
OPENAI_API_KEY=your_api_key_here
```

## 🚀 시작하기

1. 저장소 클론

```bash
git clone [repository-url]
```

2. 의존성 설치

```bash
pnpm install
```

3. 환경 변수 설정

- `.env.local` 파일 생성
- OpenAI API 키 설정

4. 개발 서버 실행

```bash
pnpm dev
```

## 🔄 확장 가능성

- 로컬 LLM (Ollama) 통합
- 다중 지식베이스 지원
- 사용자 인증 및 권한 관리
- 대화 이력 저장 및 분석

## ⚡ 성능 최적화

### 벡터 검색 최적화

- 청크 크기: 1000자
- 오버랩: 200자
- 상위 3개 결과 검색

### UI/UX 최적화

- 스트리밍 응답
- 반응형 디자인
- 스크롤 최적화
