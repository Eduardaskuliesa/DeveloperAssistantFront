export async function createChat(cacheName?: string) {
  const response = await fetch("http://localhost:4040/api/gemini/chat-create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to create chat:", response.statusText);
  }
  const data = await response.json();
  console.log(data, "Response body from createChat");

  return {
    success: true,
    chatId: data.chatId,
  };
}
