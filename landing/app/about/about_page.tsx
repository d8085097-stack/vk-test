import type { Metadata } from 'next';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'Обо мне — Coffee House',
  description: 'Разработчик проекта Coffee House, стажёр RuStore',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <span className={styles.tag}>Обо мне</span>
        <h1 className={styles.title}>Стажёр RuStore</h1>
        <p className={styles.lead}>
          Фронтенд-разработчик, прошедший практику в RuStore в 2026 году.
          За время стажировки реализовал полноценный проект с нуля —
          от архитектуры монорепы до деплоя в продакшн.
        </p>

        <div className={styles.block}>
          <h2>Чему научился</h2>
          <ul className={styles.list}>
            <li>Строить монорепу с несколькими приложениями</li>
            <li>Разрабатывать REST API на Node.js + Express</li>
            <li>Типизировать проект на TypeScript end-to-end</li>
            <li>Делать SSR с Next.js и понимать разницу с SPA</li>
            <li>Деплоить на Vercel и проверять Lighthouse-метрики</li>
          </ul>
        </div>

        <div className={styles.block}>
          <h2>Стек</h2>
          <div className={styles.tags}>
            {['React', 'TypeScript', 'Next.js', 'Node.js', 'Express', 'Vite', 'CSS Modules'].map(
              (t) => <span key={t} className={styles.techTag}>{t}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
