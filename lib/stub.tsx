import Link from "next/link";

export function Stub({ kicker, title }: { kicker: string; title: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
      <Link
        href="/"
        className="text-base font-medium text-muted underline underline-offset-4 hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-pin"
      >
        ← THE HUB
      </Link>
      <p className="mt-10 text-base font-bold tracking-[0.2em] text-muted uppercase">{kicker}</p>
      <h1 className="mt-2 text-4xl">{title}</h1>
      <p className="mt-6 text-lg text-muted">Coming soon.</p>
    </main>
  );
}
