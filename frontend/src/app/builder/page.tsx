'use client'
import Link from "next/link";
import styles from "./page.module.css";
import Builder from "@src/global-components/form/formBuilder";

export default function BuilderPage() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.buttonContainer}>
        <Link href="/formTemplates" className={`${styles.viewButton} px-1`}>
          Form templates
        </Link>
        <Link href="/submittedForms" className={`${styles.viewButton} px-1`}>
          Submitted forms
        </Link>
      </div>
      <Builder />
    </main>
  );
}
