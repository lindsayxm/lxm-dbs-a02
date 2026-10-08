import Image from "next/image";
import Link from "next/link";
import type { Pin } from "@/lib/pins";

export function MoodBoard({ number, title, pins }: { number: string; title: string; pins: Pin[] }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
      <Link
        href="/"
        className="text-base font-medium text-muted underline underline-offset-4 hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-pin"
      >
        ← THE HUB
      </Link>
      <header className="mt-10 mb-8 flex items-center gap-4">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-pin text-lg font-bold text-white"
        >
          {number}
        </span>
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
      </header>
      <ul className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {pins.map((p, i) => (
          <li key={p.src} className="mb-3 break-inside-avoid sm:mb-4">
            <Image
              src={p.src}
              width={p.width}
              height={p.height}
              alt={`${title}, image ${i + 1} of ${pins.length}`}
              className="h-auto w-full rounded-sm"
              loading="eager"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
