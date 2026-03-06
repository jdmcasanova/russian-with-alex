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
        <div className="brutal-card" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '30px' }}>Quick Facts ⚡</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ border: '4px solid white', padding: '20px', fontWeight: 900 }}>
              NATIVE <br />RUSSIAN
            </div>
            <div style={{ border: '4px solid white', padding: '20px', fontWeight: 900 }}>
              FLUENT IN <br />4 LANGUAGES
            </div>
            <div style={{ border: '4px solid white', padding: '20px', fontWeight: 900 }}>
              UNIVERSITY <br />QUALIFIED
            </div>
            <div style={{ border: '4px solid white', padding: '20px', fontWeight: 900 }}>
              BEGINNER <br />TECHNO DJ
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
