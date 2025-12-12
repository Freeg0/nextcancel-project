import { Nav } from "@/components/nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Nav />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
