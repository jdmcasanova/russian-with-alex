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
    <main className={styles.container} style={{ height: 'calc(100vh - 75px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ADMIN TOP BAR */}
      <div style={{ 
        padding: '10px 30px', 
        backgroundColor: 'var(--black)', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
          ADMIN COMMAND CENTER ⚡
        </h1>
        <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>
          MASTER: {profile.first_name}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', borderTop: '4px solid black' }}>
        
        {/* LEFT SIDE: STUDENT LIST */}
        <div style={{ 
          width: '280px', 
          borderRight: '4px solid black', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'white'
        }}>
          <div style={{ padding: '15px', borderBottom: '4px solid black', backgroundColor: 'var(--primary)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 900 }}>STUDENTS</h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {students?.map((s) => (
              <Link 
                key={s.id} 
                href={`/admin?student=${s.id}`}
                style={{ 
                  display: 'block',
                  padding: '12px 15px',
                  borderBottom: '2px solid black',
                  backgroundColor: selectedStudentId === s.id ? 'var(--light-yellow)' : 'transparent',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '0.95rem', textTransform: 'uppercase' }}>
                  {s.first_name} {s.last_name}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6 }}>
                  {s.email}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <span style={{ 
                    fontSize: '0.6rem', 
                    backgroundColor: 'black', 
                    color: 'white', 
                    padding: '1px 6px',
                    fontWeight: 900
                  }}>
                    {s.hours_remaining} HOURS
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: CHAT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', overflow: 'hidden' }}>
          {selectedStudent ? (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* TOP BAR: QUICK ACTIONS */}
              <div style={{ padding: '10px 20px', borderBottom: '4px solid black', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 900 }}>{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                
                <form action={updateHours} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="hidden" name="id" value={selectedStudent.id} />
                  <input 
                    type="number" 
                    name="hours" 
                    defaultValue={selectedStudent.hours_remaining} 
                    style={{ width: '50px', padding: '5px', border: '3px solid black', fontWeight: 900, fontSize: '0.8rem' }}
                  />
                  <button type="submit" className="brutal-btn" style={{ padding: '4px 10px', fontSize: '0.6rem', backgroundColor: 'var(--green)' }}>
                    SET
                  </button>
                </form>
              </div>

              {/* CHAT COMPONENT */}
              <div style={{ flex: 1, padding: '10px', overflow: 'hidden' }}>
                <Chat 
                  userId={user.id} 
                  studentId={selectedStudent.id} 
                  receiverName={`${selectedStudent.first_name}`} 
                />
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
              <h2 style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1rem' }}>Select a student to chat</h2>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
