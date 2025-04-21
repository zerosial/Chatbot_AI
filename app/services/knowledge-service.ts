import { OpenAIEmbeddings } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import * as fs from "fs";
import * as path from "path";
import { Document } from "@langchain/core/documents";

interface ChainInput {
  context: Document[];
  question: string;
}

export class KnowledgeService {
  private static instance: KnowledgeService;
  private vectorStore: MemoryVectorStore | null = null;
  private embeddings: OpenAIEmbeddings;

  private constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
  }

  public static getInstance(): KnowledgeService {
    if (!KnowledgeService.instance) {
      KnowledgeService.instance = new KnowledgeService();
    }
    return KnowledgeService.instance;
  }

  async initialize() {
    if (this.vectorStore) return;

    try {
      // 마크다운 파일 읽기
      const filePath = path.join(process.cwd(), "data", "knowledge.md");
      const content = fs.readFileSync(filePath, "utf-8");

      // 텍스트 분할
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docs = await textSplitter.createDocuments([content]);

      // 벡터 스토어 초기화
      this.vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        this.embeddings
      );

      console.log("Knowledge base initialized successfully");
    } catch (error) {
      console.error("Error initializing knowledge base:", error);
      throw error;
    }
  }

  async query(question: string) {
    if (!this.vectorStore) {
      throw new Error("Knowledge base not initialized");
    }

    // 관련 문서 검색
    const relevantDocs = await this.vectorStore.similaritySearch(question, 3);

    // 프롬프트 템플릿 설정
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `당신은 회사의 AI 어시스턴트입니다. 
         주어진 문맥을 기반으로 질문에 답변해주세요. 
         관련 정보가 없다면 "죄송합니다. 해당 정보를 찾을 수 없습니다."라고 답변하세요.
         
         문맥: {context}`
      ),
      HumanMessagePromptTemplate.fromTemplate("{question}"),
    ]);

    // ChatGPT 모델 설정
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    // 체인 생성
    const chain = RunnableSequence.from([
      {
        context: (input: ChainInput) => {
          return input.context
            .map((doc: Document) => doc.pageContent)
            .join("\n\n");
        },
        question: (input: ChainInput) => input.question,
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    // 응답 생성
    const response = await chain.invoke({
      context: relevantDocs,
      question: question,
    });

    return {
      response,
      sources: [],
    };
  }
}
