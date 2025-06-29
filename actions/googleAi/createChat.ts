import googleAi from "@/services/google-ai";

interface CreateChatResponse {
  success: boolean;
  message?: string;
  chat?: any;
}

export async function createChat(cacheName?: string): Promise<CreateChatResponse> {
  const systemInstruction = {
    parts: [
      {
        text: "You are a helpful and concise assistant. Always answer directly and avoid lengthy explanations unless specifically asked. Do not make assumptions. Prioritize clarity and brevity.",
      },
    ],
  };

  const cleanConfig = {
    temperature: 0.8,
    responseMimeType: "text/plain",
    systemInstruction,
  };

  const cachedConfig = {
    cachedContent: "cachedContents/r00b4izlscyh73d2m0xi5332qifqubn9hxrrkal9",
  };

 
  const chat = await googleAi.chats.create({
    model: "gemini-2.0-flash",
    config: cachedConfig,
  });

  console.log("Chat created:", chat);

  if (!chat) {
    return {
      success: false,
      message: "No chat created",
    };
  }

  return {
    success: true,
    chat,
  };
}