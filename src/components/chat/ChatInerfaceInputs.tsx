import { Send } from "lucide-react";
import React, { useState } from "react";

interface ChatInterfaceInputsProps {
  chatId: string | null;
  onSendMessage: (message: string) => void;

  isStreaming: boolean;
  tokenUsed?: number;
  onUserTyping?: () => void;
}

const ChatInterfaceInputs = ({
  onSendMessage,
  isStreaming,
  tokenUsed,

  onUserTyping,
}: ChatInterfaceInputsProps) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (inputMessage.trim() && !isStreaming) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div
      className="p-2 min-h-[180px]
    "
    >
      <div className="bg-theme-gray max-h-[120px]   relative scrollbar-hide border  border-neutral-700 rounded-lg w-full p-3">
        <div className="scrollbar-hide">
          <textarea
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              onUserTyping?.();
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about your architecture..."
            className="w-full scrollbar-hide pt-2 bg-transparent border-none text-neutral-200 text-sm placeholder-neutral-400 focus:outline-none resize-none min-h-[65px] max-h-[65px]"
          />
        </div>
        <span className="absolute right-4 top-1 text-xs text-neutral-400">
          {tokenUsed?.toLocaleString()} / 1M
        </span>
        <div className="flex items-center justify-between  text-xs text-neutral-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <button
            onClick={handleSend}
            disabled={isStreaming || !inputMessage.trim()}
            className="text-neutral-300 rounded-full hover:text-theme-pink disabled:opacity-50 transition-colors"
          >
            {isStreaming ? (
              <div className="w-4 h-4 border-2 border-gray-500 border-t-theme-pink rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfaceInputs;
