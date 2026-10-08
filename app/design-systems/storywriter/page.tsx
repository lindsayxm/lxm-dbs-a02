import type { Metadata } from "next";
import { Cal_Sans, DM_Mono, Josefin_Sans } from "next/font/google";
import { storywriter } from "@/lib/design-systems/themes";
import { DesignSystem } from "../_components/DesignSystem";

export const metadata: Metadata = { title: "Storywriter · Design System" };

// Unique const names matter: next/font uses them as the font-family name, so
// two pages that both call theirs "display" overwrite each other in the browser.
// Cal Sans is both the Display and the Heading face, as on the Papercut Tickets site.
const heading = Cal_Sans({ variable: "--ds-heading", weight: "400", subsets: ["latin"] });
const body = DM_Mono({ variable: "--ds-body", weight: ["300", "400", "500"], subsets: ["latin"] });
const label = Josefin_Sans({ variable: "--ds-label", weight: ["500", "600", "700"], subsets: ["latin"] });

export default function Page() {
  return <DesignSystem theme={storywriter} fontClass={`${heading.variable} ${body.variable} ${label.variable}`} />;
}
