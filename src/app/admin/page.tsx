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

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    .neq('role', 'admin');

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
    <main className={styles.container}>
      <header style={{ padding: '40px 20px', borderBottom: '4px solid black', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5rem' }}>ADMIN PORTAL</h1>
      </header>

      <div className={styles.splitSection}>
        {/* STUDENT LIST */}
        <div className="brutal-card">
          <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>STUDENTS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {students?.map((s) => (
              <div key={s.id} style={{ 
                border: '4px solid black', 
                padding: '15px', 
                backgroundColor: selectedStudentId === s.id ? 'var(--primary)' : 'white',
                boxShadow: selectedStudentId === s.id ? 'none' : '4px 4px 0px black'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 900 }}>{s.first_name} {s.last_name}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.7 }}>{s.email}</span>
                  </div>
                  <Link href={`/admin?student=${s.id}`} style={{ textDecoration: 'underline', fontWeight: 900 }}>CHAT 💬</Link>
                </div>

                <form action={updateHours} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="hidden" name="id" value={s.id} />
                  <input 
                    type="number" 
                    name="hours" 
                    defaultValue={s.hours_remaining} 
                    style={{ width: '50px', padding: '5px', border: '3px solid black', fontWeight: 900 }}
                  />
                  <button type="submit" style={{ background: 'black', color: 'white', padding: '5px 10px', fontWeight: 900 }}>SET</button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="brutal-card" style={{ backgroundColor: 'var(--bg)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>MESSAGES</h2>
          {selectedStudentId ? (
            <Chat userId={user.id} receiverId={selectedStudentId} />
          ) : (
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, border: '4px solid black', backgroundColor: 'white' }}>
              SELECT A STUDENT TO START CHATTING
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
