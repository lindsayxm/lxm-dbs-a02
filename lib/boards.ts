export const boards = [
  { slug: "utility", number: "01", label: "Utility", title: "Modern Vintage Top Utility" },
  { slug: "retrotech", number: "02", label: "Retrotech", title: "Red and Teal Retrotech Dystopia" },
  { slug: "storywriter", number: "03", label: "Storywriter", title: "Your Future, You Storywriter" },
] as const;

export const site = { href: "/site", label: "Papercut Tickets" };

export function getBoard(slug: string) {
  return boards.find((b) => b.slug === slug);
}
