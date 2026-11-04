import Footer from "@/modules/auth-layout/molecules/footer";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[oklch(1_0_0)] px-4 py-12">
      <Link href="/" className="mb-8 text-3xl font-bold tracking-tight">
        InkWell<span className="text-primary">.</span>
      </Link>

      <div className="border-border w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl shadow-black/5 sm:p-10">
        {children}
      </div>

      <Footer> </Footer>
    </main>
  );
}
