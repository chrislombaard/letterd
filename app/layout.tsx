import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "letterd - Personal Newsletter Platform",
  description: "Create, manage, and share beautiful newsletters with ease",
};

const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  headings: {
    fontFamily: inter.style.fontFamily,
    fontWeight: "700",
  },
  primaryColor: "dark",
  defaultRadius: "sm",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.className} antialiased`}>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
