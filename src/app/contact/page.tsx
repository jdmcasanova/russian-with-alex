import styles from "../page.module.css";

export default function Contact() {
  return (
    <main className={styles.container}>
      <section>
        <div className="brutal-card" style={{ backgroundColor: 'var(--primary)', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>SAY PRIVET 👋</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '40px' }}>
            Book your free 30-min intro or just ask a question. I usually reply within 24 hours.
          </p>

          <form 
            action="https://formsubmit.co/alex@example.com" 
            method="POST"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* FormSubmit Config */}
            <input type="hidden" name="_subject" value="New Russian Student Lead!" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 900, textTransform: 'uppercase' }}>What should I call you?</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Ivan Ivanovich"
                required 
                style={{ 
                  padding: '15px', 
                  border: '4px solid black', 
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  boxShadow: '4px 4px 0px black'
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 900, textTransform: 'uppercase' }}>Where should I reply?</label>
              <input 
                type="email" 
                name="email" 
                placeholder="your@email.com"
                required 
                style={{ 
                  padding: '15px', 
                  border: '4px solid black', 
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  boxShadow: '4px 4px 0px black'
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 900, textTransform: 'uppercase' }}>Your Russian Goals</label>
              <textarea 
                name="message" 
                rows={5} 
                required 
                placeholder="I want to learn slang, grammar, or just talk about cats..."
                style={{ 
                  padding: '15px', 
                  border: '4px solid black', 
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  boxShadow: '4px 4px 0px black'
                }} 
              />
            </div>

            <button type="submit" className="brutal-btn" style={{ backgroundColor: 'var(--green)', marginTop: '20px' }}>
              SEND IT 🚀
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
