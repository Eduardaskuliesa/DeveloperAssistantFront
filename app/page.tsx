"use client";

import { googleAiActions } from "@/actions/googleAi";
import { Chat } from "@google/genai";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenUsed, setTokenUsed] = useState<number | undefined>();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [data, setData] = useState({});
  const [cache, setCache] = useState();

  const handleSendMessage = async () => {
    const response = await googleAiActions.sendMessage({
      message,
      chat: currentChat as Chat,
    });
    setData(response.messageResponse);
    setTokenUsed(response.tokens);
    console.log("Response from Google AI:", response);
    setLoading(false);
  };

  const createCache = async () => {
    const cache = await googleAiActions.createCache();

    setCache(cache.cache);
    console.log("Cache created:", cache);
  };

  const createChat = async () => {
    const chat = await googleAiActions.createChat();

    setCurrentChat(chat.chat as Chat);

    console.log("Chat created:", chat);
  };

  const getHistory = async () => {
    const history = await googleAiActions.getHistory(currentChat as Chat);

    localStorage.setItem("chatHistory", JSON.stringify(history.history));
  };

  useEffect(() => {
    console.log("Data from Google AI:", data);
  }, [data]);

  return (
    <main className="p-24 flex flex-col itmes-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Developer Assistant</h1>
      <div className="flex flex-col">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-slate-100 border-pink-200 border-2 w-[300px] min-h-[300px]"
        ></textarea>
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="p-2 bg-pink-300 mt-4 hover:bg-pink-500 transition-colors rounded-md w-[200px] cursor-pointer"
        >
          {loading ? "Loading..." : "Send Message"}
        </button>

        <button
          onClick={createChat}
          className="p-2 bg-pink-300 mt-4 hover:bg-pink-500 transition-colors rounded-md w-[200px] cursor-pointer"
        >
          Create Chat
        </button>

        <button
          onClick={getHistory}
          className="p-2 bg-pink-300 mt-4 hover:bg-pink-500 transition-colors rounded-md w-[200px] cursor-pointer"
        >
          get history
        </button>

        <button
          onClick={createCache}
          className="p-2 bg-pink-300 mt-4 hover:bg-pink-500 transition-colors rounded-md w-[200px] cursor-pointer"
        >
          Create Cache
        </button>

        <div className="mt-2 text-sm text-gray-500">
          Tokens used: {tokenUsed}
        </div>
      </div>

      <div>{JSON.stringify(data, null, 2)}</div>
    </main>
  );
}
