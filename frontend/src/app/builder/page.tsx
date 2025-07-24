import Link from "next/link";
import FullBuilder from "./FullBuilder";
import styles from "./page.module.css";

export default function BuilderPage() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.buttonContainer}>
        <Link href="/rendertemplates" className={`${styles.viewButton} px-1`}>
          Form templates
        </Link>
        <Link href="/rendersubmittedforms" className={`${styles.viewButton} px-1`}>
          Submitted forms
        </Link>
      </div>
      <FullBuilder />
    </main>
  );
}
