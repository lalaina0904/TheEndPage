'use client';

import React, { useState } from 'react';
import axios from 'axios';

type Message = {
  sender: 'user' | 'ai';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://backend.bisounours.madagascar.webcup.hodi.host/chat',
        { message: input }
      );
      const aiMessage: Message = { sender: 'ai', content: response.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: 'ai',
        content: "Désolé, je n'ai pas pu obtenir de réponse. 😔",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-screen p-4 bg-black text-white">
      <h1 className="text-2xl font-semibold text-center mb-4 text-yellow-100">
        Your Assistant
      </h1>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 border border-neutral-700 rounded-md bg-neutral-900">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-yellow-100 text-black'
                  : 'bg-neutral-800 text-white'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-yellow-200 italic text-sm">L'IA est en train de répondre...</div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <textarea
          className="flex-1 resize-none rounded-md border border-neutral-700 p-2 bg-neutral-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          rows={2}
          placeholder="Tape ton message ici..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-yellow-200 text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
