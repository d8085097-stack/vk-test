import type { Metadata } from 'next';
import styles from './page.module.css';
import TechCard from '@/components/TechCard/TechCard';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import CoffeeCard from '@/components/CoffeeCard/CoffeeCard';

export const metadata: Metadata = {
  title: 'Coffee House ',
  description: 'Мини-магазин кофе, созданный за время практики в RuStore',
};

type Coffee = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  description: string;
  rating: number;
  roastLevel: 'light' | 'medium' | 'dark';
  origin: string;
  flavor: string;
};

// Серверный fetch — выполняется до отправки HTML
async function getCoffees(): Promise<Coffee[]> {
  try {
    const res = await fetch('http://localhost:3001/api/coffee', {
      // next.js не кэширует — всегда свежие данные
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const techStack = [
  { icon: '⚛️', name: 'React', desc: 'UI на функциональных компонентах и хуках' },
  { icon: '🔷', name: 'TypeScript', desc: 'Строгая типизация всего проекта' },
  { icon: '⚡', name: 'Vite', desc: 'Быстрая сборка и горячая перезагрузка' },
  { icon: '🟩', name: 'Node.js', desc: 'Бэкенд на Express с JSON-базой данных' },
  { icon: '🗂️', name: 'Монорепа', desc: 'Единый репозиторий для трёх проектов' },
  { icon: '▲', name: 'Next.js', desc: 'SSR-лендинг с SEO-оптимизацией' },
];

const projects = [
  {
    tag: 'Витрина',
    emoji: '🛍️',
    title: 'Магазин Coffee House',
    desc: 'Каталог кофе с фильтрами по обжарке, поиском и корзиной. Данные загружаются с бэкенда.',
    color: '#d4a574',
    href: 'http://localhost:3000',
  },
  {
    tag: 'Админка',
    emoji: '🔧',
    title: 'Панель управления',
    desc: 'CRUD-интерфейс для управления товарами. Тёмная тема, таблица, форма редактирования.',
    color: '#4f8ef7',
    href: 'http://localhost:3000/admin',
  },
  {
    tag: 'Лендинг',
    emoji: '📄',
    title: 'Этот сайт',
    desc: 'SSR-лендинг на Next.js. Полный HTML в исходнике, SEO-метаданные, деплой на Amvera.',
    color: '#22c55e',
  },
];

// Страница — async, ждёт данных до рендера
export default async function Home() {
  const coffees = await getCoffees();

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          
          <h1 className={styles.heroTitle}>
            Мини-магазин <br />
            <span className={styles.heroAccent}>Coffee House</span>
          </h1>
          <p className={styles.heroDesc}>
            За время практики я разработал полноценное веб-приложение:
            каталог кофе с витриной, панелью администратора и этим лендингом.
            Три проекта в одной монорепе — от бэкенда до деплоя.
          </p>
          <div className={styles.heroActions}>
            <a href="#about" className={styles.btnPrimary}>Узнать больше</a>
            <a href="#catalog" className={styles.btnSecondary}>Посмотреть кофе</a>
          </div>
        </div>
        <div className={styles.heroBg} aria-hidden="true">☕</div>
      </section>

      {/* О ПРОЕКТЕ */}
      <section id="about" className={styles.section}>
        <div className={styles.container}>
          <span className={styles.sectionTag}>О проекте</span>
          <h2 className={styles.sectionTitle}>Что я сделал</h2>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutCard}>
              <div className={styles.aboutIcon}>🏗️</div>
              <h3>Архитектура</h3>
              <p>Настроил монорепу с тремя приложениями: витрина, админка и лендинг.</p>
            </div>
            <div className={styles.aboutCard}>
              <div className={styles.aboutIcon}>🔌</div>
              <h3>Бэкенд</h3>
              <p>Написал REST API на Node.js и Express с CRUD-операциями и хранением в JSON.</p>
            </div>
            <div className={styles.aboutCard}>
              <div className={styles.aboutIcon}>🎨</div>
              <h3>Фронтенд</h3>
              <p>Разработал витрину с фильтрами и поиском, а также админ-панель с тёмной темой.</p>
            </div>
            <div className={styles.aboutCard}>
              <div className={styles.aboutIcon}>🚀</div>
              <h3>Деплой</h3>
              <p>Опубликовал проект и разобрался с SSR: лендинг рендерится на сервере.</p>
            </div>
          </div>
        </div>
      </section>

      {/* КАТАЛОГ ИЗ API */}
      <section id="catalog" className={styles.section}>
        <div className={styles.container}>
          <span className={styles.sectionTag}>Каталог</span>
          <h2 className={styles.sectionTitle}>
            Наш кофе
            <span className={styles.countBadge}>{coffees.length}</span>
          </h2>
          {coffees.length === 0 ? (
            <p className={styles.noData}>
              Запустите бэкенд (<code>npm run server:dev</code>), чтобы увидеть товары
            </p>
          ) : (
            <div className={styles.coffeeGrid}>
              {coffees.map((coffee) => (
                <CoffeeCard key={coffee.id} coffee={coffee} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ТЕХНОЛОГИИ */}
      <section id="stack" className={styles.section}>
        <div className={styles.container}>
          <span className={styles.sectionTag}>Стек</span>
          <h2 className={styles.sectionTitle}>Технологии</h2>
          <div className={styles.techGrid}>
            {techStack.map((tech) => (
              <TechCard key={tech.name} {...tech} />
            ))}
          </div>
        </div>
      </section>

      {/* ПРОЕКТЫ */}
      <section id="result" className={styles.section}>
        <div className={styles.container}>
          <span className={styles.sectionTag}>Результат</span>
          <h2 className={styles.sectionTitle}>Три проекта</h2>
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <ProjectCard key={project.tag} {...project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}