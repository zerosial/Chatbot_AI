# LangChain을 활용한 기업 내부 지식 베이스 챗봇
![chatai](https://github.com/user-attachments/assets/5b5e587b-e739-4e03-a6f1-f7f35bf663e7)

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

## 🔍 LangChain 구현 상세

### 3.1 문서 처리 (Document Processing)

문서 처리는 다음과 같은 단계로 이루어집니다:

1. **문서 분할 (Text Splitting)**

   - RecursiveCharacterTextSplitter를 사용하여 긴 문서를 관리 가능한 청크로 분할
   - 청크 크기와 오버랩을 조정하여 컨텍스트 유지

2. **벡터화 (Vectorization)**

   - OpenAIEmbeddings를 사용하여 텍스트를 벡터로 변환
   - 의미론적 검색을 위한 고차원 벡터 생성

3. **저장 (Storage)**
   - MemoryVectorStore를 사용하여 벡터화된 문서 저장
   - 효율적인 유사도 검색 지원

```typescript:app/api/knowledge/route.ts
// 1. 문서 처리 초기화
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,    // 각 청크의 최대 길이
  chunkOverlap: 200,  // 청크 간 중복되는 텍스트 길이 (컨텍스트 유지)
});

// 2. 문서 로드 및 분할
const content = fs.readFileSync(filePath, "utf-8");
const docs = await textSplitter.createDocuments([content]);

// 3. 임베딩 초기화
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// 4. 벡터 스토어 생성
vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
```

### 3.2 질의응답 파이프라인 (QA Pipeline)

질의응답 파이프라인은 다음 단계로 구성됩니다:

1. **관련 문서 검색 (Relevant Document Retrieval)**

   - 사용자 질문과 가장 관련성 높은 문서 청크 검색
   - 유사도 기반 상위 문서 선택

2. **프롬프트 생성 (Prompt Engineering)**

   - 시스템 프롬프트와 사용자 질문 결합
   - 컨텍스트 기반 응답 유도

3. **응답 생성 (Response Generation)**
   - LLM을 통한 응답 생성
   - 스트리밍 처리 및 포맷팅

```typescript:app/api/knowledge/route.ts
// 1. 관련 문서 검색
const relevantDocs = await vectorStore.similaritySearch(question, 3);  // 상위 3개 문서 검색

// 2. 프롬프트 템플릿 설정
const prompt = ChatPromptTemplate.fromTemplate(`
  당신은 회사의 AI 어시스턴트입니다.
  주어진 문맥을 기반으로 질문에 답변해주세요.
  관련 정보가 없다면 "죄송합니다. 해당 정보를 찾을 수 없습니다."라고 답변하세요.

  문맥: {context}
  질문: {question}
`);

// 3. LLM 모델 설정
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",  // 사용할 모델
  temperature: 0.7,            // 응답의 창의성 조절 (0: 보수적, 1: 창의적)
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// 4. 체인 구성
const chain = RunnableSequence.from([
  {
    // 컨텍스트 처리: 관련 문서들을 하나의 문자열로 결합
    context: (input: ChainInput) => {
      return input.context
        .map((doc: Document) => doc.pageContent)
        .join("\n\n");
    },
    // 질문 전달
    question: (input: ChainInput) => input.question,
  },
  prompt,    // 프롬프트 템플릿 적용
  model,     // LLM 모델을 통한 응답 생성
  new StringOutputParser(),  // 응답 문자열 파싱
]);

// 5. 응답 생성
const response = await chain.invoke({
  context: relevantDocs,
  question: question,
});
```

### 주요 특징

1. **청크 크기 최적화**

   - 1000자 단위로 분할하여 컨텍스트 윈도우 최적화
   - 200자 오버랩으로 문맥 연속성 유지

2. **벡터 검색 효율성**

   - 상위 3개 관련 문서만 검색하여 성능 최적화
   - 임베딩 캐싱으로 반복 검색 속도 향상

3. **프롬프트 엔지니어링**

   - 명확한 역할 정의
   - 컨텍스트 기반 응답 유도
   - 불확실성 처리 방법 명시

4. **응답 품질 관리**
   - Temperature 설정으로 응답 일관성 조절
   - 문맥 기반 관련성 높은 응답 생성
