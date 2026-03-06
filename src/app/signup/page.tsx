'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import Link from 'next/link';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters."),
  lastName: z.string().min(2, "Last Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = signupSchema.safeParse({ firstName, lastName, email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (success) {
    return (
      <main className={styles.container}>
        <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="brutal-card" style={{ backgroundColor: 'var(--green)', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>CHECK EMAIL!</h1>
            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              We&apos;ve sent a confirmation link to your email. Click it to activate your account!
            </p>
            <Link href="/login" className="brutal-btn" style={{ marginTop: '30px', display: 'inline-block', backgroundColor: 'white' }}>
              BACK TO LOGIN
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="brutal-card" style={{ backgroundColor: 'var(--primary)', maxWidth: '450px', width: '100%' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '30px' }}>SIGN UP</h1>

          <button 
            onClick={handleGoogleSignup}
            className="brutal-btn" 
            style={{ backgroundColor: 'white', width: '100%', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/></svg>
            GOOGLE SIGN UP
          </button>

          <div style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 900 }}>— OR —</div>
          
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div className="brutal-card" style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '10px' }}>
                {error}
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 900 }}>First Name</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
                  style={{ padding: '15px', border: '4px solid black', fontWeight: 700 }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 900 }}>Last Name</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required 
                  style={{ padding: '15px', border: '4px solid black', fontWeight: 700 }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 900 }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ padding: '15px', border: '4px solid black', fontWeight: 700 }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 900 }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ padding: '15px', border: '4px solid black', fontWeight: 700 }} 
              />
            </div>

            <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', marginTop: '10px' }}>
              {loading ? 'WAITING...' : 'JOIN NOW 🚀'}
            </button>
          </form>

          <p style={{ marginTop: '30px', fontWeight: 700 }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--secondary)', textDecoration: 'underline' }}>Login here</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
