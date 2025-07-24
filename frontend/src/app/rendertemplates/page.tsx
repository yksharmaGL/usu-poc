import ClientFormWrapper from "@/src/components/ClientFormWrapper";
import QueryProvider from "@/src/components/QueryProvider";

export default function RenderPage() {
  return (
    <main className="p-6">
      <QueryProvider>
        <ClientFormWrapper />
      </QueryProvider>
    </main>
  );
}
