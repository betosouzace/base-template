'use client'

import { ThemeProvider } from '../contexts/ThemeContext';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeWrapper } from '@/components/ThemeWrapper';
import { CompanyThemeLoader } from '@/components/CompanyThemeLoader';
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Sistema</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettingsProvider>
          <AuthProvider>
            <ThemeProvider>
              <CompanyThemeLoader>
                <ThemeWrapper>
                  {children}
                </ThemeWrapper>
              </CompanyThemeLoader>
            </ThemeProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
