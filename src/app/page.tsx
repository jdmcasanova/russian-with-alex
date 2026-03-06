'use client';
import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

const PHRASES = [
  { ru: "Красава!", en: "Krasava!", context: "Used when someone does something cool. Like 'Legend!'" },
  { ru: "Да нет, наверное.", en: "Da net, navernoye.", context: "Literally 'Yes no maybe.' It actually means 'Probably not.'" },
  { ru: "Без кота и жизнь не та.", en: "Bez kota i zhizn ne ta.", context: "Life is not the same without a cat." },
  { ru: "Ни пуха, ни пера!", en: "Ni puha, ni pera!", context: "Good luck! (Literally: Neither down nor feather)." },
  { ru: "Чё кого?", en: "Cho kogo?", context: "Super casual greeting. Like 'Whassup?'" },
  { ru: "Всё пучком!", en: "Vsyo puchkom!", context: "Everything is great / No worries." },
  { ru: "Забей.", en: "Zabei.", context: "Forget it / Nevermind. (Literally: Hammer it in)." },
  { ru: "Давай-давай!", en: "Davay-davay!", context: "Come on! / Keep going!" },
  { ru: "Ну такое...", en: "Nu takoye...", context: "Used for something mediocre. Like 'Meh...'" }
];

export default function Home() {
  const [phrase, setPhrase] = useState(PHRASES[0]);

  const rollPhrase = () => {
    const next = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    setPhrase(next);
  };

  return (
    <main className={styles.container}>
      {/* --- HERO --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroSplit}>
          <div className="brutal-card" style={{ backgroundColor: 'var(--primary)', flex: 1 }}>
            <h1 className={styles.bigText}>Russian, <br />But Make It Fun!</h1>
            <p className={styles.subText}>Skip the boring drills. Speak the real language with a native tutor who actually keeps it interesting.</p>
            <Link href="/contact" className="brutal-btn" style={{ marginTop: '20px' }}>Book a Free Intro</Link>
          </div>
          <div className="brutal-card" style={{ padding: '0', overflow: 'hidden', minHeight: '400px', transform: 'rotate(2deg)' }}>
             <img 
               src="https://c.superprof.com/i/m/34017004/300/20241202150726/34017004.webp" 
               alt="Alexandra portrait" 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
             />
          </div>
        </div>
      </section>

      {/* --- THE SURPRISE: PHRASE ROULETTE --- */}
      <section style={{ textAlign: 'center' }}>
        <div className="brutal-card" style={{ backgroundColor: 'var(--white)', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '10px' }}>Russian Vibe Check 🎲</h2>
          <p>Learn a random phrase that textbooks usually skip.</p>
          <div style={{ margin: '30px 0', padding: '20px', background: 'var(--bg)', border: '4px solid black' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 900 }}>{phrase.ru}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>{phrase.en}</p>
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>{phrase.context}</p>
          </div>
          <button onClick={rollPhrase} className="brutal-btn" style={{ fontSize: '1rem', padding: '10px 20px', background: 'var(--green)' }}>
            GIVE ME ANOTHER
          </button>
        </div>
      </section>

      {/* --- QUICK VIBE CHECK --- */}
      <section className={styles.splitSection}>
        <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white', transform: 'rotate(-1deg)' }}>
          <h2>Teacher. Traveler. Polyglot.</h2>
          <p style={{ marginTop: '20px', fontSize: '1.25rem' }}>I’m Alex. I speak Russian, Polish, and English fluently, with French and German on the way. I know exactly how to make language learning stick because I’ve done it myself—multiple times.</p>
        </div>
        <div className="brutal-card" style={{ backgroundColor: 'white', transform: 'rotate(1deg)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="30" width="60" height="50" fill="var(--accent)" stroke="black" strokeWidth="6"/>
            <rect x="30" y="20" width="40" height="10" fill="black" />
            <circle cx="40" cy="50" r="6" fill="white" />
            <circle cx="60" cy="50" r="6" fill="white" />
            <path d="M20 30L80 80M80 30L20 80" stroke="black" strokeWidth="8" strokeLinecap="round"/>
          </svg>
          <div>
            <h2>No More <br />Robot Talk.</h2>
            <p style={{ marginTop: '20px', fontSize: '1.25rem' }}>I don&apos;t just teach grammar; I teach connection. From real-life slang to the cultural quirks that make Russian beautiful. We start talking from the very first lesson.</p>
          </div>
        </div>
      </section>

      {/* --- THE STACK (WONKY) --- */}
      <section>
        <h2 className={styles.sectionTitle}>Inside the Lessons</h2>
        <div className={styles.grid}>
          <div className="brutal-card" style={{ backgroundColor: 'var(--green)', transform: 'rotate(-2deg)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 30H80V70H50L30 90V70H20V30Z" fill="white" stroke="black" strokeWidth="6"/>
              <path d="M40 50H60M40 60H55" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <div>
              <h3>REAL CONVERSATIONS</h3>
              <p>Cafe talk, street slang, and casual banter. No &quot;capital of Great Britain&quot; drills.</p>
            </div>
          </div>
          <div className="brutal-card" style={{ backgroundColor: 'var(--accent)', color: 'white', transform: 'rotate(1deg)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 20C30 20 15 35 15 55C15 75 30 85 50 85C70 85 85 75 85 55C85 35 70 20 50 20Z" fill="white" stroke="black" strokeWidth="6"/>
              <path d="M50 20V85M15 55H85" stroke="black" strokeWidth="4"/>
              <circle cx="50" cy="55" r="15" fill="var(--primary)" stroke="black" strokeWidth="4"/>
            </svg>
            <div>
              <h3>PRACTICAL GRAMMAR</h3>
              <p>Tricky cases broken down into simple hacks that actually work in your brain.</p>
            </div>
          </div>
          <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white', transform: 'rotate(-1deg)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="35" fill="white" stroke="black" strokeWidth="6"/>
              <path d="M50 15V85M15 50H85" stroke="black" strokeWidth="4"/>
              <path d="M25 25L75 75M75 25L25 75" stroke="black" strokeWidth="4"/>
            </svg>
            <div>
              <h3>CULTURE TOUCH</h3>
              <p>Slang, humor, and traditions. Learn why we jump over bonfires and keep the tea flowing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING (UPDATED) --- */}
      <section style={{ backgroundColor: 'var(--primary)', borderTop: 'var(--border-width) solid var(--black)', borderBottom: 'var(--border-width) solid var(--black)', maxWidth: '100%', margin: '0' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '100px 20px' }}>
          <h2 className={styles.sectionTitle}>Simple Pricing</h2>
          <div className={styles.grid}>
            <div className="brutal-card" style={{ transform: 'rotate(1deg)' }}>
              <h3>Single Lesson</h3>
              <div className={styles.priceValue}>$35</div>
              <p>Per hour of progress.</p>
            </div>
            <div className="brutal-card" style={{ backgroundColor: 'var(--black)', color: 'white', transform: 'scale(1.05) rotate(-1deg)' }}>
              <h3 style={{ color: 'var(--primary)' }}>5-Hour Pack</h3>
              <div className={styles.priceValue}>$160</div>
              <p>$32/h — Save $15</p>
            </div>
            <div className="brutal-card" style={{ transform: 'rotate(2deg)' }}>
              <h3>10-Hour Pack</h3>
              <div className={styles.priceValue}>$300</div>
              <p>$30/h — Save $50</p>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '40px', fontWeight: 'bold' }}>* First 30-minute intro lesson is always FREE.</p>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section style={{ 
        backgroundColor: 'var(--light-yellow)', 
        maxWidth: '100%', 
        margin: '0', 
        padding: '120px 20px', 
        textAlign: 'center', 
        borderTop: 'var(--border-width) solid var(--black)' 
      }}>
        <div className="brutal-card" style={{ 
          display: 'inline-block', 
          backgroundColor: 'var(--primary)', 
          padding: '60px 40px',
          transform: 'rotate(-1deg)'
        }}>
          <h2 style={{ fontSize: '4.5rem', marginBottom: '10px', lineHeight: '0.9' }}>READY TO</h2>
          <h2 style={{ fontSize: '6rem', marginBottom: '40px', lineHeight: '0.9', color: 'var(--secondary)' }}>START?</h2>
          <Link href="/contact" className="brutal-btn" style={{ 
            backgroundColor: 'var(--green)', 
            fontSize: '2rem',
            padding: '25px 50px',
            display: 'inline-block',
            width: '100%'
          }}>
            YES, LET&apos;S GO!
          </Link>
        </div>
      </section>

      <footer style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        backgroundColor: 'var(--black)', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ border: '2px solid white' }}>
            <circle cx="50" cy="40" r="15" fill="white" />
            <path d="M25 85C25 65 35 55 50 55C65 55 75 65 75 85H25Z" fill="white" />
          </svg>
        </div>
        <p style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '1px' }}>
          RUSSIAN-WITH-ALEX
        </p>
        <p style={{ opacity: 0.6, fontSize: '0.9rem', fontWeight: 700 }}>
          © 2026 ALL RIGHTS RESERVED. MADE FOR THE REAL WORLD.
        </p>
      </footer>
    </main>
  );
}
