import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/utilities/ThemeProvider";

const notoSans = Noto_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Care.xyz",
  description:
    "Reliable childcare, elderly care and special home care booking platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${notoSans.className} antialiased flex flex-col min-h-screen transition-colors`}
      >
        <NextAuthProvider>
          <ThemeProvider>
            <header>
              <Navbar />
            </header>

            <main className="grow my-3 pt-12 mx-4">{children}</main>

            <Toaster position="bottom-center" />
            <Footer />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
