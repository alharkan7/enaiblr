import '@/app/globals.css';
import type { Metadata } from 'next';

// export async function generateMetadata({
//   searchParams
// }: {
//   searchParams: Promise<{ q?: string }>
// }): Promise<Metadata> {
//   const params = await searchParams;
//   const query = params?.q;
//   return {
//     title: query ? `Search: ${query} | enaiblr` : 'enaiblr - AI Tools Search Engine',
//   };
// }

export const metadata: Metadata = {
  metadataBase: new URL('https://enaiblr.org'),
  title: {
    template: '%s',
    default: 'Unlimited AI Platform',
  },
  description: 'Unlimited AI Platform',

};

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children
  // (
  //   <html lang="en_US, en_ID" suppressHydrationWarning>
  //     <head>
  //       <link rel="manifest" href="/manifest.json" />
  //       <link rel="icon" type="image/png" href="/icon.png" />
  //       <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  //       <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  //       <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  //       <link rel="icon" href="/favicon.ico" />
  //       <meta 
  //         name="viewport" 
  //         content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
  //       />
  //     </head>
  //     <body className={inter.className} suppressHydrationWarning>
  //       {children}
  //     </body>
  //   </html>
  // );
}