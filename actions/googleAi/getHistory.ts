import { Chat } from "@google/genai";

export async function getHistory(chat: Chat) {
  const history = await chat.getHistory();

  console.log("Chat history:", history);

  return {
    success: true,
    history,
  };
}
