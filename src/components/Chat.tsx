'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ChatProps {
  studentId: string;
  receiverName?: string;
  onBack?: () => void; // For mobile navigation
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
        .select(`
          *,
          sender:sender_id (first_name, last_name, role)
        `)
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

          const { data: senderInfo } = await supabase
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', msg.sender_id)
            .single();
          
          setMessages((prev) => 
            prev.map(m => m.id === msg.id ? { ...m, sender: senderInfo } : m)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      sender: { first_name: 'You', last_name: '', role: '' }
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    let receiverId = studentId; 
    if (currentUserId === studentId) {
      const { data: admin } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1).single();
      if (admin) receiverId = admin.id;
    }

    const { data, error } = await supabase.from('messages').insert({
      content,
      sender_id: currentUserId,
      receiver_id: receiverId
    }).select().single();

    if (error) {
      setMessages((prev) => prev.filter(m => m.id !== optimisticId));
    } else if (data) {
      setMessages((prev) => prev.map(m => m.id === optimisticId ? data : m));
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%',
      backgroundColor: 'white', 
      position: 'relative'
    }}>
      {/* FIXED TOP HEADER */}
      <div style={{ 
        padding: '12px 20px', 
        borderBottom: '4px solid black', 
        backgroundColor: 'var(--primary)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px',
        zIndex: 10
      }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
        )}
        <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1rem' }}>
          {receiverName}
        </div>
      </div>

      {/* SCROLLABLE MESSAGES */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1,
          overflowY: 'auto', 
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: '#fafafa',
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', fontWeight: 900, fontSize: '0.8rem' }}>LOADING...</p>
        ) : (
          messages.map((m) => {
            // BULLETPROOF ALIGNMENT LOGIC
            const isMe = String(m.sender_id) === String(currentUserId);
            
            const dateObj = new Date(m.created_at);
            const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
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
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, marginBottom: '2px', textTransform: 'uppercase' }}>
                    {m.sender?.first_name}
                  </span>
                )}
                <div style={{ 
                  backgroundColor: isMe ? 'var(--secondary)' : 'white',
                  color: isMe ? 'white' : 'black',
                  padding: '10px 14px',
                  border: '3px solid black',
                  boxShadow: isMe ? '4px 4px 0px black' : '4px 4px 0px rgba(0,0,0,0.1)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  borderRadius: isMe ? '15px 15px 0 15px' : '15px 15px 15px 0'
                }}>
                  {m.content}
                </div>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, marginTop: '4px', opacity: 0.6 }}>
                  {time}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT AREA */}
      <form onSubmit={sendMessage} style={{ 
        padding: '15px', 
        borderTop: '4px solid black', 
        display: 'flex', 
        gap: '10px', 
        backgroundColor: 'white' 
      }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '12px', border: '3px solid black', fontWeight: 700, outline: 'none', fontSize: '1rem', borderRadius: '10px' }}
        />
        <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', padding: '10px 20px', borderRadius: '10px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </form>
    </div>
  );
}
