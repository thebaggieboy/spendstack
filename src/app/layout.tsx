import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import NavSwitcher from '@/components/layout/NavSwitcher';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Spendstack — AI-Powered Finance Tracker',
  description: 'Upload bank statements, automate tax calculations, and gain deep financial insights. Built for Africa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-background font-sans antialiased flex', inter.variable)}>
        <AuthProvider>
          <SidebarProvider>
            {/* Landing page gets its own nav; dashboard gets the sidebar */}
            <NavSwitcher />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative w-full">
              <Header />
              <main className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-20 px-4 sm:px-6 lg:px-8 custom-scrollbar">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
