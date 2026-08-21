export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4 py-10">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-soft">
        <h1 className="text-2xl font-semibold text-zinc-900">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-600">The requested event or ticket could not be located.</p>
      </div>
    </main>
  );
}