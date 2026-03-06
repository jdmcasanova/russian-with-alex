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
      {/* PLAYFUL HEADER */}
      <div style={{ 
        padding: '25px 40px', 
        backgroundColor: 'var(--secondary)', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '6px solid black',
        transform: 'rotate(-0.5deg)',
        margin: '10px 10px 0 10px',
        borderRadius: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ 
            padding: '10px', 
            backgroundColor: 'var(--primary)', 
            borderRadius: '50%', 
            border: '4px solid black',
            transform: 'rotate(10deg)'
          }}>
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="40" r="20" fill="black" />
              <path d="M20 90C20 70 35 60 50 60C65 60 80 70 80 90H20Z" fill="black" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1px' }}>
            ALEX&apos;S HQ
          </h1>
        </div>
        <div style={{ 
          fontWeight: 900, 
          fontSize: '0.9rem', 
          backgroundColor: 'black', 
          padding: '8px 15px', 
          borderRadius: '10px',
          transform: 'rotate(2deg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>HI, {profile.first_name.toUpperCase()}!</span>
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 50C20 30 30 20 50 20C70 20 80 30 80 50V80H20V50Z" fill="var(--primary)" stroke="white" strokeWidth="8"/>
            <circle cx="40" cy="45" r="5" fill="black" />
            <circle cx="60" cy="45" r="5" fill="black" />
          </svg>
        </div>
      </div>

      {/* WONKY TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: '20px', padding: '30px 40px' }}>
        <Link href="/admin?tab=overview" style={{
          padding: '12px 30px',
          backgroundColor: activeTab === 'overview' ? 'var(--primary)' : 'white',
          border: '4px solid black',
          borderRadius: '15px',
          fontWeight: 900,
          fontSize: '1.1rem',
          boxShadow: activeTab === 'overview' ? 'none' : '6px 6px 0px black',
          transform: activeTab === 'overview' ? 'translate(3px, 3px)' : 'rotate(-2deg)',
          transition: 'all 0.1s',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'black'
        }}>
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="35" height="35" fill="black" stroke="black" strokeWidth="4"/>
            <rect x="55" y="10" width="35" height="35" fill="white" stroke="black" strokeWidth="8"/>
            <rect x="10" y="55" width="35" height="35" fill="white" stroke="black" strokeWidth="8"/>
            <rect x="55" y="55" width="35" height="35" fill="black" stroke="black" strokeWidth="4"/>
          </svg>
          STUDENTS
        </Link>
        
        <Link href="/admin?tab=chat" style={{
          padding: '12px 30px',
          backgroundColor: activeTab === 'chat' ? '#FF6B6B' : 'white', 
          color: activeTab === 'chat' ? 'white' : 'black',
          border: '4px solid black',
          borderRadius: '15px',
          fontWeight: 900,
          fontSize: '1.1rem',
          boxShadow: activeTab === 'chat' ? 'none' : '6px 6px 0px black',
          transform: activeTab === 'chat' ? 'translate(3px, 3px)' : 'rotate(2deg)',
          transition: 'all 0.1s',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}>
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20H90V70H50L25 90V70H10V20Z" fill={activeTab === 'chat' ? 'white' : 'black'} stroke="black" strokeWidth="4"/>
          </svg>
          CHAT
        </Link>
      </div>

      <div style={{ flex: 1, padding: '0 40px 40px 40px' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '35px' }}>
            {students?.map((s, idx) => (
              <div key={s.id} className="brutal-card" style={{ 
                backgroundColor: 'white', 
                borderRadius: '25px', 
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                transform: `rotate(${idx % 2 === 0 ? '1' : '-1'}deg)`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="25" height="25" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="40" r="20" fill="black" />
                        <path d="M20 90C20 70 35 60 50 60C65 60 80 70 80 90H20Z" fill="black" />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', lineHeight: '1', textTransform: 'uppercase' }}>{s.first_name} {s.last_name}</h3>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, marginTop: '2px' }}>{s.email}</p>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: 'var(--light-yellow)', 
                  padding: '20px', 
                  borderRadius: '20px', 
                  border: '4px solid black',
                  textAlign: 'center'
                }}>
                  <p style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '5px', opacity: 0.7 }}>HOURS REMAINING</p>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900, color: s.hours_remaining === 0 ? 'var(--accent)' : 'black' }}>
                    {s.hours_remaining}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link href={`/admin?tab=chat&student=${s.id}`} className="brutal-btn" style={{ 
                    flex: 1, 
                    fontSize: '0.9rem', 
                    padding: '12px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    borderRadius: '12px',
                    textDecoration: 'none'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 20H90V70H50L25 90V70H10V20Z" fill="white" stroke="white" strokeWidth="4"/>
                    </svg>
                    REPLY
                  </Link>
                  <form action={updateHours} style={{ display: 'flex', gap: '8px' }}>
                    <input type="hidden" name="id" value={s.id} />
                    <input 
                      type="number" 
                      name="hours" 
                      defaultValue={s.hours_remaining} 
                      style={{ width: '60px', padding: '10px', border: '3px solid black', borderRadius: '12px', fontWeight: 900, fontSize: '1rem' }}
                    />
                    <button type="submit" className="brutal-btn" style={{ 
                      backgroundColor: 'var(--green)', 
                      borderRadius: '12px', 
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            height: '75vh', 
            backgroundColor: 'white', 
            border: '4px solid black', 
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '15px 15px 0px black'
          }} className="admin-chat-container">
            <style dangerouslySetInnerHTML={{ __html: `
              @media (max-width: 768px) {
                .admin-chat-container { flex-direction: column !important; height: auto !important; min-height: 600px; }
                .admin-student-list { width: 100% !important; height: 150px !important; border-right: none !important; border-bottom: 4px solid black !important; }
              }
            `}} />
            
            <div style={{ width: '320px', borderRight: '4px solid black', overflowY: 'auto', backgroundColor: '#fdfdfd', flexShrink: 0 }} className="admin-student-list">
              <div style={{ padding: '20px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 20H80V80H20V20Z" fill="black"/>
                  <path d="M30 40H70M30 60H60" stroke="white" strokeWidth="8"/>
                </svg>
                STUDENTS
              </div>
              {students?.map((s) => (
                <Link key={s.id} href={`/admin?tab=chat&student=${s.id}`} style={{
                  display: 'block',
                  padding: '20px',
                  borderBottom: '2px solid black',
                  backgroundColor: selectedStudentId === s.id ? 'var(--light-yellow)' : 'transparent',
                  fontWeight: 800,
                  fontSize: '1rem',
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
                  <Chat studentId={selectedStudent.id} receiverName={selectedStudent.first_name} />
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexDirection: 'column', gap: '20px' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary)', borderRadius: '50%', border: '4px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 20H90V70H50L25 90V70H10V20Z" fill="black" stroke="black" strokeWidth="4"/>
                    </svg>
                  </div>
                  <h2 style={{ textTransform: 'uppercase' }}>Pick a student!</h2>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
