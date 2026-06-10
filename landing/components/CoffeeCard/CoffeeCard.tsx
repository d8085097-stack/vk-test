import styles from './CoffeeCard.module.css';

type Coffee = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  rating: number;
  roastLevel: 'light' | 'medium' | 'dark';
  origin: string;
  flavor: string;
};

const roastLabel = { light: 'Светлая', medium: 'Средняя', dark: 'Тёмная' };

export default function CoffeeCard({ coffee }: { coffee: Coffee }) {
  return (
    <div className={`${styles.card} ${!coffee.inStock ? styles.outOfStock : ''}`}>
      <div className={styles.imageWrap}>
        <img src={coffee.image} alt={coffee.name} className={styles.image} />
        {!coffee.inStock && <span className={styles.overlay}>Нет в наличии</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{coffee.name}</h3>
        <p className={styles.origin}>📍 {coffee.origin}</p>
        <p className={styles.flavor}>{coffee.flavor}</p>
        <div className={styles.footer}>
          <div className={styles.meta}>
            <span className={styles.roast}>🔥 {roastLabel[coffee.roastLevel]}</span>
            <span className={styles.rating}>⭐ {coffee.rating}</span>
          </div>
          <span className={styles.price}>{coffee.price} ₽</span>
        </div>
      </div>
    </div>
  );
}
