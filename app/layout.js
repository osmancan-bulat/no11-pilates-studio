import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'No.11 Pilates Studio | Nilüfer, Bursa',
  description: "No.11 Pilates Studio, Balat Nilüfer'de kişiye özel klasik pilates deneyimi.",
};

export default function RootLayout({ children }) {
  return <html lang="tr"><head>
    <link rel="preload" href="/no11-desktop-poster.webp" as="image"/>
    <link rel="stylesheet" href="/no11-team-live.css?v=4"/>
    <link rel="stylesheet" href="/no11-studio-gallery.css?v=1"/>
    <style>{'@media (max-width:900px){.story h2{margin-bottom:2.75rem!important}}'}</style>
  </head><body>
    {children}
    <Script src="/no11-team-live.js?v=3" strategy="afterInteractive"/>
    <Script src="/no11-studio-gallery.js?v=1" strategy="afterInteractive"/>
    <Script src="/no11-schedule-live.js?v=4" strategy="afterInteractive"/>
    <Script src="/no11-settings-live.js?v=6" strategy="afterInteractive"/>
    <Script src="/no11-phone-guard.js?v=1" strategy="afterInteractive"/>
  </body></html>;
}
