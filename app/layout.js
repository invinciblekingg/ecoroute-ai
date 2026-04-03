import "./globals.css";
import { Bricolage_Grotesque, Kaushan_Script, Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

const kaushanScript = Kaushan_Script({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "EcoRoute AI - Smarter Waste, Cleaner Cities",
  description:
    "EcoRoute AI is a citizen-powered waste management platform with smart map reporting, AI triage, route optimization, and live municipal dashboards.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${bricolageGrotesque.variable} ${kaushanScript.variable}`}>{children}</body>
    </html>
  );
}
