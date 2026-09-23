import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'الرئيسية — العالمي للنقل',
  description: 'العالمي لنقل الأثاث: خدمات نقل وتغليف وفك وتركيب منظمة في القاهرة والجيزة.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  openGraph: {
    title: 'الرئيسية — العالمي للنقل',
    description: 'العالمي لنقل الأثاث: خدمات نقل وتغليف وفك وتركيب منظمة في القاهرة والجيزة.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الرئيسية — العالمي للنقل',
    description: 'العالمي لنقل الأثاث: خدمات نقل وتغليف وفك وتركيب منظمة في القاهرة والجيزة.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
