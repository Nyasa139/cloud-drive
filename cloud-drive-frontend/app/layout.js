"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <body>
        {hideSidebar ? (
          children
        ) : (
          <div className="app">
            <Sidebar />
            <main style={{ flex: 1, padding: 30 }}>
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
