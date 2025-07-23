import Link from "next/link";
import FullBuilder from "./FullBuilder";
import styles from "./page.module.css";

export default function BuilderPage() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.buttonContainer}>
        <Link href="/render" className={styles.viewButton}>
          View Form
        </Link>
      </div>
      <FullBuilder />
    </main>
  );
}
