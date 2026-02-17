import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/utilities/ThemeProvider";

export const metadata = {
  title: "Care.xyz",
  description:
    "Reliable childcare, elderly care and special home care booking platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased flex flex-col min-h-screen transition-colors font-sans"
      >
        <NextAuthProvider>
          <ThemeProvider>
            <header>
              <Navbar />
            </header>

            <main className="container mx-auto mt-18 px-4 mb-6 lg:mb-4 flex-1">
              {children}
            </main>

            <Toaster position="bottom-center" />
            <Footer />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
