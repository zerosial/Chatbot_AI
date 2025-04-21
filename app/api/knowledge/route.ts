import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as fs from "fs";
import * as path from "path";

let vectorStore: MemoryVectorStore | null = null;

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!vectorStore) {
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
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    }

    // 관련 문서 검색
    const relevantDocs = await vectorStore.similaritySearch(question, 3);

    // ChatGPT를 사용하여 응답 생성
    const chat = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
      당신은 회사의 AI 어시스턴트입니다.
      주어진 문맥을 기반으로 질문에 답변해주세요.
      관련 정보가 없다면 "죄송합니다. 해당 정보를 찾을 수 없습니다."라고 답변하세요.

      문맥: {context}

      질문: {question}
    `);

    const response = await prompt.pipe(chat).invoke({
      context: relevantDocs.map((doc) => doc.pageContent).join("\n\n"),
      question: question,
    });

    return NextResponse.json({
      response: response.content,
      sources: relevantDocs.map((doc) => doc.pageContent),
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
