import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{from: string; text: string}>>([
    { from: 'agent', text: 'Hi — how can I help you with this gig?' }
  ]);
  const [input, setInput] = useState('');

  const toggle = () => setOpen((v) => !v);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change or panel opens
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    // small timeout to allow DOM updates
    const t = setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 40);
    return () => clearTimeout(t);
  }, [messages, open]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: 'you', text: input.trim() }]);
    setInput('');
    // simulate agent reply
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'agent', text: 'Thanks — I will check and get back to you.' }]);
    }, 800);
  };

  return (
    <>
      <button aria-label="Open chat" className={styles.chatButton} onClick={toggle}>
        <svg className={styles.chatIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" />
        </svg>
        <span className={styles.unreadDot} aria-hidden></span>
      </button>

      <div role="dialog" aria-modal="false" aria-label="Chat" className={open ? styles.chatPanel : `${styles.chatPanel} ${styles.hidden}`}>
        <div className={styles.panelHeader}>Support Chat</div>
        <div ref={messagesRef} className={styles.messages} aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`${styles.messageRow} ${m.from === 'you' ? styles.you : styles.agent}`}>
              <div className={`${styles.messageBubble} ${m.from === 'you' ? styles.you : styles.agent}`}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className={styles.inputRow}>
          <input aria-label="Type a message" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key === 'Enter') send(); }} />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
