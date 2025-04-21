import Chat from "./components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-100">
        AI 어시스턴트
      </h1>
      <Chat />
    </main>
  );
}
