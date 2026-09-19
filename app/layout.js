import './globals.css';

export const metadata = {
  title: 'No.11 Pilates Studio | Nilüfer, Bursa',
  description: "No.11 Pilates Studio, Balat Nilüfer'de kişiye özel klasik pilates deneyimi.",
};

export default function RootLayout({ children }) {
  return <html lang="tr"><head><link rel="stylesheet" href="/no11-team-live.css?v=4"/><link rel="stylesheet" href="/no11-studio-gallery.css?v=1"/></head><body>{children}</body></html>;
}
