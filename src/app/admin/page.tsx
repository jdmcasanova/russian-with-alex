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
      {/* ADMIN HEADER */}
      <div style={{ 
        padding: '20px 40px', 
        backgroundColor: 'var(--black)', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '4px solid var(--primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ padding: '8px', backgroundColor: 'var(--primary)', borderRadius: '10px', border: '2px solid white' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.1H3.73L12 5.45zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/></svg>
          </div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
            COMMAND CENTER
          </h1>
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', opacity: 0.8 }}>
          MASTER: {profile.first_name}
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: '10px', padding: '20px 40px', backgroundColor: 'white', borderBottom: '4px solid black' }}>
        <Link href="/admin?tab=overview" style={{
          padding: '10px 25px',
          backgroundColor: activeTab === 'overview' ? 'var(--primary)' : 'white',
          border: '3px solid black',
          borderRadius: '12px',
          fontWeight: 900,
          boxShadow: activeTab === 'overview' ? 'none' : '4px 4px 0px black',
          transform: activeTab === 'overview' ? 'translate(2px, 2px)' : 'none'
        }}>OVERVIEW</Link>
        
        <Link href="/admin?tab=chat" style={{
          padding: '10px 25px',
          backgroundColor: activeTab === 'chat' ? 'var(--secondary)' : 'white',
          color: activeTab === 'chat' ? 'white' : 'black',
          border: '3px solid black',
          borderRadius: '12px',
          fontWeight: 900,
          boxShadow: activeTab === 'chat' ? 'none' : '4px 4px 0px black',
          transform: activeTab === 'chat' ? 'translate(2px, 2px)' : 'none'
        }}>MESSAGES</Link>
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        
        {/* TAB 1: OVERVIEW (Student Grid) */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {students?.map((s) => (
              <div key={s.id} className="brutal-card" style={{ 
                backgroundColor: 'white', 
                borderRadius: '20px', 
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', textTransform: 'uppercase' }}>{s.first_name} {s.last_name}</h3>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.6 }}>{s.email}</p>
                </div>
                
                <div style={{ 
                  backgroundColor: 'var(--light-yellow)', 
                  padding: '15px', 
                  borderRadius: '15px', 
                  border: '3px solid black',
                  textAlign: 'center'
                }}>
                  <p style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '5px' }}>HOURS REMAINING</p>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{s.hours_remaining}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/admin?tab=chat&student=${s.id}`} className="brutal-btn" style={{ 
                    flex: 1, 
                    fontSize: '0.8rem', 
                    padding: '10px', 
                    textAlign: 'center',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '10px'
                  }}>
                    CHAT 💬
                  </Link>
                  <form action={updateHours} style={{ display: 'flex', gap: '5px' }}>
                    <input type="hidden" name="id" value={s.id} />
                    <input 
                      type="number" 
                      name="hours" 
                      defaultValue={s.hours_remaining} 
                      style={{ width: '50px', padding: '10px', border: '3px solid black', borderRadius: '10px', fontWeight: 900 }}
                    />
                    <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', borderRadius: '10px', padding: '10px' }}>
                      SET
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MESSAGES (WhatsApp View) */}
        {activeTab === 'chat' && (
          <div style={{ 
            display: 'flex', 
            height: '70vh', 
            backgroundColor: 'white', 
            border: '4px solid black', 
            borderRadius: '25px',
            overflow: 'hidden',
            boxShadow: '12px 12px 0px black'
          }}>
            {/* LEFT: MINI STUDENT LIST */}
            <div style={{ width: '300px', borderRight: '4px solid black', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
              {students?.map((s) => (
                <Link key={s.id} href={`/admin?tab=chat&student=${s.id}`} style={{
                  display: 'block',
                  padding: '20px',
                  borderBottom: '2px solid black',
                  backgroundColor: selectedStudentId === s.id ? 'var(--primary)' : 'transparent',
                  fontWeight: 800
                }}>
                  {s.first_name} {s.last_name}
                </Link>
              ))}
            </div>

            {/* RIGHT: CHAT AREA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
              {selectedStudent ? (
                <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
                  <Chat userId={user.id} studentId={selectedStudent.id} receiverName={selectedStudent.first_name} />
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  SELECT A STUDENT TO START CHATTING
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
