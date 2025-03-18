import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ClientProvider from "../../HOC/ClientProvider";

const font = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin']
})
export const metadata: Metadata = {
  title: "Miky - Pet Media",
  description: "Miky - Pet Media Webapp is a social media platform for your pet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >

        <ClientProvider>
          {children}
          <Toaster />
        </ClientProvider>


      </body>
    </html>
  );
}
