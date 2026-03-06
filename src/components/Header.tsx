'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function Header({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav style={{
        padding: '15px 20px',
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'black' }}>
          <svg width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ border: '2px solid black', backgroundColor: 'var(--primary)' }}>
            <circle cx="50" cy="40" r="15" fill="black" />
            <path d="M25 85C25 65 35 55 50 55C65 55 75 65 75 85H25Z" fill="black" />
            <rect x="45" y="10" width="10" height="15" fill="black" />
          </svg>
          <span style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>
            RUSSIAN-WITH-ALEX
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          
          {user ? (
            <Link href="/dashboard" className="brutal-btn" style={{ padding: '8px 15px', fontSize: '0.8rem', backgroundColor: 'var(--green)', color: 'black' }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="brutal-btn" style={{ padding: '8px 15px', fontSize: '0.8rem', backgroundColor: 'var(--secondary)', color: 'white' }}>
              Sign In
            </Link>
          )}
        </div>

        {/* MOBILE BURGER TOGGLE */}
        <div className="mobile-nav-toggle" style={{ display: 'none', gap: '10px', alignItems: 'center' }}>
           {user ? (
            <Link href="/dashboard" className="brutal-btn" style={{ padding: '6px 12px', fontSize: '0.7rem', backgroundColor: 'var(--green)', color: 'black' }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="brutal-btn" style={{ padding: '6px 12px', fontSize: '0.7rem', backgroundColor: 'var(--secondary)', color: 'white' }}>
              Sign In
            </Link>
          )}
          <button onClick={toggleMenu} style={{ background: 'var(--primary)', border: '3px solid black', padding: '8px', borderRadius: '8px', boxShadow: '3px 3px 0px black' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '75px',
          left: 0,
          width: '100%',
          backgroundColor: 'var(--primary)',
          borderBottom: '4px solid black',
          padding: '20px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <Link href="/" onClick={toggleMenu} style={{ fontSize: '1.5rem', fontWeight: 900, textDecoration: 'none', color: 'black', border: '3px solid black', padding: '15px', backgroundColor: 'white' }}>HOME</Link>
          <Link href="/about" onClick={toggleMenu} style={{ fontSize: '1.5rem', fontWeight: 900, textDecoration: 'none', color: 'black', border: '3px solid black', padding: '15px', backgroundColor: 'white' }}>ABOUT</Link>
          <Link href="/contact" onClick={toggleMenu} style={{ fontSize: '1.5rem', fontWeight: 900, textDecoration: 'none', color: 'black', border: '3px solid black', padding: '15px', backgroundColor: 'white' }}>CONTACT</Link>
        </div>
      )}

      <style jsx>{`
        .nav-link {
          padding: 8px 16px;
          border: 3px solid black;
          box-shadow: 3px 3px 0px black;
          background-color: white;
          text-decoration: none;
          color: black;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        @media (max-width: 850px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
