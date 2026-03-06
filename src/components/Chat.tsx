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

    // SUBSCRIBE TO REALTIME UPDATES
    const channel = supabase
      .channel(`chat_${studentId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, async (payload) => {
        const msg = payload.new;
        
        // Only add if it involves this student thread
        if (msg.sender_id === studentId || msg.receiver_id === studentId) {
          // Avoid duplicate messages if we already added it optimistically
          setMessages((prev) => {
            const exists = prev.some(m => m.id === msg.id);
            if (exists) return prev;
            return [...prev, msg];
          });

          // Fetch sender info for the bubble label
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

    // OPTIMISTIC UPDATE: Add the message to the UI immediately
    const optimisticId = Math.random();
    const optimisticMsg = {
      id: optimisticId,
      content,
      sender_id: userId,
      created_at: new Date().toISOString(),
      sender: { first_name: 'You', last_name: '', role: '' } // Temporary label
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    // DETERMINE RECEIVER
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

    // SEND TO DB
    const { data, error } = await supabase.from('messages').insert({
      content,
      sender_id: userId,
      receiver_id: receiverId
    }).select().single();

    if (error) {
      console.error(error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(m => m.id !== optimisticId));
    } else if (data) {
      // Replace optimistic message with real DB message
      setMessages((prev) => prev.map(m => m.id === optimisticId ? data : m));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white', border: '4px solid black' }}>
      <div style={{ padding: '15px 20px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase' }}>
        {userId === studentId ? `Chat with Alex` : `Chatting with ${receiverName}`}
      </div>

      <div 
        ref={scrollRef}
        style={{ 
          flex: 1,
          overflowY: 'auto', 
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          backgroundColor: '#fafafa',
          minHeight: '400px'
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', fontWeight: 900 }}>LOADING CONVERSATION...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_id === userId;
            const date = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div 
                key={m.id} 
                style={{ 
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                {!isMe && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase' }}>
                    {m.sender?.first_name} {m.sender?.role === 'admin' ? '(Admin)' : ''}
                  </span>
                )}
                <div style={{ 
                  backgroundColor: isMe ? 'var(--secondary)' : 'white',
                  color: isMe ? 'white' : 'black',
                  padding: '12px 16px',
                  border: '3px solid black',
                  boxShadow: '4px 4px 0px black',
                  fontWeight: 600,
                }}>
                  {m.content}
                </div>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, marginTop: '6px', opacity: 0.6 }}>
                  {date}
                </span>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '4px solid black', display: 'flex', gap: '15px', backgroundColor: 'white' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '15px', border: '4px solid black', fontWeight: 700, outline: 'none' }}
        />
        <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', padding: '10px 25px' }}>
          SEND
        </button>
      </form>
    </div>
  );
}
