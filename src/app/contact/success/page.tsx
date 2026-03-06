import styles from "../../page.module.css";
import Link from "next/link";

export default function ContactSuccess() {
  return (
    <main className={styles.container}>
      <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="brutal-card" style={{ backgroundColor: 'var(--green)', maxWidth: '600px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="white" stroke="black" strokeWidth="6"/>
              <path d="M30 50L45 65L70 35" stroke="black" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>SPASIBA!</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '40px' }}>
            Your message is on its way. Alex will get back to you faster than a techno beat.
          </p>
          <Link href="/" className="brutal-btn" style={{ backgroundColor: 'white', display: 'inline-block' }}>
            BACK TO HOME
          </Link>
        </div>
      </section>
    </main>
  );
}
