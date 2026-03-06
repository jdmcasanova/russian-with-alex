import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import styles from '../page.module.css';
import Link from 'next/link';
import Chat from '@/components/Chat';

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If user is admin, redirect them to the admin panel instead
  if (profile?.role === 'admin') {
    return redirect('/admin');
  }

  const { data: admin } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single();

  return (
    <main className={styles.container}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <header style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>STUDENT PORTAL</h1>
          <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>Welcome back, {profile?.first_name}! 👋</p>
        </header>

        {/* COMPACT STATS GRID */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div className="brutal-card" style={{ backgroundColor: 'var(--primary)', transform: 'rotate(-1deg)', padding: '20px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '5px' }}>LESSONS LEFT</h2>
            <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>
              {profile?.hours_remaining || 0}
            </div>
          </div>

          <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white', transform: 'rotate(1deg)', padding: '20px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '5px' }}>NEXT STEP</h2>
            <Link href="https://cal.com/alex-russian" target="_blank" className="brutal-btn" style={{ backgroundColor: 'white', display: 'inline-block', fontSize: '0.9rem', padding: '8px 15px' }}>
              BOOK A CLASS 🗓️
            </Link>
          </div>
        </div>

        {/* CHAT SECTION */}
        <section style={{ padding: '0' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', textTransform: 'uppercase' }}>Chat with Alex</h2>
          <div style={{ maxWidth: '100%' }}>
            <Chat userId={user.id} studentId={user.id} receiverName="Alex" />
          </div>
        </section>

        <footer style={{ marginTop: '80px', padding: '40px 0', borderTop: '4px solid black' }}>
          <form action="/auth/signout" method="post">
            <button type="submit" style={{ background: 'none', border: 'none', textDecoration: 'underline', fontWeight: 900, cursor: 'pointer' }}>
              LOGOUT
            </button>
          </form>
        </footer>
      </div>
    </main>
  );
}
