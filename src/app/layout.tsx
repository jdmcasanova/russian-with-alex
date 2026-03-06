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
          padding: '15px 20px',
          borderBottom: 'var(--border-width) solid var(--black)',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 0 rgba(0,0,0,1)',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'black' }}>
            <svg width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ border: '2px solid black', backgroundColor: 'var(--primary)' }}>
              <circle cx="50" cy="40" r="15" fill="black" />
              <path d="M25 85C25 65 35 55 50 55C65 55 75 65 75 85H25Z" fill="black" />
              <rect x="45" y="10" width="10" height="15" fill="black" />
            </svg>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>
              RUSSIAN<span style={{ color: 'var(--accent)' }}>-</span>WITH<span style={{ color: 'var(--accent)' }}>-</span>ALEX
            </span>
          </Link>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            fontSize: '0.8rem', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/" style={{ padding: '6px 12px', border: '2px solid black', boxShadow: '2px 2px 0px black', backgroundColor: 'white', textDecoration: 'none', color: 'black' }}>Home</Link>
            <Link href="/about" style={{ padding: '6px 12px', border: '2px solid black', boxShadow: '2px 2px 0px black', backgroundColor: 'white', textDecoration: 'none', color: 'black' }}>About</Link>
            <Link href="/contact" style={{ padding: '6px 12px', border: '2px solid black', boxShadow: '2px 2px 0px black', backgroundColor: 'white', textDecoration: 'none', color: 'black' }}>Contact</Link>
            
            {user ? (
              <Link href="/dashboard" className="brutal-btn" style={{ padding: '6px 15px', fontSize: '0.8rem', boxShadow: '3px 3px 0px black', backgroundColor: 'var(--green)', textDecoration: 'none', color: 'black' }}>
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="brutal-btn" style={{ padding: '6px 15px', fontSize: '0.8rem', boxShadow: '3px 3px 0px black', backgroundColor: 'var(--secondary)', color: 'white', textDecoration: 'none' }}>
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
