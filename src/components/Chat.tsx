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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%',
      backgroundColor: '#f0f0f0', 
      position: 'fixed', // MOBILE FIX: Keep everything contained
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 2000
    }} className="chat-fullscreen-wrapper">
      
      {/* COMPACT HEADER */}
      <div style={{ 
        padding: '10px 15px', 
        borderBottom: '3px solid black', 
        backgroundColor: 'var(--primary)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        flexShrink: 0
      }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
        )}
        <div style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase' }}>
          {receiverName}
        </div>
      </div>

      {/* COMPACT MESSAGES */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1,
          overflowY: 'auto', 
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px', /* MINIMAL GAP */
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', fontWeight: 900, fontSize: '0.7rem' }}>LOADING...</p>
        ) : (
          messages.map((m) => {
            const isMe = String(m.sender_id) === String(currentUserId);
            const time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div 
                key={m.id} 
                style={{ 
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                {!isMe && (
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, marginBottom: '1px', textTransform: 'uppercase', opacity: 0.7 }}>
                    {m.sender?.first_name}
                  </span>
                )}
                <div style={{ 
                  backgroundColor: isMe ? 'var(--secondary)' : 'white',
                  color: isMe ? 'white' : 'black',
                  padding: '6px 10px', /* VERY COMPACT PADDING */
                  border: '2px solid black',
                  boxShadow: isMe ? '2px 2px 0px black' : '2px 2px 0px rgba(0,0,0,0.1)',
                  fontWeight: 600,
                  fontSize: '0.85rem', /* SMALLER TYPO */
                  borderRadius: isMe ? '10px 10px 0 10px' : '10px 10px 10px 0'
                }}>
                  {m.content}
                </div>
                <span style={{ fontSize: '0.5rem', fontWeight: 700, marginTop: '2px', opacity: 0.5 }}>
                  {time}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* PERMANENTLY FIXED INPUT BAR */}
      <form onSubmit={sendMessage} style={{ 
        padding: '10px', 
        borderTop: '3px solid black', 
        display: 'flex', 
        gap: '8px', 
        backgroundColor: 'white',
        flexShrink: 0,
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' // MOBILE FIX: Respect notch/home bar
      }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message..."
          style={{ 
            flex: 1, 
            padding: '10px', 
            border: '2px solid black', 
            fontWeight: 700, 
            outline: 'none', 
            fontSize: '0.9rem', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}
        />
        <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', padding: '8px 15px', borderRadius: '8px', boxShadow: '2px 2px 0px black' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </form>

      {/* DESKTOP RESET: Ensure it stays inside the card on large screens */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 850px) {
          .chat-fullscreen-wrapper { position: relative !important; z-index: 1 !important; height: 100% !important; border-radius: 0 !important; }
        }
      `}} />
    </div>
  );
}
