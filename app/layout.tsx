import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "letterd - Personal Newsletter Platform",
  description: "Create, manage, and share beautiful newsletters with ease",
};

const theme = createTheme({
  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  fontFamilyMonospace: 'var(--font-geist-mono), Monaco, monospace',
  headings: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    fontWeight: '500',
  },
  colors: {
    dark: [
      '#f8f9fa',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#6c757d',
      '#495057',
      '#343a40',
      '#212529',
      '#000000'
    ],
  },
  primaryColor: 'dark',
  defaultRadius: 'sm',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 4px rgba(0, 0, 0, 0.05)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.05)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.05)',
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased page-content`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications 
            position="top-right" 
            containerWidth={400}
            transitionDuration={300}
          />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
