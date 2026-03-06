import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Russian, But Make It Fun! | Online Russian Lessons with Alex",
  description: "Learn Russian with a native speaker who skips the boring drills. Practical conversations, memorable grammar, and culture for US & UK students.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <nav style={{
          padding: '15px 30px',
          borderBottom: 'var(--border-width) solid var(--black)',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 0 rgba(0,0,0,1)'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ border: '3px solid black', backgroundColor: 'var(--primary)' }}>
              <circle cx="50" cy="40" r="15" fill="black" />
              <path d="M25 85C25 65 35 55 50 55C65 55 75 65 75 85H25Z" fill="black" />
              <rect x="45" y="10" width="10" height="15" fill="black" />
            </svg>
            <span style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>
              RUSSIAN<span style={{ color: 'var(--accent)' }}>-</span>WITH<span style={{ color: 'var(--accent)' }}>-</span>ALEX
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '15px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', alignItems: 'center' }}>
            <Link href="/" style={{ padding: '8px 16px', border: '3px solid black', boxShadow: '3px 3px 0px black', backgroundColor: 'white' }}>Home</Link>
            <Link href="/about" style={{ padding: '8px 16px', border: '3px solid black', boxShadow: '3px 3px 0px black', backgroundColor: 'white' }}>About</Link>
            <Link href="/contact" style={{ padding: '8px 16px', border: '3px solid black', boxShadow: '3px 3px 0px black', backgroundColor: 'white' }}>Contact</Link>
            
            {user ? (
              <Link href="/dashboard" className="brutal-btn" style={{ padding: '8px 20px', fontSize: '0.9rem', boxShadow: '4px 4px 0px black', backgroundColor: 'var(--green)' }}>
                Dashboard 🚀
              </Link>
            ) : (
              <Link href="/login" className="brutal-btn" style={{ padding: '8px 20px', fontSize: '0.9rem', boxShadow: '4px 4px 0px black', backgroundColor: 'var(--secondary)', color: 'white' }}>
                Sign In
              </Link>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
