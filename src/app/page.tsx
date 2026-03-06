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
        <div className="brutal-card" style={{ backgroundColor: 'white', transform: 'rotate(1deg)' }}>
          <h2>No More <br />Robot Talk. 🤖</h2>
          <p style={{ marginTop: '20px', fontSize: '1.25rem' }}>I don&apos;t just teach grammar; I teach connection. From real-life slang to the cultural quirks that make Russian beautiful. We start talking from the very first lesson.</p>
        </div>
      </section>

      {/* --- THE STACK (WONKY) --- */}
      <section>
        <h2 className={styles.sectionTitle}>Inside the Lessons</h2>
        <div className={styles.grid}>
          <div className="brutal-card" style={{ backgroundColor: 'var(--green)', transform: 'rotate(-2deg)' }}>
            <h3>🗣️ REAL CONVERSATIONS</h3>
            <p>Cafe talk, street slang, and casual banter. No &quot;capital of Great Britain&quot; drills.</p>
          </div>
          <div className="brutal-card" style={{ backgroundColor: 'var(--accent)', color: 'white', transform: 'rotate(1deg)' }}>
            <h3>🧠 PRACTICAL GRAMMAR</h3>
            <p>Tricky cases broken down into simple hacks that actually work in your brain.</p>
          </div>
          <div className="brutal-card" style={{ backgroundColor: 'var(--secondary)', color: 'white', transform: 'rotate(-1deg)' }}>
            <h3>🌍 CULTURE TOUCH</h3>
            <p>Slang, humor, and traditions. Learn why we jump over bonfires and keep the tea flowing.</p>
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

      <footer style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--black)', color: 'white' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>READY TO START?</h2>
        <Link href="/contact" className="brutal-btn" style={{ backgroundColor: 'var(--green)' }}>YES, LET’S GO!</Link>
        <p style={{ marginTop: '40px' }}>© 2024 RUSSIAN WITH ALEX. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
