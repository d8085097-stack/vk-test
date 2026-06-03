import styles from './ProjectCard.module.css';

type Props = {
  tag: string;
  emoji: string;
  title: string;
  desc: string;
  color: string;
  href?: string;
};

export default function ProjectCard({ tag, emoji, title, desc, color, href }: Props) {
  const inner = (
    <>
      <div className={styles.top}>
        <span className={styles.tag}>{tag}</span>
        <span className={styles.emoji}>{emoji}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
      {href && <span className={styles.link}>Открыть →</span>}
      <div className={styles.accent} aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card}
        style={{ '--accent': color } as React.CSSProperties}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className={styles.card} style={{ '--accent': color } as React.CSSProperties}>
      {inner}
    </div>
  );
}