import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Link from 'next/link';  // Added for internal links

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Dream Beauty",
  description: "Beauty products inspired by Victoria Beckham",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-black text-white p-4 fixed w-full top-0 z-10">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <Link href="/" className="text-xl font-bold">My Dream Beauty</Link>
            <ul className="flex space-x-6 items-center">
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li>
                <form action="/search" method="get" className="flex">
                  <input 
                    name="q" 
                    type="text" 
                    placeholder="Search products..." 
                    className="bg-gray-800 text-white p-2 rounded-l focus:outline-none" 
                  />
                  <button type="submit" className="bg-gray-600 text-white px-3 py-2 rounded-r">Go</button>
                </form>
              </li>
              <li><Link href="/cart">Cart</Link></li>
              <li><Link href="/account">Account</Link></li>
            </ul>
          </nav>
        </header>
        <div className="pt-16">  {/* Offset for fixed header */}
          {children}
        </div>
        <footer className="bg-black text-white p-4 text-center mt-8">
          © 2025 My Dream Beauty | All Rights Reserved
        </footer>
      </body>
    </html>
  );
}
