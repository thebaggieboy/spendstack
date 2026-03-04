import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Spendstack',
  description: 'AI-powered expense tracking and budgeting platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-background font-sans antialiased flex', inter.variable)}>
        {/* Sidebar Component */}
        <Sidebar />

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative w-full">
          {/* Header Component */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-20 px-4 sm:px-6 lg:px-8 custom-scrollbar">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
