'use client'
import Link from "next/link";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const CustomFormBuilder = dynamic(
  () => import('@src/global-components/form/formBuilder'),
  {
    ssr: false,
    loading: () => (
      <div className="container-fluid p-6">
        <div className="row">
          <div className="col-12">
            <h2 className="text-2xl font-bold mb-4">Form Builder</h2>
            <div className="d-flex justify-content-center align-items-center border rounded-lg p-4 bg-white" style={{ minHeight: '600px' }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading Form Builder...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
);

export default function BuilderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.wrapper}>
        <div className={styles.buttonContainer}>
          <Link href="/formTemplates" className={`${styles.viewButton} px-1`}>
            Form templates
          </Link>
          <Link href="/submittedForms" className={`${styles.viewButton} px-1`}>
            Submitted forms
          </Link>
        </div>
        <CustomFormBuilder />
      </main>
    </Suspense>
  );
}
