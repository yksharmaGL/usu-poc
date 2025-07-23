import Link from "next/link";
import styles from "./header.module.css";

export default function HeaderPage() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>MyForm Builder</h1>
      <nav className={styles.nav}>
        <Link href="/" className={styles.link}>
          Home
        </Link>
        <Link href="/builder" className={styles.link}>
          Service Desk
        </Link>
      </nav>
    </header>
  );
}
