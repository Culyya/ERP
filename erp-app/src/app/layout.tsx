"use client"

import 'bootstrap/dist/css/bootstrap.min.css'; // CSS Bootstrap
import './globals.css'; // Custom CSS
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Muat file JavaScript Bootstrap
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
