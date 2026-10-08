import type { Metadata } from "next";
import { Cal_Sans, DM_Mono, Josefin_Sans } from "next/font/google";
import { PapercutSite } from "./_components/PapercutSite";

export const metadata: Metadata = {
  title: "Papercut Tickets",
  description: "Make a ticket for your DIY show and get a link to sell it.",
};

// Unique const names: next/font uses them as the font-family name.
const heading = Cal_Sans({ variable: "--ds-heading", weight: "400", subsets: ["latin"] });
const body = DM_Mono({ variable: "--ds-body", weight: ["300", "400", "500"], subsets: ["latin"] });
const label = Josefin_Sans({ variable: "--ds-label", weight: ["500", "600", "700"], subsets: ["latin"] });

export default function Page() {
  return <PapercutSite fontClass={`${heading.variable} ${body.variable} ${label.variable}`} />;
}
