import type { Metadata } from "next";
import { Chakra_Petch, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import { retrotech } from "@/lib/design-systems/themes";
import { DesignSystem } from "../_components/DesignSystem";

export const metadata: Metadata = { title: "Retrotech · Design System" };

const retrotechDisplay = localFont({ src: "../../../fonts/airstrike/airstrikebold.ttf", variable: "--ds-display", weight: "400" });
const label = Chakra_Petch({ variable: "--ds-label", weight: ["600", "700"], subsets: ["latin"] });
const body = Space_Mono({ variable: "--ds-body", weight: ["400", "700"], subsets: ["latin"] });

export default function Page() {
  return <DesignSystem theme={retrotech} fontClass={`${retrotechDisplay.variable} ${label.variable} ${body.variable}`} />;
}
