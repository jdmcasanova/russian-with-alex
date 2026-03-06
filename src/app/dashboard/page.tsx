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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase' }}>STUDENT PORTAL</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome back, {profile?.first_name}! 👋</p>
        </header>

        {/* COMPACT STATS GRID */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px',
          maxWidth: '800px',
          marginBottom: '60px'
        }}>
          <div className="brutal-card" style={{ backgroundColor: 'var(--primary)', transform: 'rotate(-1deg)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '10px' }}>YOUR LESSONS</h2>
            <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>
              {profile?.hours_remaining || 0}
            </div>
            <p style={{ fontWeight: 700, marginTop: '5px' }}>Hours Remaining</p>
          </div>

          <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white', transform: 'rotate(1deg)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '10px' }}>NEXT STEP</h2>
            <p style={{ marginBottom: '20px', fontWeight: 600 }}>Ready for your next breakthrough?</p>
            <Link href="https://cal.com/alex-russian" target="_blank" className="brutal-btn" style={{ backgroundColor: 'white', display: 'inline-block', fontSize: '1rem', padding: '10px 20px' }}>
              BOOK A CLASS 🗓️
            </Link>
          </div>
        </div>

        {/* CHAT SECTION */}
        <section>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', textTransform: 'uppercase' }}>Direct Chat with Alex</h2>
          <div style={{ maxWidth: '800px' }}>
            {admin ? (
              <Chat userId={user.id} receiverId={admin.id} receiverName="Alex" />
            ) : (
              <div className="brutal-card">
                <p style={{ fontWeight: 700 }}>Chat unavailable. Check back soon!</p>
              </div>
            )}
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
