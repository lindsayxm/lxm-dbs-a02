import Link from "next/link";
import { boards, site } from "@/lib/boards";

const pill =
  "inline-flex items-center justify-center rounded-full border-2 border-ink px-6 py-3 text-lg font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-pin active:translate-y-px";
const pillOutline = `${pill} bg-paper text-ink hover:bg-ink hover:text-paper active:bg-ink active:text-paper`;
const pillSolid = `${pill} bg-ink text-paper hover:bg-paper hover:text-ink active:bg-paper active:text-ink`;

function Section({
  n,
  title,
  note,
  children,
}: {
  n: number;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-rule py-10 last:border-b-0">
      <h2 className="flex items-center gap-4 text-3xl">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-pin text-xl font-bold text-white"
        >
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-6 flex flex-wrap gap-3">{children}</div>
      {note && <p className="mt-4 text-base text-muted">{note}</p>}
    </section>
  );
}

export default function Hub() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
      <h1 className="text-xl tracking-[0.2em] text-muted">THE HUB</h1>
      <div className="mt-6">
        <Section n={1} title="Mood Boards">
          {boards.map((b) => (
            <Link key={b.slug} href={`/mood-boards/${b.slug}`} className={pillOutline}>
              {b.label} →
            </Link>
          ))}
        </Section>
        <Section n={2} title="Design Systems" note="Each one built from its mood board">
          {boards.map((b) => (
            <Link key={b.slug} href={`/design-systems/${b.slug}`} className={pillOutline}>
              {b.label} →
            </Link>
          ))}
        </Section>
        <Section n={3} title="Your Site">
          <Link href={site.href} className={pillSolid}>
            {site.label} →
          </Link>
        </Section>
      </div>
    </main>
  );
}
