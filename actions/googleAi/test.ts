import { Chat } from "@google/genai";

export async function sendMessage({
  message,
  chat,
}: {
  message: string;
  chat: Chat;
}) {
  const response = await chat.sendMessage({
    message: message,
  });

  console.log("Response from Google AI:", response);
  console.log("Cached tokens", response.usageMetadata?.cachedContentTokenCount);

  if (!response) {
    return {
      successs: false,
      content: "No response from Google AI",
    };
  }

  const messageResponse = response?.candidates[0]?.content?.parts[0]?.text;
  const tokens = response.usageMetadata?.totalTokenCount;
  const normalToken = response.usageMetadata?.toolUsePromptTokenCount;

  const cachedTokens = response.usageMetadata?.cacheTokensDetails;

  console.log(
    `Normal tokens: ${normalToken}, Total tokens: ${tokens}, Cached tokens: ${response.usageMetadata?.cachedContentTokenCount}`
  );
  console.log(JSON.stringify(response, null, 2), "Response from Google AI");

  return {
    messageResponse,
    tokens,
  };
}
