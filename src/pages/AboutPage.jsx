import React, { useEffect, useState } from 'react';
import styles from './AboutPage.module.css';

const features = [
  {
    title: 'Skill Tracking',
    desc: 'Track your progress with timelines, milestones and visual charts.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 13h4v8H3zM10 3h4v18h-4zM17 8h4v13h-4z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Personalized Roadmaps',
    desc: 'Get a tailored roadmap based on your goals and current skill level.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l4 4-4 4-4-4 4-4zm0 7v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Progress Insights',
    desc: 'Actionable suggestions and visual insights to accelerate learning.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 9l-6 6-4-4-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false;
    return (
      document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkTheme = () => {
      const dark = (
        document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
      setIsDark(dark);
    };

    // Observe changes on <html> attributes so we pick up theme toggles from Navbar
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    // Also listen for media changes
    let mql;
    if (window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      try { mql.addEventListener('change', checkTheme); } catch (e) { mql.addListener(checkTheme); }
    }

    return () => {
      observer.disconnect();
      if (mql) {
        try { mql.removeEventListener('change', checkTheme); } catch (e) { mql.removeListener(checkTheme); }
      }
    };
  }, []);

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : styles.light}` }>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>About Skill Tracker & Roadmap Generator</h1>
          <p className={styles.subtitle}>
            Empowering learners with personalized roadmaps and progress tracking — built to help you level up faster.
          </p>
          <div className={styles.ctaRow}>
            <a href="/" className={styles.ctaPrimary}>Try the Roadmap Generator</a>
            <a href="https://github.com/pankajbaria712/Skill-Tracker-and-Personalized-Roadmap-Generator" target="_blank" rel="noreferrer" className={styles.ctaGhost}>View on GitHub</a>
          </div>
        </div>
        <div className={styles.heroCard} aria-hidden>
          <div className={styles.sampleCard}>
            <div className={styles.sampleHeader}></div>
            <div className={styles.sampleBody}></div>
            <div className={styles.sampleFooter}></div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        {features.map((f) => (
          <article key={f.title} className={styles.card}>
            <div className={styles.icon}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </article>
        ))}
      </section>

      <section className={styles.howItWorks}>
        <h2>How it works</h2>
        <p className={styles.lead}>Answer a few questions about your background and goals, then get a prioritized learning path with milestones and resources.</p>
        <ol className={styles.steps}>
          <li><strong>Assess:</strong> Tell us your current skills and goals.</li>
          <li><strong>Generate:</strong> Receive a personalized roadmap with milestones.</li>
          <li><strong>Track:</strong> Mark progress and get suggested next steps.</li>
        </ol>
      </section>

      <section className={styles.team}>
        <h2>About the author</h2>
        <div className={styles.author}>
          <img className={styles.avatar} src={`https://github.com/pankajbaria712.png`} alt="Author avatar" />
          <div>
            <h3>Pankaj Baria</h3>
            <p>Creator and maintainer — passionate about developer education, tooling and building practical learning experiences.</p>
            <p className={styles.small}>Open-source: <a href="https://github.com/pankajbaria712" target="_blank" rel="noreferrer">@pankajbaria712</a></p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Built with ❤️ — Fork, contribute or open an issue on the GitHub repo.</p>
      </footer>
    </div>
  );
}