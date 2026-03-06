'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Chat({ userId, studentId, receiverName }: { userId: string, studentId: string, receiverName?: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchMessages = async () => {
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

    fetchMessages();

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
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage('');

    const optimisticId = Math.random();
    const optimisticMsg = {
      id: optimisticId,
      content,
      sender_id: userId,
      created_at: new Date().toISOString(),
      sender: { first_name: 'You', last_name: '', role: '' }
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    let receiverId = studentId; 
    if (userId === studentId) {
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
      sender_id: userId,
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
      height: '500px', /* FIXED HEIGHT */
      backgroundColor: 'white', 
      border: '4px solid black' 
    }}>
      <div style={{ padding: '10px 20px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem' }}>
        {userId === studentId ? `Chat with Alex` : `Chatting with ${receiverName}`}
      </div>

      <div 
        ref={scrollRef}
        style={{ 
          flex: 1,
          overflowY: 'auto', 
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px', /* REDUCED GAP */
          backgroundColor: '#fafafa',
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', fontWeight: 900, fontSize: '0.8rem' }}>LOADING...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>No messages yet.</p>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_id === userId;
            const date = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
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
                  padding: '8px 12px', /* REDUCED PADDING */
                  border: '3px solid black',
                  boxShadow: '3px 3px 0px black',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  {m.content}
                </div>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, marginTop: '4px', opacity: 0.6 }}>
                  {date}
                </span>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} style={{ padding: '15px', borderTop: '4px solid black', display: 'flex', gap: '10px', backgroundColor: 'white' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type message..."
          style={{ flex: 1, padding: '10px', border: '3px solid black', fontWeight: 700, outline: 'none', fontSize: '0.9rem' }}
        />
        <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', padding: '8px 20px', fontSize: '0.9rem' }}>
          SEND
        </button>
      </form>
    </div>
  );
}
