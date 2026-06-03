import styles from './TechCard.module.css';

type Props = {
  icon: string;
  name: string;
  desc: string;
};

export default function TechCard({ icon, name, desc }: Props) {
  return (
    <div className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}