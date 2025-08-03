"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Optional

export default function ChatBot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Resume Assistant. I can help you with resume tips, job application advice, and answer questions about your career. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse = {
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorResponse = {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* Optional Tooltip around button */}
        {/* <Tooltip>
          <TooltipTrigger asChild> */}
          <SheetTitle>
            <Button className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-black text-white dark:bg-white dark:text-black ">
              <MessageSquare className="w-6 h-6" />
            </Button>
          </SheetTitle>
          {/* </TooltipTrigger>
          <TooltipContent>
            <p>Chat with Resume Refiner AI</p>
          </TooltipContent>
        </Tooltip> */}
      </SheetTrigger>

      <SheetContent side="right" className="w-80 p-0 flex flex-col bg-white text-black dark:bg-black dark:text-white">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-300 dark:border-neutral-700">
          <MessageSquare className="w-5 h-5" />
          <div>
            <h3 className="font-semibold text-sm">Resume Refiner AI</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Your AI Resume Assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-white text-black dark:bg-black dark:text-white"
                      : "bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-6 h-4" />
                  ) : (
                    <Bot className="w-6 h-4" />
                  )}
                </div>
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    message.role === "user"
                      ? "bg-white text-black dark:bg-black dark:text-white"
                      : "bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="px-3 py-2 rounded-lg text-sm bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-neutral-300 dark:border-neutral-700">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-white text-black dark:bg-black dark:text-white"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="bg-white text-black hover:bg-neutral-200 dark:bg-black dark:text-white dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
