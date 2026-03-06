'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function Header({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  };

  return (
    <>
      <nav style={{
        padding: '12px 20px',
        borderBottom: '4px solid black',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 0 rgba(0,0,0,1)',
      }}>
        {/* LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'black' }}>
          <div style={{ backgroundColor: 'var(--primary)', border: '3px solid black', borderRadius: '50%', padding: '5px' }}>
            <svg width="25" height="25" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="40" r="15" fill="black" />
              <path d="M25 85C25 65 35 55 50 55C65 55 75 65 75 85H25Z" fill="black" />
            </svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>
            RUSSIAN<span style={{ color: 'var(--accent)' }}>-</span>ALEX
          </span>
        </Link>

        {/* DESKTOP NAV - PERFECTLY SQUARED */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link href="/" className="nav-link-sq">Home</Link>
          <Link href="/about" className="nav-link-sq">About</Link>
          <Link href="/contact" className="nav-link-sq">Contact</Link>
          
          {user ? (
            <Link href="/dashboard" className="brutal-btn" style={{ 
              padding: '8px 15px', 
              fontSize: '0.8rem', 
              backgroundColor: 'var(--green)', 
              color: 'black',
              boxShadow: '4px 4px 0px black',
              borderRadius: '0px' // FIXED: Perfectly square
            }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="brutal-btn" style={{ 
              padding: '8px 15px', 
              fontSize: '0.8rem', 
              backgroundColor: 'var(--secondary)', 
              color: 'white',
              boxShadow: '4px 4px 0px black',
              borderRadius: '0px' // FIXED: Perfectly square
            }}>
              Sign In
            </Link>
          )}
        </div>

        {/* MOBILE BURGER TOGGLE */}
        <div className="mobile-nav-toggle" style={{ display: 'none', gap: '10px', alignItems: 'center' }}>
          <button onClick={toggleMenu} style={{ background: 'var(--primary)', border: '3px solid black', padding: '10px', borderRadius: '0px', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}>
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'var(--primary)', zIndex: 999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '40px'
        }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px', borderBottom: '8px solid black' }}>MENU</h2>
          <Link href="/" onClick={toggleMenu} className="mobile-link">HOME</Link>
          <Link href="/about" onClick={toggleMenu} className="mobile-link">ABOUT</Link>
          <Link href="/contact" onClick={toggleMenu} className="mobile-link">CONTACT</Link>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'black', margin: '20px 0' }}></div>
          {user ? (
            <>
              <Link href="/dashboard" onClick={toggleMenu} className="mobile-link" style={{ backgroundColor: 'var(--green)' }}>DASHBOARD</Link>
              <form action="/auth/signout" method="post" style={{ width: '100%', maxWidth: '300px' }}>
                <button type="submit" className="mobile-link" style={{ backgroundColor: 'var(--accent)', color: 'white', width: '100%', cursor: 'pointer', borderRadius: '0px' }}>
                  LOGOUT
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" onClick={toggleMenu} className="mobile-link" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>SIGN IN</Link>
          )}
        </div>
      )}

      <style jsx>{`
        .nav-link-sq {
          padding: 8px 16px;
          border: 3px solid black;
          box-shadow: 3px 3px 0px black;
          background-color: white;
          text-decoration: none;
          color: black;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          border-radius: 0px; /* FIXED: Perfectly square */
        }
        .mobile-link {
          width: 100%;
          max-width: 300px;
          text-align: center;
          padding: 20px;
          border: 4px solid black;
          box-shadow: 8px 8px 0px black;
          background-color: white;
          text-decoration: none;
          color: black;
          font-weight: 900;
          font-size: 1.5rem;
          text-transform: uppercase;
          border-radius: 0px; /* Mobile stays bold too */
        }
        @media (max-width: 850px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
