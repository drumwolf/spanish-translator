'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const [dialect, setDialect] = useState('mx');
  const { messages, sendMessage } = useChat();

  const pairs = messages.reduce((acc, message) => {
    if (message.role === 'user') {
      acc.push({ user: message, assistant: null });
    } else if (message.role === 'assistant' && acc.length > 0) {
      acc[acc.length - 1].assistant = message;
    }
    return acc;
  }, [] as { user: (typeof messages)[0]; assistant: (typeof messages)[0] | null }[]);

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950">
      {/* Left Sidebar */}
      <aside className="w-64 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shrink-0">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Spanish Translator</h1>
        </div>
        <form
          className="flex flex-col gap-2"
          onSubmit={e => {
            e.preventDefault();
            sendMessage({ text: input }, { body: { dialect } });
            setInput('');
          }}
        >
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1 font-bold">Dialect</label>
            <select
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              onChange={e => setDialect(e.currentTarget.value)}
              value={dialect}
            >
              <option value="mx">Mexican</option>
              <option value="es">Peninsular</option>
            </select>
          </div>
          <div className="flex flex-col flex-1 p-4 gap-3">
            <textarea
              className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              rows={4}
              value={input}
              placeholder="Enter text to translate..."
              onChange={e => setInput(e.currentTarget.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage({ text: input }, { body: { dialect } });
                    setInput('');
                  }
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-lg bg-zinc-800 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Translate
            </button>
          </div>
        </form>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {pairs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600 text-sm">
            Translations will appear here.
          </div>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {pairs.map(({ user, assistant }) => (
              <div
                className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800 shadow-sm"
                key={user.id}
              >
                <strong className="block text-zinc-900 dark:text-zinc-100">
                  {user.parts.filter(p => p.type === 'text').map((p, i) => <span key={i}>{p.text}</span>)}
                </strong>
                {assistant && (
                  <div className="italic mt-2 text-zinc-600 dark:text-zinc-400">
                    {assistant.parts.filter(p => p.type === 'text').map((p, i) => <span key={i}>{p.text}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
