'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Chat({ studentId, receiverName }: { userId: string, studentId: string, receiverName?: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const initChat = async () => {
      // 1. Get current user ID reliably on client
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // 2. Fetch initial messages
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

    // 3. Subscribe to realtime
    const channel = supabase
      .channel(`chat_${studentId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, async (payload) => {
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
      const { data: admin } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .single();
      if (admin) receiverId = admin.id;
    }

    const { data, error } = await supabase.from('messages').insert({
      content,
      sender_id: currentUserId,
      receiver_id: receiverId
    }).select().single();

    if (error) {
      console.error(error);
      setMessages((prev) => prev.filter(m => m.id !== optimisticId));
    } else if (data) {
      setMessages((prev) => prev.map(m => m.id === optimisticId ? data : m));
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '500px', 
      maxHeight: '70vh',
      backgroundColor: 'white', 
      border: '4px solid black',
      borderRadius: '15px',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '10px 20px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem' }}>
        {currentUserId === studentId ? `Chat with Alex` : `Chatting with ${receiverName}`}
      </div>

      <div 
        ref={scrollRef}
        style={{ 
          flex: 1,
          overflowY: 'auto', 
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: '#fafafa',
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', fontWeight: 900, fontSize: '0.8rem' }}>LOADING...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>No messages yet.</p>
        ) : (
          messages.map((m) => {
            // STRONGER CHECK FOR isMe
            const isMe = String(m.sender_id) === String(currentUserId);
            
            const dateObj = new Date(m.created_at);
            const now = new Date();
            const isToday = dateObj.toDateString() === now.toDateString();
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            const isYesterday = dateObj.toDateString() === yesterday.toDateString();

            let dateLabel = dateObj.toLocaleDateString([], { day: 'numeric', month: 'short' });
            if (isToday) dateLabel = 'Today';
            if (isYesterday) dateLabel = 'Yesterday';

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
                    {m.sender?.first_name} {m.sender?.role === 'admin' ? '(Admin)' : ''}
                  </span>
                )}
                <div style={{ 
                  backgroundColor: isMe ? 'var(--secondary)' : 'white',
                  color: isMe ? 'white' : 'black',
                  padding: '8px 12px',
                  border: '3px solid black',
                  boxShadow: '3px 3px 0px black',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0'
                }}>
                  {m.content}
                </div>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, marginTop: '4px', opacity: 0.6 }}>
                  {dateLabel}, {time}
                </span>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} style={{ padding: '10px', borderTop: '4px solid black', display: 'flex', gap: '10px', backgroundColor: 'white' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message..."
          style={{ flex: 1, padding: '10px', border: '3px solid black', fontWeight: 700, outline: 'none', fontSize: '0.9rem', borderRadius: '8px' }}
        />
        <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', padding: '10px 15px', fontSize: '0.8rem', borderRadius: '8px' }}>
          SEND
        </button>
      </form>
    </div>
  );
}
