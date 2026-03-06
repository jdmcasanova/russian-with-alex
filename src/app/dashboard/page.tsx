import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import styles from '../page.module.css';
import Link from 'next/link';
import Chat from '@/components/Chat';

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Find the Admin (Alex) ID to chat with
  const { data: admin } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single();

  return (
    <main className={styles.container}>
      <header style={{ padding: '40px 20px', borderBottom: '4px solid black', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5rem' }}>STUDENT PORTAL</h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>Welcome back, {profile?.first_name || 'Student'}! 👋</p>
      </header>

      <div className={styles.grid}>
        <div className="brutal-card" style={{ backgroundColor: 'var(--primary)', transform: 'rotate(-1deg)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>YOUR LESSONS</h2>
          <div style={{ fontSize: '4rem', fontWeight: 900 }}>
            {profile?.hours_remaining || 0}
          </div>
          <p style={{ fontWeight: 700 }}>Hours Remaining</p>
        </div>

        <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white', transform: 'rotate(1deg)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>NEXT STEP</h2>
          <p style={{ marginBottom: '30px' }}>Ready for your next Russian breakthrough?</p>
          <Link href="https://cal.com/alex-russian" target="_blank" className="brutal-btn" style={{ backgroundColor: 'white', display: 'inline-block' }}>
            BOOK A CLASS 🗓️
          </Link>
        </div>
      </div>

      <section style={{ marginTop: '60px' }}>
        <h2 className={styles.sectionTitle}>Direct Chat with Alex</h2>
        {admin ? (
          <Chat userId={user.id} receiverId={admin.id} />
        ) : (
          <div className="brutal-card" style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 700 }}>Chat currently unavailable. Alex hasn&apos;t set up her admin account yet!</p>
          </div>
        )}
      </section>

      <footer style={{ marginTop: '80px', padding: '40px 0', borderTop: '4px solid black', textAlign: 'center' }}>
        <form action="/auth/signout" method="post">
          <button type="submit" style={{ background: 'none', border: 'none', textDecoration: 'underline', fontWeight: 900, cursor: 'pointer' }}>
            LOGOUT
          </button>
        </form>
      </footer>
    </main>
  );
}
