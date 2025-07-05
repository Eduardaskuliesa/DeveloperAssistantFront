export async function sendMessage({
  message,
  chatId,
}: {
  message: string;
  chatId: number;
}) {
  const response = await fetch(
    "http://localhost:4040/api/gemini/chat-send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        chatId,
      }),
    }
  );

  if (!response.ok) {
    console.error("Failed to send message:", response.statusText);
  }

  const data = await response.json();

  return {
    messageResponse: data.message,
    tokens: data.tokens,
    cachedTokens: data.cachedTokens,
  };
}
