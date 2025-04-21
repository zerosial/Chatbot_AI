import Chat from "./components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-800 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-100">
        AI 챗봇
      </h1>
      <Chat />
    </main>
  );
}
