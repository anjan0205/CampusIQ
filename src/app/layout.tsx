import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompareDrawer from "@/components/CompareDrawer";
import { ClerkProvider } from "@clerk/nextjs";

// export const runtime = "edge"; // Commented out for Vercel deployment to support Node.js serverless runtime

export const metadata: Metadata = {
  title: "CampusIQ | Premium College Discovery & Predictor Platform",
  description: "Explore, search, filter, and compare 40+ top IITs, NITs, IIMs, and Medical universities in India. Predict your dream college using your rank.",
  keywords: ["college search", "college compare", "rank predictor", "engineering cutoff", "IIT admissions", "JEE Main predictor", "CAT predictor", "MBA colleges", "NEET predictor", "CampusIQ"],
  authors: [{ name: "CampusIQ Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased radial-bg min-h-screen">
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pb-16 md:pb-24">
                {children}
              </main>
              <Footer />
              <CompareDrawer />
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
