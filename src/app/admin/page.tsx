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
            ALEX&apos;S HQ ⚡
          </h1>
        </div>
        <div style={{ 
          fontWeight: 900, 
          fontSize: '0.9rem', 
          backgroundColor: 'black', 
          padding: '8px 15px', 
          borderRadius: '10px',
          transform: 'rotate(2deg)'
        }}>
          HI, {profile.first_name.toUpperCase()}! 👋
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
          transition: 'all 0.1s'
        }}>STUDENTS</Link>
        
        <Link href="/admin?tab=chat" style={{
          padding: '12px 30px',
          backgroundColor: activeTab === 'chat' ? '#FF6B6B' : 'white', // Fun clashing red
          color: activeTab === 'chat' ? 'white' : 'black',
          border: '4px solid black',
          borderRadius: '15px',
          fontWeight: 900,
          fontSize: '1.1rem',
          boxShadow: activeTab === 'chat' ? 'none' : '6px 6px 0px black',
          transform: activeTab === 'chat' ? 'translate(3px, 3px)' : 'rotate(2deg)',
          transition: 'all 0.1s'
        }}>CHAT 💬</Link>
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
                  <div>
                    <h3 style={{ fontSize: '1.6rem', lineHeight: '1' }}>{s.first_name}<br/>{s.last_name}</h3>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5, marginTop: '5px' }}>{s.email}</p>
                  </div>
                  <div style={{ backgroundColor: 'var(--green)', padding: '5px 10px', border: '3px solid black', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900 }}>
                    ACTIVE
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: 'var(--light-yellow)', 
                  padding: '20px', 
                  borderRadius: '20px', 
                  border: '4px solid black',
                  textAlign: 'center',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '5px', opacity: 0.7 }}>LESSONS REMAINING</p>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900, color: s.hours_remaining === 0 ? 'var(--accent)' : 'black' }}>
                    {s.hours_remaining}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link href={`/admin?tab=chat&student=${s.id}`} className="brutal-btn" style={{ 
                    flex: 1, 
                    fontSize: '0.9rem', 
                    padding: '12px', 
                    textAlign: 'center',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    borderRadius: '12px'
                  }}>
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
                    <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', borderRadius: '12px', padding: '12px' }}>
                      SET
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MESSAGES */}
        {activeTab === 'chat' && (
          <div style={{ 
            display: 'flex', 
            height: '75vh', 
            backgroundColor: 'white', 
            border: '4px solid black', 
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '15px 15px 0px black'
          }}>
            <div style={{ width: '320px', borderRight: '4px solid black', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
              <div style={{ padding: '20px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)', fontWeight: 900 }}>
                STUDENT LIST
              </div>
              {students?.map((s) => (
                <Link key={s.id} href={`/admin?tab=chat&student=${s.id}`} style={{
                  display: 'block',
                  padding: '20px',
                  borderBottom: '2px solid black',
                  backgroundColor: selectedStudentId === s.id ? 'var(--light-yellow)' : 'transparent',
                  fontWeight: 800,
                  fontSize: '1rem'
                }}>
                  {s.first_name} {s.last_name}
                </Link>
              ))}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', overflow: 'hidden' }}>
              {selectedStudent ? (
                <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
                  <Chat userId={user.id} studentId={selectedStudent.id} receiverName={selectedStudent.first_name} />
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexDirection: 'column', gap: '20px' }}>
                  <div style={{ fontSize: '4rem' }}>💬</div>
                  <h2 style={{ textTransform: 'uppercase' }}>Pick a student to chat!</h2>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
