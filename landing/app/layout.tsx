import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coffee House — практика в RuStore',
  description:
    'Лендинг о практике разработки мини-магазина кофе в рамках стажировки в RuStore',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              ☕ Coffee House
            </Link>
            <nav className={styles.nav}>
              <Link href="/#about" className={styles.navLink}>О проекте</Link>
              <Link href="/#stack" className={styles.navLink}>Технологии</Link>
              <Link href="/#result" className={styles.navLink}>Результат</Link>
              
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <span>☕ Coffee House</span>
            <span>2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}