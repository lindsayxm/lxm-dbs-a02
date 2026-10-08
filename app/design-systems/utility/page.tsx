import type { Metadata } from "next";
import { Barlow, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { utility } from "@/lib/design-systems/themes";
import { DesignSystem } from "../_components/DesignSystem";

export const metadata: Metadata = { title: "Utility · Design System" };

const utilityDisplay = localFont({ src: "../../../fonts/absans-main/fonts/Absans-Regular.woff2", variable: "--ds-display", weight: "400" });
const body = Barlow({ variable: "--ds-body", weight: ["400", "600"], subsets: ["latin"] });
const label = IBM_Plex_Mono({ variable: "--ds-label", weight: ["500", "700"], subsets: ["latin"] });

export default function Page() {
  return <DesignSystem theme={utility} fontClass={`${utilityDisplay.variable} ${body.variable} ${label.variable}`} />;
}
