'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Chat({ userId, receiverId, receiverName }: { userId: string, receiverId: string, receiverName?: string }) {
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
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const msg = payload.new;
        if ((msg.sender_id === userId && msg.receiver_id === receiverId) || 
            (msg.sender_id === receiverId && msg.receiver_id === userId)) {
          
          // Fetch sender info for the new message
          const { data: senderInfo } = await supabase
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', msg.sender_id)
            .single();
          
          setMessages((prev) => [...prev, { ...msg, sender: senderInfo }]);
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
      setNewMessage(tempMessage);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white', border: '4px solid black' }}>
      {/* CHAT HEADER */}
      <div style={{ padding: '15px 20px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase' }}>
        Chat with {receiverName || 'Support'}
      </div>

      {/* MESSAGES AREA */}
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
                  position: 'relative'
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

      {/* INPUT AREA */}
      <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '4px solid black', display: 'flex', gap: '15px', backgroundColor: 'white' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '15px', border: '3px solid black', fontWeight: 700, outline: 'none' }}
        />
        <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', padding: '10px 25px' }}>
          SEND
        </button>
      </form>
    </div>
  );
}
