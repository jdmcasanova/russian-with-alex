'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Chat({ userId, receiverId }: { userId: string, receiverId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        if ((msg.sender_id === userId && msg.receiver_id === receiverId) || 
            (msg.sender_id === receiverId && msg.receiver_id === userId)) {
          setMessages((prev) => [...prev, msg]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, receiverId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = newMessage;
    setNewMessage('');

    const { error } = await supabase.from('messages').insert({
      content: tempMessage,
      sender_id: userId,
      receiver_id: receiverId
    });

    if (error) {
      console.error(error);
      setNewMessage(tempMessage); // Restore if failed
    }
  };

  return (
    <div className="brutal-card" style={{ backgroundColor: 'white', padding: '20px' }}>
      <div 
        ref={scrollRef}
        style={{ 
          height: '400px', 
          overflowY: 'auto', 
          border: '4px solid black', 
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: '#f5f5f5'
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', fontWeight: 900 }}>LOADING VIBES...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>No messages yet. Say Privet!</p>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              style={{ 
                alignSelf: m.sender_id === userId ? 'flex-end' : 'flex-start',
                backgroundColor: m.sender_id === userId ? 'var(--primary)' : 'white',
                padding: '10px 15px',
                border: '3px solid black',
                boxShadow: '4px 4px 0px black',
                maxWidth: '80%',
                fontWeight: 700
              }}
            >
              {m.content}
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '15px' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type something in Russian..."
          style={{ flex: 1, padding: '15px', border: '4px solid black', fontWeight: 700 }}
        />
        <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', padding: '10px 25px' }}>
          SEND 🚀
        </button>
      </form>
    </div>
  );
}
