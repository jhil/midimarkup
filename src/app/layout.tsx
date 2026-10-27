import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = {
  title: "MIDI Markup",
  description:
    "Compose music with words and notes. An accessible browser music editor.",
  metadataBase: new URL("https://midimarkup.jeffand.co"),
  alternates: { canonical: "/" },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
