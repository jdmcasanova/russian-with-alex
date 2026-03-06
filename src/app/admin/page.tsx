import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import styles from '../page.module.css';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import Chat from '@/components/Chat';

export default async function Admin({ searchParams }: { searchParams: Promise<{ student?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  const selectedStudentId = params.student;

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
  }

  return (
    <main className={styles.container} style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', borderTop: '4px solid black' }}>
        
        {/* LEFT SIDE: STUDENT LIST (WhatsApp Style) */}
        <div style={{ 
          width: '350px', 
          borderRight: '4px solid black', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'white'
        }}>
          <div style={{ padding: '20px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>STUDENTS</h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {students?.map((s) => (
              <Link 
                key={s.id} 
                href={`/admin?student=${s.id}`}
                style={{ 
                  display: 'block',
                  padding: '20px',
                  borderBottom: '2px solid black',
                  backgroundColor: selectedStudentId === s.id ? 'var(--light-yellow)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>
                  {s.first_name} {s.last_name}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.6, marginTop: '4px' }}>
                  {s.email}
                </div>
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    backgroundColor: 'black', 
                    color: 'white', 
                    padding: '2px 8px',
                    fontWeight: 900
                  }}>
                    {s.hours_remaining} HOURS LEFT
                  </span>
                </div>
              </Link>
            ))}
            {students?.length === 0 && <p style={{ padding: '20px', fontWeight: 700 }}>No students yet.</p>}
          </div>
        </div>

        {/* RIGHT SIDE: CHAT & ACTIONS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
          {selectedStudent ? (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
              
              {/* TOP BAR: QUICK ACTIONS */}
              <div style={{ padding: '15px 30px', borderBottom: '4px solid black', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                </div>
                
                <form action={updateHours} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="hidden" name="id" value={selectedStudent.id} />
                  <label style={{ fontWeight: 900, fontSize: '0.8rem' }}>MANAGE HOURS:</label>
                  <input 
                    type="number" 
                    name="hours" 
                    defaultValue={selectedStudent.hours_remaining} 
                    style={{ width: '60px', padding: '8px', border: '3px solid black', fontWeight: 900 }}
                  />
                  <button type="submit" className="brutal-btn" style={{ padding: '5px 15px', fontSize: '0.7rem', backgroundColor: 'var(--green)' }}>
                    UPDATE
                  </button>
                </form>
              </div>

              {/* CHAT COMPONENT */}
              <div style={{ flex: 1, padding: '20px' }}>
                <Chat 
                  userId={user.id} 
                  receiverId={selectedStudent.id} 
                  receiverName={`${selectedStudent.first_name}`} 
                />
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="20" width="80" height="60" fill="white" stroke="black" strokeWidth="6"/>
                <path d="M30 45H70M30 55H60" stroke="black" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              <h2 style={{ fontWeight: 900, textTransform: 'uppercase' }}>Select a student to start chatting</h2>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
