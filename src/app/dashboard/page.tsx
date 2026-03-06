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

  if (profile?.role === 'admin') {
    return redirect('/admin');
  }

  return (
    <main className={styles.container}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <header style={{ marginBottom: '25px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', textTransform: 'uppercase', lineHeight: 1 }}>STUDENT PORTAL</h1>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '10px' }}>Welcome back, {profile?.first_name}! 👋</p>
        </header>

        {/* RESPONSIVE STATS GRID */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', // Stack by default on mobile
          gap: '20px',
          marginBottom: '40px'
        }} className="dashboard-grid">
          
          <style dangerouslySetInnerHTML={{ __html: `
            @media (min-width: 600px) {
              .dashboard-grid { grid-template-columns: 1fr 1fr !important; }
            }
          `}} />

          <div className="brutal-card" style={{ backgroundColor: 'var(--primary)', transform: 'rotate(-1deg)', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '5px' }}>LESSONS LEFT</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>
              {profile?.hours_remaining || 0}
            </div>
          </div>

          <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white', transform: 'rotate(1deg)', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '10px' }}>NEXT STEP</h2>
            <Link href="https://cal.com/alex-russian" target="_blank" className="brutal-btn" style={{ backgroundColor: 'white', display: 'inline-block', fontSize: '0.9rem', padding: '10px 20px', width: '100%', textDecoration: 'none', color: 'black' }}>
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

        <footer style={{ marginTop: '60px', padding: '30px 0', borderTop: '4px solid black', textAlign: 'center' }}>
          <form action="/auth/signout" method="post">
            <button type="submit" style={{ background: 'none', border: 'none', textDecoration: 'underline', fontWeight: 900, cursor: 'pointer', fontSize: '0.9rem' }}>
              LOGOUT
            </button>
          </form>
        </footer>
      </div>
    </main>
  );
}
