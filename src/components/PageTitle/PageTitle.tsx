import styles from './PageTitle.module.css';

interface PageTitleProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageTitleProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
}