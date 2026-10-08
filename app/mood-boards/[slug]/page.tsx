import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { boards, getBoard } from "@/lib/boards";
import { MoodBoard } from "@/lib/mood-board";
import { pins } from "@/lib/pins";
import { Stub } from "@/lib/stub";

export const dynamicParams = false;
export const generateStaticParams = () => boards.map((b) => ({ slug: b.slug }));

export async function generateMetadata({ params }: PageProps<"/mood-boards/[slug]">): Promise<Metadata> {
  const board = getBoard((await params).slug);
  return { title: board ? `${board.title} · Mood Board` : "Mood Board" };
}

export default async function Page({ params }: PageProps<"/mood-boards/[slug]">) {
  const board = getBoard((await params).slug);
  if (!board) notFound();
  const boardPins = pins[board.slug];
  if (!boardPins) return <Stub kicker={`Mood Board ${board.number}`} title={board.title} />;
  return <MoodBoard number={board.number} title={board.title} pins={boardPins} />;
}
