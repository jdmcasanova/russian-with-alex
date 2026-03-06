import styles from "../page.module.css";
import Link from "next/link";

export default function About() {
  return (
    <main className={styles.container}>
      <section>
        <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <h1 style={{ fontSize: '4.5rem' }}>The Story Behind <br />The Matryoshka</h1>
        </div>
      </section>

      <section className={styles.splitSection}>
        <div className="brutal-card">
          <h2 style={{ marginBottom: '20px' }}>From Linguistics <br />to Techno</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            I graduated from the University of Warsaw with a degree in Applied Linguistics. 
            I’ve been on both sides of the language game—as a student of French and German, 
            and as a teacher of Russian, Polish, and English.
          </p>
          <p style={{ fontSize: '1.2rem' }}>
            When I’m not teaching, I’m digging for vinyl or spinning techno beats. 
            I believe language learning should have the same energy—rhythm, 
            excitement, and zero boredom.
          </p>
        </div>
        <div className="brutal-card" style={{ backgroundColor: 'var(--primary)' }}>
          <h2 style={{ marginBottom: '20px' }}>The Matryoshka <br />Method 🥣</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            Russian is like the Matryoshka doll. On the surface, it looks like a 
            scary pile of grammar cases and Cyrillic symbols.
          </p>
          <p style={{ fontSize: '1.2rem' }}>
            But as we peel back each layer, we uncover the heart: the humor, 
            the slang, and the soul of the language. I’m here to help you 
            reach that inner layer faster than any textbook ever could.
          </p>
        </div>
      </section>

      <section>
        <div className="brutal-card" style={{ 
          backgroundColor: 'var(--black)', 
          color: 'white', 
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 10L20 60H50L40 90L80 40H50L60 10Z" fill="var(--primary)" stroke="white" strokeWidth="6" strokeLinejoin="round"/>
          </svg>
          <h2 style={{ fontSize: '3.5rem', textTransform: 'uppercase' }}>Quick Facts</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
          {/* NATIVE RUSSIAN */}
          <div className="brutal-card" style={{ backgroundColor: 'var(--primary)', transform: 'rotate(-2deg)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="20" width="80" height="20" fill="white" stroke="black" strokeWidth="6"/>
              <rect x="10" y="40" width="80" height="20" fill="#0052FF" stroke="black" strokeWidth="6"/>
              <rect x="10" y="60" width="80" height="20" fill="#FF3B30" stroke="black" strokeWidth="6"/>
            </svg>
            <div style={{ lineHeight: '1.1' }}>
              <span style={{ fontSize: '1rem', fontWeight: 900 }}>NATIVE</span> <br />
              <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>RUSSIAN</span>
            </div>
          </div>

          {/* FLUENT IN 4 LANGUAGES */}
          <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white', transform: 'rotate(1deg)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="35" cy="40" r="25" fill="white" stroke="black" strokeWidth="6"/>
              <circle cx="65" cy="60" r="25" fill="var(--primary)" stroke="black" strokeWidth="6"/>
              <path d="M30 40H40M35 35V45" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <div style={{ lineHeight: '1.1' }}>
              <span style={{ fontSize: '1rem', fontWeight: 900 }}>FLUENT IN</span> <br />
              <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>4 LANGUAGES</span>
            </div>
          </div>

          {/* UNIVERSITY QUALIFIED */}
          <div className="brutal-card" style={{ backgroundColor: 'var(--green)', transform: 'rotate(-1deg)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 40L50 20L90 40L50 60L10 40Z" fill="white" stroke="black" strokeWidth="6"/>
              <path d="M30 50V75C30 75 40 85 50 85C60 85 70 75 70 75V50" fill="white" stroke="black" strokeWidth="6"/>
              <rect x="85" y="40" width="10" height="30" fill="black" />
            </svg>
            <div style={{ lineHeight: '1.1' }}>
              <span style={{ fontSize: '1rem', fontWeight: 900 }}>UNIVERSITY</span> <br />
              <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>QUALIFIED</span>
            </div>
          </div>

          {/* PRACTICAL APPROACH */}
          <div className="brutal-card" style={{ backgroundColor: 'var(--accent)', color: 'white', transform: 'rotate(2deg)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 80L80 20M30 20L20 30M80 70L70 80" stroke="white" strokeWidth="10" strokeLinecap="round"/>
              <circle cx="80" cy="20" r="10" fill="var(--primary)" stroke="black" strokeWidth="4"/>
            </svg>
            <div style={{ lineHeight: '1.1' }}>
              <span style={{ fontSize: '1rem', fontWeight: 900 }}>PRACTICAL</span> <br />
              <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>APPROACH</span>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '40px' }}>READY TO DIVE IN?</h2>
        <Link href="/contact" className="brutal-btn" style={{ backgroundColor: 'var(--green)' }}>BOOK YOUR FIRST LESSON</Link>
      </footer>
    </main>
  );
}
