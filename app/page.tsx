'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
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
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {pairs.map(({ user, assistant }) => (
        <div className="section border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 mb-4 bg-zinc-50 dark:bg-zinc-800 shadow-sm" key={user.id}>
          <strong>{user.parts.filter(p => p.type === 'text').map((p, i) => <span key={i}>{p.text}</span>)}</strong>
          {assistant && (
            <div>Translation: {assistant.parts.filter(p => p.type === 'text').map((p, i) => <span key={i}>{p.text}</span>)}</div>
          )}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
