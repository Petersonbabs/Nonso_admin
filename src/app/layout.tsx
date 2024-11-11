"use client"
import localFont from "next/font/local";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import "./globals.css";
import AuthProvider from "@/contexts/AuthContext";
import ProductProvider from "@/contexts/ProductsContext";
import OrderProvider from "@/contexts/OrdersContext"
import { Toaster } from "sonner";
import { Suspense } from "react";
import {Montserrat} from "@next/font/google"

const montserrat = Montserrat({weight:'100',  subsets: ['latin']})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});




// export const metadata: Metadata = {
//   title: "Admin | Nonso Kitchen",
//   description: "Manage Nonso Kitchen as an admin",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={montserrat.className}
      >
        <Suspense>
        <ProgressBar
          height="4px"
          color="#fffd00"
          options={{ showSpinner: false }}
          shallowRouting
          />
          </Suspense>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
            <Toaster richColors position="top-right" closeButton visibleToasts={1}/>
            {children}
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
