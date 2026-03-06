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
    .select('*')
    .neq('role', 'admin')
    .order('first_name', { ascending: true });

  const selectedStudent = students?.find(s => s.id === selectedStudentId);

  async function updateHours(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const id = formData.get('id');
    const hours = formData.get('hours');

    await supabase
      .from('profiles')
      .update({ hours_remaining: parseInt(hours as string) })
      .eq('id', id);

    revalidatePath('/admin');
    revalidatePath('/dashboard');
  }

  return (
    <main className={styles.container} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      {/* HEADER */}
      <div style={{ 
        padding: '15px 20px', 
        backgroundColor: 'var(--black)', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '6px solid black',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '6px', backgroundColor: 'var(--primary)', borderRadius: '50%', border: '3px solid black' }}>
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="40" r="20" fill="black" />
              <path d="M20 90C20 70 35 60 50 60C65 60 80 70 80 90H20Z" fill="black" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>ALEX&apos;S HQ</h1>
        </div>
        <div style={{ fontWeight: 900, fontSize: '0.75rem', backgroundColor: 'black', padding: '5px 12px', borderRadius: '8px', border: '1px solid white' }}>
          HI, {profile.first_name.toUpperCase()}!
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px 20px', flexWrap: 'wrap' }}>
        <Link href="/admin?tab=overview" style={{
          padding: '8px 20px',
          backgroundColor: activeTab === 'overview' ? 'var(--primary)' : 'white',
          border: '3px solid black',
          borderRadius: '12px',
          fontWeight: 900,
          fontSize: '0.9rem',
          textDecoration: 'none',
          color: 'black'
        }}>STUDENTS</Link>
        <Link href="/admin?tab=chat" style={{
          padding: '8px 20px',
          backgroundColor: activeTab === 'chat' ? '#FF6B6B' : 'white',
          color: activeTab === 'chat' ? 'white' : 'black',
          border: '3px solid black',
          borderRadius: '12px',
          fontWeight: 900,
          fontSize: '0.9rem',
          textDecoration: 'none'
        }}>CHAT</Link>
      </div>

      <div style={{ flex: 1, padding: '0 20px 20px 20px' }}>
        
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {students?.map((s, idx) => (
              <div key={s.id} className="brutal-card" style={{ 
                backgroundColor: 'white', 
                borderRadius: '20px', 
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                transform: `rotate(${idx % 2 === 0 ? '0.5' : '-0.5'}deg)`
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="40" r="20" fill="black" />
                      <path d="M20 90C20 70 35 60 50 60C65 60 80 70 80 90H20Z" fill="black" />
                    </svg>
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.first_name} {s.last_name}</h3>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.5 }}>{s.email}</p>
                  </div>
                </div>
                
                <div style={{ backgroundColor: 'var(--light-yellow)', padding: '12px', borderRadius: '15px', border: '3px solid black', textAlign: 'center' }}>
                  <p style={{ fontWeight: 900, fontSize: '0.7rem', opacity: 0.7 }}>HOURS</p>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{s.hours_remaining}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/admin?tab=chat&student=${s.id}`} className="brutal-btn" style={{ flex: 1, fontSize: '0.8rem', padding: '10px', textAlign: 'center', backgroundColor: 'var(--secondary)', color: 'white', borderRadius: '10px', textDecoration: 'none' }}>REPLY</Link>
                  <form action={updateHours} style={{ display: 'flex', gap: '5px' }}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="number" name="hours" defaultValue={s.hours_remaining} style={{ width: '45px', padding: '8px', border: '3px solid black', borderRadius: '10px', fontWeight: 900, fontSize: '0.9rem' }} />
                    <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', borderRadius: '10px', padding: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 50L40 70L80 30" stroke="black" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row',
            height: 'calc(100vh - 200px)', 
            backgroundColor: 'white', 
            border: '4px solid black', 
            borderRadius: '20px',
            overflow: 'hidden'
          }} className="admin-chat-container">
            {/* CSS for responsive chat - will inject via globals or inline style tag */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media (max-width: 768px) {
                .admin-chat-container { flex-direction: column !important; height: auto !important; min-height: 600px; }
                .admin-student-list { width: 100% !important; height: 150px !important; border-right: none !important; border-bottom: 4px solid black !important; }
              }
            `}} />
            
            <div style={{ width: '250px', borderRight: '4px solid black', overflowY: 'auto', backgroundColor: '#fdfdfd', flexShrink: 0 }} className="admin-student-list">
              <div style={{ padding: '12px 15px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem' }}>STUDENTS</div>
              {students?.map((s) => (
                <Link key={s.id} href={`/admin?tab=chat&student=${s.id}`} style={{
                  display: 'block',
                  padding: '12px 15px',
                  borderBottom: '2px solid black',
                  backgroundColor: selectedStudentId === s.id ? 'var(--light-yellow)' : 'transparent',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  color: 'black'
                }}>
                  {s.first_name} {s.last_name}
                </Link>
              ))}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', overflow: 'hidden' }}>
              {selectedStudent ? (
                <div style={{ flex: 1, padding: '10px', overflow: 'hidden' }}>
                  <Chat userId={user.id} studentId={selectedStudent.id} receiverName={selectedStudent.first_name} />
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, padding: '20px', textAlign: 'center' }}>
                  SELECT A STUDENT TO CHAT
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
