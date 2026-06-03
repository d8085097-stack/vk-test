import styles from './ProjectCard.module.css';

type Props = {
  tag: string;
  emoji: string;
  title: string;
  desc: string;
  color: string;
};

export default function ProjectCard({ tag, emoji, title, desc, color }: Props) {
  return (
    <div className={styles.card} style={{ '--accent': color } as React.CSSProperties}>
      <div className={styles.top}>
        <span className={styles.tag}>{tag}</span>
        <span className={styles.emoji}>{emoji}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
      <div className={styles.accent} aria-hidden="true" />
    </div>
  );
}