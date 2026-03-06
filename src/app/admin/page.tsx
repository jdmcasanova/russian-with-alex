import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import styles from '../page.module.css';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import Chat from '@/components/Chat';

export default async function Admin({ searchParams }: { searchParams: Promise<{ student?: string, tab?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  const selectedStudentId = params.student;
  const activeTab = params.tab || 'overview';

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') return redirect('/dashboard');

  const { data: students } = await supabase
    .from('profiles')
    .select(`*, messages!messages_sender_id_fkey(content, created_at)`)
    .neq('role', 'admin')
    .order('first_name', { ascending: true });

  const processedStudents = students?.map(s => ({
    ...s,
    lastMessage: s.messages?.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
  }));

  const selectedStudent = processedStudents?.find(s => s.id === selectedStudentId);

  async function updateHours(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const id = formData.get('id');
    const hours = formData.get('hours');
    await supabase.from('profiles').update({ hours_remaining: parseInt(hours as string) }).eq('id', id);
    revalidatePath('/admin');
    revalidatePath('/dashboard');
  }

  return (
    <main className={styles.container} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      
      {/* 1. HEADER (Only hide on mobile active chat) */}
      <div className="admin-header" style={{ 
        padding: '15px 20px', 
        backgroundColor: 'var(--black)', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '6px solid black',
      }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>ALEX&apos;S HQ</h1>
        <div style={{ fontWeight: 900, fontSize: '0.7rem' }}>HI, {profile.first_name.toUpperCase()}!</div>
      </div>

      {/* 2. TABS (Only hide on mobile active chat) */}
      <div className="admin-tabs" style={{ display: 'flex', gap: '10px', padding: '15px 20px' }}>
        <Link href="/admin?tab=overview" style={{
          padding: '8px 20px', backgroundColor: activeTab === 'overview' ? 'var(--primary)' : 'white',
          border: '3px solid black', fontWeight: 900, fontSize: '0.9rem', textDecoration: 'none', color: 'black',
          boxShadow: activeTab === 'overview' ? 'none' : '4px 4px 0px black'
        }}>STUDENTS</Link>
        <Link href="/admin?tab=chat" style={{
          padding: '8px 20px', backgroundColor: activeTab === 'chat' ? '#FF6B6B' : 'white',
          color: activeTab === 'chat' ? 'white' : 'black', border: '3px solid black', fontWeight: 900, fontSize: '0.9rem', textDecoration: 'none',
          boxShadow: activeTab === 'chat' ? 'none' : '4px 4px 0px black'
        }}>CHAT</Link>
      </div>

      {/* 3. CONTENT AREA */}
      <div style={{ flex: 1, padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column' }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
            {processedStudents?.map((s) => (
              <div key={s.id} className="brutal-card" style={{ backgroundColor: 'white', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '0px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', textTransform: 'uppercase' }}>{s.first_name} {s.last_name}</h3>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.6 }}>{s.email}</p>
                  </div>
                  <div style={{ backgroundColor: 'var(--green)', padding: '5px 10px', border: '3px solid black', fontSize: '0.7rem', fontWeight: 900 }}>ACTIVE</div>
                </div>
                <div style={{ backgroundColor: 'var(--light-yellow)', padding: '15px', border: '3px solid black', textAlign: 'center' }}>
                  <p style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '5px' }}>HOURS REMAINING</p>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{s.hours_remaining}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/admin?tab=chat&student=${s.id}`} className="brutal-btn" style={{ flex: 1, fontSize: '0.8rem', padding: '12px', textAlign: 'center', backgroundColor: 'var(--secondary)', color: 'white', textDecoration: 'none', borderRadius: '0px' }}>CHAT</Link>
                  <form action={updateHours} style={{ display: 'flex', gap: '5px' }}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="number" name="hours" defaultValue={s.hours_remaining} style={{ width: '55px', padding: '10px', border: '3px solid black', fontWeight: 900 }} />
                    <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', padding: '10px', borderRadius: '0px' }}>SET</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flex: 1, backgroundColor: 'white', border: '4px solid black', overflow: 'hidden' }} className="admin-chat-layout">
            
            {/* SIDEBAR: STUDENT LIST */}
            <div className={`chat-sidebar ${selectedStudentId ? 'mobile-hidden' : ''}`} style={{ 
              width: '350px', borderRight: '4px solid black', overflowY: 'auto', backgroundColor: 'white' 
            }}>
              <div style={{ padding: '15px 20px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)', fontWeight: 900 }}>CONVERSATIONS</div>
              {processedStudents?.map((s) => (
                <Link key={s.id} href={`/admin?tab=chat&student=${s.id}`} style={{
                  display: 'block', padding: '15px 20px', borderBottom: '2px solid black',
                  backgroundColor: selectedStudentId === s.id ? 'var(--light-yellow)' : 'transparent',
                  textDecoration: 'none', color: 'black'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 900 }}>{s.first_name} {s.last_name}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.5 }}>{s.lastMessage ? new Date(s.lastMessage.created_at).toLocaleDateString() : ''}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{s.lastMessage ? s.lastMessage.content : 'No messages...'}</div>
                </Link>
              ))}
            </div>

            {/* MAIN: CHAT WINDOW */}
            <div className={`chat-main ${!selectedStudentId ? 'mobile-hidden' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {selectedStudent ? (
                <Chat 
                  studentId={selectedStudent.id} 
                  receiverName={selectedStudent.first_name} 
                  onBack={async () => { 'use server'; redirect('/admin?tab=chat'); }} 
                />
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>PICK A STUDENT</div>
              )}
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 850px) {
          .mobile-hidden { display: none !important; }
          .admin-chat-layout { border: none !important; }
          ${selectedStudentId && activeTab === 'chat' ? `
            .admin-header, .admin-tabs { display: none !important; }
          ` : ''}
        }
        @media (min-width: 851px) {
          .chat-sidebar { width: 350px !important; display: flex !important; }
          .chat-main { display: flex !important; }
        }
      `}} />
    </main>
  );
}
