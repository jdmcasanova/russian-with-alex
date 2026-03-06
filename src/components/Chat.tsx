'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ChatProps {
  studentId: string;
  receiverName?: string;
  onBack?: () => void;
}

export default function Chat({ studentId, receiverName, onBack }: ChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data } = await supabase
        .from('messages')
        .select(`*, sender:sender_id (first_name, role)`)
        .or(`sender_id.eq.${studentId},receiver_id.eq.${studentId}`)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
      setLoading(false);
    };

    initChat();

    const channel = supabase
      .channel(`chat_${studentId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const msg = payload.new;
        if (msg.sender_id === studentId || msg.receiver_id === studentId) {
          setMessages((prev) => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          const { data: senderInfo } = await supabase.from('profiles').select('first_name, role').eq('id', msg.sender_id).single();
          setMessages((prev) => prev.map(m => m.id === msg.id ? { ...m, sender: senderInfo } : m));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [studentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;
    const content = newMessage;
    setNewMessage('');

    const optimisticId = Math.random();
    const optimisticMsg = {
      id: optimisticId,
      content,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      sender: { first_name: 'You' }
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    let receiverId = studentId; 
    if (currentUserId === studentId) {
      const { data: admin } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1).single();
      if (admin) receiverId = admin.id;
    }

    const { data, error } = await supabase.from('messages').insert({ content, sender_id: currentUserId, receiver_id: receiverId }).select().single();
    if (error) setMessages((prev) => prev.filter(m => m.id !== optimisticId));
    else if (data) setMessages((prev) => prev.map(m => m.id === optimisticId ? data : m));
  };

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header">
        {onBack && (
          <button onClick={onBack} className="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
        )}
        <div className="receiver-name">{receiverName}</div>
      </div>

      {/* MESSAGES */}
      <div ref={scrollRef} className="messages-area">
        {loading ? (
          <p className="status-text">LOADING...</p>
        ) : (
          messages.map((m) => {
            const isMe = String(m.sender_id) === String(currentUserId);
            const time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={m.id} className={`message-wrapper ${isMe ? 'is-me' : 'is-them'}`}>
                {!isMe && <span className="sender-label">{m.sender?.first_name}</span>}
                <div className="message-bubble">
                  {m.content}
                </div>
                <span className="timestamp">{time}</span>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT BAR */}
      <form onSubmit={sendMessage} className="input-form">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message..."
          className="chat-input"
        />
        <button type="submit" className="send-button brutal-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </form>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background-color: #fafafa;
          position: fixed;
          top: 0; left: 0; bottom: 0; right: 0;
          z-index: 2000;
        }
        .chat-header {
          padding: 12px 20px;
          border-bottom: 4px solid black;
          background-color: var(--primary);
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
        }
        .receiver-name { font-weight: 900; text-transform: uppercase; font-size: 1rem; }
        .back-button { background: none; border: none; cursor: pointer; padding: 5px; display: flex; }
        
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .status-text { text-align: center; font-weight: 900; font-size: 0.8rem; }
        
        .message-wrapper {
          max-width: 85%;
          display: flex;
          flex-direction: column;
        }
        .is-me { align-self: flex-end; alignItems: flex-end; }
        .is-them { align-self: flex-start; alignItems: flex-start; }
        
        .sender-label { font-size: 0.65rem; font-weight: 900; margin-bottom: 2px; text-transform: uppercase; opacity: 0.7; }
        
        .message-bubble {
          padding: 8px 12px;
          border: 3px solid black;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .is-me .message-bubble {
          background-color: var(--secondary);
          color: white;
          box-shadow: 4px 4px 0px black;
          border-radius: 15px 15px 0 15px;
        }
        .is-them .message-bubble {
          background-color: white;
          color: black;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
          border-radius: 15px 15px 15px 0;
        }
        
        .timestamp { font-size: 0.6rem; font-weight: 700; margin-top: 4px; opacity: 0.6; }
        
        .input-form {
          padding: 15px;
          border-top: 4px solid black;
          display: flex;
          gap: 10px;
          background-color: white;
          padding-bottom: calc(15px + env(safe-area-inset-bottom));
        }
        .chat-input {
          flex: 1;
          padding: 12px;
          border: 3px solid black;
          font-weight: 700;
          outline: none;
          font-size: 1rem;
          border-radius: 10px;
          background-color: #f9f9f9;
        }
        .send-button { background-color: var(--green); padding: 10px 20px; border-radius: 10px; }

        /* DESKTOP RESTORATION */
        @media (min-width: 850px) {
          .chat-container {
            position: relative !important;
            z-index: 1 !important;
            height: 100% !important;
            border: 4px solid black;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 8px 8px 0px black;
          }
          .chat-header { padding: 15px 25px; }
          .receiver-name { font-size: 1.2rem; }
          .message-bubble { padding: 12px 18px; font-size: 1rem; }
          .messages-area { padding: 25px; gap: 15px; }
          .input-form { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
