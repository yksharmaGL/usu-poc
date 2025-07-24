import SubmittedFormRenderer from "@/src/components/SubmittedFormRenderer";
import QueryProvider from "@/src/components/QueryProvider";

export default function RenderSubmittedFormPage() {
  return (
    <main className="p-6">
      <QueryProvider>
        <SubmittedFormRenderer />
      </QueryProvider>
    </main>
  );
}
