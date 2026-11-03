async function getCurrentYear() {
    "use cache";
    return new Date().getFullYear();
  }
export default async function AuthLayout({ children }:Readonly<{ children: React.ReactNode }>) {
  
  const year = await getCurrentYear();

  return (
    <main className="min-h-screen">
      {children}

      <footer className="mt-8 text-center text-sm text-gray-500">
        © {year} Inkora. All rights reserved.
      </footer>
    </main>
  );
}
